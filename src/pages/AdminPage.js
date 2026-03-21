import React, { useState, useEffect, useCallback } from "react";
import SetsPanel from "../components/SetsPanel";

import { supabase } from "../lib/supabase";
import { useAuth } from "../lib/AuthContext";

const generateSlug = (name) =>
  name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") +
  "-" +
  Math.random().toString(36).substr(2, 4);


const PAGE_TYPES = [
  { value: "standard", label: "⭐ Padrão", desc: "Promoções e conteúdo exclusivo" },
  { value: "rifa",     label: "🏆 Rifa",   desc: "Sorteio com prêmio em destaque" },
];

function PageTypeSelector({ value, onChange }) {
  return (
    <div style={{ display: "flex", gap: 10 }}>
      {PAGE_TYPES.map((pt) => (
        <button
          key={pt.value}
          type="button"
          onClick={() => onChange(pt.value)}
          style={{
            flex: 1, padding: "10px 14px", borderRadius: 10, cursor: "pointer",
            border: `1.5px solid ${value === pt.value ? "rgba(37,211,102,0.5)" : "var(--border)"}`,
            background: value === pt.value ? "rgba(37,211,102,0.08)" : "rgba(255,255,255,0.02)",
            color: value === pt.value ? "var(--green)" : "var(--text-dim)",
            transition: "all 0.15s", textAlign: "left",
          }}
        >
          <div style={{ fontWeight: 600, fontSize: 13 }}>{pt.label}</div>
          <div style={{ fontSize: 11, opacity: 0.6, marginTop: 2 }}>{pt.desc}</div>
        </button>
      ))}
    </div>
  );
}

