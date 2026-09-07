"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const unlocks = ["Verified field records", "Satellite evidence", "Decision-ready use cases"];

export default function DemoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open || !mounted) return null;

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          &times;
        </button>
        <div className="modal-grid">
          <div className="modal-intro">
            <p className="eyebrow">See 5am.earth in action</p>
            <h2>What would you like to unlock?</h2>
            <p className="modal-lede">
              Share a little about your organization and interests. We will contact you with relevant data,
              evidence, and use cases.
            </p>
            <ul className="modal-unlocks">
              {unlocks.map((u) => (
                <li key={u}>{u}</li>
              ))}
            </ul>
          </div>
          <form className="card-form modal-form">
            <label>Full name<input type="text" placeholder="Your name" /></label>
            <label>Work email<input type="email" placeholder="name@organization.com" /></label>
            <label>Organization<input type="text" placeholder="Organization name" /></label>
            <label>
              Your interest
              <select defaultValue="">
                <option value="" disabled>Select one</option>
                <option>Accessing verified data</option>
                <option>Building a solution</option>
                <option>Contributing data</option>
                <option>Funding or partnering</option>
              </select>
            </label>
            <label>
              What data would help you?
              <textarea placeholder="Region, crop, farmer network, field evidence, or decision need" rows={3} />
            </label>
            <button className="btn btn-ink" type="button" style={{ justifyContent: "center" }}>Request a demonstration</button>
            <small>Demo form. Connect this action to the CRM before launch.</small>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
}
