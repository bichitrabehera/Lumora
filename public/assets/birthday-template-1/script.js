document.addEventListener('DOMContentLoaded', () => {
    const steps = document.querySelectorAll('.step');
    let currentStep = 0;

    const bgm = document.getElementById('bgm');
    const dynamicName = document.getElementById('dynamic-name');

    const envLetterContent = document.querySelector('.env-letter-content');
    const titleText = document.querySelector('.title-text');
    const finalWish = document.querySelector('.final-wish');
    const signatureEl = document.querySelector('.signature');

    // Handle messages from parent window
    window.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'lovey:preview:update') {
            const values = event.data.values;
            const recName = values.recipient_name || values.recipientName;
            if (recName) {
                document.querySelectorAll('#dynamic-name, .recipient-name').forEach(el => {
                    el.textContent = recName + '!';
                });
            }
            if (values.welcome_title && envLetterContent) {
                envLetterContent.textContent = values.welcome_title;
            }
            if (values.welcome_message && titleText) {
                titleText.textContent = values.welcome_message;
            }
            if (values.final_wish && finalWish) {
                finalWish.textContent = values.final_wish;
            }
            if (values.signature && signatureEl) {
                signatureEl.textContent = values.signature;
            }
            if (values.music_url && bgm) {
                const source = bgm.querySelector('source');
                if (source && source.getAttribute('src') !== values.music_url) {
                    source.setAttribute('src', values.music_url);
                    bgm.load();
                    if (document.body.classList.contains('lights-off') || document.body.classList.contains('mood-set')) {
                        bgm.play().catch(e => console.log('Audio play error:', e));
                    }
                }
            }
        }
    });

    function goToStep(index) {
        steps.forEach((step, i) => {
            if (i === index) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
        currentStep = index;
    }

    // Step 1: Intro
    const btnYes = document.getElementById('btn-yes');
    const stepIntro = document.getElementById('step-intro');
    
    btnYes.addEventListener('click', () => {
        stepIntro.classList.add('opening');
        setTimeout(() => {
            goToStep(1); // Lights off
            document.body.classList.add('lights-off');
            // Try to play music if allowed
            bgm.play().catch(e => console.log('Audio autoplay prevented'));
        }, 1500);
    });

    // Step 2: Lights Off -> On
    document.getElementById('btn-turn-on').addEventListener('click', () => {
        document.body.classList.remove('lights-off');
        document.body.classList.add('lights-on');
        goToStep(2);
    });

    // Step 3: Set Mood
    document.getElementById('btn-set-mood').addEventListener('click', () => {
        document.body.classList.remove('lights-on');
        document.body.classList.add('mood-set');
        goToStep(3);
    });

    // Step 4: Decorate
    document.getElementById('btn-decorate').addEventListener('click', () => {
        goToStep(4);
        createConfetti();
    });

    function createConfetti() {
        const container = document.getElementById('confetti-container');
        for (let i = 0; i < 50; i++) {
            const piece = document.createElement('div');
            piece.classList.add('confetti-piece');
            piece.style.left = Math.random() * 100 + 'vw';
            piece.style.animationDelay = Math.random() * 5 + 's';
            piece.style.backgroundColor = ['#f06292', '#ffeb3b', '#4fc3f7', '#81c784'][Math.floor(Math.random() * 4)];
            container.appendChild(piece);
        }
    }

    // Step 5: Balloons
    document.getElementById('btn-balloons').addEventListener('click', () => {
        goToStep(5);
        createBalloons();
    });

    function createBalloons() {
        const container = document.getElementById('balloon-container');
        for (let i = 0; i < 15; i++) {
            const balloon = document.createElement('div');
            balloon.classList.add('balloon');
            balloon.style.left = Math.random() * 90 + 'vw';
            balloon.style.animationDelay = Math.random() * 2 + 's';
            balloon.style.backgroundColor = ['#f06292', '#ffca28', '#42a5f5', '#66bb6a', '#ab47bc'][Math.floor(Math.random() * 5)];
            container.appendChild(balloon);
        }
    }

    // Step 6: Cake Cutting
    const btnCake = document.getElementById('btn-cake');
    const knife = document.getElementById('knife');
    const cutPathContainer = document.getElementById('cut-path-container');
    const cakeWrapper = document.getElementById('cake-element');
    const cakeHint = document.getElementById('cake-hint');
    const btnMakeWish = document.getElementById('btn-make-wish');
    const candles = document.getElementById('candles');
    
    btnCake.addEventListener('click', () => {
        goToStep(6);
    });

    let isDragging = false;
    let startX = 0;
    let currentX = 0;
    
    knife.addEventListener('mousedown', dragStart);
    knife.addEventListener('touchstart', dragStart, {passive: false});

    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag, {passive: false});

    document.addEventListener('mouseup', dragEnd);
    document.addEventListener('touchend', dragEnd);

    function dragStart(e) {
        if(btnMakeWish.classList.contains('hidden') === false) return; // already cut
        isDragging = true;
        startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    }

    function drag(e) {
        if (!isDragging) return;
        e.preventDefault();
        
        let clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        let deltaX = clientX - startX;
        
        // Constrain dragging
        if (deltaX < 0) deltaX = 0;
        if (deltaX > 250) deltaX = 250;
        
        // Calculate Y based on slope (10 deg is approx 0.17 slope)
        let slope = Math.tan(10 * Math.PI / 180);
        let deltaY = deltaX * slope;

        knife.style.transform = `translate(${deltaX}px, ${deltaY}px) rotate(-35deg)`;

        // Check if cut is complete
        if (deltaX > 200) {
            isDragging = false;
            completeCut();
        }
    }

    function dragEnd() {
        if (!isDragging) return;
        isDragging = false;
        // Reset if not fully cut
        knife.style.transform = `rotate(-35deg)`;
        knife.style.transition = `transform 0.3s ease`;
        setTimeout(() => { knife.style.transition = 'transform 0.1s'; }, 300);
    }

    function completeCut() {
        // Stop flames
        candles.innerHTML = '';
        
        cakeWrapper.classList.add('cake-cut-active');
        knife.style.opacity = '0';
        cakeHint.style.display = 'none';
        btnMakeWish.classList.remove('hidden');
    }

    // Step 7: Make a Wish
    btnMakeWish.addEventListener('click', () => {
        goToStep(7);
    });

    document.getElementById('btn-cards').addEventListener('click', () => {
        goToStep(8);
    });

    // Step 8: Wish Cards
    const cards = document.querySelectorAll('.wish-card');
    const btnFinal = document.getElementById('btn-final');
    let flippedCount = 0;

    cards.forEach(card => {
        card.addEventListener('click', () => {
            if (card.dataset.flipped === "false") {
                card.classList.add('flipped');
                card.dataset.flipped = "true";
                flippedCount++;
                
                if (flippedCount === cards.length) {
                    setTimeout(() => {
                        btnFinal.classList.remove('hidden');
                    }, 500);
                }
            }
        });
    });

    // Step 9: Final
    btnFinal.addEventListener('click', () => {
        goToStep(9);
    });
});
