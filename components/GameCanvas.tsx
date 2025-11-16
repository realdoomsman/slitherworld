'use client'

import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import MobileControls from './MobileControls'

interface GameCanvasProps {
  lobbyId: string
}

export default function GameCanvas({ lobbyId }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const socketRef = useRef<Socket | null>(null)
  const [gameState, setGameState] = useState<any>(null)
  const [mySnakeId, setMySnakeId] = useState<string | null>(null)
  const [gameOver, setGameOver] = useState<{ winner: string; payout: number } | null>(null)
  const [isDead, setIsDead] = useState(false)
  const [killFeed, setKillFeed] = useState<Array<{ killer: string; victim: string; time: number }>>([])
  const inputRef = useRef({ angle: 0, boosting: false })
  const cameraRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const token = localStorage.getItem('sessionToken')
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      transports: ['websocket'],
    })

    socketRef.current = socket

    socket.on('connect', () => {
      console.log('Socket connected, authenticating...')
      socket.emit('authenticate', { token })
    })

    socket.on('authenticated', (data: any) => {
      console.log('Authenticated, joining lobby:', lobbyId)
      setMySnakeId(socket.id || null)
      socket.emit('join_lobby', { lobbyId })
    })

    socket.on('game_state', (state: any) => {
      setGameState(state)
      
      // Check if player died
      if (mySnakeId) {
        const mySnake = state.snakes.find((s: any) => s.id === mySnakeId)
        if (mySnake && !mySnake.alive && !isDead) {
          setIsDead(true)
        }
      }
    })

    socket.on('game_end', (data: any) => {
      console.log('Game ended:', data)
      setGameOver({
        winner: data.winnerId,
        payout: data.winnerPayout
      })
    })

    socket.on('player_killed', (data: { killer: string; victim: string }) => {
      setKillFeed(prev => [...prev, { ...data, time: Date.now() }].slice(-5))
    })

    socket.on('error', (error: any) => {
      console.error('Socket error:', error)
    })

    return () => {
      socket.disconnect()
    }
  }, [lobbyId])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !gameState) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Find my snake
    const mySnake = gameState.snakes.find((s: any) => s.id === mySnakeId)
    
    // Update camera to follow player
    if (mySnake && mySnake.segments.length > 0) {
      cameraRef.current.x = mySnake.segments[0].x - canvas.width / 2
      cameraRef.current.y = mySnake.segments[0].y - canvas.height / 2
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
        
        // Color based on size
        if (radius <= 3) {
          ctx.fillStyle = '#fff' // Small = white
        } else if (radius <= 5) {
          ctx.fillStyle = '#4ade80' // Medium = green
        } else {
          ctx.fillStyle = '#fbbf24' // Large = gold
        }
        
        // Add glow for larger pellets
        if (radius > 5) {
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

      // Draw glow
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
  }, [gameState, mySnakeId])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const canvas = canvasRef.current
      if (!canvas || !mySnakeId || !gameState) return

      const mySnake = gameState.snakes.find((s: any) => s.id === mySnakeId)
      if (!mySnake || !mySnake.segments || mySnake.segments.length === 0) return

      const rect = canvas.getBoundingClientRect()
      const mouseX = e.clientX - rect.left + cameraRef.current.x
      const mouseY = e.clientY - rect.top + cameraRef.current.y

      const dx = mouseX - mySnake.segments[0].x
      const dy = mouseY - mySnake.segments[0].y
      const angle = Math.atan2(dy, dx)

      inputRef.current.angle = angle
      socketRef.current?.emit('player_input', inputRef.current)
    }

    let isMouseDown = false
    let isSpaceDown = false

    const updateBoostState = () => {
      const shouldBoost = isMouseDown || isSpaceDown
      if (inputRef.current.boosting !== shouldBoost) {
        inputRef.current.boosting = shouldBoost
        socketRef.current?.emit('player_input', inputRef.current)
      }
    }

    const handleMouseDown = (e: MouseEvent) => {
      if (!gameState) return
      isMouseDown = true
      updateBoostState()
    }

    const handleMouseUp = () => {
      if (!gameState) return
      isMouseDown = false
      updateBoostState()
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && gameState && !isSpaceDown) {
        e.preventDefault()
        isSpaceDown = true
        updateBoostState()
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space' && gameState) {
        e.preventDefault()
        isSpaceDown = false
        updateBoostState()
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [gameState, mySnakeId])

  const handleMobileInput = (angle: number, boosting: boolean) => {
    inputRef.current = { angle, boosting }
    socketRef.current?.emit('player_input', inputRef.current)
  }

  return (
    <div className="relative w-full h-screen bg-black">
      <canvas ref={canvasRef} className="w-full h-full" />
      
      {/* Waiting Screen */}
      {!gameState && (
        <div className="absolute inset-0 bg-black flex items-center justify-center">
          <div className="text-center">
            <div className="mb-8">
              <div className="w-20 h-20 rounded-full bg-green-500/20 border-4 border-green-500 flex items-center justify-center mx-auto mb-6 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-green-500"></div>
              </div>
              <h2 className="text-4xl font-bold text-green-400 mb-4">Waiting for Game to Start</h2>
              <p className="text-xl text-gray-400 mb-2">Lobby: {lobbyId.slice(0, 8)}...</p>
              <p className="text-gray-500">Game will start when minimum players join</p>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      )}
      
      {/* Death Overlay */}
      {isDead && !gameOver && (
        <div className="absolute inset-0 bg-gradient-to-b from-red-900/50 to-black/80 backdrop-blur-sm flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="mb-6 animate-pulse">
              <h2 className="text-8xl font-bold mb-4" style={{ textShadow: '0 0 30px #ef4444' }}>
                💀
              </h2>
              <h3 className="text-6xl font-bold text-red-500 mb-2" style={{ textShadow: '0 0 20px #ef4444' }}>
                ELIMINATED
              </h3>
            </div>
            <p className="text-2xl text-gray-300">Spectating remaining players...</p>
          </div>
        </div>
      )}
      
      {/* Victory Screen */}
      {gameOver && (
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black flex items-center justify-center z-50">
          <div className="text-center max-w-3xl p-8">
            {gameOver.winner === mySnakeId ? (
              <>
                {/* Victory Animation */}
                <div className="mb-12">
                  <div className="text-9xl mb-6 animate-bounce">🏆</div>
                  <h1 className="text-8xl font-bold mb-6 neon-text" style={{ textShadow: '0 0 40px #00ff88, 0 0 80px #00ff88' }}>
                    VICTORY!
                  </h1>
                  <div className="neon-border-green bg-green-500 bg-opacity-10 backdrop-blur-sm p-8 rounded-2xl mb-6">
                    <p className="text-2xl text-gray-300 mb-2">You Won</p>
                    <p className="text-6xl font-bold text-yellow-400 mb-2">
                      +{gameOver.payout.toFixed(3)} SOL
                    </p>
                    <p className="text-sm text-gray-400">Transferred to your wallet</p>
                  </div>
                  <p className="text-3xl text-white font-bold mb-2">🎉 CHAMPION 🎉</p>
                  <p className="text-lg text-gray-400">You outlasted everyone!</p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 justify-center flex-wrap">
                  <button
                    onClick={() => window.location.href = '/'}
                    className="neon-button px-10 py-4 rounded-xl font-bold text-xl smooth-transition"
                  >
                    🎮 Play Again
                  </button>
                  <button
                    onClick={() => window.location.href = '/live'}
                    className="neon-button-outline px-10 py-4 rounded-xl font-bold text-xl smooth-transition"
                  >
                    👁️ Watch Live
                  </button>
                  <button
                    onClick={() => window.location.href = '/profile'}
                    className="px-10 py-4 bg-gray-800 hover:bg-gray-700 rounded-xl font-bold text-xl smooth-transition border-2 border-gray-700"
                  >
                    📊 View Stats
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Defeat Screen */}
                <div className="mb-12">
                  <div className="text-8xl mb-6">😔</div>
                  <h1 className="text-6xl font-bold text-gray-400 mb-6">GAME OVER</h1>
                  <div className="neon-border-purple bg-purple-500 bg-opacity-10 backdrop-blur-sm p-6 rounded-2xl mb-6">
                    <p className="text-xl text-gray-300 mb-2">Winner</p>
                    <p className="text-3xl text-white font-bold mb-2">
                      {gameOver.winner.slice(0, 8)}...
                    </p>
                    <p className="text-2xl text-yellow-400 font-bold">
                      {gameOver.payout.toFixed(3)} SOL
                    </p>
                  </div>
                  <p className="text-lg text-gray-400">Better luck next time!</p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 justify-center flex-wrap">
                  <button
                    onClick={() => window.location.href = '/'}
                    className="neon-button px-10 py-4 rounded-xl font-bold text-xl smooth-transition"
                  >
                    🎮 Play Again
                  </button>
                  <button
                    onClick={() => window.location.href = '/live'}
                    className="neon-button-outline px-10 py-4 rounded-xl font-bold text-xl smooth-transition"
                  >
                    👁️ Watch Live
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      
      {/* HUD - Top Left */}
      <div className="absolute top-2 md:top-4 left-2 md:left-4 space-y-2 md:space-y-3">
        {/* Lobby Info */}
        <div className="neon-border-green bg-black bg-opacity-80 backdrop-blur-sm p-2 md:p-4 rounded-lg md:rounded-xl">
          <p className="text-xs text-gray-400 mb-1">LOBBY</p>
          <p className="text-sm md:text-base text-white font-bold">{lobbyId.slice(0, 8)}</p>
        </div>

        {/* Player Stats */}
        {gameState && mySnakeId && (() => {
          const mySnake = gameState.snakes.find((s: any) => s.id === mySnakeId)
          const minBoostLength = 15
          const canBoost = mySnake && mySnake.length >= minBoostLength
          
          return mySnake ? (
            <div className="neon-border-green bg-black bg-opacity-80 backdrop-blur-sm p-2 md:p-4 rounded-lg md:rounded-xl">
              <p className="text-xs text-gray-400 mb-1 md:mb-2">YOUR STATS</p>
              <div className="space-y-1 md:space-y-2">
                <div className="flex justify-between gap-2 md:gap-4">
                  <span className="text-gray-300 text-xs md:text-sm">Length</span>
                  <span className="text-green-400 font-bold text-base md:text-lg">{Math.floor(mySnake.length)}</span>
                </div>
                
                {/* Boost Status */}
                <div className="pt-2 border-t border-gray-700">
                  {mySnake.boosting ? (
                    <div className="flex items-center gap-2 px-2 py-1 bg-yellow-500 bg-opacity-20 rounded">
                      <span className="text-yellow-400 text-xs font-bold">🚀 BOOSTING</span>
                    </div>
                  ) : canBoost ? (
                    <div className="flex items-center gap-2 px-2 py-1 bg-green-500 bg-opacity-20 rounded">
                      <span className="text-green-400 text-xs font-bold">✓ Boost Ready</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 px-2 py-1 bg-gray-700 bg-opacity-50 rounded">
                      <span className="text-gray-400 text-xs">Need {minBoostLength - Math.floor(mySnake.length)} more</span>
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-1 text-center">Hold Click/Space</p>
                </div>
              </div>
            </div>
          ) : null
        })()}

        {/* Players Alive */}
        {gameState && (
          <div className="neon-border-purple bg-black bg-opacity-80 backdrop-blur-sm p-2 md:p-4 rounded-lg md:rounded-xl">
            <p className="text-xs text-gray-400 mb-1">ALIVE</p>
            <p className="text-purple-400 font-bold text-xl md:text-2xl">
              {gameState.snakes.filter((s: any) => s.alive).length}
            </p>
          </div>
        )}
      </div>

      {/* Leaderboard - Top Right */}
      <div className="absolute top-2 md:top-4 right-2 md:right-4 neon-border-green bg-black bg-opacity-80 backdrop-blur-sm p-2 md:p-4 rounded-lg md:rounded-xl min-w-[180px] md:min-w-[250px]">
        <h3 className="text-green-400 font-bold mb-2 md:mb-3 text-sm md:text-lg flex items-center gap-1 md:gap-2">
          <span className="text-base md:text-xl">🏆</span>
          <span className="hidden md:inline">TOP PLAYERS</span>
          <span className="md:hidden">TOP</span>
        </h3>
        <div className="space-y-1 md:space-y-2">
          {gameState?.snakes
            .filter((s: any) => s.alive)
            .sort((a: any, b: any) => b.length - a.length)
            .slice(0, 5)
            .map((snake: any, idx: number) => (
              <div
                key={snake.id}
                className={`flex justify-between items-center p-1 md:p-2 rounded ${
                  idx === 0 ? 'bg-yellow-500 bg-opacity-20' : 'bg-gray-800 bg-opacity-50'
                }`}
              >
                <div className="flex items-center gap-1 md:gap-2">
                  <span className={`font-bold text-xs md:text-sm ${idx === 0 ? 'text-yellow-400' : 'text-gray-400'}`}>
                    {idx + 1}
                  </span>
                  <span className="text-white text-xs md:text-sm">
                    {snake.walletAddress.slice(0, 4)}...
                  </span>
                </div>
                <span className="text-green-400 font-bold text-xs md:text-base">{Math.floor(snake.length)}</span>
              </div>
            ))}
        </div>
      </div>

      {/* Kill Feed - Top Center */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 space-y-2 min-w-[300px]">
        {killFeed.filter(k => Date.now() - k.time < 5000).map((kill, idx) => (
          <div
            key={idx}
            className="bg-red-900 bg-opacity-90 backdrop-blur-sm px-6 py-3 rounded-xl text-white text-sm font-bold border-2 border-red-500 shadow-lg animate-fade-in"
          >
            <span className="text-red-400">💀</span>
            {' '}
            <span className="text-white">{kill.killer.slice(0, 6)}</span>
            {' '}
            <span className="text-gray-400">eliminated</span>
            {' '}
            <span className="text-white">{kill.victim.slice(0, 6)}</span>
          </div>
        ))}
      </div>

      {/* Mobile Controls */}
      <MobileControls onInput={handleMobileInput} />
    </div>
  )
}
