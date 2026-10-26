import { useState } from "react";
import styles from "./DeleteModal.module.css";

// `onConfirm` performs the real delete (an API call) and closes the modal on
// success. If it throws, we show the message and keep the modal open.
const DeleteModal = ({ onToggleModal, onConfirm, projectName }) => {
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  const handleConfirm = async () => {
    setError("");
    setDeleting(true);
    try {
      await onConfirm();
    } catch (err) {
      setError(err.message);
      setDeleting(false);
    }
  };

  return (
    <>
      <div className={styles.modal}>
        <div onClick={onToggleModal} className={styles["overlay"]}></div>
        <div className={styles["modal-content"]}>
          <h2 className={styles["modal-header"]}>
            {projectName ? `delete "${projectName}"?` : "are you sure you want to delete?"}
          </h2>
          {error && <p style={{ color: "#c0392b", margin: 0 }}>{error}</p>}
          <button className={styles["close-modal"]} onClick={onToggleModal}>
            X
          </button>
          <div className={styles.buttons}>
            <button className={styles["yes-button"]} onClick={handleConfirm} disabled={deleting}>
              {deleting ? "deleting..." : "yes"}
            </button>
            <button className={styles["no-button"]} onClick={onToggleModal}>
              no
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteModal;