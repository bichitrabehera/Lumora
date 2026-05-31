let currentStep = 0;
const steps = [
  document.getElementById("step0"),
  document.getElementById("step1"),
  document.getElementById("step2"),
];

document.getElementById("btn-start").addEventListener("click", () => {
  steps[0].classList.remove("active");
  steps[1].classList.add("active");
  currentStep = 1;
  typewriterEffect();
});

document.getElementById("btn-reveal").addEventListener("click", () => {
  steps[1].classList.remove("active");
  steps[2].classList.add("active");
  currentStep = 2;
  createFireflies();
  const audio = document.getElementById("audio-player");
  if (audio.src) {
    audio.play().catch(() => console.log("Autoplay prevented"));
  }
});

let titleText = "Happy Birthday";
function typewriterEffect() {
  const el = document.getElementById("t-title");
  el.innerHTML = '<span class="cursor"></span>';
  let i = 0;
  const interval = setInterval(() => {
    if (i < titleText.length) {
      el.innerHTML =
        titleText.substring(0, i + 1) + '<span class="cursor"></span>';
      i++;
    } else {
      clearInterval(interval);
    }
  }, 100);
}

function createFireflies() {
  const container = document.querySelector(".fireflies");
  for (let i = 0; i < 30; i++) {
    let f = document.createElement("div");
    f.className = "firefly";
    f.style.left = Math.random() * 100 + "%";
    f.style.width = f.style.height = Math.random() * 3 + 2 + "px";
    f.style.animationDuration = Math.random() * 8 + 8 + "s";
    f.style.animationDelay = Math.random() * 5 + "s";
    container.appendChild(f);
  }
}

function setText(selector, value) {
  if (!value) return;
  const el = document.querySelector(selector);
  if (el) el.innerText = value;
}

window.addEventListener("message", (event) => {
  if (event.data?.type === "lovey:preview:update") {
    const v = event.data.values;
    if (v.title) titleText = v.title;
    document.getElementById("t-subtitle").innerText =
      v.subtitle || "A moonlit surprise awaits...";
    document.getElementById("t-title-small").innerText =
      v.title || "Happy Birthday";
    document.getElementById("t-message").innerText = v.message || "";

    setText(
      "#hero-moon .font-label-md",
      v.hero_button_label || "Join The Gala",
    );

    const sectionBlocks = document.querySelectorAll("section");
    const celebrationSection = sectionBlocks[1];
    const milestonesSection = sectionBlocks[2];
    const messagesSection = sectionBlocks[3];

    if (celebrationSection) {
      const celebrationHeading = celebrationSection.querySelector("h2");
      if (celebrationHeading)
        celebrationHeading.innerText =
          v.celebration_heading || "The Art of Celebration";
      const intro = celebrationSection.querySelector("p");
      if (intro) intro.innerText = v.celebration_message || intro.innerText;

      const storyCards = celebrationSection.querySelectorAll("h3");
      if (storyCards[0])
        storyCards[0].innerText = v.featured_story_title || "Midnight Musings";
      if (storyCards[0]) {
        const text = storyCards[0].parentElement?.querySelector("p");
        if (text) text.innerText = v.featured_story_message || text.innerText;
      }
      if (storyCards[1])
        storyCards[1].innerText = v.secondary_story_title || "Celestial Soul";
      if (storyCards[1]) {
        const text = storyCards[1].parentElement?.querySelector("p");
        if (text) text.innerText = v.secondary_story_message || text.innerText;
      }
    }

    if (milestonesSection) {
      const milestoneHeading = milestonesSection.querySelector("h2");
      if (milestoneHeading)
        milestoneHeading.innerText = v.milestones_heading || "Lunar Milestones";
      const milestoneIntro = milestonesSection.querySelector("p");
      if (milestoneIntro)
        milestoneIntro.innerText =
          v.milestones_intro || milestoneIntro.innerText;

      // Render milestone items if provided as an array
      if (Array.isArray(v.milestones)) {
        const track = document.querySelector(".lunar-track");
        if (track) {
          function esc(s) {
            return String(s || "")
              .replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;");
          }
          track.innerHTML = v.milestones
            .slice(0, 20)
            .map((m) => {
              const year = esc(m.year);
              const title = esc(m.title);
              const desc = esc(m.description);
              return `
              <div class="flex-shrink-0 w-48 flex flex-col items-center group cursor-pointer">
                <div class="w-12 h-12 rounded-full border border-secondary/40 glass flex items-center justify-center mb-6 group-hover:bg-secondary group-hover:text-surface transition-colors duration-500">
                  <span class="font-label-md text-label-md">${year}</span>
                </div>
                <div class="w-3 h-3 rounded-full bg-secondary-container mb-4 shadow-[0_0_10px_#00f1fe]"></div>
                <h4 class="font-headline-sm text-headline-sm text-center">${title}</h4>
                <p class="text-on-tertiary-container text-body-md text-center text-xs mt-2">${desc}</p>
              </div>
            `;
            })
            .join("");
        }
      }
    }

    if (messagesSection) {
      const messagesHeading = messagesSection.querySelector("h2");
      if (messagesHeading)
        messagesHeading.innerText = v.messages_heading || "Starlit Messages";
    }

    if (v.audio_url) {
      const audio = document.getElementById("audio-player");
      audio.src = v.audio_url;
      audio.style.display = "block";
    }

    if (v.photos) {
      const photos = Array.isArray(v.photos) ? v.photos : v.photos.split("\n");
      const gal = document.getElementById("photo-gallery");
      gal.innerHTML = "";
      photos
        .filter((p) => p.trim())
        .slice(0, 4)
        .forEach((src) => {
          let img = document.createElement("img");
          img.src = src;
          gal.appendChild(img);
        });
    }
  }
});
