import React from "react";
import { motion } from "framer-motion";

// 1. เก็บลิงก์และไอคอนไว้ใน Array เดียว (ง่ายต่อการ Loop)
const SOCIAL_LINKS = [
  {
    name: "Email",
    href: "mailto:jelllydev99007788@gmail.com",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
    // Email ไม่ต้อง target blank
    isExternal: false, 
  },
  {
    name: "Github",
    href: "https://github.com/jelldev001",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.3-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.876.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
    isExternal: true,
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/share/1EYpoJYdgd/?mibextid=wwXIfr",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
    ),
    isExternal: true,
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/jelly_jus001?igsi=Z3A1Z2JreXF4aGdl&utm_source=qr",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
    ),
    isExternal: true,
  },
  // เพิ่มช่องว่างสำหรับ WhatsApp, X, Telegram ได้ง่ายๆ ตรงนี้
];

export default function Contact() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7 }}
    >
      <div className="page contact">
        <section className="section">
          <h2 className="section__title">Contact</h2>
          <p className="about__text">
            Feel free to reach out through any of the channels below.
          </p>
          <div className="flex flex-wrap gap-3 mt-4">
            {/* ใช้ .map() Loop ตามข้อมูลใน SOCIAL_LINKS */}
            {SOCIAL_LINKS.map((link, index) => (
              <a
                key={index} // จำเป็นต้องมี key เมื่อใช้ loop
                href={link.href}
                target={link.isExternal ? "_blank" : undefined}
                rel={link.isExternal ? "noopener noreferrer" : undefined}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-green-200 text-sm font-medium hover:bg-green-100 hover:text-black transition-colors hover:translate-y-1"
              >
                {link.icon}
                {link.name}
              </a>
            ))}
          </div>
        </section>
      </div>
    </motion.div>
  );
}
