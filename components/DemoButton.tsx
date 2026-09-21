"use client";

import { useState, type ReactNode } from "react";
import DemoModal from "./DemoModal";

/**
 * A button that opens the same DemoModal as the header's "See it in action".
 *
 * The pages are server components (they read content off disk), so anything
 * that needs onClick has to live in its own client component. DemoModal
 * renders through a portal and returns null while closed, so having more than
 * one trigger on a page costs nothing.
 */
export default function DemoButton({
  className = "btn btn-ink",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className={className} type="button" onClick={() => setOpen(true)}>
        {children}
      </button>
      <DemoModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
