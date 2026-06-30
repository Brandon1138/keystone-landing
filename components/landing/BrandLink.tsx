import Link from "next/link";

import { KeystoneGlyph } from "@/components/landing/KeystoneGlyph";

export function BrandLink() {
  return (
    <Link href="/" aria-label="Keystone home" className="brand-link">
      <span className="brand-mark">
        <KeystoneGlyph />
      </span>
      <span>Keystone</span>
    </Link>
  );
}
