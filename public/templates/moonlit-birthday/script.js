
let currentStep = 0;
const steps = [document.getElementById('step0'), document.getElementById('step1'), document.getElementById('step2')];

document.getElementById('btn-start').addEventListener('click', () => {
    steps[0].classList.remove('active');
    steps[1].classList.add('active');
    currentStep = 1;
    typewriterEffect();
});

document.getElementById('btn-reveal').addEventListener('click', () => {
    steps[1].classList.remove('active');
    steps[2].classList.add('active');
    currentStep = 2;
    createFireflies();
    const audio = document.getElementById('audio-player');
    if (audio.src) {
        audio.play().catch(() => console.log('Autoplay prevented'));
    }
});

let titleText = "Happy Birthday";
function typewriterEffect() {
    const el = document.getElementById('t-title');
    el.innerHTML = '<span class="cursor"></span>';
    let i = 0;
    const interval = setInterval(() => {
        if (i < titleText.length) {
            el.innerHTML = titleText.substring(0, i+1) + '<span class="cursor"></span>';
            i++;
        } else {
            clearInterval(interval);
        }
    }, 100);
}

function createFireflies() {
    const container = document.querySelector('.fireflies');
    for (let i = 0; i < 30; i++) {
        let f = document.createElement('div');
        f.className = 'firefly';
        f.style.left = Math.random() * 100 + '%';
        f.style.width = f.style.height = (Math.random() * 3 + 2) + 'px';
        f.style.animationDuration = (Math.random() * 8 + 8) + 's';
        f.style.animationDelay = (Math.random() * 5) + 's';
        container.appendChild(f);
    }
}

window.addEventListener('message', (event) => {
    if (event.data?.type === 'lovey:preview:update') {
        const v = event.data.values;
        if (v.title) titleText = v.title;
        document.getElementById('t-subtitle').innerText = v.subtitle || 'A moonlit surprise awaits...';
        document.getElementById('t-title-small').innerText = v.title || 'Happy Birthday';
        document.getElementById('t-message').innerText = v.message || '';
        document.getElementById('btn-cta').innerText = v.cta_label || 'Open';
        document.getElementById('btn-cta').href = v.cta_url || '#';
        
        if (v.audio_url) {
            const audio = document.getElementById('audio-player');
            audio.src = v.audio_url;
            audio.style.display = 'block';
        }
        
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
