@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,400&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --green: #25D366;
  --green-dim: rgba(37,211,102,0.15);
  --green-glow: rgba(37,211,102,0.25);
  --bg: #0a0a0a;
  --surface: rgba(255,255,255,0.03);
  --border: rgba(255,255,255,0.07);
  --text: #f0ede8;
  --text-dim: rgba(240,237,232,0.4);
  --text-muted: rgba(240,237,232,0.2);
  --red: #ff6b6b;
  --font-display: 'Syne', sans-serif;
  --font-body: 'DM Sans', sans-serif;
}

html { scroll-behavior: smooth; }

body {
  font-family: var(--font-body);
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
}

.noise {
  position: fixed; inset: 0; pointer-events: none; z-index: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
  opacity: 0.35;
}
.blob {
  position: fixed; border-radius: 50%; pointer-events: none; z-index: 0;
}
.blob-1 {
  top: -200px; right: -100px; width: 600px; height: 600px;
  background: radial-gradient(circle, rgba(37,211,102,0.1) 0%, transparent 70%);
}
.blob-2 {
  bottom: -150px; left: -200px; width: 500px; height: 500px;
  background: radial-gradient(circle, rgba(37,211,102,0.06) 0%, transparent 70%);
}

.page { position: relative; z-index: 1; min-height: 100vh; }
.container { max-width: 920px; margin: 0 auto; padding: 0 24px; }

/* TOAST */
.toast {
  position: fixed; bottom: 28px; right: 28px; z-index: 9999;
  padding: 12px 20px; border-radius: 10px; font-size: 13px; font-weight: 500;
  animation: toastIn 0.3s ease;
  display: flex; align-items: center; gap: 8px;
}
.toast.success {
  background: rgba(37,211,102,0.12);
  border: 1px solid rgba(37,211,102,0.3);
  color: #25D366;
}
.toast.error {
  background: rgba(255,107,107,0.12);
  border: 1px solid rgba(255,107,107,0.3);
  color: #ff6b6b;
}
@keyframes toastIn {
  from { transform: translateY(16px); opacity: 0; }
  to   { transform: translateY(0); opacity: 1; }
}

/* SPINNER */
.spinner {
  width: 20px; height: 20px;
  border: 2px solid rgba(37,211,102,0.2);
  border-top-color: #25D366;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  display: inline-block;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* BUTTONS */
.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  border: none; cursor: pointer; font-family: var(--font-body); font-weight: 500;
  transition: all 0.18s; border-radius: 10px; white-space: nowrap;
}
.btn:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-primary {
  background: var(--green); color: #0a0a0a;
  padding: 13px 24px; font-size: 14px; font-weight: 700;
  font-family: var(--font-display); letter-spacing: 0.5px;
}
.btn-primary:hover:not(:disabled) {
  background: #20c75a;
  transform: translateY(-1px);
  box-shadow: 0 8px 25px var(--green-glow);
}
.btn-ghost {
  background: var(--surface); border: 1px solid var(--border);
  color: var(--text-dim); padding: 8px 16px; font-size: 13px;
}
.btn-ghost:hover { background: rgba(255,255,255,0.07); color: var(--text); }
.btn-icon {
  background: var(--surface); border: 1px solid var(--border);
  color: var(--text-dim); width: 34px; height: 34px; border-radius: 8px;
  font-size: 14px; padding: 0;
}
.btn-icon:hover { background: rgba(255,255,255,0.08); color: var(--text); }
.btn-icon.danger:hover { background: rgba(255,107,107,0.12); border-color: rgba(255,107,107,0.2); color: var(--red); }
.btn-icon.active { background: var(--green-dim); border-color: rgba(37,211,102,0.25); color: var(--green); }

/* INPUTS */
.input {
  background: rgba(255,255,255,0.04); border: 1px solid var(--border);
  border-radius: 10px; padding: 12px 16px; color: var(--text);
  font-family: var(--font-body); font-size: 14px; outline: none;
  transition: border-color 0.2s, background 0.2s; width: 100%;
}
.input:focus { border-color: rgba(37,211,102,0.45); background: rgba(37,211,102,0.04); }
.input::placeholder { color: var(--text-muted); }
.input.error { border-color: rgba(255,107,107,0.4); }

.field-error { color: var(--red); font-size: 12px; margin-top: 5px; }
.label {
  font-size: 11px; color: var(--text-dim); letter-spacing: 1.5px;
  text-transform: uppercase; font-weight: 500; margin-bottom: 8px; display: block;
}

/* CARD */
.card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 18px; position: relative; overflow: hidden;
}
.card-shine::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(37,211,102,0.35), transparent);
}
