import React from "react";
import { motion } from "framer-motion";
export default function About() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7 }}
    >
    
    <div className="page about">
      <section className="section">
        <h2 className="section__title">About</h2>
        <p className="about__text">
          This is a portfolio site built to showcase my skills, the languages
          I work with, and a gallery of my work. Content on the home page
          (skills, languages, images) is managed through a simple admin
          panel, protected by a username and password login.
        </p>
        <p className="about__text">
          Tech stack: React (Vite, JSX) on the frontend, Node.js and Express
          on the backend, with MongoDB as the database via Prisma ORM.
        </p>
      </section>
    </div></motion.div>
  );
}
