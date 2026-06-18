export type TemplateField = {
  key: string;
  type: "text" | "textarea" | "image" | "audio" | "gallery";
  label: string;
};

export type TemplateSchema = {
  fields: TemplateField[];
};

export type EditorFieldValues = Record<string, any>;

export type PublishInfo = {
  fullUrl: string;
  qr: string | null;
  slug: string;
};

export const TEMPLATE_DEFAULTS: Record<string, Record<string, any>> = {
  "birthday-template-1": {
    page_title: "A Grand Birthday Surprise!",
    welcome_title: "You've got a surprise!",
    welcome_message: "Click below to start your birthday journey...",
    start_button_label: "Start the Celebration!",
    letter_greeting: "Dearest [Name],",
    letter_message: "This message carries wishes straight from the heart.",
    letter_prompt: "Click the button to reveal your special birthday surprise!",
    unfold_button_label: "Unfold My Surprise!",
    recipient_name: "Sapthesh!",
    final_greeting: "Happy Birthday,",
    final_wish: "May your special day be filled with joy.",
    signature: "With love and best wishes",
    music_url: "/assets/birthday-template-1/birthday_song.mp3",
  },
  "birthday-template-2": {
    page_title: "Birthday Wish",
    envelope_text: "A special note for you",
    music_greeting: "Happy Birthday!",
    recipient_name: "Sapthesh",
    polaroid_caption_1: "Memory 1",
    polaroid_caption_2: "Memory 2",
    polaroid_caption_3: "Memory 3",
    flower_wish_1: "Joy",
    flower_wish_2: "Peace",
    flower_wish_3: "Love",
    letter_message:
      "Wishing you the happiest of birthdays! May this year bring you closer to your dreams, surround you with love, and give you countless reasons to smile.",
    signature: "- Yours",
  },
  "apology-template-1": {
    page_title: "Cute Apology",
    recipient_name: "Sapthesh",
    apology_question: "Will you forgive me?",
    polaroid_caption_1: "Memory 1",
    polaroid_caption_2: "Memory 2",
    polaroid_caption_3: "Memory 3",
    letter_message:
      "I wanted to make this to show you how much I care. I promise to do better and make you smile more often. You mean the world to me.",
    signature: "- Yours always",
  },
  "apology-template-2": {
    page_title: "My Apology",
    recipient_name: "Recipient",
    envelope_text: "Please open this letter... I have something important to say.",
    flip_prompt_1: "Why I'm writing this",
    flip_message_1: "I want to explain what happened and apologize sincerely.",
    flip_prompt_2: "What I promise",
    flip_message_2: "I promise to listen more, communicate better, and be more patient.",
    flip_prompt_3: "Our relationship",
    flip_message_3: "You are the most important person to me and I value us so much.",
    final_letter_message:
      "I am truly sorry for my actions. I hope you can find it in your heart to forgive me.",
  },
  "apology-template-3": {
    page_title: "Sorry Petals",
    recipient_name: "Recipient",
    puzzle_message: "I'm sorry. Please pluck the petals below.",
    petal_prompt_1: "First Petal",
    petal_message_1: "I am sorry for my words.",
    petal_prompt_2: "Second Petal",
    petal_message_2: "I am sorry for my actions.",
    petal_prompt_3: "Third Petal",
    petal_message_3: "I want to make it up to you.",
    final_letter_message:
      "You mean the world to me and I hope we can move past this together.",
  },
  "love-template-1": {
    page_title: "A Little Bouquet",
    recipient_name: "My Love",
    hero_title: "A little bouquet for you",
    button_text: "Open Bouquet",
    final_letter_message:
      "Here's a small reminder of how much you mean to me. Every single day, I am grateful for you.",
  },
};
