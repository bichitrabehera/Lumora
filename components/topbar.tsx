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
  logo = "LL",
  brandName,
  ghostHref = "/contact",
  ghostLabel = "Start a page",
  nav,
  authAction,
}: Props) {
  return (
    <header className="topbar">
      <div className="brand-mark">
        {typeof logo === "string" &&
        (logo.endsWith(".svg") ||
          logo.endsWith(".png") ||
          logo.includes("/")) ? (
          // render an image when given a path
          // Next's Image component can be used later if desired
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
          logo
        )}
      </div>

      {nav ?? (
        <nav>
          <Link href="/">Home</Link>
          <a href="#templates">Templates</a>
          <a href="#how-it-works">How it works</a>
          <a href="#reviews">Reviews</a>
          <a href="#faq">FAQ</a>
        </nav>
      )}

      {authAction}

      <Link className="ghost-btn" href={ghostHref}>
        {ghostLabel}
      </Link>
    </header>
  );
}
