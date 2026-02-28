import { useEffect, useState } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const PIXEL_ID = '1786202755146767'

function initPixel() {
  if (window.fbq) return
  /* eslint-disable */
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
  n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
  (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
  /* eslint-enable */
  window.fbq('init', PIXEL_ID)
}

export default function SetRedirectPage() {
  const { slug } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [group, setGroup] = useState(null)
  const [status, setStatus] = useState('loading')

  const fbclid = new URLSearchParams(location.search).get('fbclid')

  useEffect(() => {
    initPixel()
    window.fbq('track', 'PageView')

    async function resolveNextGroup() {
      // 1. Busca o conjunto pelo slug
      const { data: set, error: setError } = await supabase
        .from('group_sets')
        .select('id, name, active, current_index')
        .eq('slug', slug)
        .single()

      if (setError || !set) return setStatus('not_found')
      if (!set.active) return setStatus('inactive')

      // 2. Busca membros ativos ordenados por position
      const { data: members, error: membersError } = await supabase
        .from('group_set_members')
        .select('position, group_id, groups(id, name, whatsapp_url, active)')
        .eq('set_id', set.id)
        .order('position', { ascending: true })

      if (membersError || !members || members.length === 0)
        return setStatus('not_found')

      // Filtra só grupos ativos
      const activeMembers = members.filter(m => m.groups?.active)
      if (activeMembers.length === 0) return setStatus('inactive')

      // 3. Determina qual grupo é o próximo (round-robin)
      const idx = set.current_index % activeMembers.length
      const chosen = activeMembers[idx].groups

      // 4. Incrementa o contador atomicamente no banco
      await supabase
        .from('group_sets')
        .update({ current_index: set.current_index + 1 })
        .eq('id', set.id)

      // 5. Registra clique no grupo escolhido
      await supabase.from('clicks').insert({ group_id: chosen.id })

      setGroup(chosen)
      setStatus('found')
    }

    resolveNextGroup()
  }, [slug]) // eslint-disable-line

  const handleJoinClick = () => {
    if (!window.fbq) return
    const eventData = { content_name: group?.name }
    const eventOptions = fbclid ? { eventID: fbclid } : {}
    window.fbq('track', 'Lead', eventData, eventOptions)
    window.fbq('track', 'Subscribe', eventData, eventOptions)
  }

  const bgStyle = {
    minHeight: '100vh', display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    textAlign: 'center', padding: '40px 24px', position: 'relative'
  }

  if (status === 'loading') return (
    <div className="page" style={bgStyle}>
      <div className="noise" /><div className="blob blob-1" /><div className="blob blob-2" />
      <span className="spinner" style={{ width: 36, height: 36, borderWidth: 3 }} />
    </div>
  )

  if (status === 'not_found') return (
    <div className="page" style={bgStyle}>
      <div className="noise" />
      <div style={{ fontSize: 56, marginBottom: 16, opacity: 0.3 }}>🔍</div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, marginBottom: 12 }}>
        Link não encontrado
      </h1>
      <p style={{ color: 'var(--text-dim)', fontSize: 14 }}>Este link é inválido ou foi removido.</p>
    </div>
  )

  if (status === 'inactive') return (
    <div className="page" style={bgStyle}>
      <div className="noise" />
      <div style={{ fontSize: 56, marginBottom: 16, opacity: 0.3 }}>⏸</div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, marginBottom: 12 }}>
        Grupos temporariamente indisponíveis
      </h1>
      <p style={{ color: 'var(--text-dim)', fontSize: 14 }}>Tente novamente mais tarde.</p>
    </div>
  )

  return (
    <div className="page" style={bgStyle}>
      <div className="noise" /><div className="blob blob-1" /><div className="blob blob-2" />

      <div style={{
        width: 80, height: 80, background: 'rgba(37,211,102,0.15)',
        borderRadius: 24, display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: 40, margin: '0 auto 28px',
        boxShadow: '0 0 50px rgba(37,211,102,0.2)', animation: 'pulse 2s infinite'
      }}>💬</div>

      <h1 style={{
        fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 800,
        letterSpacing: '-0.5px', marginBottom: 14
      }}>Você foi convidado!</h1>

      <p style={{ color: 'var(--text-dim)', fontSize: 15, marginBottom: 36, lineHeight: 1.7 }}>
        Clique no botão abaixo para entrar no grupo<br />
        <strong style={{ color: 'var(--text)' }}>{group.name}</strong> no WhatsApp.
      </p>

      <a
        href={group.whatsapp_url}
        target="_blank"
        rel="noreferrer"
        onClick={handleJoinClick}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 12,
          background: '#25D366', color: '#0a0a0a', borderRadius: 14,
          padding: '16px 36px', fontFamily: 'var(--font-display)',
          fontSize: 16, fontWeight: 700, textDecoration: 'none',
          letterSpacing: '0.3px', transition: 'all 0.2s'
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = '#20c75a'
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.boxShadow = '0 14px 40px rgba(37,211,102,0.4)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = '#25D366'
          e.currentTarget.style.transform = ''
          e.currentTarget.style.boxShadow = ''
        }}
      >
        <span>📱</span> Entrar no Grupo
      </a>

      <style>{`
        @keyframes pulse {
          0%,100% { box-shadow: 0 0 30px rgba(37,211,102,0.2); }
          50% { box-shadow: 0 0 60px rgba(37,211,102,0.45); }
        }
      `}</style>
    </div>
  )
}
