import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";

const generateSlug = (name) =>
  name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") +
  "-" +
  Math.random().toString(36).substr(2, 4);

function SetCard({
  set,
  allGroups,
  onDelete,
  onToggle,
  onCopy,
  onAddMember,
  onRemoveMember,
  copiedId,
}) {
  const baseUrl = window.location.origin;
  const generatedLink = `${baseUrl}/s/${set.slug}`;
  const [adding, setAdding] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState("");

  // Groups already in this set
  const memberIds = set.members?.map((m) => m.group_id) || [];

  // Available groups: active, not in ANY set (already filtered by parent), or in this set
  const available = allGroups.filter((g) => !memberIds.includes(g.id));

  const handleAdd = async () => {
    if (!selectedGroupId) return;
    setAdding(true);
    const nextPos = set.members?.length || 0;
    const { error } = await supabase.from("group_set_members").insert({
      set_id: set.id,
      group_id: selectedGroupId,
      position: nextPos,
    });
    if (!error) {
      setSelectedGroupId("");
      onAddMember(set.id, selectedGroupId, nextPos);
    }
    setAdding(false);
  };

  const handleRemove = async (memberId, groupId) => {
    const { error } = await supabase
      .from("group_set_members")
      .delete()
      .eq("id", memberId);
    if (!error) onRemoveMember(set.id, memberId);
  };

  const totalClicks =
    set.members?.reduce((sum, m) => sum + (m.groups?.click_count ?? 0), 0) ?? 0;

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
      {/* Header */}
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
              background: "rgba(99,102,241,0.15)",
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              flexShrink: 0,
            }}
          >
            🔀
          </div>
          <div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 15,
                fontWeight: 600,
              }}
            >
              {set.name}
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
                {set.members?.length || 0} grupo
                {set.members?.length !== 1 ? "s" : ""} · rodízio
              </span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  padding: "2px 8px",
                  borderRadius: 20,
                  background: set.active
                    ? "rgba(37,211,102,0.12)"
                    : "rgba(255,255,255,0.05)",
                  border: `1px solid ${set.active ? "rgba(37,211,102,0.25)" : "rgba(255,255,255,0.08)"}`,
                  color: set.active ? "var(--green)" : "var(--text-muted)",
                }}
              >
                {set.active ? "Ativo" : "Inativo"}
              </span>
            </div>
          </div>
        </div>

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
              {totalClicks}
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
            className={`btn btn-icon ${set.active ? "active" : ""}`}
            onClick={() => onToggle(set.id, !set.active)}
          >
            {set.active ? "⏸" : "▶"}
          </button>
          <button
            className="btn btn-icon danger"
            onClick={() => onDelete(set.id)}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Generated link */}
      <div
        style={{
          background: "rgba(0,0,0,0.3)",
          borderRadius: 10,
          padding: "10px 14px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 14,
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
          Link único
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
          onClick={() => onCopy(set.id, generatedLink)}
          style={{
            background:
              copiedId === set.id
                ? "rgba(37,211,102,0.2)"
                : "rgba(37,211,102,0.1)",
            border: "1px solid rgba(37,211,102,0.25)",
            color: copiedId === set.id ? "#4dff8a" : "var(--green)",
            borderRadius: 7,
            padding: "5px 12px",
            fontSize: 11,
            fontWeight: 600,
            cursor: "pointer",
            whiteSpace: "nowrap",
            transition: "all 0.15s",
          }}
        >
          {copiedId === set.id ? "✓ Copiado" : "Copiar"}
        </button>
      </div>

      {/* Members list */}
      {set.members && set.members.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          {set.members.map((m, i) => (
            <div
              key={m.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 12px",
                borderRadius: 8,
                marginBottom: 6,
                background: "rgba(255,255,255,0.02)",
                border: "1px solid var(--border)",
              }}
            >
              <span
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 6,
                  background: "rgba(37,211,102,0.12)",
                  color: "var(--green)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  fontWeight: 700,
                  fontFamily: "var(--font-display)",
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </span>
              <span style={{ fontSize: 13, flex: 1, color: "var(--text)" }}>
                {m.groups?.name}
              </span>
              <span
                style={{
                  fontSize: 10,
                  color: m.groups?.active
                    ? "var(--green)"
                    : "var(--text-muted)",
                  background: m.groups?.active
                    ? "rgba(37,211,102,0.1)"
                    : "rgba(255,255,255,0.04)",
                  padding: "2px 8px",
                  borderRadius: 20,
                  border: "1px solid",
                  borderColor: m.groups?.active
                    ? "rgba(37,211,102,0.2)"
                    : "rgba(255,255,255,0.06)",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                {m.groups?.active ? "ativo" : "inativo"}
              </span>
              <span
                style={{
                  fontSize: 11,
                  color: "var(--text-muted)",
                  marginRight: 4,
                }}
              >
                {m.groups?.click_count ?? 0} cliques
              </span>
              <button
                className="btn btn-icon danger"
                style={{ width: 26, height: 26, fontSize: 11 }}
                onClick={() => handleRemove(m.id, m.group_id)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add group to set */}
      <div style={{ display: "flex", gap: 8 }}>
        <select
          value={selectedGroupId}
          onChange={(e) => setSelectedGroupId(e.target.value)}
          style={{
            flex: 1,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            padding: "8px 12px",
            color: selectedGroupId ? "var(--text)" : "var(--text-muted)",
            fontFamily: "var(--font-body)",
            fontSize: 13,
            outline: "none",
            cursor: "pointer",
          }}
        >
          <option value="">+ Adicionar grupo ao conjunto...</option>
          {available.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
        <button
          className="btn btn-primary"
          onClick={handleAdd}
          disabled={!selectedGroupId || adding}
          style={{ padding: "8px 18px", fontSize: 13 }}
        >
          {adding ? (
            <span
              className="spinner"
              style={{ width: 14, height: 14, borderWidth: 2 }}
            />
          ) : (
            "Adicionar"
          )}
        </button>
      </div>

      {available.length === 0 && (
        <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 8 }}>
          Todos os grupos disponíveis já estão em conjuntos ou não há grupos
          cadastrados.
        </p>
      )}
    </div>
  );
}

export default function SetsPanel({ showToast }) {
  const [sets, setSets] = useState([]);
  const [freeGroups, setFreeGroups] = useState([]); // groups not in any set
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "" });
  const [errors, setErrors] = useState({});
  const [copiedId, setCopiedId] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);

    // Fetch sets with members + group info + click_count
    const { data: setsData } = await supabase
      .from("group_sets")
      .select(
        `
        id, name, slug, active, current_index, created_at,
        group_set_members (
          id, position, group_id,
          groups ( id, name, whatsapp_url, active )
        )
      `,
      )
      .order("created_at", { ascending: false });

    // Attach click counts for each member's group
    const setsWithClicks = await Promise.all(
      (setsData || []).map(async (set) => {
        const members = await Promise.all(
          (set.group_set_members || [])
            .sort((a, b) => a.position - b.position)
            .map(async (m) => {
              const { count } = await supabase
                .from("clicks")
                .select("*", { count: "exact", head: true })
                .eq("group_id", m.group_id);
              return { ...m, groups: { ...m.groups, click_count: count || 0 } };
            }),
        );
        return { ...set, members };
      }),
    );

    setSets(setsWithClicks);

    // Fetch all groups to find which are free (not in any set)
    const allMemberGroupIds = (setsData || []).flatMap((s) =>
      (s.group_set_members || []).map((m) => m.group_id),
    );

    const { data: groupsData } = await supabase
      .from("groups")
      .select("id, name, active")
      .order("name");

    setFreeGroups(
      (groupsData || []).filter((g) => !allMemberGroupIds.includes(g.id)),
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreate = async () => {
    if (!form.name.trim()) return setErrors({ name: "Nome obrigatório" });
    setErrors({});
    setSaving(true);
    const { error } = await supabase.from("group_sets").insert({
      name: form.name.trim(),
      slug: generateSlug(form.name.trim()),
      active: true,
      current_index: 0,
    });
    if (error) {
      showToast("Erro ao criar conjunto.", "error");
    } else {
      setForm({ name: "" });
      showToast("✅ Conjunto criado!");
      fetchData();
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Remover este conjunto? Os grupos voltarão a ficar disponíveis.",
      )
    )
      return;
    const { error } = await supabase.from("group_sets").delete().eq("id", id);
    if (!error) {
      showToast("Conjunto removido.");
      fetchData();
    }
  };

  const handleToggle = async (id, active) => {
    const { error } = await supabase
      .from("group_sets")
      .update({ active })
      .eq("id", id);
    if (!error) {
      setSets((s) => s.map((x) => (x.id === id ? { ...x, active } : x)));
      showToast(active ? "▶ Conjunto ativado" : "⏸ Conjunto pausado");
    }
  };

  const handleCopy = (id, url) => {
    navigator.clipboard.writeText(url).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    showToast("🔗 Link copiado!");
  };

  const handleAddMember = (setId, groupId, position) => {
    const group = freeGroups.find((g) => g.id === groupId);
    setSets((prev) =>
      prev.map((s) => {
        if (s.id !== setId) return s;
        return {
          ...s,
          members: [
            ...(s.members || []),
            {
              id: Math.random().toString(36),
              position,
              group_id: groupId,
              groups: { ...group, click_count: 0 },
            },
          ],
        };
      }),
    );
    setFreeGroups((prev) => prev.filter((g) => g.id !== groupId));
  };

  const handleRemoveMember = (setId, memberId) => {
    setSets((prev) =>
      prev.map((s) => {
        if (s.id !== setId) return s;
        const removed = s.members.find((m) => m.id === memberId);
        if (removed) setFreeGroups((f) => [...f, removed.groups]);
        return { ...s, members: s.members.filter((m) => m.id !== memberId) };
      }),
    );
    showToast("Grupo removido do conjunto.");
  };

  return (
    <div>
      {/* Create set form */}
      <div
        className="card card-shine"
        style={{ padding: 28, marginBottom: 36 }}
      >
        <div
          style={{
            fontSize: 11,
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: "var(--text-dim)",
            fontWeight: 600,
            marginBottom: 18,
          }}
        >
          Criar novo conjunto (rodízio)
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <input
              className={`input ${errors.name ? "error" : ""}`}
              placeholder="Ex: Campanha Black Friday"
              value={form.name}
              onChange={(e) => setForm({ name: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            />
            {errors.name && <p className="field-error">{errors.name}</p>}
          </div>
          <button
            className="btn btn-primary"
            onClick={handleCreate}
            disabled={saving}
            style={{ whiteSpace: "nowrap" }}
          >
            {saving ? <span className="spinner" /> : "🔀 Criar Conjunto"}
          </button>
        </div>
        <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 12 }}>
          Após criar, adicione grupos ao conjunto. Um único link distribuirá os
          usuários em rodízio entre os grupos.
        </p>
      </div>

      {/* List */}
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
          Conjuntos ({sets.length})
        </span>
        <button
          className="btn btn-ghost"
          onClick={fetchData}
          style={{ fontSize: 12 }}
        >
          ↻ Atualizar
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 60 }}>
          <span
            className="spinner"
            style={{ width: 32, height: 32, borderWidth: 3 }}
          />
        </div>
      ) : sets.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            border: "1px dashed rgba(255,255,255,0.08)",
            borderRadius: 20,
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.25 }}>
            🔀
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
            Nenhum conjunto criado ainda.
            <br />
            Crie um acima e adicione grupos!
          </p>
        </div>
      ) : (
        sets.map((set) => (
          <SetCard
            key={set.id}
            set={set}
            allGroups={freeGroups}
            onDelete={handleDelete}
            onToggle={handleToggle}
            onCopy={handleCopy}
            onAddMember={handleAddMember}
            onRemoveMember={handleRemoveMember}
            copiedId={copiedId}
          />
        ))
      )}
    </div>
  );
}
