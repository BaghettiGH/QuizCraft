// app/components/Sidebar.tsx
"use client";

import Link from "next/link";

import React, { useState, useEffect } from "react";

interface ChatSession {
  session_id: string;
  user_id?: number;
  title?: string;
  mode?: string;
  created_at?: string;
  last_active_at?: string;
}

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const [chats, setChats] = useState<ChatSession[]>([]);

  useEffect(() => {
    async function fetchChats() {
      const userId = "USER_ID";
      const res = await fetch(`${process.env.SUPABASE_URL}/chats?user_id=USER_ID`);
      const data = await res.json();
      setChats(data);
    }
    fetchChats();
  }, []);

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
          {chats.length > 0 ? (
    chats.map((chat) => (
      <Link
        key={chat.session_id}
        href={`/chat/${chat.session_id}`}
        style={{
          display: "block",
          color: "#b3b3b3",
          textDecoration: "none",
          fontSize: 15,
          marginBottom: 12,
        }}
      >
        {chat.title || "Untitled Chat"}
      </Link>
    ))
  ) : (
    <p style={{ color: "#777" }}>No chats yet</p>
  )}
        </div>
      </div>
    </div>
  );
}
