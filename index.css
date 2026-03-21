import { useEffect, useState } from 'react'
import { useParams, useLocation } from 'react-router-dom'
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

function fakeMemberCount(seed) {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0
  return 312 + (Math.abs(h) % 388)
}

export default function SetRedirectPage() {
  const { slug } = useParams()
  const location = useLocation()
  const [group, setGroup] = useState(null)
  const [status, setStatus] = useState('loading')
  const [spotsLeft] = useState(() => Math.floor(Math.random() * 8) + 3)
  const [pulse, setPulse] = useState(false)

  const fbclid = new URLSearchParams(location.search).get('fbclid')

  useEffect(() => {
    initPixel()
    window.fbq('track', 'PageView')

    async function resolveNextGroup() {
      const { data: set, error: setError } = await supabase
        .from('group_sets')
        .select('id, name, active, current_index')
        .eq('slug', slug)
        .single()

      if (setError || !set) return setStatus('not_found')
      if (!set.active) return setStatus('inactive')

      const { data: members, error: membersError } = await supabase
        .from('group_set_members')
        .select('position, group_id, groups(id, name, whatsapp_url, active)')
        .eq('set_id', set.id)
        .order('position', { ascending: true })

      if (membersError || !members || members.length === 0) return setStatus('not_found')

      const activeMembers = members.filter(m => m.groups?.active)
      if (activeMembers.length === 0) return setStatus('inactive')

      const idx = set.current_index % activeMembers.length
      const chosen = activeMembers[idx].groups

      await supabase.from('group_sets').update({ current_index: set.current_index + 1 }).eq('id', set.id)
      await supabase.from('clicks').insert({ group_id: chosen.id })

      setGroup(chosen)
      setStatus('found')
    }

    resolveNextGroup()
  }, [slug]) // eslint-disable-line

  useEffect(() => {
    if (status !== 'found') return
    const t = setInterval(() => {
      setPulse(true)
      setTimeout(() => setPulse(false), 600)
    }, 4000)
    return () => clearInterval(t)
  }, [status])

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
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Link não encontrado</h1>
      <p style={{ color: 'var(--text-dim)', fontSize: 14 }}>Este link é inválido ou foi removido.</p>
    </div>
  )

  if (status === 'inactive') return (
    <div className="page" style={bgStyle}>
      <div className="noise" />
      <div style={{ fontSize: 56, marginBottom: 16, opacity: 0.3 }}>⏸</div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Grupos temporariamente indisponíveis</h1>
      <p style={{ color: 'var(--text-dim)', fontSize: 14 }}>Tente novamente mais tarde.</p>
    </div>
  )

  const memberCount = fakeMemberCount(group.name)

  return (
    <div className="page" style={{ ...bgStyle, justifyContent: 'flex-start', paddingTop: 0 }}>
      <div className="noise" /><div className="blob blob-1" /><div className="blob blob-2" />

      {/* TOP URGENCY BANNER */}
      <div style={{
        width: '100%', background: 'linear-gradient(90deg, #ff6b00, #ff3d00)',
        padding: '10px 24px', textAlign: 'center', position: 'sticky', top: 0, zIndex: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10
      }}>
        <span style={{ fontSize: 14 }}>🔥</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#fff', letterSpacing: '0.3px' }}>
          Atenção: apenas <strong style={{ textDecoration: 'underline' }}>{spotsLeft} vagas</strong> restantes neste grupo!
        </span>
        <span style={{ fontSize: 14 }}>🔥</span>
      </div>

      <div style={{ maxWidth: 480, width: '100%', margin: '0 auto', padding: '48px 24px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

        <div style={{
          width: 88, height: 88, background: 'rgba(37,211,102,0.12)',
          border: '2px solid rgba(37,211,102,0.25)',
          borderRadius: 28, display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: 44, marginBottom: 28,
          boxShadow: '0 0 60px rgba(37,211,102,0.2)',
          animation: 'iconPulse 2.5s ease-in-out infinite'
        }}>💬</div>

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.3)',
          color: '#ffd700', borderRadius: 20, padding: '5px 14px',
          fontSize: 11, fontWeight: 700, letterSpacing: '2px',
          textTransform: 'uppercase', marginBottom: 20
        }}>
          ⭐ Grupo Exclusivo
        </div>

        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800,
          letterSpacing: '-0.5px', marginBottom: 12, lineHeight: 1.2, color: '#f0ede8'
        }}>
          Você garantiu seu<br />
          <span style={{ color: '#25D366' }}>acesso especial!</span>
        </h1>

        <p style={{ color: 'rgba(240,237,232,0.6)', fontSize: 15, marginBottom: 28, lineHeight: 1.7, maxWidth: 380 }}>
          Entre agora no grupo <strong style={{ color: '#f0ede8' }}>{group.name}</strong> e receba promoções exclusivas, descontos imperdíveis e conteúdo VIP direto no seu WhatsApp.
        </p>

        <div style={{
          width: '100%', background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16,
          padding: '20px 24px', marginBottom: 28, textAlign: 'left'
        }}>
          {[
            { icon: '🎯', text: 'Ofertas exclusivas antes de todo mundo' },
            { icon: '💰', text: 'Descontos que não aparecem em nenhum outro lugar' },
            { icon: '📣', text: 'Conteúdo VIP direto no seu WhatsApp' },
            { icon: '🔒', text: 'Grupo fechado — acesso apenas por convite' },
          ].map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: i < 3 ? 14 : 0 }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>{b.icon}</span>
              <span style={{ fontSize: 14, color: 'rgba(240,237,232,0.75)', lineHeight: 1.4 }}>{b.text}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
          <div style={{ display: 'flex' }}>
            {['😊','🙂','😄','🤩','😎'].map((e, i) => (
              <div key={i} style={{
                width: 30, height: 30, borderRadius: '50%',
                background: `hsl(${120 + i * 25}, 50%, 35%)`,
                border: '2px solid #0a0a0a', marginLeft: i > 0 ? -8 : 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14
              }}>{e}</div>
            ))}
          </div>
          <span style={{ fontSize: 13, color: 'rgba(240,237,232,0.5)' }}>
            <strong style={{ color: 'rgba(240,237,232,0.8)' }}>{memberCount.toLocaleString('pt-BR')} pessoas</strong> já estão no grupo
          </span>
        </div>

        <a
          href={group.whatsapp_url}
          target="_blank"
          rel="noreferrer"
          onClick={handleJoinClick}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
            background: 'linear-gradient(135deg, #25D366, #1aad52)',
            color: '#fff', borderRadius: 16, padding: '18px 40px',
            fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 800,
            textDecoration: 'none', letterSpacing: '0.3px', width: '100%',
            boxShadow: '0 8px 30px rgba(37,211,102,0.4)', transition: 'all 0.2s',
            transform: pulse ? 'scale(1.03)' : 'scale(1)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)'
            e.currentTarget.style.boxShadow = '0 16px 45px rgba(37,211,102,0.5)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(37,211,102,0.4)'
          }}
        >
          <span style={{ fontSize: 22 }}>📲</span>
          QUERO ENTRAR AGORA
        </a>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 14 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff4444', display: 'inline-block', animation: 'blink 1s infinite' }} />
          <span style={{ fontSize: 12, color: 'rgba(240,237,232,0.45)' }}>
            Restam apenas <strong style={{ color: '#ff9966' }}>{spotsLeft} vagas</strong> — o grupo pode fechar a qualquer momento
          </span>
        </div>

        <p style={{ fontSize: 11, color: 'rgba(240,237,232,0.2)', marginTop: 32, lineHeight: 1.6 }}>
          🔒 Seus dados estão seguros. Ao entrar, você concorda em receber<br />conteúdos e ofertas exclusivas via WhatsApp.
        </p>
      </div>

      <style>{`
        @keyframes iconPulse {
          0%,100% { box-shadow: 0 0 40px rgba(37,211,102,0.2); }
          50% { box-shadow: 0 0 80px rgba(37,211,102,0.45); }
        }
        @keyframes blink {
          0%,100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  )
}
