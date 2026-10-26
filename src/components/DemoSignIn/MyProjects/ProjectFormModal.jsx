import { useState } from "react";
import styles from "./ProjectFormModal.module.css";

const STATUS_OPTIONS = [
  { value: "not_started", label: "not started" },
  { value: "in_progress", label: "in progress" },
  { value: "completed", label: "completed" },
];

// One form for both create and edit. If a `project` is passed in we're
// editing (and show the status field); otherwise we're creating.
// `onSave` does the actual API call — if it throws, we show the message
// (the same error pattern SignInForm uses) and keep the modal open so the
// user doesn't lose what they typed.
const ProjectFormModal = ({ project, onSave, onClose }) => {
  const isEdit = Boolean(project);
  const [name, setName] = useState(project?.name ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [status, setStatus] = useState(project?.status ?? "not_started");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const values = isEdit ? { name, description, status } : { name, description };
      await onSave(values);
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
    // No `finally` reset on success: onSave closes the modal, so there's
    // nothing left to re-enable.
  };

  return (
    <div className={styles.modal}>
      <div className={styles.overlay} onClick={onClose}></div>
      <form className={styles.content} onSubmit={handleSubmit}>
        <h2 className={styles.header}>{isEdit ? "edit project" : "create project"}</h2>
        <button type="button" className={styles.close} onClick={onClose}>
          X
        </button>

        {error && <p className={styles.error}>{error}</p>}

        <label className={styles.label} htmlFor="project-name">
          name
        </label>
        <input
          id="project-name"
          className={styles.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />

        <label className={styles.label} htmlFor="project-description">
          description
        </label>
        <textarea
          id="project-description"
          className={styles.input}
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {isEdit && (
          <>
            <label className={styles.label} htmlFor="project-status">
              status
            </label>
            <select
              id="project-status"
              className={styles.input}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </>
        )}

        <div className={styles.buttons}>
          <button type="submit" className={styles.save} disabled={submitting}>
            {submitting ? "saving..." : "save"}
          </button>
          <button type="button" className={styles.cancel} onClick={onClose}>
            cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectFormModal;