document.addEventListener('DOMContentLoaded', () => {
    const steps = document.querySelectorAll('.step');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Dynamic fields
    const dynamicName = document.getElementById('dynamic-name');
    const heroTitle = document.getElementById('hero-title');
    const btnTapHere = document.getElementById('btn-tap-here');
    const finalLetterMessage = document.getElementById('final-letter-message');

    window.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'lovey:preview:update') {
            const v = event.data.values;
            if (v.recipient_name) dynamicName.textContent = v.recipient_name;
            if (v.hero_title) heroTitle.innerHTML = v.hero_title.replace(/\n/g, '<br>');
            if (v.button_text) btnTapHere.textContent = v.button_text;
            if (v.final_letter_message) finalLetterMessage.textContent = v.final_letter_message;
        }
    });

    function navigateTo(targetId) {
        // Update active step
        steps.forEach(step => {
            if (step.id === targetId) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });

        // Update active nav link
        navLinks.forEach(link => {
            if (link.getAttribute('data-target') === targetId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // Top Navigation Links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target');
            navigateTo(targetId);
        });
    });

    // Tap Here Button
    btnTapHere.addEventListener('click', () => {
        navigateTo('step-bouquet');
    });

});
