"use client";

import Link from "next/link";
import { useState } from "react";

type MobileNavItem = {
  title: string;
  href: string;
};

type MobileNavProps = {
  categories: MobileNavItem[];
};

export function MobileNav({ categories }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mobile-nav">
      <button type="button" className="ghost-button" onClick={() => setOpen(true)}>
        导航
      </button>
      {open ? (
        <div className="search-overlay" role="dialog" aria-modal="true">
          <div className="mobile-nav-panel">
            <div className="hero-actions">
              <strong>模块导航</strong>
              <button type="button" className="ghost-button" onClick={() => setOpen(false)}>
                关闭
              </button>
            </div>
            <div className="recent-list">
              {categories.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
