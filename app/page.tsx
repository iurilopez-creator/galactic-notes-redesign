"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import NoteItem, { type Note } from "./components/NoteItem";

const STORAGE_KEY = "galactic-notes";

function isNote(value: unknown): value is Note {
  if (typeof value !== "object" || value === null) return false;

  const note = value as Record<string, unknown>;
  return (
    typeof note.id === "string" &&
    typeof note.title === "string" &&
    typeof note.content === "string" &&
    typeof note.updatedAt === "string" &&
    !Number.isNaN(Date.parse(note.updatedAt))
  );
}

function isDuplicate(title: string, content: string, other: Note) {
  return (
    other.title.trim().toLocaleLowerCase() === title.trim().toLocaleLowerCase() &&
    other.content.trim().toLocaleLowerCase() ===
      content.trim().toLocaleLowerCase()
  );
}

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewingNote, setViewingNote] = useState<Note | null>(null);
  const [search, setSearch] = useState("");
  const [duplicate, setDuplicate] = useState(false);
  const [notice, setNotice] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const storedNotes = window.localStorage.getItem(STORAGE_KEY);
      if (storedNotes) {
        const parsed: unknown = JSON.parse(storedNotes);
        if (!Array.isArray(parsed) || !parsed.every(isNote)) {
          throw new Error("Saved notes have an invalid format.");
        }
        setNotes(parsed);
      }
    } catch (error) {
      console.error("Unable to load saved notes.", error);
      setNotice("Saved notes could not be loaded. Your new notes can still be saved.");
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch (error) {
      console.error("Unable to save notes.", error);
      setNotice("Your notes could not be saved in this browser.");
    }
  }, [notes, ready]);

  useEffect(() => {
    const cleanTitle = title.trim();
    const cleanContent = content.trim();
    if (!cleanTitle || !cleanContent) {
      setDuplicate(false);
      return;
    }
    setDuplicate(
      notes.some(
        (note) => note.id !== editingId && isDuplicate(cleanTitle, cleanContent, note),
      ),
    );
  }, [content, editingId, notes, title]);

  const visibleNotes = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    if (!query) return notes;
    return notes.filter(
      (note) =>
        note.title.toLocaleLowerCase().includes(query) ||
        note.content.toLocaleLowerCase().includes(query),
    );
  }, [notes, search]);

  function clearForm() {
    setTitle("");
    setContent("");
    setEditingId(null);
    setDuplicate(false);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanTitle = title.trim();
    const cleanContent = content.trim();
    if (!cleanTitle || !cleanContent) {
      setNotice("A title and thought are both required.");
      return;
    }
    if (
      duplicate ||
      notes.some(
        (note) => note.id !== editingId && isDuplicate(cleanTitle, cleanContent, note),
      )
    ) {
      setNotice("A note with this title and content already exists.");
      return;
    }

    const updatedAt = new Date().toISOString();
    if (editingId) {
      setNotes((current) =>
        current.map((note) =>
          note.id === editingId
            ? { ...note, title: cleanTitle, content: cleanContent, updatedAt }
            : note,
        ),
      );
      setNotice("Your note has been updated.");
    } else {
      setNotes((current) => [
        { id: crypto.randomUUID(), title: cleanTitle, content: cleanContent, updatedAt },
        ...current,
      ]);
      setNotice("Your note has been added to the galaxy.");
    }
    clearForm();
  }

  function startEditing(note: Note) {
    setTitle(note.title);
    setContent(note.content);
    setEditingId(note.id);
    setViewingNote(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteNote(id: string) {
    const note = notes.find((item) => item.id === id);
    if (!note || !window.confirm(`Delete "${note.title}"? This cannot be undone.`)) {
      return;
    }
    setNotes((current) => current.filter((item) => item.id !== id));
    if (viewingNote?.id === id) setViewingNote(null);
    if (editingId === id) clearForm();
    setNotice("The note has been deleted.");
  }

  return (
    <main className="page-shell">
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />
      <header className="topbar">
        <a className="brand" href="/" aria-label="Galactic Notes home">
          <span className="brand-mark" aria-hidden="true">✦</span>
          <span>GALACTIC<span className="brand-light"> NOTES</span></span>
        </a>
        <span className="save-status">
          <span className={ready ? "status-dot" : "status-dot status-loading"} />
          {ready ? "Saved in this browser" : "Finding your notes"}
        </span>
      </header>

      <section className="hero">
        <div className="eyebrow"><span /> YOUR PERSONAL UNIVERSE</div>
        <h1>Thoughts worth<br /><span>keeping in orbit.</span></h1>
        <p>A little space for the big ideas, passing thoughts, and everything in between.</p>
        <div className="hero-stats">
          <span className="stat-number">{notes.length.toString().padStart(2, "0")}</span>
          <span className="stat-label">{notes.length === 1 ? "NOTE IN YOUR ORBIT" : "NOTES IN YOUR ORBIT"}</span>
          <span className="stat-divider" />
          <span className="stat-sparkle" aria-hidden="true">✳</span>
          <span className="stat-label">ONLY YOU CAN SEE THESE</span>
        </div>
      </section>

      {notice && (
        <div className="notice" role="status">
          <span>{notice}</span>
          <button aria-label="Dismiss notification" onClick={() => setNotice("")} type="button">×</button>
        </div>
      )}

      <section className="workspace" aria-label="Notes workspace">
        <form className="compose-panel" onSubmit={handleSubmit}>
          <div className="panel-heading">
            <div className="panel-icon" aria-hidden="true">{editingId ? "↗" : "✎"}</div>
            <div>
              <h2>{editingId ? "Update your note" : "Capture a thought"}</h2>
              <p>{editingId ? "Make this thought yours again." : "The universe is listening."}</p>
            </div>
          </div>
          <label className="field-label" htmlFor="note-title">NOTE TITLE</label>
          <input
            id="note-title"
            maxLength={80}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Give your thought a name..."
            required
            value={title}
          />
          <label className="field-label" htmlFor="note-content">YOUR THOUGHT</label>
          <textarea
            id="note-content"
            maxLength={2000}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Let it drift out into the universe..."
            required
            rows={5}
            value={content}
          />
          <div className="form-footer">
            <span className="character-count">{content.length} / 2000</span>
            <div className="form-buttons">
              {editingId && (
                <button className="cancel-button" onClick={clearForm} type="button">Cancel</button>
              )}
              <button className="submit-button" disabled={duplicate || !ready} type="submit">
                <span>{editingId ? "Save changes" : "Add to orbit"}</span>
                <span aria-hidden="true">↗</span>
              </button>
            </div>
          </div>
          {duplicate && <p className="duplicate-message" role="alert">A note with this title and content already exists.</p>}
        </form>

        <section className="notes-section" aria-labelledby="notes-heading">
          <div className="notes-heading-row">
            <div>
              <div className="section-kicker">YOUR COLLECTION</div>
              <h2 id="notes-heading">Notes <span>({notes.length})</span></h2>
            </div>
            <label className="search-box">
              <span aria-hidden="true">⌕</span>
              <input
                aria-label="Search notes"
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search your notes..."
                value={search}
              />
              <kbd>/</kbd>
            </label>
          </div>
          {!ready ? (
            <div className="empty-state"><span className="empty-orbit">◌</span><p>Gathering your thoughts...</p></div>
          ) : visibleNotes.length ? (
            <div className="notes-grid">
              {visibleNotes.map((note) => (
                <NoteItem
                  key={note.id}
                  note={note}
                  onDelete={deleteNote}
                  onEdit={startEditing}
                  onView={setViewingNote}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span className="empty-orbit" aria-hidden="true">◌</span>
              <h3>{search ? "No notes found in this orbit." : "A whole universe of possibility."}</h3>
              <p>{search ? "Try another search term." : "Your first thought is just a few words away."}</p>
            </div>
          )}
        </section>
      </section>

      <footer className="site-footer">
        <span>MADE FOR THE THOUGHTS THAT FIND THEIR WAY HOME</span>
        <span className="footer-star" aria-hidden="true">✦</span>
        <span>YOUR NOTES STAY ON THIS DEVICE</span>
      </footer>

      {viewingNote && (
        <div className="modal-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setViewingNote(null);
        }}>
          <section aria-labelledby="modal-title" aria-modal="true" className="note-modal" role="dialog">
            <button
              aria-label="Close note"
              className="modal-close"
              onClick={() => setViewingNote(null)}
              type="button"
            >
              ×
            </button>
            <div className="section-kicker">A THOUGHT IN YOUR ORBIT</div>
            <h2 id="modal-title">{viewingNote.title}</h2>
            <p className="modal-date">
              Updated{" "}
              {new Intl.DateTimeFormat("en", {
                dateStyle: "long",
                timeStyle: "short",
              }).format(new Date(viewingNote.updatedAt))}
            </p>
            <p className="modal-content">{viewingNote.content}</p>
            <div className="modal-actions">
              <button className="cancel-button" onClick={() => deleteNote(viewingNote.id)} type="button">Delete note</button>
              <button className="submit-button" onClick={() => startEditing(viewingNote)} type="button">Edit note <span aria-hidden="true">↗</span></button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
