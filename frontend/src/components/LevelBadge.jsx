import React from "react";

// แสดง badge ระดับ ถ้าไม่มี level (null/undefined) จะไม่ render อะไรเลย
const LABELS = {
  basic: "Basic",
  advanced: "Advanced",
  expert: "Expert",
  native: "Native",
};

export default function LevelBadge({ level }) {
  if (!level) return null;
  return <span className={`badge badge--${level}`}>{LABELS[level] || level}</span>;
}
