
let currentStep = 0;
const steps = [document.getElementById('step0'), document.getElementById('step1')];

document.getElementById('env-wrap').addEventListener('click', function() {
    this.classList.add('open');
    setTimeout(() => {
        steps[0].classList.remove('active');
        steps[1].classList.add('active');
        createPetals();
        const audio = document.getElementById('audio-player');
        if (audio.src) {
            audio.play().catch(() => console.log('Autoplay prevented'));
        }
    }, 1200);
});

function createPetals() {
    const container = document.querySelector('.petals');
    for (let i = 0; i < 40; i++) {
        let p = document.createElement('div');
        p.className = 'petal';
        p.style.left = Math.random() * 100 + 'vw';
        p.style.width = (Math.random() * 10 + 10) + 'px';
        p.style.height = (Math.random() * 10 + 10) + 'px';
        p.style.animationDuration = (Math.random() * 5 + 5) + 's';
        p.style.animationDelay = (Math.random() * 3) + 's';
        container.appendChild(p);
    }
}

const moments = ["First hello", "A shared laugh", "The long walk home", "Every day after"];

window.addEventListener('message', (event) => {
    if (event.data?.type === 'lovey:preview:update') {
        const v = event.data.values;
        if (v.subtitle) document.getElementById('t-subtitle').innerText = v.subtitle;
        document.getElementById('t-title').innerText = v.title || 'Our Anniversary';
        document.getElementById('t-message').innerText = v.message || '';
        document.getElementById('btn-cta').innerText = v.cta_label || 'Read more';
        document.getElementById('btn-cta').href = v.cta_url || '#';
        
        if (v.audio_url) {
            const audio = document.getElementById('audio-player');
            audio.src = v.audio_url;
            audio.style.display = 'block';
        }
        
        // timeline
        const tl = document.getElementById('timeline');
        tl.innerHTML = '';
        moments.forEach(m => {
            let d = document.createElement('div');
            d.className = 'timeline-item';
            d.innerHTML = '<strong>' + m + '</strong>';
            tl.appendChild(d);
        });
        
        if (v.photos) {
            const photos = Array.isArray(v.photos) ? v.photos : v.photos.split('\n');
            const gal = document.getElementById('photo-gallery');
            gal.innerHTML = '';
            photos.filter(p=>p.trim()).slice(0,4).forEach(src => {
                let img = document.createElement('img');
                img.src = src;
                gal.appendChild(img);
            });
        }
    }
});
