"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  children: React.ReactNode;
  /** Delay sebelum animasi dimulai setelah elemen masuk viewport (ms) */
  delay?: number;
  /** Tailwind classes tambahan untuk wrapper div (misal: lg:col-span-2 h-full) */
  className?: string;
}

/**
 * ScrollReveal — MOTION 2
 * Mengobservasi elemen via IntersectionObserver dan menambahkan class
 * `is-visible` saat elemen masuk viewport. Animasi didefinisikan di globals.css
 * (.scroll-reveal + .scroll-reveal.is-visible), sehingga prefers-reduced-motion
 * ditangani sepenuhnya di CSS tanpa logika JS tambahan.
 */
export default function ScrollReveal({ children, delay = 0, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`scroll-reveal${visible ? " is-visible" : ""}${className ? ` ${className}` : ""}`}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}
