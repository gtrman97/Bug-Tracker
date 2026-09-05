import React from "react";
import styles from "./Label.module.css";

// type/value/onChange are optional so existing call sites that don't pass
// them (like ForgotPassword, not wired to a backend yet) keep working
// exactly as before — this only adds capability, it doesn't require it.
const Label = (props) => {
  const { title, type = "text", value, onChange, name } = props;

  return (
    <div className={styles["input-group"]}>
      <label htmlFor={title} className={styles.label}>
        {title}
      </label>
      <input
        type={type}
        id={title}
        name={name || title}
        className={styles.input}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default Label;