import React, { useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import styles from "./SignInForm.module.css";
import bugIcon from "../../images/icons/bug.png";
import Label from "../SignIn/Label";
import Button from "../SignIn/Button";
import { TypeAnimation } from "react-type-animation";
import { useAuth } from "../../context/AuthContext";

const SignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // stop the browser's default full-page-reload form submit
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className={styles["sign-in"]}>
        <TypeAnimation
          // Same String at the start will only be typed once, initially
          sequence={[
            "Welcome to Bug Tracker",
            1000,
            "Create Projects",
            1000,
            "Track Issues",
            1000,
            "Add Features",
            1000,
          ]}
          speed={50} // Custom Speed from 1-99 - Default Speed: 40
          style={{
            fontSize: "1.5rem",
            color: "white",
            minHeight: "5rem",
            maxWidth: "90vw",
            display: "flex",
            alignItems: 'center', 
            justifyContent: 'center'
          }}
          wrapper="span" // Animation will be rendered as a <span>
          repeat={Infinity} // Repeat this Animation Sequence infinitely
        />
        <form className={styles["sign-in-form"]} onSubmit={handleSubmit}>
          <img src={bugIcon} alt="bug icon" id={styles.logo} />
          {error && <p className={styles.error}>{error}</p>}
          <Label title={"email"} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Label title={"password"} type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button title={submitting ? "signing in..." : "sign in"} className="button" color={"red"} disabled={submitting} />
          <div>
            <p className={styles.option}>
              {"Forgot your "}
              <Link to="/forgot-password" className={styles.link}>
                Password?
              </Link>
            </p>
            <p className={styles.option}>
              {"Don't have an account?"}
              <br />
              <Link to="/sign-up" className={styles.link}>
                Sign Up
              </Link>
            </p>
            <p className={styles.option}>
              {"Sign in as a "}
              <Link to="/demo-sign-in" className={styles.link}>
                Demo User
              </Link>
            </p>
          </div>
        </form>
      </div>
    </>
  );
};

export default SignInForm;