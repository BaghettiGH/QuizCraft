import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="login-layout">{children}</div>;
}