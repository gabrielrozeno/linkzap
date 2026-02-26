import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/AuthContext'

const generateSlug = (name) =>
  name.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') +
  '-' + Math.random().toString(36).substr(2, 4)

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000)
    return () => clearTimeout(t)
  }, [onClose])
  return <div className={`toast ${type}`}>{message}</div>
}

function GroupCard({ group, onDelete, onToggle, onCopy, copiedId }) {
  const baseUrl = window.location.origin
  const generatedLink = `${baseUrl}/g/${group.slug}`

  return (
    <div className="card" style={{
      padding: '20px 24px', marginBottom: 12,
      transition: 'border-color 0.2s',
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(37,211,102,0.2)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
    >
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 38, height: 38, background: 'var(--green-dim)',
            borderRadius: 10, display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 18, flexShrink: 0
          }}>👥</div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600 }}>
              {group.name}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 3 }}>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                {new Date(group.created_at).toLocaleDateString('pt-BR')}
              </span>
              <span style={{
                fontSize: 10, fontWeight: 700, letterSpacing: '1.5px',
                textTransform: 'uppercase', padding: '2px 8px', borderRadius: 20,
                background: group.active ? 'rgba(37,211,102,0.12)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${group.active ? 'rgba(37,211,102,0.25)' : 'rgba(255,255,255,0.08)'}`,
                color: group.active ? 'var(--green)' : 'var(--text-muted)',
              }}>
                {group.active ? 'Ativo' : 'Inativo'}
              </span>
            </div>
          </div>
        </div>

        {/* Clicks badge + actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ textAlign: 'right', marginRight: 4 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, color: 'var(--green)', lineHeight: 1 }}>
              {group.click_count ?? 0}
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase' }}>
              cliques
            </div>
          </div>
          <button
            className={`btn btn-icon ${group.active ? 'active' : ''}`}
            title={group.active ? 'Pausar' : 'Ativar'}
            onClick={() => onToggle(group.id, !group.active)}
          >
            {group.active ? '⏸' : '▶'}
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
      <div style={{
        background: 'rgba(0,0,0,0.3)', borderRadius: 10, padding: '10px 14px',
        display: 'flex', alignItems: 'center', gap: 10
      }}>
        <span style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '1.5px', textTransform: 'uppercase', whiteSpace: 'nowrap', fontWeight: 500 }}>
          Link gerado
        </span>
        <span style={{
          fontSize: 13, color: 'var(--green)', flex: 1, overflow: 'hidden',
          textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'monospace'
        }}>
          {generatedLink}
        </span>
        <button
          onClick={() => onCopy(group.id, generatedLink)}
          style={{
            background: copiedId === group.id ? 'rgba(37,211,102,0.2)' : 'rgba(37,211,102,0.1)',
            border: '1px solid rgba(37,211,102,0.25)',
            color: copiedId === group.id ? '#4dff8a' : 'var(--green)',
            borderRadius: 7, padding: '5px 12px', fontSize: 11,
            fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s'
          }}
        >
          {copiedId === group.id ? '✓ Copiado' : 'Copiar'}
        </button>
      </div>
    </div>
  )
}

export default function AdminPage() {
  const { user, signOut } = useAuth()
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: '', whatsapp_url: '' })
  const [errors, setErrors] = useState({})
  const [copiedId, setCopiedId] = useState(null)
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'success') => setToast({ message, type })

  const fetchGroups = useCallback(async () => {
    const { data, error } = await supabase
      .from('groups_with_clicks')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error) setGroups(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchGroups() }, [fetchGroups])

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Nome obrigatório'
    if (!form.whatsapp_url.trim()) e.whatsapp_url = 'Link obrigatório'
    else if (!form.whatsapp_url.includes('chat.whatsapp.com'))
      e.whatsapp_url = 'Use um link válido do WhatsApp (chat.whatsapp.com)'
    return e
  }

  const handleAdd = async () => {
    const e = validate()
    if (Object.keys(e).length) return setErrors(e)
    setErrors({})
    setSaving(true)

    const newGroup = {
      name: form.name.trim(),
      whatsapp_url: form.whatsapp_url.trim(),
      slug: generateSlug(form.name.trim()),
      active: true,
    }

    const { error } = await supabase.from('groups').insert(newGroup)
    if (error) {
      showToast('Erro ao cadastrar grupo.', 'error')
    } else {
      setForm({ name: '', whatsapp_url: '' })
      showToast('✅ Grupo cadastrado com sucesso!')
      fetchGroups()
    }
    setSaving(false)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Remover este grupo? Os cliques também serão apagados.')) return
    const { error } = await supabase.from('groups').delete().eq('id', id)
    if (!error) {
      setGroups(g => g.filter(x => x.id !== id))
      showToast('Grupo removido.')
    } else {
      showToast('Erro ao remover.', 'error')
    }
  }

  const handleToggle = async (id, active) => {
    const { error } = await supabase.from('groups').update({ active }).eq('id', id)
    if (!error) {
      setGroups(g => g.map(x => x.id === id ? { ...x, active } : x))
      showToast(active ? '▶ Grupo ativado' : '⏸ Grupo pausado')
    }
  }

  const handleCopy = (id, url) => {
    navigator.clipboard.writeText(url).catch(() => {})
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
    showToast('🔗 Link copiado!')
  }

  const activeCount = groups.filter(g => g.active).length
  const totalClicks = groups.reduce((sum, g) => sum + (g.click_count ?? 0), 0)

  return (
    <div className="page">
      <div className="noise" />
      <div className="blob blob-1" />
      <div className="blob blob-2" />

      <div className="container">
        {/* HEADER */}
        <header style={{
          padding: '44px 0 36px',
          borderBottom: '1px solid var(--border)',
          marginBottom: 44
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 46, height: 46, background: '#25D366', borderRadius: 13,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 24, boxShadow: '0 0 30px rgba(37,211,102,0.3)'
              }}>💬</div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 21, fontWeight: 700, letterSpacing: '-0.3px' }}>
                  LinkZap
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '2px', textTransform: 'uppercase', marginTop: 1 }}>
                  Painel Admin
                </div>
              </div>
            </div>

            {/* Stats + signout */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
              {[
                { val: groups.length, label: 'Grupos' },
                { val: activeCount, label: 'Ativos' },
                { val: totalClicks, label: 'Cliques' },
              ].map(s => (
                <div key={s.label} style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, color: 'var(--green)', lineHeight: 1 }}>
                    {s.val}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '1.5px', textTransform: 'uppercase', marginTop: 3 }}>
                    {s.label}
                  </div>
                </div>
              ))}
              <button className="btn btn-ghost" onClick={signOut} style={{ fontSize: 12 }}>
                Sair →
              </button>
            </div>
          </div>

          {user && (
            <div style={{ marginTop: 10, fontSize: 12, color: 'var(--text-muted)' }}>
              Logado como <span style={{ color: 'var(--text-dim)' }}>{user.email}</span>
            </div>
          )}
        </header>

        {/* FORM */}
        <div className="card card-shine" style={{ padding: 32, marginBottom: 40 }}>
          <div style={{ fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-dim)', fontWeight: 600, marginBottom: 22 }}>
            Cadastrar novo grupo
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <label className="label">Nome do grupo</label>
              <input
                className={`input ${errors.name ? 'error' : ''}`}
                placeholder="Ex: Grupo VIP Promoções"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && handleAdd()}
              />
              {errors.name && <p className="field-error">{errors.name}</p>}
            </div>
            <div>
              <label className="label">Link do WhatsApp</label>
              <input
                className={`input ${errors.whatsapp_url ? 'error' : ''}`}
                placeholder="https://chat.whatsapp.com/..."
                value={form.whatsapp_url}
                onChange={e => setForm({ ...form, whatsapp_url: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && handleAdd()}
              />
              {errors.whatsapp_url && <p className="field-error">{errors.whatsapp_url}</p>}
            </div>
          </div>
          <button
            className="btn btn-primary"
            onClick={handleAdd}
            disabled={saving}
            style={{ width: '100%' }}
          >
            {saving ? <span className="spinner" /> : '＋ Gerar Link de Redirecionamento'}
          </button>
        </div>

        {/* LIST */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <span style={{ fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-dim)', fontWeight: 600 }}>
            Grupos cadastrados ({groups.length})
          </span>
          <button className="btn btn-ghost" onClick={fetchGroups} style={{ fontSize: 12 }}>
            ↻ Atualizar
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <span className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
          </div>
        ) : groups.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '60px 20px',
            border: '1px dashed rgba(255,255,255,0.08)', borderRadius: 20
          }}>
            <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.25 }}>📭</div>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
              Nenhum grupo cadastrado ainda.<br />Adicione o primeiro acima!
            </p>
          </div>
        ) : (
          groups.map(g => (
            <GroupCard
              key={g.id}
              group={g}
              onDelete={handleDelete}
              onToggle={handleToggle}
              onCopy={handleCopy}
              copiedId={copiedId}
            />
          ))
        )}

        <div style={{ height: 60 }} />
      </div>

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
  )
}
