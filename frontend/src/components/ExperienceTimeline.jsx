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
    icon: "https://miro.medium.com/1*BwJ84XJUWpPNpSKFGU8KDQ.png",
    image: "https://img.magnific.com/free-vector/business-hand-drawn-e-commerce-landing-page_23-2149600513.jpg",
    points: [
      "พัฒนาเว็บแอปด้วย React และ Node.js",
      "ทำงานร่วมกับทีมออกแบบ UI/UX",
    ],
  },
  {
    title: "Pos System",
    company_name: "เรียนรู้ด้วยตนเอง",
    date: "2024 - 2025",
    icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYSTONLkETxWsvtd4_yHSXOibOHzcKekAOK7xQFW47xg&s=10",
    image: "https://cdn.dribbble.com/userupload/36311639/file/original-351aba02cb1c8434a59a4f96ab321c08.png?format=webp&resize=400x300&vertical=center",
    points: [
      "เรียนรู้ Typescript,Nextjs, Node.js",
      "สร้างโปรเจกต์ pos system ",
    ],
  },
  {
    title: "Fullstack Developer",
    company_name: "ชื่อบริษัท/โปรเจกต์",
    date: "2023 - 2024",
    icon: "https://miro.medium.com/1*BwJ84XJUWpPNpSKFGU8KDQ.png",
    image: "https://img.magnific.com/free-vector/business-hand-drawn-e-commerce-landing-page_23-2149600513.jpg",
    points: ["พัฒนาเว็บแอปด้วย React และ Node.js"],
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
      icon={
        experience.icon ? (
          <img
            src={experience.icon}
            alt={experience.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "50%",
              display: "block",
            }}
          />
        ) : undefined
      }
      iconStyle={{
        background: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        padding: 0,
      }}
    >
      {experience.image && (
        <img
          src={experience.image}
          alt={experience.title}
          style={{
            width: "800px",
            height: "200px",
            objectFit: "cover",
            borderRadius: "8px",
            marginBottom: "12px",
          }}
        />
      )}
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