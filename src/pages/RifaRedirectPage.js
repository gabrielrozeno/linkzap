import { useEffect, useState } from 'react'

function fakeSpotsLeft(seed) {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0
  return 23 + (Math.abs(h) % 74)
}

export default function RifaRedirectPage({ group, onJoinClick }) {
  const [pulse, setPulse] = useState(false)
  const [tick, setTick] = useState(0)

  const meta = group.page_meta || {}
  const prize = meta.prize || 'Prêmio Especial'
  const ticketPrice = meta.ticket_price || null
  const spotsLeft = fakeSpotsLeft(group.name)
  const viewersNow = 12 + (tick % 5)

  useEffect(() => {
    const t = setInterval(() => {
      setPulse(true)
      setTimeout(() => setPulse(false), 600)
    }, 4000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 7000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="page" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', paddingTop: 0, position: 'relative' }}>
      <div className="noise" />

      {/* Background */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 60% 0%, rgba(255,180,0,0.08) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(255,60,0,0.07) 0%, transparent 55%), #0a0a0a'
      }}>
        {[...Array(18)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: 6 + (i % 4) * 3, height: 6 + (i % 4) * 3,
            borderRadius: i % 3 === 0 ? '50%' : 2,
            background: ['#ffd700', '#ff6b35', '#25D366', '#ff4444', '#fff'][i % 5],
            opacity: 0.12 + (i % 4) * 0.04,
            left: `${(i * 17 + 5) % 95}%`,
            top: `${(i * 23 + 8) % 90}%`,
            animation: `rifaFloat${i % 3} ${6 + (i % 4)}s ease-in-out infinite`,
            animationDelay: `${i * 0.4}s`
          }} />
        ))}
      </div>

      {/* TOP BANNER */}
      <div style={{
        width: '100%', position: 'sticky', top: 0, zIndex: 10,
        background: 'linear-gradient(90deg, #c8000a, #ff2d20, #c8000a)',
        backgroundSize: '200% 100%', animation: 'rifaShimmer 3s linear infinite',
        padding: '11px 24px', textAlign: 'center',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10
      }}>
        <span style={{ fontSize: 15 }}>⚠️</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>
          ÚLTIMOS <strong style={{ fontSize: 15, textDecoration: 'underline' }}>{spotsLeft} BILHETES</strong> DISPONÍVEIS — CORRE!
        </span>
        <span style={{ fontSize: 15 }}>⚠️</span>
      </div>

      <div style={{ maxWidth: 480, width: '100%', margin: '0 auto', padding: '40px 24px 48px', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 1 }}>

        {/* TROPHY */}
        <div style={{
          fontSize: 72, marginBottom: 8,
          animation: 'rifaTrophy 2s ease-in-out infinite',
          filter: 'drop-shadow(0 0 20px rgba(255,215,0,0.5))'
        }}>🏆</div>

        {/* LIVE VIEWERS */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20,
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 20, padding: '5px 14px'
        }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#ff4444', display: 'inline-block', animation: 'rifaBlink 1s infinite' }} />
          <span style={{ fontSize: 12, color: 'rgba(240,237,232,0.55)' }}>
            <strong style={{ color: 'rgba(240,237,232,0.85)' }}>{viewersNow} pessoas</strong> vendo agora
          </span>
        </div>

        {/* PRIZE CARD */}
        <div style={{
          width: '100%', borderRadius: 20, marginBottom: 24, overflow: 'hidden',
          border: '1.5px solid rgba(255,215,0,0.3)',
          background: 'linear-gradient(135deg, rgba(255,215,0,0.07), rgba(255,140,0,0.05))',
          boxShadow: '0 0 40px rgba(255,215,0,0.1)',
        }}>
          <div style={{
            background: 'linear-gradient(90deg, rgba(255,215,0,0.15), rgba(255,140,0,0.1))',
            padding: '10px 20px', borderBottom: '1px solid rgba(255,215,0,0.15)',
            display: 'flex', alignItems: 'center', gap: 8
          }}>
            <span style={{ fontSize: 14 }}>🎁</span>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,215,0,0.8)' }}>
              Prêmio em Disputa
            </span>
          </div>
          <div style={{ padding: '20px 24px', textAlign: 'center' }}>
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800,
              color: '#ffd700', letterSpacing: '-0.5px', lineHeight: 1.2,
              textShadow: '0 0 30px rgba(255,215,0,0.4)', marginBottom: 6
            }}>{prize}</div>
            <div style={{ fontSize: 13, color: 'rgba(240,237,232,0.4)' }}>{group.name}</div>
          </div>
        </div>

        {/* HEADLINE */}
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800,
          letterSpacing: '-0.5px', marginBottom: 10, lineHeight: 1.25,
          color: '#f0ede8', textAlign: 'center'
        }}>
          Participe e concorra a<br />
          <span style={{ color: '#ffd700' }}>esse prêmio incrível!</span>
        </h1>

        <p style={{ color: 'rgba(240,237,232,0.55)', fontSize: 14, marginBottom: 24, lineHeight: 1.7, textAlign: 'center', maxWidth: 360 }}>
          Entre no grupo do WhatsApp, adquira seu bilhete e garanta sua chance de ganhar. Sorteio transparente e ao vivo!
        </p>

        {/* PILLS */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 28, flexWrap: 'wrap', justifyContent: 'center' }}>
          {ticketPrice && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.25)', borderRadius: 30, padding: '8px 16px' }}>
              <span style={{ fontSize: 16 }}>💵</span>
              <div>
                <div style={{ fontSize: 10, color: 'rgba(240,237,232,0.35)', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 600 }}>Bilhete por</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#25D366', fontFamily: 'var(--font-display)' }}>{ticketPrice}</div>
              </div>
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'rgba(255,100,0,0.1)', border: '1px solid rgba(255,100,0,0.25)', borderRadius: 30, padding: '8px 16px' }}>
            <span style={{ fontSize: 16 }}>🎟️</span>
            <div>
              <div style={{ fontSize: 10, color: 'rgba(240,237,232,0.35)', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 600 }}>Restam</div>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#ff9944', fontFamily: 'var(--font-display)' }}>{spotsLeft} bilhetes</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.2)', borderRadius: 30, padding: '8px 16px' }}>
            <span style={{ fontSize: 16 }}>✅</span>
            <div>
              <div style={{ fontSize: 10, color: 'rgba(240,237,232,0.35)', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 600 }}>Sorteio</div>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#ffd700', fontFamily: 'var(--font-display)' }}>Ao vivo</div>
            </div>
          </div>
        </div>

        {/* HOW IT WORKS */}
        <div style={{ width: '100%', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '18px 20px', marginBottom: 28, textAlign: 'left' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(240,237,232,0.3)', marginBottom: 14 }}>Como funciona</div>
          {[
            { n: '1', text: 'Entre no grupo do WhatsApp abaixo' },
            { n: '2', text: 'Escolha e pague pelo seu bilhete' },
            { n: '3', text: 'Aguarde o sorteio ao vivo no grupo' },
            { n: '4', text: 'Ganhe e receba o prêmio!' },
          ].map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: i < 3 ? 12 : 0 }}>
              <span style={{ width: 26, height: 26, borderRadius: 8, flexShrink: 0, background: 'rgba(255,215,0,0.12)', border: '1px solid rgba(255,215,0,0.2)', color: '#ffd700', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, fontFamily: 'var(--font-display)' }}>{s.n}</span>
              <span style={{ fontSize: 13, color: 'rgba(240,237,232,0.7)' }}>{s.text}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <a
          href={group.whatsapp_url}
          target="_blank"
          rel="noreferrer"
          onClick={onJoinClick}
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
          QUERO MEU BILHETE AGORA
        </a>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 14 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff4444', display: 'inline-block', animation: 'rifaBlink 1s infinite' }} />
          <span style={{ fontSize: 12, color: 'rgba(240,237,232,0.4)' }}>
            Apenas <strong style={{ color: '#ff9966' }}>{spotsLeft} bilhetes restantes</strong> — não perca sua chance!
          </span>
        </div>

        <p style={{ fontSize: 11, color: 'rgba(240,237,232,0.18)', marginTop: 32, lineHeight: 1.6, textAlign: 'center' }}>
          🔒 Rifa organizada de forma transparente. Sorteio realizado ao vivo no grupo.
        </p>
      </div>

      <style>{`
        @keyframes rifaTrophy {
          0%,100% { transform: translateY(0) rotate(-3deg); }
          50% { transform: translateY(-10px) rotate(3deg); }
        }
        @keyframes rifaBlink { 0%,100% { opacity: 1; } 50% { opacity: 0.2; } }
        @keyframes rifaShimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes rifaFloat0 {
          0%,100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes rifaFloat1 {
          0%,100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(-120deg); }
        }
        @keyframes rifaFloat2 {
          0%,100% { transform: translateY(0px); }
          33% { transform: translateY(-15px); }
          66% { transform: translateY(-25px); }
        }
      `}</style>
    </div>
  )
}
