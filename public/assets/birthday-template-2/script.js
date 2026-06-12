document.addEventListener('DOMContentLoaded', () => {
    const steps = document.querySelectorAll('.step');
    let currentStep = 0;

    const bgm = document.getElementById('bgm');
    const dynamicName = document.getElementById('dynamic-name');
    const envText = document.getElementById('envelope-text');
    const musicGreeting = document.getElementById('music-greeting');
    const letterMessage = document.getElementById('letter-message');
    const signature = document.getElementById('signature');

    const captions = [
        document.getElementById('caption-1'),
        document.getElementById('caption-2'),
        document.getElementById('caption-3')
    ];

    const wishes = [
        document.getElementById('wish-1'),
        document.getElementById('wish-2'),
        document.getElementById('wish-3')
    ];

    // Handle messages from parent window
    window.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'lovey:preview:update') {
            const v = event.data.values;
            if (v.envelope_text) envText.textContent = v.envelope_text;
            if (v.recipient_name) dynamicName.textContent = v.recipient_name;
            if (v.music_greeting) musicGreeting.textContent = v.music_greeting;
            if (v.polaroid_caption_1) captions[0].textContent = v.polaroid_caption_1;
            if (v.polaroid_caption_2) captions[1].textContent = v.polaroid_caption_2;
            if (v.polaroid_caption_3) captions[2].textContent = v.polaroid_caption_3;
            if (v.flower_wish_1) wishes[0].textContent = v.flower_wish_1;
            if (v.flower_wish_2) wishes[1].textContent = v.flower_wish_2;
            if (v.flower_wish_3) wishes[2].textContent = v.flower_wish_3;
            if (v.letter_message) letterMessage.textContent = v.letter_message;
            if (v.signature) signature.textContent = v.signature;
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

    // Step 1: Envelope
    const envelope = document.getElementById('envelope-body');
    const seal = document.getElementById('env-seal');
    const envelopeWrapper = document.querySelector('.envelope-wrapper');
    
    function openEnvelope(e) {
        if (e) e.stopPropagation();
        if (envelope.classList.contains('open')) return;
        console.log('Envelope clicked!');
        envelope.classList.add('open');
        setTimeout(() => {
            goToStep(1); // Music player
        }, 1500);
    }
    
    seal.addEventListener('click', openEnvelope);
    envelopeWrapper.addEventListener('click', openEnvelope);

    // Step 2: Music Player
    const btnPlay = document.getElementById('btn-play-music');
    const vinyl = document.querySelector('.vinyl-record');
    const progressFill = document.querySelector('.progress-fill');
    const btnNextMusic = document.getElementById('btn-next-music');
    let isPlaying = false;
    let progressInterval;

    btnPlay.addEventListener('click', () => {
        if (!isPlaying) {
            bgm.play().catch(e => console.log('Audio error:', e));
            vinyl.classList.add('spin');
            btnPlay.textContent = '⏸';
            btnNextMusic.classList.remove('hidden');
            isPlaying = true;

            // Fake progress bar
            let p = 0;
            progressInterval = setInterval(() => {
                p += 1;
                if(p > 100) p = 0;
                progressFill.style.width = p + '%';
            }, 500);
        } else {
            bgm.pause();
            vinyl.classList.remove('spin');
            btnPlay.textContent = '▶';
            isPlaying = false;
            clearInterval(progressInterval);
        }
    });

    btnNextMusic.addEventListener('click', () => {
        goToStep(2); // Polaroids
    });

    // Step 3: Polaroid Slider
    const slides = document.querySelectorAll('.polaroid-slide');
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const btnNextPolaroid = document.getElementById('btn-next-polaroid');
    let currentSlide = 0;

    function updateSlider() {
        slides.forEach((slide, i) => {
            slide.className = 'polaroid-slide';
            if (i === currentSlide) {
                slide.classList.add('active');
            } else if (i < currentSlide) {
                slide.classList.add('prev');
            }
        });

        // Show next button only if seen all
        if (currentSlide === slides.length - 1) {
            btnNextPolaroid.classList.remove('hidden');
        }
    }

    btnPrev.addEventListener('click', () => {
        if (currentSlide > 0) {
            currentSlide--;
            updateSlider();
        }
    });

    btnNext.addEventListener('click', () => {
        if (currentSlide < slides.length - 1) {
            currentSlide++;
            updateSlider();
        }
    });

    btnNextPolaroid.addEventListener('click', () => {
        goToStep(3); // Flowers
    });

    // Step 4: Flowers
    const flowers = document.querySelectorAll('.flower-card');
    let flippedCount = 0;

    flowers.forEach(flower => {
        flower.addEventListener('click', () => {
            if (flower.dataset.flipped === "false") {
                flower.classList.add('flipped');
                flower.dataset.flipped = "true";
                flippedCount++;
                
                if (flippedCount === flowers.length) {
                    setTimeout(() => {
                        goToStep(4); // Final Letter
                    }, 2000);
                }
            }
        });
    });
});
