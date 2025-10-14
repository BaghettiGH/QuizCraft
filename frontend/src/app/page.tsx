//   app/page.tsx
// this is the landing page
"use client";

export default function Page() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white', marginBottom: '1.5rem' }}>QuizCraft</h1>
      <div style={{ display: 'flex', alignItems: 'center', width: '520px', background: 'rgba(255,255,255,0.03)', borderRadius: '2rem', border: '1px solid #444', marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Put your notes here"
          style={{
            flex: 1,
            padding: '0.75rem 1rem',
            border: 'none',
            background: 'transparent',
            color: 'white',
            fontSize: '1rem',
            outline: 'none',
            borderRadius: '2rem',
          }}
        />
        <button style={{ background: 'none', border: 'none', padding: '0 0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <img src="/file.svg" alt="Clipboard" style={{ width: 22, height: 22, filter: 'invert(60%)' }} />
        </button>
        <button style={{ background: 'none', border: 'none', padding: '0 1rem 0 0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          📷
        </button> {/*  temp icon */}
      </div>
    </div>
  );
}