function RifaFields({ meta, onChange }) {
  const total = parseInt(meta.total_tickets) || 0;
  const sold  = parseInt(meta.sold_tickets)  || 0;
  const remaining = Math.max(0, total - sold);
  const pct = total > 0 ? Math.min(100, Math.round((sold / total) * 100)) : 0;

  return (
    <div style={{ background: "rgba(255,215,0,0.04)", border: "1px solid rgba(255,215,0,0.15)", borderRadius: 10, padding: "16px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
        <div>
          <label className="label">🏆 Prêmio em destaque</label>
          <input className="input" placeholder="Ex: iPhone 15 Pro" value={meta.prize || ""} onChange={(e) => onChange({ ...meta, prize: e.target.value })} />
        </div>
        <div>
          <label className="label">💵 Preço do bilhete</label>
          <input className="input" placeholder="Ex: R$ 10,00" value={meta.ticket_price || ""} onChange={(e) => onChange({ ...meta, ticket_price: e.target.value })} />
        </div>
        <div>
          <label className="label">🎟️ Total de bilhetes</label>
          <input className="input" type="number" min="1" placeholder="Ex: 200" value={meta.total_tickets || ""} onChange={(e) => onChange({ ...meta, total_tickets: e.target.value })} />
        </div>
        <div>
          <label className="label">✅ Bilhetes vendidos</label>
          <input className="input" type="number" min="0" placeholder="Ex: 47" value={meta.sold_tickets || ""} onChange={(e) => onChange({ ...meta, sold_tickets: e.target.value })} />
        </div>
      </div>
      {total > 0 && (
        <div style={{ marginTop: 4 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "rgba(240,237,232,0.45)", marginBottom: 6 }}>
            <span>{sold} vendidos · {remaining} restantes</span>
            <span style={{ color: pct >= 80 ? "#ff6b35" : "#ffd700", fontWeight: 700 }}>{pct}% vendido</span>
          </div>
          <div style={{ height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${pct}%`, background: pct >= 80 ? "linear-gradient(90deg,#ff6b35,#ff2d20)" : "linear-gradient(90deg,#ffd700,#ff9900)", borderRadius: 99, transition: "width 0.4s" }} />
          </div>
        </div>
      )}
    </div>
  );
}

function EditModal({ group, onSave, onClose }) {
  const [pageType, setPageType] = React.useState(group.page_type || "standard");
  const [meta, setMeta] = React.useState(group.page_meta || {});
  const [saving, setSaving] = React.useState(false);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase.from("groups").update({ page_type: pageType, page_meta: meta }).eq("id", group.id);
    setSaving(false);
    if (!error) onSave(group.id, pageType, meta);
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }} onClick={onClose}>
      <div className="card card-shine" style={{ width: "100%", maxWidth: 480, padding: 28 }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700 }}>Editar tipo de página</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{group.name}</div>
          </div>
          <button className="btn btn-icon" onClick={onClose}>✕</button>
        </div>
        <label className="label" style={{ marginBottom: 8, display: "block" }}>Tipo de página</label>
        <PageTypeSelector value={pageType} onChange={setPageType} />
        {pageType === "rifa" && (
          <div style={{ marginTop: 16 }}>
            <label className="label" style={{ marginBottom: 8, display: "block" }}>Informações da rifa</label>
            <RifaFields meta={meta} onChange={setMeta} />
          </div>
        )}
        <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
          <button className="btn btn-ghost" onClick={onClose} style={{ flex: 1 }}>Cancelar</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving} style={{ flex: 2 }}>
            {saving ? <span className="spinner" /> : "Salvar alterações"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);
  return <div className={`toast ${type}`}>{message}</div>;
}

function GroupCard({ group, onDelete, onToggle, onCopy, onEdit, copiedId }) {
  const baseUrl = window.location.origin;
  const generatedLink = `${baseUrl}/g/${group.slug}`;

  return (
    <div
      className="card"
      style={{
        padding: "20px 24px",
        marginBottom: 12,
        transition: "border-color 0.2s",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.borderColor = "rgba(37,211,102,0.2)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.borderColor = "var(--border)")
      }
    >
      {/* Top row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 14,
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 38,
              height: 38,
              background: "var(--green-dim)",
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              flexShrink: 0,
            }}
          >
            👥
          </div>
          <div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 15,
                fontWeight: 600,
              }}
            >
              {group.name}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginTop: 3,
              }}
            >
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                {new Date(group.created_at).toLocaleDateString("pt-BR")}
              </span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  padding: "2px 8px",
                  borderRadius: 20,
                  background: group.active
                    ? "rgba(37,211,102,0.12)"
                    : "rgba(255,255,255,0.05)",
                  border: `1px solid ${group.active ? "rgba(37,211,102,0.25)" : "rgba(255,255,255,0.08)"}`,
                  color: group.active ? "var(--green)" : "var(--text-muted)",
                }}
              >
                {group.active ? "Ativo" : "Inativo"}
              </span>
              <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 20, background: group.page_type === "rifa" ? "rgba(255,215,0,0.1)" : "rgba(255,255,255,0.04)", border: `1px solid ${group.page_type === "rifa" ? "rgba(255,215,0,0.25)" : "rgba(255,255,255,0.07)"}`, color: group.page_type === "rifa" ? "#ffd700" : "var(--text-muted)", letterSpacing: "1px", textTransform: "uppercase" }}>
                {group.page_type === "rifa" ? "🏆 Rifa" : "⭐ Padrão"}
              </span>
            </div>
          </div>
        </div>

        {/* Clicks badge + actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ textAlign: "right", marginRight: 4 }}>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 22,
                fontWeight: 800,
                color: "var(--green)",
                lineHeight: 1,
              }}
            >
              {group.click_count ?? 0}
            </div>
            <div
              style={{
                fontSize: 10,
                color: "var(--text-muted)",
                letterSpacing: "1px",
                textTransform: "uppercase",
              }}
            >
              cliques
            </div>
          </div>
          <button
            className="btn btn-icon"
            title="Editar tipo de página"
            onClick={() => onEdit(group)}
          >
            ✏️
          </button>
          <button
            className={`btn btn-icon ${group.active ? "active" : ""}`}
            title={group.active ? "Pausar" : "Ativar"}
            onClick={() => onToggle(group.id, !group.active)}
          >
            {group.active ? "⏸" : "▶"}
          </button>
          <button
            className="btn btn-icon danger"
            title="Remover"
            onClick={() => onDelete(group.id)}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Link row */}
      <div
        style={{
          background: "rgba(0,0,0,0.3)",
          borderRadius: 10,
          padding: "10px 14px",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <span
          style={{
            fontSize: 10,
            color: "var(--text-muted)",
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            fontWeight: 500,
          }}
        >
          Link gerado
        </span>
        <span
          style={{
            fontSize: 13,
            color: "var(--green)",
            flex: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontFamily: "monospace",
          }}
        >
          {generatedLink}
        </span>
        <button
          onClick={() => onCopy(group.id, generatedLink)}
          style={{
            background:
              copiedId === group.id
                ? "rgba(37,211,102,0.2)"
                : "rgba(37,211,102,0.1)",
            border: "1px solid rgba(37,211,102,0.25)",
            color: copiedId === group.id ? "#4dff8a" : "var(--green)",
            borderRadius: 7,
            padding: "5px 12px",
            fontSize: 11,
            fontWeight: 600,
            cursor: "pointer",
            whiteSpace: "nowrap",
            transition: "all 0.15s",
          }}
        >
          {copiedId === group.id ? "✓ Copiado" : "Copiar"}
        </button>
      </div>

      {/* Rifa meta preview */}
      {group.page_type === "rifa" && group.page_meta && (
        (() => {
          const m = group.page_meta;
          const total = parseInt(m.total_tickets) || 0;
          const sold  = parseInt(m.sold_tickets)  || 0;
          const remaining = Math.max(0, total - sold);
          const pct = total > 0 ? Math.min(100, Math.round((sold / total) * 100)) : 0;
          return (
            <div style={{ marginTop: 10, background: "rgba(255,215,0,0.04)", border: "1px solid rgba(255,215,0,0.12)", borderRadius: 8, padding: "10px 14px" }}>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: total > 0 ? 10 : 0 }}>
                {m.prize && <span style={{ fontSize: 12, color: "rgba(255,215,0,0.7)" }}>🏆 {m.prize}</span>}
                {m.ticket_price && <span style={{ fontSize: 12, color: "rgba(37,211,102,0.7)" }}>💵 {m.ticket_price}</span>}
                {total > 0 && <span style={{ fontSize: 12, color: "rgba(255,153,68,0.8)" }}>🎟️ {remaining} restantes de {total}</span>}
              </div>
              {total > 0 && (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "rgba(240,237,232,0.35)", marginBottom: 4 }}>
                    <span>{sold} vendidos</span>
                    <span style={{ color: pct >= 80 ? "#ff6b35" : "#ffd700", fontWeight: 700 }}>{pct}%</span>
                  </div>
                  <div style={{ height: 5, background: "rgba(255,255,255,0.07)", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: pct >= 80 ? "linear-gradient(90deg,#ff6b35,#ff2d20)" : "linear-gradient(90deg,#ffd700,#ff9900)", borderRadius: 99 }} />
                  </div>
                </div>
              )}
            </div>
          );
        })()
      )}
    </div>
  );
}

export default function AdminPage() {
  const { user, signOut } = useAuth();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", whatsapp_url: "", page_type: "standard", page_meta: {} });
  const [errors, setErrors] = useState({});
  const [copiedId, setCopiedId] = useState(null);
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState("groups");
  const [editingGroup, setEditingGroup] = useState(null);

  const showToast = (message, type = "success") => setToast({ message, type });

  const fetchGroups = useCallback(async () => {
    const { data, error } = await supabase
      .from("groups_with_clicks")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setGroups(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Nome obrigatório";
    if (!form.whatsapp_url.trim()) e.whatsapp_url = "Link obrigatório";
    else if (!form.whatsapp_url.includes("chat.whatsapp.com"))
      e.whatsapp_url = "Use um link válido do WhatsApp (chat.whatsapp.com)";
    return e;
  };

  const handleAdd = async () => {
    const e = validate();
    if (Object.keys(e).length) return setErrors(e);
    setErrors({});
    setSaving(true);

    const newGroup = {
      name: form.name.trim(),
      whatsapp_url: form.whatsapp_url.trim(),
      slug: generateSlug(form.name.trim()),
      active: true,
      page_type: form.page_type,
      page_meta: form.page_meta,
    };

    const { error } = await supabase.from("groups").insert(newGroup);
    if (error) {
      showToast("Erro ao cadastrar grupo.", "error");
    } else {
      setForm({ name: "", whatsapp_url: "", page_type: "standard", page_meta: {} });
      showToast("✅ Grupo cadastrado com sucesso!");
      fetchGroups();
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm("Remover este grupo? Os cliques também serão apagados.")
    )
      return;
    const { error } = await supabase.from("groups").delete().eq("id", id);
    if (!error) {
      setGroups((g) => g.filter((x) => x.id !== id));
      showToast("Grupo removido.");
    } else {
      showToast("Erro ao remover.", "error");
    }
  };

  const handleToggle = async (id, active) => {
    const { error } = await supabase
      .from("groups")
      .update({ active })
      .eq("id", id);
    if (!error) {
      setGroups((g) => g.map((x) => (x.id === id ? { ...x, active } : x)));
      showToast(active ? "▶ Grupo ativado" : "⏸ Grupo pausado");
    }
  };

  const handleCopy = (id, url) => {
    navigator.clipboard.writeText(url).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    showToast("🔗 Link copiado!");
  };

  const handleEditSave = (id, pageType, meta) => {
    setGroups((g) => g.map((x) => x.id === id ? { ...x, page_type: pageType, page_meta: meta } : x));
    setEditingGroup(null);
    showToast("✅ Tipo de página atualizado!");
  };

  const activeCount = groups.filter((g) => g.active).length;
  const totalClicks = groups.reduce((sum, g) => sum + (g.click_count ?? 0), 0);

  return (
    <div className="page">
      <div className="noise" />
      <div className="blob blob-1" />
      <div className="blob blob-2" />

      <div className="container">
        {/* HEADER */}
        <header
          style={{
            padding: "44px 0 36px",
            borderBottom: "1px solid var(--border)",
            marginBottom: 44,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div
                style={{
                  width: 46,
                  height: 46,
                  background: "#25D366",
                  borderRadius: 13,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                  boxShadow: "0 0 30px rgba(37,211,102,0.3)",
                }}
              >
                💬
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 21,
                    fontWeight: 700,
                    letterSpacing: "-0.3px",
                  }}
                >
                  LinkZap
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--text-muted)",
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                    marginTop: 1,
                  }}
                >
                  Painel Admin
                </div>
              </div>
            </div>

            {/* Stats + signout */}
            <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
              {[
                { val: groups.length, label: "Grupos" },
                { val: activeCount, label: "Ativos" },
                { val: totalClicks, label: "Cliques" },
              ].map((s) => (
                <div key={s.label} style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 26,
                      fontWeight: 800,
                      color: "var(--green)",
                      lineHeight: 1,
                    }}
                  >
                    {s.val}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "var(--text-muted)",
                      letterSpacing: "1.5px",
                      textTransform: "uppercase",
                      marginTop: 3,
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
              <button
                className="btn btn-ghost"
                onClick={signOut}
                style={{ fontSize: 12 }}
              >
                Sair →
              </button>
            </div>
          </div>

          {user && (
            <div
              style={{
                marginTop: 10,
                fontSize: 12,
                color: "var(--text-muted)",
              }}
            >
              Logado como{" "}
              <span style={{ color: "var(--text-dim)" }}>{user.email}</span>
            </div>
          )}
        </header>

        {/* TABS */}
        <div
          style={{
            display: "flex",
            gap: 4,
            marginBottom: 32,
            background: "rgba(255,255,255,0.03)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: 4,
            width: "fit-content",
          }}
        >
          {[
            { key: "groups", label: "\u{1F465} Grupos" },
            { key: "sets", label: "\u{1F500} Conjuntos (Rod\u00EDzio)" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: "8px 20px",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--font-body)",
                fontSize: 13,
                fontWeight: 500,
                transition: "all 0.2s",
                background:
                  activeTab === tab.key
                    ? "rgba(37,211,102,0.15)"
                    : "transparent",
                color:
                  activeTab === tab.key ? "var(--green)" : "var(--text-dim)",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "groups" && (
          <>
            {/* FORM */}
            <div
              className="card card-shine"
              style={{ padding: 32, marginBottom: 40 }}
            >
              <div
                style={{
                  fontSize: 11,
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  color: "var(--text-dim)",
                  fontWeight: 600,
                  marginBottom: 22,
                }}
              >
                Cadastrar novo grupo
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                  marginBottom: 16,
                }}
              >
                <div>
                  <label className="label">Nome do grupo</label>
                  <input
                    className={`input ${errors.name ? "error" : ""}`}
                    placeholder="Ex: Grupo VIP Promo\u00E7\u00F5es"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                  />
                  {errors.name && <p className="field-error">{errors.name}</p>}
                </div>
                <div>
                  <label className="label">Link do WhatsApp</label>
                  <input
                    className={`input ${errors.whatsapp_url ? "error" : ""}`}
                    placeholder="https://chat.whatsapp.com/..."
                    value={form.whatsapp_url}
                    onChange={(e) =>
                      setForm({ ...form, whatsapp_url: e.target.value })
                    }
                    onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                  />
                  {errors.whatsapp_url && (
                    <p className="field-error">{errors.whatsapp_url}</p>
                  )}
                </div>
              </div>
              {/* Page type */}
              <div style={{ marginBottom: 16 }}>
                <label className="label" style={{ marginBottom: 8, display: "block" }}>Tipo de página</label>
                <PageTypeSelector value={form.page_type} onChange={(v) => setForm({ ...form, page_type: v, page_meta: {} })} />
              </div>

              {/* Rifa extra fields */}
              {form.page_type === "rifa" && (
                <div style={{ marginBottom: 16 }}>
                  <label className="label" style={{ marginBottom: 8, display: "block" }}>Informações da rifa</label>
                  <RifaFields meta={form.page_meta} onChange={(m) => setForm({ ...form, page_meta: m })} />
                </div>
              )}

              <button
                className="btn btn-primary"
                onClick={handleAdd}
                disabled={saving}
                style={{ width: "100%" }}
              >
                {saving ? (
                  <span className="spinner" />
                ) : (
                  "\uFF0B Gerar Link de Redirecionamento"
                )}
              </button>
            </div>

            {/* LIST */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  color: "var(--text-dim)",
                  fontWeight: 600,
                }}
              >
                Grupos cadastrados ({groups.length})
              </span>
              <button
                className="btn btn-ghost"
                onClick={fetchGroups}
                style={{ fontSize: 12 }}
              >
                \u21BB Atualizar
              </button>
            </div>

            {loading ? (
              <div style={{ textAlign: "center", padding: 60 }}>
                <span
                  className="spinner"
                  style={{ width: 32, height: 32, borderWidth: 3 }}
                />
              </div>
            ) : groups.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "60px 20px",
                  border: "1px dashed rgba(255,255,255,0.08)",
                  borderRadius: 20,
                }}
              >
                <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.25 }}>
                  \uD83D\uDCED
                </div>
                <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
                  Nenhum grupo cadastrado ainda.
                  <br />
                  Adicione o primeiro acima!
                </p>
              </div>
            ) : (
              groups.map((g) => (
                <GroupCard
                  key={g.id}
                  group={g}
                  onDelete={handleDelete}
                  onToggle={handleToggle}
                  onCopy={handleCopy}
                  onEdit={setEditingGroup}
                  copiedId={copiedId}
                />
              ))
            )}
          </>
        )}

        {activeTab === "sets" && <SetsPanel showToast={showToast} />}

        <div style={{ height: 60 }} />
      </div>

      {editingGroup && (
        <EditModal
          group={editingGroup}
          onSave={handleEditSave}
          onClose={() => setEditingGroup(null)}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <style>{`
        @media (max-width: 600px) {
          .card > div > div:first-child { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
