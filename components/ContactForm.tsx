"use client";

import { useRef, useState } from "react";

// Google Apps Script web app. It holds no secret — it only knows how to email
// a fixed recipient, so it is safe for this URL to be public. Same endpoint
// the previous static site used.
const CONTACT_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbzIDQm_lpcfvms-GzhS87IMhG2Flz4adI2g2auOZ8gwQUw-tCICRKs2IG3mY0yWRHbnbw/exec";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const renderedAt = useRef(Date.now());

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("sending");

    try {
      // text/plain keeps this a CORS "simple request" so the browser sends it to
      // Apps Script without a preflight (Apps Script doesn't return CORS headers).
      await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          role: data.get("role") || "",
          name: data.get("name") || "",
          organization: data.get("organization") || "",
          email: data.get("email") || "",
          message: data.get("message") || "",
          website: data.get("website") || "", // honeypot
          elapsedMs: Date.now() - renderedAt.current,
        }),
      });

      // no-cors gives an opaque response we can't read; a resolved fetch means it
      // was delivered to Apps Script, which validates and emails server-side.
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <form className="card-form" onSubmit={handleSubmit}>
      <label>
        Full name
        <input name="name" type="text" placeholder="Your name" required />
      </label>
      <label>
        Work email
        <input name="email" type="email" placeholder="name@organization.com" required />
      </label>
      <label>
        Organization
        <input name="organization" type="text" placeholder="Organization name" />
      </label>
      <label>
        How can we work together?
        <select name="role" defaultValue="">
          <option value="" disabled>Select a route</option>
          <option>Access verified information</option>
          <option>Build a solution</option>
          <option>Contribute data</option>
          <option>Fund or partner</option>
          <option>Media or research</option>
        </select>
      </label>
      <label>
        Message
        <textarea name="message" placeholder="Tell us about your goal" rows={5} />
      </label>
      {/* Honeypot: hidden from humans, bots fill it in. Submissions with this set are dropped server-side. */}
      <input
        name="website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
      />
      <button
        className="btn btn-ink"
        type="submit"
        style={{ justifyContent: "center" }}
        disabled={status === "sending"}
      >
        {status === "sending" ? "Sending…" : "Send inquiry"}
      </button>
      {status === "sent" && <small>Message sent! We&apos;ll be in touch within 5 business days.</small>}
      {status === "error" && <small>Network error. Please try again.</small>}
      {status === "idle" && <small>We respond to qualified inquiries within 5 business days.</small>}
    </form>
  );
}
