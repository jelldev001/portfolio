import React from "react";

export default function Contact() {
  return (
    <div className="page contact">
      <section className="section">
        <h2 className="section__title">Contact</h2>
        <p className="about__text">
          Feel free to reach out through any of the channels below.
        </p>
        <ul className="contact__list">
          <li>
            <span className="contact__label">Email</span>
            <span>jelllydev99007788@gmail.com</span>
          </li>
          <li>
            <span className="contact__label">GitHub</span>
            <a href="https://github.com/jelldev001" target="_blank">
              https://github.com/jelldev001
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}
