document.addEventListener("DOMContentLoaded", () => {
  const backgroundMusic = document.getElementById("backgroundMusic");
  const startButton = document.getElementById("startButton");
  const envelopeContainer = document.getElementById("envelopeContainer");
  const unfoldButton = document.getElementById("unfoldButton");
  const finalGreetingElement = document.getElementById("finalGreeting");
  const titleElement = document.querySelector("title");
  const welcomeTitleElement = document.querySelector(".welcome-title");
  const welcomeMessageElement = document.querySelector(".welcome-message");
  const letterGreetingElement = document.querySelector(
    "#step3 .letter p:first-child",
  );
  const letterMessageElement = document.querySelector(
    "#step3 .letter p:nth-child(2)",
  );
  const letterPromptElement = document.querySelector(
    "#step3 .letter p:nth-child(3)",
  );
  const recipientNameElement = document.querySelector(".recipient-name");
  const finalWishElement = document.querySelector(".final-wish");
  const signatureElement = document.querySelector(".signature");
  const clickInstructionElement = document.querySelector(".click-instruction");
  const backgroundMusicSource = backgroundMusic?.querySelector("source");

  const steps = {
    step1: document.getElementById("step1"),
    step2: document.getElementById("step2"),
    step3: document.getElementById("step3"),
    step4: document.getElementById("step4"),
  };

  const defaultState = {
    page_title: "A Grand Birthday Surprise!",
    welcome_title: "You've got a surprise!",
    welcome_message: "Click below to start your birthday journey...",
    start_button_label: "Start the Celebration!",
    letter_greeting: "Dearest [Name],",
    letter_message:
      "This message carries wishes straight from the heart, ready to unfold into a memorable celebration just for you.",
    letter_prompt: "Click the button to reveal your special birthday surprise!",
    unfold_button_label: "Unfold My Surprise!",
    recipient_name: "Sapthesh!",
    final_greeting: "Happy Birthday,",
    final_wish:
      "May your special day be filled with immense joy, laughter, and all the wonderful things life has to offer. Here's to another year of amazing adventures!",
    signature: "With love and best wishes",
    music_url: "birthday_song.mp3",
  };

  let currentState = { ...defaultState };
  let typingTimer = null;

  function transitionToStep(targetStepId) {
    const currentActive = document.querySelector(".step.active");
    if (currentActive) {
      currentActive.classList.remove("active");
    }
    steps[targetStepId].classList.add("active");
  }

  function clearTyping() {
    if (typingTimer) {
      clearInterval(typingTimer);
      typingTimer = null;
    }
  }

  function typeFinalGreeting(text) {
    if (!finalGreetingElement) return;
    clearTyping();
    finalGreetingElement.textContent = "";
    finalGreetingElement.dataset.fullText = text;
    finalGreetingElement.style.borderRight = "3px solid var(--accent-yellow)";

    let index = 0;
    typingTimer = setInterval(() => {
      const fullText = finalGreetingElement.dataset.fullText || text;
      if (index < fullText.length) {
        finalGreetingElement.textContent += fullText.charAt(index);
        index += 1;
      } else {
        clearTyping();
        finalGreetingElement.classList.add("typed");
      }
    }, 100);
  }

  function applyState(nextState) {
    currentState = { ...defaultState, ...(nextState || {}) };
    const resolvedState = {
      page_title: currentState.page_title ?? currentState.pageTitle,
      welcome_title: currentState.welcome_title ?? currentState.welcomeTitle,
      welcome_message:
        currentState.welcome_message ?? currentState.welcomeMessage,
      start_button_label:
        currentState.start_button_label ?? currentState.startButtonLabel,
      letter_greeting:
        currentState.letter_greeting ?? currentState.letterGreeting,
      letter_message: currentState.letter_message ?? currentState.letterMessage,
      letter_prompt: currentState.letter_prompt ?? currentState.letterPrompt,
      unfold_button_label:
        currentState.unfold_button_label ?? currentState.unfoldButtonLabel,
      recipient_name: currentState.recipient_name ?? currentState.recipientName,
      final_greeting: currentState.final_greeting ?? currentState.finalGreeting,
      final_wish: currentState.final_wish ?? currentState.finalWish,
      signature: currentState.signature,
      music_url: currentState.music_url ?? currentState.musicUrl,
    };

    if (titleElement) titleElement.textContent = resolvedState.page_title;
    if (welcomeTitleElement)
      welcomeTitleElement.textContent = resolvedState.welcome_title;
    if (welcomeMessageElement)
      welcomeMessageElement.textContent = resolvedState.welcome_message;
    if (startButton) startButton.textContent = resolvedState.start_button_label;
    if (letterGreetingElement)
      letterGreetingElement.textContent = resolvedState.letter_greeting;
    if (letterMessageElement)
      letterMessageElement.textContent = resolvedState.letter_message;
    if (letterPromptElement)
      letterPromptElement.textContent = resolvedState.letter_prompt;
    if (unfoldButton)
      unfoldButton.textContent = resolvedState.unfold_button_label;
    if (recipientNameElement)
      recipientNameElement.textContent = resolvedState.recipient_name;
    if (finalWishElement)
      finalWishElement.textContent = resolvedState.final_wish;
    if (signatureElement)
      signatureElement.innerHTML = `${resolvedState.signature} <span class="heart-icon"></span>`;

    if (backgroundMusicSource && resolvedState.music_url) {
      backgroundMusicSource.src = resolvedState.music_url;
      backgroundMusic.load();
    }

    if (document.querySelector(".step.active")?.id === "step4") {
      typeFinalGreeting(resolvedState.final_greeting);
    } else if (finalGreetingElement) {
      finalGreetingElement.textContent = resolvedState.final_greeting;
    }
  }

  function handleLiveUpdate(event) {
    const data = event.data;
    if (!data || data.type !== "lovey:preview:update") return;
    applyState(data.values);
  }

  window.addEventListener("message", handleLiveUpdate);
  applyState();

  startButton?.addEventListener("click", () => {
    transitionToStep("step2");
    backgroundMusic?.play().catch((error) => {
      console.log("Autoplay prevented:", error);
    });
  });

  envelopeContainer?.addEventListener("click", () => {
    envelopeContainer.classList.add("open");
    if (clickInstructionElement) clickInstructionElement.style.opacity = "0";
    setTimeout(() => {
      transitionToStep("step3");
      setTimeout(() => {
        document.getElementById("letterContainer")?.classList.add("show");
      }, 100);
    }, 700);
  });

  unfoldButton?.addEventListener("click", () => {
    transitionToStep("step4");
    typeFinalGreeting(
      currentState.final_greeting ?? currentState.finalGreeting,
    );
    startCelebrationAnimations();
  });

  function startCelebrationAnimations() {
    createConfettiCannon(100, 0.5);
    setTimeout(() => createConfettiCannon(80, 0.3), 500);
    setTimeout(() => createConfettiCannon(60, 0.2), 1000);
    createBalloons(15);
    createFireworks(5);
  }

  function createConfettiCannon(count, delayMultiplier) {
    const confettiCannonContainer = document.querySelector(
      ".confetti-cannon-container",
    );
    const colors = [
      "var(--primary-red)",
      "var(--accent-yellow)",
      "var(--text-light)",
      "#00d8d6",
      "#8e44ad",
    ];

    for (let i = 0; i < count; i++) {
      const confetti = document.createElement("div");
      confetti.classList.add("confetti");
      confetti.style.backgroundColor =
        colors[Math.floor(Math.random() * colors.length)];
      confetti.style.left = `${Math.random() * 100}vw`;
      confetti.style.top = `${Math.random() * 20 - 10}vh`;
      const duration = Math.random() * 2 + 3;
      const delay = Math.random() * delayMultiplier;
      confetti.style.animationDuration = `${duration}s`;
      confetti.style.animationDelay = `${delay}s`;
      const size = Math.random() * 8 + 4;
      confetti.style.width = `${size}px`;
      confetti.style.height = `${size}px`;
      if (Math.random() > 0.5) confetti.style.borderRadius = "50%";
      confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
      confettiCannonContainer?.appendChild(confetti);
      confetti.addEventListener("animationend", () => confetti.remove());
    }
  }

  function createBalloons(count) {
    const balloonsContainer = document.querySelector(".balloons-container");
    const colors = [
      "var(--primary-red)",
      "var(--accent-yellow)",
      "#00d8d6",
      "#8e44ad",
      "#3498db",
    ];

    for (let i = 0; i < count; i++) {
      const balloon = document.createElement("div");
      balloon.classList.add("balloon");
      balloon.style.left = `${Math.random() * 80 + 10}vw`;
      balloon.style.backgroundColor =
        colors[Math.floor(Math.random() * colors.length)];
      balloon.style.animationDuration = `${Math.random() * 6 + 10}s`;
      balloon.style.animationDelay = `${Math.random() * 5}s`;
      balloonsContainer?.appendChild(balloon);
      balloon.addEventListener("animationend", () => balloon.remove());
    }
  }

  function createFireworks(count) {
    const fireworksContainer = document.querySelector(".fireworks-container");
    const colors = [
      "var(--primary-red)",
      "var(--accent-yellow)",
      "var(--text-light)",
      "#00d8d6",
    ];

    for (let i = 0; i < count; i++) {
      const firework = document.createElement("div");
      firework.classList.add("firework");
      firework.style.left = `${Math.random() * 80 + 10}vw`;
      firework.style.bottom = `${Math.random() * 20}vh`;
      firework.style.backgroundColor =
        colors[Math.floor(Math.random() * colors.length)];
      firework.style.boxShadow = `0 0 5px ${firework.style.backgroundColor}`;
      const delay = Math.random() * 3;
      firework.style.animationDelay = `${delay}s, ${delay + 3}s`;
      fireworksContainer?.appendChild(firework);
      firework.addEventListener("animationend", () => firework.remove());
    }
  }
});
