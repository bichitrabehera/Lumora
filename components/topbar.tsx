import Link from "next/link";

type Props = {
  logo?: React.ReactNode;
  brandName?: string;
  ghostHref?: string;
  ghostLabel?: string;
  nav?: React.ReactNode;
  authAction?: React.ReactNode;
};

export default function Topbar({
  logo = "loveypage",
  brandName,
  ghostHref = "/auth",
  ghostLabel = "Login/Signup",
  nav,
  authAction,
}: Props) {
  const safeGhostHref = ghostHref.startsWith("/") ? ghostHref : "/contact";

  return (
    <header className="topbar">
      <div className="brand-mark">
        {typeof logo === "string" &&
        (logo.endsWith(".svg") ||
          logo.endsWith(".png") ||
          logo.includes("/")) ? (
          // render an image when given a path
          <img
            src={logo}
            alt={brandName ?? "logo"}
            style={{
              width: 32,
              height: 32,
              padding: 4,
              borderRadius: 8,
              objectFit: "contain",
              background: "transparent",
              display: "block",
            }}
          />
        ) : (
          <span>{logo}</span>
        )}
      </div>

      {nav ?? (
        <nav>
          <a href="#templates">Templates</a>
          <a href="#how-it-works">How it works</a>
          <a href="#contact">Contact</a>
        </nav>
      )}

      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        {authAction}

        <Link className="primary-btn" href={safeGhostHref as never}>
          {ghostLabel}
        </Link>
      </div>
    </header>
  );
}
