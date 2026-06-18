export const NAVIGATION = [
  { label: "Templates", href: "/templates" },
  { label: "Contact", href: "/contact" },
] as const;

export const AUTH_LINKS = {
  signIn: { label: "Login", href: "/auth/login?next=/" },
  signUp: { label: "Sign Up", href: "/auth/register" },
} as const;
