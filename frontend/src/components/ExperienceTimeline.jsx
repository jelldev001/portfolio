import React from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { motion } from "framer-motion";

// แก้ข้อมูลตรงนี้ให้เป็นประสบการณ์จริงของคุณ
const experiences = [
  {
    title: "Frontend Developer",
    company_name: "ชื่อบริษัท/โปรเจกต์",
    date: "2025 - Present",
    points: [
      "พัฒนาเว็บแอปด้วย React และ Node.js",
      "ทำงานร่วมกับทีมออกแบบ UI/UX",
    ],
  },
  {
    title: "Self-taught Developer",
    company_name: "เรียนรู้ด้วยตนเอง",
    date: "2024 - 2025",
    points: [
      "เรียนรู้ JavaScript, React, Node.js",
      "สร้างโปรเจกต์ portfolio ส่วนตัว",
    ],
  },
];

function ExperienceCard({ experience }) {
  return (
    <VerticalTimelineElement
      contentStyle={{
        background: "#1b1e29",
        color: "#eceef4",
        border: "1px solid #2d3244",
      }}
      contentArrowStyle={{ borderRight: "7px solid #1b1e29" }}
      date={experience.date}
      iconStyle={{ background: "#5dd6c0" }}
    >
      <h3 style={{ fontSize: "1.1rem", fontWeight: 600, margin: 0 }}>
        {experience.title}
      </h3>
      <p style={{ color: "#8890a3", margin: "4px 0 12px" }}>
        {experience.company_name}
      </p>
      <ul style={{ paddingLeft: "18px", margin: 0 }}>
        {experience.points.map((point, i) => (
          <li key={i} style={{ fontSize: "0.9rem", marginBottom: "6px" }}>
            {point}
          </li>
        ))}
      </ul>
    </VerticalTimelineElement>
  );
}

export default function ExperienceTimeline() {
  return (
    <motion.section
      className="section"
      id="experience"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="section__title">Experience</h2>
      <VerticalTimeline lineColor="#2d3244">
        {experiences.map((exp, i) => (
          <ExperienceCard key={i} experience={exp} />
        ))}
      </VerticalTimeline>
    </motion.section>
  );
}