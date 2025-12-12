"use client"

import { useEffect, useState } from "react"
import { useCustomTheme } from "./theme-provider"

interface Confetti {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  color: string
  size: number
  rotation: number
  rotationSpeed: number
}

export function CompletionCelebration() {
  const [confetti, setConfetti] = useState<Confetti[]>([])
  const { accentColor, availableColors } = useCustomTheme()

  useEffect(() => {
    const colors = [
      availableColors[accentColor]?.light.primary || "oklch(0.5 0.233 264.052)",
      availableColors[accentColor]?.dark.primary || "oklch(0.7 0.191 264.052)",
      "oklch(0.8 0.2 60)", // Gold
      "oklch(0.7 0.2 120)", // Green
      "oklch(0.6 0.2 300)", // Purple
    ]

    const newConfetti: Confetti[] = []

    // Create confetti bursts from multiple positions
    const burstPositions = [
      { x: 20, y: 30 },
      { x: 80, y: 30 },
      { x: 50, y: 20 },
      { x: 30, y: 50 },
      { x: 70, y: 50 },
    ]

    burstPositions.forEach((pos, burstIndex) => {
      for (let i = 0; i < 15; i++) {
        const angle = (Math.PI * 2 * i) / 15 + Math.random() * 0.5
        const velocity = 3 + Math.random() * 4

        newConfetti.push({
          id: burstIndex * 15 + i,
          x: pos.x + (Math.random() - 0.5) * 10,
          y: pos.y + (Math.random() - 0.5) * 10,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity - 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: 4 + Math.random() * 6,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 10,
        })
      }
    })

    setConfetti(newConfetti)

    // Animate confetti
    const animateConfetti = () => {
      setConfetti((prev) =>
        prev
          .map((piece) => ({
            ...piece,
            x: piece.x + piece.vx,
            y: piece.y + piece.vy,
            vy: piece.vy + 0.3, // Gravity
            rotation: piece.rotation + piece.rotationSpeed,
          }))
          .filter((piece) => piece.y < 120 && piece.x > -10 && piece.x < 110),
      )
    }

    const interval = setInterval(animateConfetti, 50)

    const cleanup = setTimeout(() => {
      clearInterval(interval)
      setConfetti([])
    }, 4000)

    return () => {
      clearInterval(interval)
      clearTimeout(cleanup)
    }
  }, [accentColor, availableColors])

  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="absolute transition-all duration-75 ease-out"
          style={{
            left: `${piece.x}%`,
            top: `${piece.y}%`,
            transform: `rotate(${piece.rotation}deg)`,
          }}
        >
          <div
            className="rounded-sm"
            style={{
              width: `${piece.size}px`,
              height: `${piece.size}px`,
              backgroundColor: piece.color,
            }}
          />
        </div>
      ))}
    </div>
  )
}
