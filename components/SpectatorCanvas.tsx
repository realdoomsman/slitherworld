'use client'

import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'

interface SpectatorCanvasProps {
  lobbyId: string
}

export default function SpectatorCanvas({ lobbyId }: SpectatorCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const socketRef = useRef<Socket | null>(null)
  const [gameState, setGameState] = useState<any>(null)
  const [lobby, setLobby] = useState<any>(null)
  const [cameraMode, setCameraMode] = useState<'follow' | 'free'>('follow')
  const [followTarget, setFollowTarget] = useState<string | null>(null)
  const cameraRef = useRef({ x: 0, y: 0 })
  const dragRef = useRef({ isDragging: false, startX: 0, startY: 0 })

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      transports: ['websocket'],
    })

    socketRef.current = socket

    socket.on('connect', () => {
      console.log('Spectator connected')
      socket.emit('join_lobby', { lobbyId, spectate: true })
    })

    socket.on('spectator_joined', (data: any) => {
      console.log('Joined as spectator:', data)
      setLobby(data.lobby)
    })

    socket.on('game_state', (state: any) => {
      setGameState(state)
      
      // Auto-follow longest snake in follow mode
      if (cameraMode === 'follow' && state.snakes.length > 0) {
        const longest = state.snakes.reduce((prev: any, current: any) => 
          (current.length > prev.length && current.alive) ? current : prev
        )
        setFollowTarget(longest.id)
      }
    })

    socket.on('lobby_update', (lobbyData: any) => {
      setLobby(lobbyData)
    })

    return () => {
      socket.disconnect()
    }
  }, [lobbyId, cameraMode])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !gameState) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Update camera
    if (cameraMode === 'follow' && followTarget) {
      const target = gameState.snakes.find((s: any) => s.id === followTarget)
      if (target && target.segments.length > 0) {
        cameraRef.current.x = target.segments[0].x - canvas.width / 2
        cameraRef.current.y = target.segments[0].y - canvas.height / 2
      }
    }

    // Clear canvas
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw grid
    ctx.strokeStyle = '#111'
    ctx.lineWidth = 1
    const gridSize = 50
    for (let x = -cameraRef.current.x % gridSize; x < canvas.width; x += gridSize) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height)
      ctx.stroke()
    }
    for (let y = -cameraRef.current.y % gridSize; y < canvas.height; y += gridSize) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width, y)
      ctx.stroke()
    }

    // Draw pellets
    for (const pellet of gameState.pellets) {
      const x = pellet.position.x - cameraRef.current.x
      const y = pellet.position.y - cameraRef.current.y
      
      if (x > -20 && x < canvas.width + 20 && y > -20 && y < canvas.height + 20) {
        const radius = pellet.radius || 5
        
        if (radius <= 3) {
          ctx.fillStyle = '#fff'
        } else if (radius <= 5) {
          ctx.fillStyle = '#4ade80'
        } else {
          ctx.fillStyle = '#fbbf24'
          ctx.shadowBlur = 10
          ctx.shadowColor = ctx.fillStyle
        }
        
        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
      }
    }

    // Draw snakes
    for (const snake of gameState.snakes) {
      if (!snake.alive || snake.segments.length === 0) continue

      ctx.strokeStyle = snake.color
      ctx.lineWidth = 20
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.shadowBlur = 20
      ctx.shadowColor = snake.color

      ctx.beginPath()
      const firstSeg = snake.segments[0]
      ctx.moveTo(firstSeg.x - cameraRef.current.x, firstSeg.y - cameraRef.current.y)

      for (let i = 1; i < snake.segments.length; i++) {
        const seg = snake.segments[i]
        ctx.lineTo(seg.x - cameraRef.current.x, seg.y - cameraRef.current.y)
      }
      ctx.stroke()

      // Draw head
      ctx.shadowBlur = 0
      ctx.fillStyle = snake.color
      ctx.beginPath()
      ctx.arc(
        firstSeg.x - cameraRef.current.x,
        firstSeg.y - cameraRef.current.y,
        12,
        0,
        Math.PI * 2
      )
      ctx.fill()

      // Draw name
      ctx.fillStyle = '#fff'
      ctx.font = '12px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(
        `${Math.floor(snake.length)}`,
        firstSeg.x - cameraRef.current.x,
        firstSeg.y - cameraRef.current.y - 20
      )
    }
  }, [gameState, cameraMode, followTarget])

  // Free camera controls
  useEffect(() => {
    if (cameraMode !== 'free') return

    const handleMouseDown = (e: MouseEvent) => {
      dragRef.current = {
        isDragging: true,
        startX: e.clientX + cameraRef.current.x,
        startY: e.clientY + cameraRef.current.y
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragRef.current.isDragging) return
      cameraRef.current.x = dragRef.current.startX - e.clientX
      cameraRef.current.y = dragRef.current.startY - e.clientY
    }

    const handleMouseUp = () => {
      dragRef.current.isDragging = false
    }

    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [cameraMode])

  return (
    <div className="relative w-full h-screen bg-black">
      <canvas ref={canvasRef} className="w-full h-full" />
      
      {/* Spectator HUD */}
      <div className="absolute top-4 left-4 bg-black bg-opacity-70 p-4 rounded-lg border-2 border-purple-500">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-purple-400 text-2xl">👁️</span>
          <h3 className="text-white font-bold text-lg">SPECTATING</h3>
        </div>
        {lobby && (
          <>
            <p className="text-gray-300 text-sm">Lobby: {lobby.id.slice(0, 8)}</p>
            <p className="text-green-400 font-bold">Entry: {lobby.entryFee} SOL</p>
            {gameState && (
              <>
                <p className="text-white mt-2">
                  Players: {gameState.snakes.filter((s: any) => s.alive).length} alive
                </p>
                <p className="text-yellow-400 font-bold">
                  Pot: {(lobby.entryFee * lobby.players.length).toFixed(2)} SOL
                </p>
              </>
            )}
          </>
        )}
      </div>

      {/* Camera Controls */}
      <div className="absolute top-4 right-4 bg-black bg-opacity-70 p-4 rounded-lg border-2 border-blue-500">
        <h3 className="text-white font-bold mb-2">Camera Mode</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setCameraMode('follow')}
            className={`px-4 py-2 rounded ${
              cameraMode === 'follow'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-400'
            }`}
          >
            Follow Leader
          </button>
          <button
            onClick={() => setCameraMode('free')}
            className={`px-4 py-2 rounded ${
              cameraMode === 'free'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-400'
            }`}
          >
            Free Camera
          </button>
        </div>
        {cameraMode === 'free' && (
          <p className="text-xs text-gray-400 mt-2">Click and drag to move</p>
        )}
      </div>

      {/* Mini Leaderboard */}
      <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 p-4 rounded-lg border-2 border-green-500 min-w-[200px]">
        <h3 className="text-white font-bold mb-2">Top Players</h3>
        {gameState?.snakes
          .filter((s: any) => s.alive)
          .sort((a: any, b: any) => b.length - a.length)
          .slice(0, 5)
          .map((snake: any, idx: number) => (
            <div key={snake.id} className="text-white text-sm flex justify-between mb-1">
              <span>
                {idx + 1}. {snake.walletAddress.slice(0, 6)}
              </span>
              <span className="text-green-400">{Math.floor(snake.length)}</span>
            </div>
          ))}
      </div>

      {/* Back Button */}
      <div className="absolute bottom-4 left-4">
        <a
          href="/"
          className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-bold text-white"
        >
          ← Exit Spectator
        </a>
      </div>
    </div>
  )
}
