
document.getElementById('btn-pop').addEventListener('click', () => {
    document.getElementById('step0').classList.remove('active');
    document.getElementById('step1').classList.add('active');
    const container = document.getElementById('confetti');
    const colors = ['#e74c3c', '#3498db', '#f1c40f', '#2ecc71'];
    for(let i=0; i<100; i++){
        let c = document.createElement('div');
        c.className = 'confetti-piece';
        c.style.left = Math.random() * 100 + 'vw';
        c.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        c.style.animationDelay = Math.random() * 2 + 's';
        container.appendChild(c);
    }
    const audio = document.getElementById('audio-player');
    if (audio.src) audio.play().catch(e=>console.log(e));
});
window.addEventListener('message', (e) => {
    if (e.data?.type === 'lovey:preview:update') {
        const v = e.data.values;
        document.getElementById('t-title').innerText = v.title || 'Milestone';
        document.getElementById('t-subtitle').innerText = v.subtitle || '';
        document.getElementById('t-message').innerText = v.message || '';
        document.getElementById('btn-cta').innerText = v.cta_label || 'Yay!';
        document.getElementById('btn-cta').href = v.cta_url || '#';
        if (v.audio_url) {
            const audio = document.getElementById('audio-player');
            audio.src = v.audio_url;
            audio.style.display = 'block';
        }
        if (v.photos) {
            const photos = Array.isArray(v.photos) ? v.photos : v.photos.split('\n');
            const gal = document.getElementById('photo-gallery'); gal.innerHTML = '';
            photos.filter(p=>p.trim()).slice(0,4).forEach(src => {
                let img = document.createElement('img'); img.src = src; gal.appendChild(img);
            });
        }
    }
});
