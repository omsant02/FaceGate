'use client'

import { useState } from 'react'

const MOVIES = [
  { id: 1, title: 'Stranger Things', genre: 'Sci-Fi', rating: 'TV-14', year: 2024, color: '#1a1a2e', accent: '#e94560' },
  { id: 2, title: 'The Crown', genre: 'Drama', rating: 'TV-MA', year: 2024, color: '#16213e', accent: '#0f3460' },
  { id: 3, title: 'Ozark', genre: 'Thriller', rating: 'TV-MA', year: 2024, color: '#1b262c', accent: '#0a3d62' },
  { id: 4, title: 'Bridgerton', genre: 'Romance', rating: 'TV-MA', year: 2024, color: '#2d1b69', accent: '#11998e' },
  { id: 5, title: 'Wednesday', genre: 'Horror', rating: 'TV-14', year: 2024, color: '#0d0d0d', accent: '#636e72' },
  { id: 6, title: 'The Witcher', genre: 'Fantasy', rating: 'TV-MA', year: 2024, color: '#1a0a00', accent: '#c0392b' },
  { id: 7, title: 'Money Heist', genre: 'Crime', rating: 'TV-MA', year: 2024, color: '#1a0000', accent: '#e55039' },
  { id: 8, title: 'Dark', genre: 'Mystery', rating: 'TV-MA', year: 2024, color: '#0a0a1a', accent: '#2980b9' },
  { id: 9, title: 'Squid Game', genre: 'Thriller', rating: 'TV-MA', year: 2024, color: '#1a1a00', accent: '#f39c12' },
  { id: 10, title: 'Narcos', genre: 'Crime', rating: 'TV-MA', year: 2024, color: '#0d1b00', accent: '#27ae60' },
  { id: 11, title: 'Black Mirror', genre: 'Sci-Fi', rating: 'TV-MA', year: 2024, color: '#111111', accent: '#95a5a6' },
  { id: 12, title: 'Peaky Blinders', genre: 'Drama', rating: 'TV-MA', year: 2024, color: '#1a0d00', accent: '#d35400' },
]

const ROWS = [
  { title: 'Trending Now', movies: MOVIES.slice(0, 6) },
  { title: 'Top Picks For You', movies: MOVIES.slice(3, 9) },
  { title: 'Continue Watching', movies: MOVIES.slice(6, 12) },
]

interface MovieGridProps {
  verified: boolean
  onUnlockClick: () => void
}

function MovieCard({ movie, verified, onUnlockClick }: { movie: typeof MOVIES[0], verified: boolean, onUnlockClick: () => void }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        flexShrink: 0,
        width: '220px',
        height: '130px',
        borderRadius: '4px',
        overflow: 'hidden',
        cursor: verified ? 'pointer' : 'default',
        transition: 'transform 0.2s ease',
        transform: hovered && verified ? 'scale(1.05)' : 'scale(1)',
      }}
    >
      {/* Movie poster background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `linear-gradient(135deg, ${movie.color} 0%, ${movie.accent}88 100%)`,
        filter: verified ? 'none' : 'blur(8px)',
        transition: 'filter 0.5s ease',
        animation: verified ? 'unblur 0.6s ease forwards' : 'none',
      }}/>

      {/* Movie title overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: verified
          ? 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)'
          : 'rgba(0,0,0,0.6)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '12px',
        filter: verified ? 'none' : 'blur(4px)',
        transition: 'filter 0.5s ease',
      }}>
        <div style={{ fontSize: '13px', fontWeight: '700', color: '#fff' }}>{movie.title}</div>
        <div style={{ fontSize: '11px', color: '#B3B3B3', marginTop: '2px' }}>{movie.genre} · {movie.rating}</div>
      </div>

      {/* Lock overlay when not verified */}
      {!verified && (
        <div
          onClick={onUnlockClick}
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.5)',
            cursor: 'pointer',
            gap: '6px',
          }}
        >
          <div style={{ fontSize: '24px' }}>🔒</div>
          <div style={{ fontSize: '11px', color: '#B3B3B3', textAlign: 'center' }}>Verify face to watch</div>
        </div>
      )}

      {/* Play button on hover when verified */}
      {verified && hovered && (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0,0,0,0.3)',
        }}>
          <div style={{
            width: '40px', height: '40px',
            background: 'rgba(255,255,255,0.9)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '16px',
          }}>▶</div>
        </div>
      )}
    </div>
  )
}

export default function MovieGrid({ verified, onUnlockClick }: MovieGridProps) {
  return (
    <div style={{ paddingTop: '20px' }}>
      {ROWS.map(row => (
        <div key={row.title} style={{ marginBottom: '40px' }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '700',
            marginBottom: '16px',
            paddingLeft: '60px',
            color: verified ? '#fff' : '#B3B3B3',
          }}>
            {row.title}
          </h2>
          <div style={{
            display: 'flex',
            gap: '8px',
            paddingLeft: '60px',
            paddingRight: '60px',
            overflowX: 'auto',
            scrollbarWidth: 'none',
          }}>
            {row.movies.map(movie => (
              <MovieCard
                key={movie.id}
                movie={movie}
                verified={verified}
                onUnlockClick={onUnlockClick}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}