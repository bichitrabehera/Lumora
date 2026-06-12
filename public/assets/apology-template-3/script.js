document.addEventListener('DOMContentLoaded', () => {
    const steps = document.querySelectorAll('.step');
    let currentStep = 0;

    // Dynamic fields
    const dynamicName = document.getElementById('dynamic-name');
    const puzzleMessage = document.getElementById('puzzle-message');
    const finalLetterMessage = document.getElementById('final-letter-message');

    const petalPrompts = [
        document.getElementById('petal-prompt-1'),
        document.getElementById('petal-prompt-2'),
        document.getElementById('petal-prompt-3')
    ];
    const petalMsgs = [
        document.getElementById('petal-message-1'),
        document.getElementById('petal-message-2'),
        document.getElementById('petal-message-3')
    ];

    window.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'lovey:preview:update') {
            const v = event.data.values;
            if (v.recipient_name) dynamicName.textContent = v.recipient_name;
            if (v.puzzle_message) puzzleMessage.textContent = v.puzzle_message;
            if (v.final_letter_message) finalLetterMessage.textContent = v.final_letter_message;
            
            if (v.petal_prompt_1) petalPrompts[0].textContent = v.petal_prompt_1;
            if (v.petal_message_1) petalMsgs[0].textContent = v.petal_message_1;
            
            if (v.petal_prompt_2) petalPrompts[1].textContent = v.petal_prompt_2;
            if (v.petal_message_2) petalMsgs[1].textContent = v.petal_message_2;
            
            if (v.petal_prompt_3) petalPrompts[2].textContent = v.petal_prompt_3;
            if (v.petal_message_3) petalMsgs[2].textContent = v.petal_message_3;
        }
    });

    function goToStep(index) {
        steps.forEach((step, i) => {
            if (i === index) step.classList.add('active');
            else step.classList.remove('active');
        });
        currentStep = index;
    }

    // Step 1: Puzzle
    const targetCell = document.getElementById('target-cell');
    const btnNextTransition = document.getElementById('btn-next-transition');
    targetCell.addEventListener('click', () => {
        targetCell.classList.remove('empty');
        targetCell.classList.add('filled');
        targetCell.textContent = '♡';
        setTimeout(() => {
            btnNextTransition.classList.remove('hidden');
        }, 500);
    });

    btnNextTransition.addEventListener('click', () => {
        goToStep(1);
    });

    // Step 2: Transition
    document.getElementById('btn-next-petals').addEventListener('click', () => {
        goToStep(2);
    });

    // Step 3: Petals
    let petalsRevealed = 0;
    const btnNextLetter = document.getElementById('btn-next-letter');
    
    for(let i=1; i<=3; i++) {
        const wrapper = document.getElementById(`petal-${i}`);
        const front = wrapper.querySelector('.petal-front');
        const back = wrapper.querySelector('.petal-back');
        
        front.addEventListener('click', () => {
            front.classList.add('hidden');
            back.classList.remove('hidden');
            petalsRevealed++;
            if (petalsRevealed === 3) {
                setTimeout(() => {
                    btnNextLetter.classList.remove('hidden');
                }, 800);
            }
        });
    }

    btnNextLetter.addEventListener('click', () => {
        goToStep(3);
    });

    // Final
    document.getElementById('btn-restart').addEventListener('click', () => {
        // reset puzzle
        targetCell.classList.add('empty');
        targetCell.classList.remove('filled');
        targetCell.textContent = '';
        btnNextTransition.classList.add('hidden');

        // reset petals
        petalsRevealed = 0;
        btnNextLetter.classList.add('hidden');
        for(let i=1; i<=3; i++) {
            const wrapper = document.getElementById(`petal-${i}`);
            wrapper.querySelector('.petal-front').classList.remove('hidden');
            wrapper.querySelector('.petal-back').classList.add('hidden');
        }

        goToStep(0);
    });

});
