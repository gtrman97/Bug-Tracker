import React from "react";
import styles from "./Button.module.css"
const Button = (props) => {

    const {color, title, disabled} = props;

    return (
        <button type="submit" className={`${styles.button} ${styles[color]}`} disabled={disabled}>
            {title}
        </button>
    )

}

export default Button;