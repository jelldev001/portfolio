import React, { useEffect, useState } from "react";
import api, { assetUrl } from "../api/axios.js";

const TABS = ["skills", "languages", "images"];
const SKILL_LEVELS = ["basic", "advanced", "expert"];
const LANGUAGE_LEVELS = ["basic", "advanced", "native"];

export default function Admin() {
  const [tab, setTab] = useState("skills");
  const [skills, setSkills] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");

  async function loadAll() {
    try {
      const [s, l, i] = await Promise.all([
        api.get("/skills"),
        api.get("/languages"),
        api.get("/images"),
      ]);
      setSkills(s.data);
      setLanguages(l.data);
      setImages(i.data);
    } catch (err) {
      setError("Failed to load admin data. Try logging in again.");
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  return (
    <div className="page admin">
      <section className="section">
        <h2 className="section__title">Admin Panel</h2>
        {error && <p className="form-error">{error}</p>}

        <div className="tabs">
          {TABS.map((t) => (
            <button
              key={t}
              className={`tabs__btn ${tab === t ? "active" : ""}`}
              onClick={() => setTab(t)}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {tab === "skills" && <SkillCrud items={skills} onChange={loadAll} />}
        {tab === "languages" && <LanguageCrud items={languages} onChange={loadAll} />}
        {tab === "images" && <ImageCrud items={images} onChange={loadAll} />}
      </section>
    </div>
  );
}

// ---------- ตัวเลือก level แบบ optional (ติ๊กก่อนถึงจะเลือก label ได้) ----------
function OptionalLevelField({ levels, hasLevel, setHasLevel, level, setLevel }) {
  return (
    <label className="field field--level-toggle">
      <span>
        <input
          type="checkbox"
          checked={hasLevel}
          onChange={(e) => setHasLevel(e.target.checked)}
        />{" "}
        ระบุระดับ
      </span>
      {hasLevel && (
        <select value={level} onChange={(e) => setLevel(e.target.value)}>
          {levels.map((lvl) => (
            <option key={lvl} value={lvl}>
              {lvl.charAt(0).toUpperCase() + lvl.slice(1)}
            </option>
          ))}
        </select>
      )}
    </label>
  );
}

// ---------- Skill CRUD: name, category (พิมพ์เอง), level (optional) ----------
function SkillCrud({ items, onChange }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [hasLevel, setHasLevel] = useState(false);
  const [level, setLevel] = useState(SKILL_LEVELS[0]);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const categories = [...new Set(items.map((s) => s.category))];

  function resetForm() {
    setName("");
    setCategory("");
    setHasLevel(false);
    setLevel(SKILL_LEVELS[0]);
    setEditingId(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const payload = { name, category, level: hasLevel ? level : null };
    try {
      if (editingId) {
        await api.put(`/skills/${editingId}`, payload);
      } else {
        await api.post("/skills", payload);
      }
      resetForm();
      onChange();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  }
function handleEdit(item) {
    setEditingId(item.id);
    setFile(null);
    setPreview(assetUrl(item.url));
    setCaption(item.caption || "");
  }

  async function handleDelete(id) {
    if (!confirm("Delete this skill?")) return;
    try {
      await api.delete(`/skills/${id}`);
      onChange();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete");
    }
  }

  return (
    <div className="crud">
      {error && <p className="form-error">{error}</p>}
      <form className="crud__form crud__form--skill" onSubmit={handleSubmit}>
        <label className="field">
          <span>Skill name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label className="field">
          <span>Category</span>
          <input
            type="text"
            list="skill-categories"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="เช่น Frontend, Cyber, Excel"
            required
          />
          <datalist id="skill-categories">
            {categories.map((c) => (
              <option value={c} key={c} />
            ))}
          </datalist>
        </label>
        <OptionalLevelField
          levels={SKILL_LEVELS}
          hasLevel={hasLevel}
          setHasLevel={setHasLevel}
          level={level}
          setLevel={setLevel}
        />
        <button type="submit" className="btn btn--primary">
          {editingId ? "Update" : "Add"} Skill
        </button>
        {editingId && (
          <button type="button" className="btn btn--ghost" onClick={resetForm}>
            Cancel
          </button>
        )}
      </form>

      <ul className="crud__list">
        {items.map((item) => (
          <li key={item.id} className="crud__row">
            <div className="crud__row-info">
              <span className="crud__row-name">{item.name}</span>
              <span className="crud__row-category">{item.category}</span>
              {item.level && (
                <span className={`badge badge--${item.level}`}>{item.level}</span>
              )}
            </div>
            <div className="crud__row-actions">
              <button className="btn btn--small" onClick={() => handleEdit(item)}>
                Edit
              </button>
              <button
                className="btn btn--small btn--danger"
                onClick={() => handleDelete(item.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ---------- Language CRUD: name, level (optional: basic/advanced/native) ----------
function LanguageCrud({ items, onChange }) {
  const [name, setName] = useState("");
  const [hasLevel, setHasLevel] = useState(false);
  const [level, setLevel] = useState(LANGUAGE_LEVELS[0]);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  function resetForm() {
    setName("");
    setHasLevel(false);
    setLevel(LANGUAGE_LEVELS[0]);
    setEditingId(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const payload = { name, level: hasLevel ? level : null };
    try {
      if (editingId) {
        await api.put(`/languages/${editingId}`, payload);
      } else {
        await api.post("/languages", payload);
      }
      resetForm();
      onChange();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  }

  function handleEdit(item) {
    setEditingId(item.id);
    setName(item.name);
    setHasLevel(!!item.level);
    setLevel(item.level || LANGUAGE_LEVELS[0]);
  }

  async function handleDelete(id) {
    if (!confirm("Delete this language?")) return;
    try {
      await api.delete(`/languages/${id}`);
      onChange();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete");
    }
  }

  return (
    <div className="crud">
      {error && <p className="form-error">{error}</p>}
      <form className="crud__form crud__form--language" onSubmit={handleSubmit}>
        <label className="field">
          <span>Language name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <OptionalLevelField
          levels={LANGUAGE_LEVELS}
          hasLevel={hasLevel}
          setHasLevel={setHasLevel}
          level={level}
          setLevel={setLevel}
        />
        <button type="submit" className="btn btn--primary">
          {editingId ? "Update" : "Add"} Language
        </button>
        {editingId && (
          <button type="button" className="btn btn--ghost" onClick={resetForm}>
            Cancel
          </button>
        )}
      </form>

      <ul className="crud__list">
        {items.map((item) => (
          <li key={item.id} className="crud__row">
            <div className="crud__row-info">
              <span className="crud__row-name">{item.name}</span>
              {item.level && (
                <span className={`badge badge--${item.level}`}>{item.level}</span>
              )}
            </div>
            <div className="crud__row-actions">
              <button className="btn btn--small" onClick={() => handleEdit(item)}>
                Edit
              </button>
              <button
                className="btn btn--small btn--danger"
                onClick={() => handleDelete(item.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ---------- Image CRUD: upload ไฟล์จากเครื่อง (multipart/form-data) ----------
function ImageCrud({ items, onChange }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  function resetForm() {
    setFile(null);
    setPreview(null);
    setCaption("");
    setEditingId(null);
  }

  function handleFileChange(e) {
    const f = e.target.files?.[0] || null;
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!editingId && !file) {
      setError("กรุณาเลือกไฟล์ภาพ");
      return;
    }

    const formData = new FormData();
    if (file) formData.append("image", file);
    formData.append("caption", caption);

    try {
      if (editingId) {
        await api.put(`/images/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/images", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      resetForm();
      onChange();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  }

  function handleEdit(item) {
    setEditingId(item.id);
    setFile(null);
    setPreview(item.url);
    setCaption(item.caption || "");
  }

  async function handleDelete(id) {
    if (!confirm("Delete this image?")) return;
    try {
      await api.delete(`/images/${id}`);
      onChange();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete");
    }
  }

  return (
    <div className="crud">
      {error && <p className="form-error">{error}</p>}
      <form className="crud__form crud__form--image" onSubmit={handleSubmit}>
        <label className="field">
          <span>{editingId ? "เปลี่ยนไฟล์ภาพ (ถ้าต้องการ)" : "เลือกไฟล์ภาพจากเครื่อง"}</span>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </label>
        {preview && (
          <img src={preview} alt="preview" className="crud__preview" />
        )}
        <label className="field">
          <span>Caption (optional)</span>
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
        </label>
        <button type="submit" className="btn btn--primary">
          {editingId ? "Update" : "Add"} Image
        </button>
        {editingId && (
          <button type="button" className="btn btn--ghost" onClick={resetForm}>
            Cancel
          </button>
        )}
      </form>

      <div className="crud__image-grid">
        {items.map((item) => (
          <div key={item.id} className="crud__image-card">
            <img src={item.url} alt={item.caption || "image"} />
            {item.caption && <p>{item.caption}</p>}
            <div className="crud__row-actions">
              <button className="btn btn--small" onClick={() => handleEdit(item)}>
                Edit
              </button>
              <button
                className="btn btn--small btn--danger"
                onClick={() => handleDelete(item.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
