// app/components/Sidebar.tsx
"use client";

import Link from "next/link";

import React, { useState } from "react";

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      {/* Toggle Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        style={{
          position: "fixed",
          top: 20,
          left: 20,
          zIndex: 1001,
          background: "#16182F",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          width: 40,
          height: 40,
          cursor: "pointer",
        }}
        aria-label="Toggle sidebar"
      >
        {/* Hamburger icon */}
        <span style={{ fontSize: 24 }}>&#9776;</span>
      </button>

      {/* Sidebar Box */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          width: open ? 240 : 60,
          background: "#16182F",
          transition: "width 0.3s cubic-bezier(0.4,0,0.2,1)",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          paddingTop: 32,
          boxSizing: "border-box",
        }}
      >
        {/* Sidebar Navigation */}
        <nav style={{
          paddingLeft: open ? 24 : 0,
          paddingRight: open ? 24 : 0,
          marginTop: 48,
        }}>
            
          <Link href="#" style={{
            display: "block",
            color: "#fff",
            textDecoration: "none",
            fontWeight: 600,
            fontSize: 16,
            marginBottom: 16,
            opacity: open ? 1 : 0,
            transition: "opacity 0.2s",
            pointerEvents: open ? "auto" : "none",
          }}>New chat</Link>

          <Link href="#" style={{
            display: "block",
            color: "#fff",
            textDecoration: "none",
            fontWeight: 600,
            fontSize: 16,
            marginBottom: 32,
            opacity: open ? 1 : 0,
            transition: "opacity 0.2s",
            pointerEvents: open ? "auto" : "none",
          }}>Progress</Link>

        </nav>
        {/* Chats Section */}
        <div style={{
          marginTop: 64,
          paddingLeft: open ? 24 : 0,
          paddingRight: open ? 24 : 0,
        }}>
          <div style={{
            color: "#fff",
            fontWeight: 700,
            fontSize: 15,
            marginBottom: 12,
            opacity: open ? 1 : 0,
            transition: "opacity 0.2s",
            pointerEvents: open ? "auto" : "none",
          }}>
            Chats
          </div>
          <Link href="#" style={{
            display: "block",
            color: "#b3b3b3",
            textDecoration: "none",
            fontWeight: 400,
            fontSize: 15,
            marginBottom: 12,
            opacity: open ? 1 : 0,
            transition: "opacity 0.2s",
            pointerEvents: open ? "auto" : "none",
          }}>temporary, testing</Link>
          {/* Previous chats will go here in the future */}
        </div>
      </div>
    </div>
  );
}
