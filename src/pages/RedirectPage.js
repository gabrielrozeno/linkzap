import { useEffect, useState } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const PIXEL_ID = '1786202755146767'

// Injeta o script base do Pixel uma única vez
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

export default function RedirectPage() {
  const { slug } = useParams()
  const location = useLocation()
  const [group, setGroup] = useState(null)
  const [status, setStatus] = useState('loading') // loading | found | not_found | inactive

  // Extrai fbclid da URL (?fbclid=XXXX)
  const fbclid = new URLSearchParams(location.search).get('fbclid')

  useEffect(() => {
    // Inicializa o Pixel e dispara PageView assim que a página carrega
    initPixel()
    window.fbq('track', 'PageView')

    async function loadAndRedirect() {
      const { data, error } = await supabase
        .from('groups')
        .select('id, name, whatsapp_url, active')
        .eq('slug', slug)
        .single()

      if (error || !data) return setStatus('not_found')
      if (!data.active) return setStatus('inactive')

      setGroup(data)
      setStatus('found')

      // Registra clique no banco
      await supabase.from('clicks').insert({ group_id: data.id })
    }

    loadAndRedirect()
  }, [slug]) // eslint-disable-line

  // Dispara eventos Lead + Subscribe com fbclid ao clicar no botão
  const handleJoinClick = () => {
    if (!window.fbq) return
    const eventData = { content_name: group?.name }
    const eventOptions = fbclid ? { eventID: fbclid } : {}
    window.fbq('track', 'Lead', eventData, eventOptions)
    window.fbq('track', 'Subscribe', eventData, eventOptions)
  }

  const bgStyle = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '40px 24px',
    position: 'relative'
  }

  if (status === 'loading') return (
    <div className="page" style={bgStyle}>
      <div className="noise" />
      <div className="blob blob-1" />
      <div className="blob blob-2" />
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
      <p style={{ color: 'var(--text-dim)', fontSize: 14 }}>
        Este link é inválido ou foi removido.
      </p>
    </div>
  )

  if (status === 'inactive') return (
    <div className="page" style={bgStyle}>
      <div className="noise" />
      <div style={{ fontSize: 56, marginBottom: 16, opacity: 0.3 }}>⏸</div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, marginBottom: 12 }}>
        Grupo temporariamente indisponível
      </h1>
      <p style={{ color: 'var(--text-dim)', fontSize: 14 }}>
        Este grupo está pausado no momento. Tente novamente mais tarde.
      </p>
    </div>
  )

  return (
    <div className="page" style={bgStyle}>
      <div className="noise" />
      <div className="blob blob-1" />
      <div className="blob blob-2" />

      <div style={{
        width: 80, height: 80, background: 'rgba(37,211,102,0.15)',
        borderRadius: 24, display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: 40, margin: '0 auto 28px',
        boxShadow: '0 0 50px rgba(37,211,102,0.2)',
        animation: 'pulse 2s infinite'
      }}>💬</div>

      <h1 style={{
        fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 800,
        letterSpacing: '-0.5px', marginBottom: 14
      }}>
        Você foi convidado!
      </h1>

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
