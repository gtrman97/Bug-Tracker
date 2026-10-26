import { useEffect, useState } from "react";
import Popup from "reactjs-popup";
import DeleteModal from "./DeleteModal";
import ProjectFormModal from "./ProjectFormModal";
import "reactjs-popup/dist/index.css";
import styles from "./Projects.module.css";
import dots from "../../../images/icons/three-dots.png";
import { api } from "../../../api/client";
import { useAuth } from "../../../context/AuthContext";

// Mirrors what the BACKEND enforces (PATCH: admin/manager, DELETE: admin).
// This only decides what to *show* — the server's requireRole check is the
// real protection, since anyone can call the API without our UI.
const canEdit = (role) => role === "admin" || role === "manager";
const canDelete = (role) => role === "admin";

// The API uses "in_progress"; people read "in progress".
const formatStatus = (status) => status.replace(/_/g, " ");

const Projects = () => {
  const { token } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  // Bumping this re-runs the fetch effect below. After any create/edit/
  // delete we refetch from the server rather than patching local state, so
  // the table can never drift from what's actually in the database.
  const [refreshKey, setRefreshKey] = useState(0);
  // null = no modal open; otherwise { type: "create" | "edit" | "delete", project }
  const [modal, setModal] = useState(null);

  useEffect(() => {
    let ignore = false; // guards against setting state after unmount / a newer fetch
    api
      .get("/projects", token)
      .then((data) => {
        if (ignore) return;
        setProjects(data);
        setLoadError("");
      })
      .catch((err) => {
        if (!ignore) setLoadError(err.message);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [token, refreshKey]);

  const closeModal = () => setModal(null);

  const handleSave = async (values) => {
    if (modal.type === "edit") {
      await api.patch(`/projects/${modal.project.id}`, values, token);
    } else {
      await api.post("/projects", values, token);
    }
    closeModal();
    setRefreshKey((k) => k + 1);
  };

  const handleDelete = async () => {
    await api.delete(`/projects/${modal.project.id}`, token);
    closeModal();
    setRefreshKey((k) => k + 1);
  };

  const isMobile = window.screen.width < 897;

  const renderBody = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan={5} className={styles.message}>
            loading projects...
          </td>
        </tr>
      );
    }
    if (loadError) {
      return (
        <tr>
          <td colSpan={5} className={`${styles.message} ${styles.error}`}>
            {loadError}
          </td>
        </tr>
      );
    }
    if (projects.length === 0) {
      return (
        <tr>
          <td colSpan={5} className={styles.message}>
            no projects yet — create your first one
          </td>
        </tr>
      );
    }
    return projects.map((project) => (
      <tr key={project.id} className={styles["table-body-row"]}>
        <td>
          <span>{project.name}</span>
        </td>
        <td>
          <span>{project.owner?.name}</span>
        </td>
        <td>
          <span>{project.description}</span>
        </td>
        <td>
          <span>{formatStatus(project.status)}</span>
        </td>
        <td className={styles.actions}>
          {canEdit(project.role) && (
            <Popup
              className="actions"
              trigger={<img src={dots} alt="dots" className={styles.dots} />}
              position="left center"
              closeOnDocumentClick
            >
              {(close) => (
                <>
                  <div
                    className={styles["edit-option"]}
                    onClick={() => {
                      close();
                      setModal({ type: "edit", project });
                    }}
                  >
                    edit project
                  </div>
                  {canDelete(project.role) && (
                    <div
                      className={styles["delete-option"]}
                      onClick={() => {
                        close();
                        setModal({ type: "delete", project });
                      }}
                    >
                      delete project
                    </div>
                  )}
                </>
              )}
            </Popup>
          )}
        </td>
      </tr>
    ));
  };

  return (
    <>
      {modal?.type === "delete" && (
        <DeleteModal
          onToggleModal={closeModal}
          onConfirm={handleDelete}
          projectName={modal.project.name}
        />
      )}
      {(modal?.type === "create" || modal?.type === "edit") && (
        <ProjectFormModal project={modal.project} onSave={handleSave} onClose={closeModal} />
      )}
      <div className={styles.create}>
        <button className={styles.button} onClick={() => setModal({ type: "create" })}>
          create project
        </button>
      </div>
      <div className={styles.row}>
        <div className={styles.col}>
          <div className={styles.card}>
            <div className={styles["card-header"]}>
              <div className={styles.gradient}>
                <h6 className={styles["header-text"]}>my projects</h6>
              </div>
            </div>
            <div className={styles["card-body"]}>
              <div className={styles["table-responsive"]}>
                <table className={styles.table}>
                  <thead className={styles["table-heading"]}>
                    <tr className={styles["table-heading-row"]}>
                      <th>{isMobile ? "project" : "project name"}</th>
                      <th>{isMobile ? "owner" : "project owner"}</th>
                      <th>description</th>
                      <th>status</th>
                      <th className={styles["actions-col"]}></th>
                    </tr>
                  </thead>
                  <tbody>{renderBody()}</tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Projects;