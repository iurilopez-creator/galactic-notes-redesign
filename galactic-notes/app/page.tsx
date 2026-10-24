
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!email.trim().toLowerCase().endsWith("@gmail.com")) {
      setError("Email must end with @gmail.com.");
      return;
    }

    if (password.length <= 6) {
      setError("Password must be more than 6 characters.");
      return;
    }

    localStorage.setItem("isLoggedIn", "true");
    router.push("/notes");
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="logo">✦</div>
        <p className="eyebrow">YOUR PERSONAL SPACE</p>
        <h1>Galactic Notes</h1>
        <p className="subtitle">
          Your thoughts, beyond the stars.
        </p>

        <form onSubmit={handleLogin}>
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="text"
            placeholder="you@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="More than 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="login-button" type="submit">
            Enter Your Galaxy →
          </button>

          {error && (
            <p className="error-message" role="alert">
              {error}
            </p>
          )}
        </form>

        <p className="footer-text">
          ✧ A little universe just for you ✧
        </p>
      </section>
    </main>
  );
}
