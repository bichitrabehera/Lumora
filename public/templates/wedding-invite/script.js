
document.getElementById('seal').addEventListener('click', () => {
    document.getElementById('step0').classList.remove('active');
    document.getElementById('step1').classList.add('active');
});
window.addEventListener('message', (event) => {
    if (event.data?.type === 'lovey:preview:update') {
        const v = event.data.values;
        if(v.subtitle) document.getElementById('t-subtitle').innerText = v.subtitle;
        document.getElementById('t-title').innerText = v.title || 'You are invited';
        document.getElementById('t-message').innerText = v.message || '';
        document.getElementById('btn-cta').innerText = v.cta_label || 'RSVP';
        document.getElementById('btn-cta').href = v.cta_url || '#';
        if (v.photos) {
            const photos = Array.isArray(v.photos) ? v.photos : v.photos.split('\n');
            const gal = document.getElementById('photo-gallery');
            gal.innerHTML = '';
            photos.filter(p=>p.trim()).slice(0,1).forEach(src => {
                let img = document.createElement('img'); img.src = src; gal.appendChild(img);
            });
        }
    }
});
