
document.getElementById('btn-read').addEventListener('click', () => {
    document.getElementById('step0').classList.remove('active');
    document.getElementById('step1').classList.add('active');
    const audio = document.getElementById('audio-player');
    if (audio.src) audio.play().catch(e=>console.log(e));
});

window.addEventListener('message', (event) => {
    if (event.data?.type === 'lovey:preview:update') {
        const v = event.data.values;
        if (v.subtitle) document.getElementById('t-subtitle').innerText = v.subtitle;
        document.getElementById('t-title').innerText = v.title || 'To you';
        document.getElementById('t-message').innerText = v.message || '';
        document.getElementById('btn-cta').innerText = v.cta_label || 'I understand';
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
            photos.filter(p=>p.trim()).slice(0,2).forEach(src => {
                let img = document.createElement('img');
                img.src = src;
                gal.appendChild(img);
            });
        }
    }
});
