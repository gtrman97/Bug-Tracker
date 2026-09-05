import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./SignUpForm.module.css";
import FormHeader from "../SignIn/FormHeader";
import bugIcon from "../../images/icons/bug.png";
import Label from "../SignIn/Label";
import Button from "../SignIn/Button";
import { useAuth } from "../../context/AuthContext";

const SignUpForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Checked client-side first purely for a faster, friendlier error —
    // the backend doesn't know or care about "confirm password" at all,
    // it only ever receives a single password field.
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setSubmitting(true);
    try {
      await register(name, email, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
    <div className={styles["sign-up"]}>
      <span className={styles.span}></span>
      <FormHeader title={"sign up"} />
      <form className={styles["sign-up-form"]} onSubmit={handleSubmit}>
        <img src={bugIcon} alt="bug icon" id={styles["logo"]} />
        <p className={styles.prompt}>
          Enter your name, email and password to register
        </p>
        {error && <p className={styles.error}>{error}</p>}
        <Label title={"name"} value={name} onChange={(e) => setName(e.target.value)} />
        <Label title={"email"} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Label title={"password"} type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Label title={"confirm password"} type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        <Button title={submitting ? "signing up..." : "sign up"} color={"red"} disabled={submitting} />
        <p className={styles.option}>
          Already have an account?{" "}
          <Link to="/sign-in" className={styles.link}>
            Sign In
          </Link>
        </p>
      </form>
    </div>
    </>
  );
};

export default SignUpForm;