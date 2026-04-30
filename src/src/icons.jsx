// Minimal 1px line icons. Use stroke="currentColor" so they inherit theme color.

const Ico = ({ children, size = 16, className = "", strokeWidth = 1.5 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="square"
    strokeLinejoin="miter"
    className={className}
    aria-hidden="true"
  >
    {children}
  </svg>
);

const IconKeystone = ({ size = 22 }) => (
  // wedge / keystone glyph
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M7 4 L17 4 L20 20 L4 20 Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="miter" />
    <path d="M7 4 L17 4" stroke="currentColor" strokeWidth="1.5" />
    <path d="M12 4 L12 20" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.4" />
  </svg>
);

const IconArrowRight = (p) => (
  <Ico {...p}><path d="M5 12 H19 M13 6 L19 12 L13 18" /></Ico>
);
const IconDownload = (p) => (
  <Ico {...p}><path d="M12 4 V15 M7 11 L12 16 L17 11 M5 20 H19" /></Ico>
);
const IconGithub = (p) => (
  <Ico {...p} strokeWidth={1.5}>
    <path d="M9 19c-4 1.5-4-2-6-2.5M15 22v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 19 4.77 5.07 5.07 0 0 0 18.91 1S17.73.65 15 2.48a13.38 13.38 0 0 0-7 0C5.27.65 4.09 1 4.09 1A5.07 5.07 0 0 0 4 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 8 18.13V22"/>
  </Ico>
);
const IconSun = (p) => (
  <Ico {...p}>
    <circle cx="12" cy="12" r="4"/>
    <path d="M12 2v2 M12 20v2 M2 12h2 M20 12h2 M4.93 4.93l1.41 1.41 M17.66 17.66l1.41 1.41 M4.93 19.07l1.41-1.41 M17.66 6.34l1.41-1.41"/>
  </Ico>
);
const IconMoon = (p) => (
  <Ico {...p}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></Ico>
);
const IconWindows = (p) => (
  <Ico {...p}><path d="M3 5l8-1v8H3V5z M11 4l10-1.5V12H11V4z M3 13h8v7l-8-1v-6z M11 13h10v8.5L11 20v-7z" /></Ico>
);
const IconBenchmark = (p) => (
  <Ico {...p}>
    <path d="M3 20h18" />
    <path d="M5 20V12" />
    <path d="M10 20V8" />
    <path d="M15 20v-6" />
    <path d="M20 20V4" />
  </Ico>
);
const IconLock = (p) => (
  <Ico {...p}>
    <rect x="4" y="11" width="16" height="10" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </Ico>
);
const IconAtom = (p) => (
  <Ico {...p}>
    <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/>
    <ellipse cx="12" cy="12" rx="10" ry="4"/>
    <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/>
    <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/>
  </Ico>
);
const IconCheck = (p) => (
  <Ico {...p}><path d="M4 12 L10 18 L20 6"/></Ico>
);
const IconCopy = (p) => (
  <Ico {...p}>
    <rect x="8" y="8" width="12" height="12"/>
    <path d="M16 8V4H4v12h4"/>
  </Ico>
);
const IconExternal = (p) => (
  <Ico {...p}><path d="M14 4h6v6 M20 4 L10 14 M20 14v6H4V4h6"/></Ico>
);
const IconTerminal = (p) => (
  <Ico {...p}>
    <rect x="3" y="4" width="18" height="16"/>
    <path d="M7 9 L11 12 L7 15 M13 16 H17"/>
  </Ico>
);

Object.assign(window, {
  IconKeystone, IconArrowRight, IconDownload, IconGithub, IconSun, IconMoon,
  IconWindows, IconBenchmark, IconLock, IconAtom, IconCheck, IconCopy, IconExternal, IconTerminal,
});
