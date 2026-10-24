export type Note = {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
};

type NoteItemProps = {
  note: Note;
  onView: (note: Note) => void;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
};

export default function NoteItem({
  note,
  onView,
  onEdit,
  onDelete,
}: NoteItemProps) {
  return (
    <article className="note-card">
      <span className="note-card-orbit" aria-hidden="true">✧</span>
      <h3>{note.title}</h3>
      <button
        aria-label={`View ${note.title}`}
        className="note-open"
        onClick={() => onView(note)}
        type="button"
      >
        <span className="note-preview">{note.content}</span>
        <span className="note-date">
          Updated{" "}
          {new Intl.DateTimeFormat("en", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }).format(new Date(note.updatedAt))}
        </span>
      </button>
      <div className="note-actions">
        <button
          aria-label={`Edit ${note.title}`}
          className="icon-button"
          onClick={() => onEdit(note)}
          type="button"
        >
          Edit
        </button>
        <button
          aria-label={`Delete ${note.title}`}
          className="icon-button delete-button"
          onClick={() => onDelete(note.id)}
          type="button"
        >
          Delete
        </button>
      </div>
    </article>
  );
}
