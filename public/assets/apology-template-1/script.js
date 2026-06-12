document.addEventListener('DOMContentLoaded', () => {
    const steps = document.querySelectorAll('.step');
    let currentStep = 0;

    const bgm = document.getElementById('bgm');
    const dynamicName = document.getElementById('dynamic-name');
    const letterMessage = document.getElementById('letter-message');
    const signature = document.getElementById('signature');
    const apologyQuestion = document.getElementById('apology-question');

    const captions = [
        document.getElementById('caption-1'),
        document.getElementById('caption-2'),
        document.getElementById('caption-3')
    ];

    // Handle incoming data
    window.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'lovey:preview:update') {
            const v = event.data.values;
            if (v.recipient_name) dynamicName.textContent = v.recipient_name;
            if (v.apology_question) apologyQuestion.textContent = v.apology_question;
            if (v.polaroid_caption_1) captions[0].textContent = v.polaroid_caption_1;
            if (v.polaroid_caption_2) captions[1].textContent = v.polaroid_caption_2;
            if (v.polaroid_caption_3) captions[2].textContent = v.polaroid_caption_3;
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

    // Step 1: Landing
    document.getElementById('btn-mad-yes').addEventListener('click', () => {
        goToStep(1); // Runaway question
    });
    
    document.getElementById('btn-mad-no').addEventListener('click', () => {
        // Wait, if they aren't mad, just skip to slideshow or letter?
        goToStep(2); // Accepted
    });

    // Step 2: Runaway Button
    const btnForgiveYes = document.getElementById('btn-forgive-yes');
    const btnForgiveNo = document.getElementById('btn-forgive-no');

    // Runaway logic
    function runaway() {
        const x = Math.random() * (window.innerWidth - btnForgiveNo.offsetWidth - 50);
        const y = Math.random() * (window.innerHeight - btnForgiveNo.offsetHeight - 50);
        
        btnForgiveNo.style.position = 'fixed';
        btnForgiveNo.style.left = `${x}px`;
        btnForgiveNo.style.top = `${y}px`;
        btnForgiveNo.style.zIndex = "1000";
    }

    btnForgiveNo.addEventListener('mouseover', runaway);
    btnForgiveNo.addEventListener('touchstart', (e) => {
        e.preventDefault();
        runaway();
    });

    btnForgiveYes.addEventListener('click', () => {
        btnForgiveNo.style.display = 'none'; // hide the wandering button
        goToStep(2); // Accepted
    });

    // Step 3: Accepted
    document.getElementById('btn-next-tictactoe').addEventListener('click', () => {
        goToStep(3); // Tic-Tac-Toe
    });

    // Step 4: Tic-Tac-Toe
    const cells = document.querySelectorAll('.cell');
    const gameStatus = document.getElementById('game-status');
    const btnNextSlideshow = document.getElementById('btn-next-slideshow');
    let board = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;
    const player = '💖';
    const computer = '🥺';

    const winConditions = [
        [0,1,2], [3,4,5], [6,7,8], // rows
        [0,3,6], [1,4,7], [2,5,8], // cols
        [0,4,8], [2,4,6] // diagonals
    ];

    function checkWin(sym) {
        return winConditions.some(cond => {
            return board[cond[0]] === sym && board[cond[1]] === sym && board[cond[2]] === sym;
        });
    }

    function computerMove() {
        const emptyCells = board.map((v, i) => v === '' ? i : null).filter(v => v !== null);
        if (emptyCells.length > 0 && gameActive) {
            const randIdx = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            board[randIdx] = computer;
            cells[randIdx].textContent = computer;
            if (checkWin(computer)) {
                gameStatus.textContent = 'I win! Please forgive me?';
                gameActive = false;
                btnNextSlideshow.classList.remove('hidden');
            } else if (board.every(c => c !== '')) {
                gameStatus.textContent = 'A draw! We are meant to be.';
                btnNextSlideshow.classList.remove('hidden');
            }
        }
    }

    cells.forEach((cell, index) => {
        cell.addEventListener('click', () => {
            if (board[index] === '' && gameActive) {
                board[index] = player;
                cell.textContent = player;
                
                if (checkWin(player)) {
                    gameStatus.textContent = 'You win! 🥰';
                    gameActive = false;
                    btnNextSlideshow.classList.remove('hidden');
                } else if (board.every(c => c !== '')) {
                    gameStatus.textContent = 'A draw! We are meant to be.';
                    btnNextSlideshow.classList.remove('hidden');
                } else {
                    setTimeout(computerMove, 500);
                }
            }
        });
    });

    btnNextSlideshow.addEventListener('click', () => {
        goToStep(4); // Slideshow
    });

    // Step 5: Slideshow
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;
    const btnNextMusic = document.getElementById('btn-next-music');

    function updateSlides() {
        slides.forEach((s, i) => {
            if (i === currentSlide) s.classList.add('active');
            else s.classList.remove('active');
        });
        if (currentSlide === slides.length - 1) {
            btnNextMusic.classList.remove('hidden');
        }
    }

    document.getElementById('btn-prev-slide').addEventListener('click', () => {
        if (currentSlide > 0) { currentSlide--; updateSlides(); }
    });

    document.getElementById('btn-next-slide').addEventListener('click', () => {
        if (currentSlide < slides.length - 1) { currentSlide++; updateSlides(); }
    });

    btnNextMusic.addEventListener('click', () => {
        goToStep(5); // Music
    });

    // Step 6: Music
    const btnPlay = document.getElementById('btn-play-song');
    const progressFill = document.getElementById('music-progress');
    let isPlaying = false;
    let progressInterval;

    btnPlay.addEventListener('click', () => {
        if (!isPlaying) {
            bgm.play().catch(e => console.log('Audio error:', e));
            btnPlay.textContent = '⏸';
            isPlaying = true;
            let p = 0;
            progressInterval = setInterval(() => {
                p += 1;
                if(p > 100) p = 0;
                progressFill.style.width = p + '%';
            }, 500);
        } else {
            bgm.pause();
            btnPlay.textContent = '▶';
            isPlaying = false;
            clearInterval(progressInterval);
        }
    });

    document.getElementById('btn-next-letter').addEventListener('click', () => {
        goToStep(6); // Letter
    });

});
