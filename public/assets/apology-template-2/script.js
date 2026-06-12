document.addEventListener('DOMContentLoaded', () => {
    const steps = document.querySelectorAll('.step');
    let currentStep = 0;

    // Petal Generator
    const petalsContainer = document.getElementById('petals-container');
    function createPetal() {
        const petal = document.createElement('div');
        petal.classList.add('petal');
        petal.style.left = Math.random() * 100 + 'vw';
        petal.style.animationDuration = (Math.random() * 3 + 4) + 's';
        petal.style.opacity = Math.random() * 0.5 + 0.3;
        petalsContainer.appendChild(petal);
        setTimeout(() => petal.remove(), 7000);
    }
    setInterval(createPetal, 300);

    // Dynamic fields
    const dynamicName = document.getElementById('dynamic-name');
    const envelopeText = document.getElementById('envelope-text');
    const finalLetterMessage = document.getElementById('final-letter-message');

    const flipPrompts = [
        document.getElementById('flip-prompt-1'),
        document.getElementById('flip-prompt-2'),
        document.getElementById('flip-prompt-3')
    ];
    const flipMsgs = [
        document.getElementById('flip-msg-1'),
        document.getElementById('flip-msg-2'),
        document.getElementById('flip-msg-3')
    ];

    window.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'lovey:preview:update') {
            const v = event.data.values;
            if (v.recipient_name) dynamicName.textContent = v.recipient_name;
            if (v.envelope_text) envelopeText.textContent = v.envelope_text;
            if (v.final_letter_message) finalLetterMessage.textContent = v.final_letter_message;
            
            if (v.flip_prompt_1) flipPrompts[0].textContent = v.flip_prompt_1;
            if (v.flip_message_1) flipMsgs[0].textContent = v.flip_message_1;
            
            if (v.flip_prompt_2) flipPrompts[1].textContent = v.flip_prompt_2;
            if (v.flip_message_2) flipMsgs[1].textContent = v.flip_message_2;
            
            if (v.flip_prompt_3) flipPrompts[2].textContent = v.flip_prompt_3;
            if (v.flip_message_3) flipMsgs[2].textContent = v.flip_message_3;
        }
    });

    function goToStep(index) {
        steps.forEach((step, i) => {
            if (i === index) step.classList.add('active');
            else step.classList.remove('active');
        });
        currentStep = index;
    }

    // Controls
    document.querySelectorAll('.btn-close').forEach(btn => {
        btn.addEventListener('click', () => { alert("You can't close me! ❤️"); });
    });

    // Landing
    document.getElementById('btn-open-envelope').addEventListener('click', () => { goToStep(1); });

    // Envelope
    const envelopeWrapper = document.getElementById('envelope-wrapper');
    const envelopeBody = document.getElementById('envelope-body');
    const envelopeSeal = document.getElementById('env-seal');

    function openEnvelope() {
        if(!envelopeBody.classList.contains('open')){
            envelopeBody.classList.add('open');
        }
    }

    envelopeWrapper.addEventListener('click', openEnvelope);
    if (envelopeSeal) {
        envelopeSeal.addEventListener('click', (e) => {
            e.stopPropagation();
            openEnvelope();
        });
    }
    document.getElementById('btn-next-music').addEventListener('click', (e) => {
        e.stopPropagation();
        goToStep(2);
    });

    // Music Player
    const tapes = document.querySelectorAll('.cassette-tape');
    let currentAudio = null;
    let currentBtn = null;
    let currentWheels = null;

    tapes.forEach(tape => {
        const btn = tape.querySelector('.btn-play-tape');
        const wheels = tape.querySelectorAll('.wheel');
        const songSrc = tape.getAttribute('data-song');
        
        btn.addEventListener('click', () => {
            // Find corresponding audio element based on src
            let audioEl = Array.from(document.querySelectorAll('audio')).find(a => a.querySelector('source').src.includes(songSrc));
            
            if (currentAudio && currentAudio !== audioEl) {
                currentAudio.pause();
                if(currentBtn) currentBtn.textContent = '▶';
                if(currentWheels) currentWheels.forEach(w => w.classList.remove('spinning'));
            }

            if (audioEl.paused) {
                audioEl.play().catch(e => console.log('Audio error:', e));
                btn.textContent = '⏸';
                wheels.forEach(w => w.classList.add('spinning'));
                currentAudio = audioEl;
                currentBtn = btn;
                currentWheels = wheels;
            } else {
                audioEl.pause();
                btn.textContent = '▶';
                wheels.forEach(w => w.classList.remove('spinning'));
                currentAudio = null;
            }
        });
    });

    document.getElementById('btn-next-flip').addEventListener('click', () => {
        if(currentAudio) { currentAudio.pause(); }
        goToStep(3);
    });

    // Flip Cards
    const flipCards = document.querySelectorAll('.flip-card');
    flipCards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('flipped');
        });
    });

    document.getElementById('btn-next-final').addEventListener('click', () => { goToStep(4); });

    // Final
    document.getElementById('btn-restart').addEventListener('click', () => {
        envelopeBody.classList.remove('open');
        flipCards.forEach(card => card.classList.remove('flipped'));
        goToStep(0);
    });

});
