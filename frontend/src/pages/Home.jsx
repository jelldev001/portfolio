import React, { useEffect, useState } from "react";
import api, { assetUrl } from "../api/axios.js";
import LevelBadge from "../components/LevelBadge.jsx";
import { motion } from "framer-motion";
import HeroCanvas from "../components/HeroCanvas.jsx";
import ExperienceTimeline from "../components/ExperienceTimeline.jsx";
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};
export default function Home() {
  const [images, setImages] = useState([]);
  const [skills, setSkills] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [imgRes, skillRes, langRes] = await Promise.all([
          api.get("/images"),
          api.get("/skills"),
          api.get("/languages"),
        ]);
        setImages(imgRes.data);
        setSkills(skillRes.data);
        setLanguages(langRes.data);
      } catch (err) {
        console.error("Failed to load home data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const skillsByCategory = skills.reduce((acc, skill) => {
    const key = skill.category || "Other";
    if (!acc[key]) acc[key] = [];
    acc[key].push(skill);
    return acc;
  }, {});

  return (
    <div className="page home">
      <motion.section
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className="hero">
        <p className="hero__eyebrow">Welcome</p>
        <h1 className="hero__title">
          Building things with <span>code</span>, one skill at a time.
        </h1>
        <p className="hero__subtitle">
          A quick look at my work, my skills, and the languages I speak &mdash;
          both human and programming.
        </p>
        {/* <HeroCanvas /> */}
      </motion.section>

      <motion.section
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className="section" id="images">
        {loading ? (
          <p className="empty-state">Loading images...</p>
        ) : images.length === 0 ? (
          <p className="empty-state">No images yet. Add some from the admin page.</p>
        ) : (
          <figure className="hero-image">
            <img
              src={assetUrl(images[0].url)}
              alt={images[0].caption || "portfolio image"}
            />
            {images[0].caption && <figcaption>{images[0].caption}</figcaption>}
          </figure>
        )}
      </motion.section>

      <motion.section
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className="section" id="skills">
        <h2 className="section__title">Skills</h2>
        {loading ? (
          <p className="empty-state">Loading skills...</p>
        ) : skills.length === 0 ? (
          <p className="empty-state">No skills yet. Add some from the admin page.</p>
        ) : (
          <div className="category-groups">
            {Object.entries(skillsByCategory).map(([category, items]) => (
              <div className="category-group" key={category}>
                <h3 className="category-group__title">{category}</h3>
                <div className="tag-grid">
                  {items.map((s) => (
                    <div className="tag-chip" key={s.id}>
                      <span>{s.name}</span>
                      <LevelBadge level={s.level} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.section>

      <motion.section
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className="section" id="languages">
        <h2 className="section__title">Languages</h2>
        {loading ? (
          <p className="empty-state">Loading languages...</p>
        ) : languages.length === 0 ? (
          <p className="empty-state">No languages yet. Add some from the admin page.</p>
        ) : (
          <div className="tag-grid">
            {languages.map((l) => (
              <div className="tag-chip" key={l.id}>
                <span>{l.name}</span>
                <LevelBadge level={l.level} />
              </div>
            ))}
          </div>
        )}
      </motion.section>
      <ExperienceTimeline />

    </div>
  );
}