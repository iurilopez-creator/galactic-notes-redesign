"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (!email.trim().toLowerCase().endsWith("@gmail.com")) {
      setError("Your email address must end with @gmail.com.");
      return;
    }
    if (password.length <= 6) {
      setError("Your password must be more than 6 characters.");
      return;
    }

    try {
      window.localStorage.setItem("isLoggedIn", "true");
      router.push("/notes");
    } catch (loginError) {
      console.error("Unable to start your Galactic Notes session.", loginError);
      setError("We couldn't sign you in on this device. Please check your browser settings and try again.");
    }
  }

  return (
    <main className="login-page">
      <div aria-hidden="true" className="login-star login-star-one">✦</div>
      <div aria-hidden="true" className="login-star login-star-two">✧</div>
      <div aria-hidden="true" className="login-star login-star-three">✧</div>
      <section aria-labelledby="login-heading" className="login-card">
        <div aria-hidden="true" className="brand-mark login-brand-mark">✦</div>
        <p className="eyebrow">YOUR PERSONAL UNIVERSE</p>
        <h1 id="login-heading">Galactic Notes</h1>
        <p className="login-subtitle">Your thoughts, beyond the stars.</p>

        <form className="login-form" noValidate onSubmit={handleLogin}>
          <label htmlFor="email">Email Address</label>
          <input
            autoComplete="email"
            id="email"
            inputMode="email"
            onChange={(event) => {
              setEmail(event.target.value);
              setError("");
            }}
            placeholder="you@gmail.com"
            type="email"
            value={email}
          />

          <label htmlFor="password">Password</label>
          <input
            autoComplete="current-password"
            id="password"
            onChange={(event) => {
              setPassword(event.target.value);
              setError("");
            }}
            placeholder="More than 6 characters"
            type="password"
            value={password}
          />

          <button className="login-button" type="submit">
            <span>Log in to your galaxy</span>
            <span aria-hidden="true">↗</span>
          </button>
          {error && <p className="error-message" role="alert">{error}</p>}
        </form>

        <p className="login-footer">
          <span aria-hidden="true">✧</span> A little universe, just for you
        </p>
      </section>
      <p className="login-caption">A quiet place for everything on your mind.</p>
    </main>
  );
}
