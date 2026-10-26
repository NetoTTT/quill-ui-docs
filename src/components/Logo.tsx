import iconLight from "@/assets/quill-ui-icon.png";
import iconDark from "@/assets/quill-ui-icon-dark.png";

/** Official Quill UI mark, with a dark-surface variant for the dark theme. */
export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <span className="logo-mark relative inline-flex shrink-0" style={{ width: size, height: size }}>
      <img
        src={iconLight}
        alt=""
        aria-hidden="true"
        className="logo-light h-full w-full rounded-[6px] ring-1 ring-line/70"
      />
      <img
        src={iconDark}
        alt=""
        aria-hidden="true"
        className="logo-dark absolute inset-0 h-full w-full rounded-[6px] ring-1 ring-line/70"
      />
    </span>
  );
}

export function Logo({ size = 28 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark size={size} />
      <span className="text-[15px] font-semibold tracking-tight text-ink">Quill UI</span>
    </span>
  );
}
