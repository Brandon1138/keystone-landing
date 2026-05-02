const Ico = ({ children, size = 20, strokeWidth = 1.7 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="square"
    strokeLinejoin="miter"
    aria-hidden="true"
  >
    {children}
  </svg>
);

const IconTarget = (p) => (
  <Ico {...p}>
    <circle cx="12" cy="12" r="7" />
    <circle cx="12" cy="12" r="2" />
    <path d="M12 2v4 M12 18v4 M2 12h4 M18 12h4" />
  </Ico>
);

const IconLayers = (p) => (
  <Ico {...p}>
    <path d="M12 3 3 8l9 5 9-5-9-5Z" />
    <path d="m3 13 9 5 9-5" />
    <path d="m3 18 9 5 9-5" />
  </Ico>
);

const IconShield = (p) => (
  <Ico {...p}>
    <path d="M12 3 20 6v6c0 5-3.4 7.8-8 9-4.6-1.2-8-4-8-9V6l8-3Z" />
    <path d="m9 12 2 2 4-5" />
  </Ico>
);

const IconTimer = (p) => (
  <Ico {...p}>
    <circle cx="12" cy="13" r="8" />
    <path d="M9 2h6 M12 13l4-3 M12 5V3" />
  </Ico>
);

const IconBenchmark = (p) => (
  <Ico {...p}>
    <path d="M4 20h16" />
    <path d="M6 20V10" />
    <path d="M11 20V6" />
    <path d="M16 20v-8" />
  </Ico>
);

const IconBlocks = (p) => (
  <Ico {...p}>
    <rect x="4" y="4" width="7" height="7" />
    <rect x="13" y="4" width="7" height="7" />
    <rect x="8.5" y="13" width="7" height="7" />
  </Ico>
);

const IconCode = (p) => (
  <Ico {...p}>
    <path d="m8 8-4 4 4 4" />
    <path d="m16 8 4 4-4 4" />
    <path d="m14 5-4 14" />
  </Ico>
);

const IconArrow = (p) => (
  <Ico {...p}>
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </Ico>
);

const IconCheck = (p) => (
  <Ico {...p}>
    <path d="m4 12 5 5L20 6" />
  </Ico>
);

const IconCopy = (p) => (
  <Ico {...p}>
    <rect x="8" y="8" width="12" height="12" />
    <path d="M16 8V4H4v12h4" />
  </Ico>
);

const IconCube = (p) => (
  <Ico {...p}>
    <path d="M12 3 20 7.5v9L12 21l-8-4.5v-9L12 3Z" />
    <path d="M12 12 20 7.5 M12 12v9 M12 12 4 7.5" />
  </Ico>
);

const IconPlus = (p) => (
  <Ico {...p}>
    <path d="M12 5v14 M5 12h14" />
  </Ico>
);

Object.assign(window, {
  IconTarget,
  IconLayers,
  IconShield,
  IconTimer,
  IconBenchmark,
  IconBlocks,
  IconCode,
  IconArrow,
  IconCheck,
  IconCopy,
  IconCube,
  IconPlus,
});
