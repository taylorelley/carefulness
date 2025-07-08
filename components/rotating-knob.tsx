"use client"

import type React from "react"
import { useState, useRef, useCallback, useEffect } from "react"

interface RotatingKnobProps {
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  color?: string
  size?: number
}

export function RotatingKnob({ value, onChange, min, max, color = "#6366f1", size = 100 }: RotatingKnobProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const knobRef = useRef<HTMLDivElement>(null)

  const normalizedValue = (value - min) / (max - min)
  const rotation = normalizedValue * 270 - 135 // -135 to 135 degrees

  const updateValueFromPosition = useCallback(
    (clientX: number, clientY: number) => {
      if (!knobRef.current) return

      const rect = knobRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const deltaX = clientX - centerX
      const deltaY = clientY - centerY

      let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI)
      angle = (angle + 90 + 360) % 360

      let normalizedAngle
      if (angle <= 135) {
        normalizedAngle = (angle + 135) / 270
      } else if (angle >= 225) {
        normalizedAngle = (angle - 225) / 270
      } else {
        return // Dead zone
      }

      normalizedAngle = Math.max(0, Math.min(1, normalizedAngle))
      const newValue = Math.round(min + normalizedAngle * (max - min))

      if (newValue !== value) {
        onChange(newValue)
      }
    },
    [min, max, onChange, value],
  )

  // Mouse events
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      setIsDragging(true)
      updateValueFromPosition(e.clientX, e.clientY)
      e.preventDefault()
    },
    [updateValueFromPosition],
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return
      updateValueFromPosition(e.clientX, e.clientY)
    },
    [isDragging, updateValueFromPosition],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Touch events
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      setIsDragging(true)
      const touch = e.touches[0]
      updateValueFromPosition(touch.clientX, touch.clientY)
      e.preventDefault()
    },
    [updateValueFromPosition],
  )

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging) return
      const touch = e.touches[0]
      updateValueFromPosition(touch.clientX, touch.clientY)
      e.preventDefault()
    },
    [isDragging, updateValueFromPosition],
  )

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      document.addEventListener("touchmove", handleTouchMove, { passive: false })
      document.addEventListener("touchend", handleTouchEnd)

      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
        document.removeEventListener("touchmove", handleTouchMove)
        document.removeEventListener("touchend", handleTouchEnd)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd])

  return (
    <div
      ref={knobRef}
      className={`relative cursor-pointer select-none transition-transform duration-200 ${
        isDragging ? "scale-105" : isHovered ? "scale-102" : "scale-100"
      }`}
      style={{ width: size, height: size }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Outer Ring */}
      <div
        className="absolute inset-0 rounded-full shadow-lg"
        style={{
          background: `conic-gradient(from -135deg, ${color}40 0deg, ${color}80 ${normalizedValue * 270}deg, #e2e8f0 ${normalizedValue * 270}deg, #e2e8f0 270deg, transparent 270deg)`,
          boxShadow: isDragging
            ? `0 8px 25px -5px ${color}40, 0 4px 10px -3px ${color}20`
            : `0 4px 15px -3px ${color}20, 0 2px 6px -2px ${color}10`,
        }}
      />

      {/* Inner Knob */}
      <div
        className="absolute inset-2 rounded-full bg-gradient-to-br from-white via-gray-50 to-gray-100 shadow-inner border border-white transition-all duration-200"
        style={{
          transform: `rotate(${rotation}deg)`,
          transformOrigin: "center",
          boxShadow: isDragging
            ? "inset 0 2px 8px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.1)"
            : "inset 0 2px 4px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.05)",
        }}
      >
        {/* Indicator */}
        <div
          className="absolute w-1 rounded-full top-2 left-1/2 transform -translate-x-1/2 transition-all duration-200"
          style={{
            backgroundColor: color,
            height: size * 0.25,
            boxShadow: `0 2px 4px ${color}40`,
          }}
        />

        {/* Center Dot */}
        <div
          className="absolute w-3 h-3 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-2 border-white shadow-sm"
          style={{ backgroundColor: color }}
        />
      </div>

      {/* Scale Marks */}
      {Array.from({ length: 10 }, (_, i) => {
        const markAngle = (i / 9) * 270 - 135
        const isActive = i <= value - min
        return (
          <div
            key={i}
            className="absolute origin-bottom transition-all duration-200"
            style={{
              width: "2px",
              height: size * 0.08,
              backgroundColor: isActive ? color : "#cbd5e1",
              transform: `rotate(${markAngle}deg) translateY(-${size / 2 - 4}px)`,
              transformOrigin: `center ${size / 2}px`,
              left: "50%",
              top: "50%",
              borderRadius: "1px",
              opacity: isActive ? 1 : 0.5,
            }}
          />
        )
      })}

      {/* Touch feedback circle */}
      {isDragging && (
        <div
          className="absolute inset-0 rounded-full border-2 animate-pulse"
          style={{
            borderColor: `${color}60`,
            animation: "pulse 1s infinite",
          }}
        />
      )}
    </div>
  )
}
