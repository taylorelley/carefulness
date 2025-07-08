"use client"

import { useState, useCallback } from "react"
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { RotatingKnob } from "@/components/rotating-knob"

export default function CarefulnessKnob() {
  const [carefulness, setCarefulness] = useState(5)
  const [time, setTime] = useState(5)
  const [cost, setCost] = useState(5)

  const TOTAL_SUM = 15 // Constant sum for all three values

  // Helper function to redistribute values while maintaining constant sum
  const redistributeValues = useCallback(
    (changedParam: "carefulness" | "time" | "cost", newValue: number) => {
      const currentSum = carefulness + time + cost
      const difference =
        newValue - (changedParam === "carefulness" ? carefulness : changedParam === "time" ? time : cost)

      if (changedParam === "carefulness") {
        const remaining = TOTAL_SUM - newValue
        const currentOthers = time + cost
        if (currentOthers > 0) {
          const ratio = remaining / currentOthers
          const newTime = Math.max(1, Math.min(10, Math.round(time * ratio)))
          const newCost = Math.max(1, Math.min(10, TOTAL_SUM - newValue - newTime))
          setCarefulness(newValue)
          setTime(newTime)
          setCost(newCost)
        }
      } else if (changedParam === "time") {
        const remaining = TOTAL_SUM - newValue
        const currentOthers = carefulness + cost
        if (currentOthers > 0) {
          const ratio = remaining / currentOthers
          const newCarefulness = Math.max(1, Math.min(10, Math.round(carefulness * ratio)))
          const newCost = Math.max(1, Math.min(10, TOTAL_SUM - newValue - newCarefulness))
          setTime(newValue)
          setCarefulness(newCarefulness)
          setCost(newCost)
        }
      } else if (changedParam === "cost") {
        const remaining = TOTAL_SUM - newValue
        const currentOthers = carefulness + time
        if (currentOthers > 0) {
          const ratio = remaining / currentOthers
          const newCarefulness = Math.max(1, Math.min(10, Math.round(carefulness * ratio)))
          const newTime = Math.max(1, Math.min(10, TOTAL_SUM - newValue - newCarefulness))
          setCost(newValue)
          setCarefulness(newCarefulness)
          setTime(newTime)
        }
      }
    },
    [carefulness, time, cost],
  )

  // Create data point for the bubble chart
  const data = [
    {
      x: time,
      y: carefulness,
      z: cost, // bubble size driven directly by cost
    },
  ]

  const currentSum = carefulness + time + cost

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-md bg-white/80 border-b border-white/20 px-4 py-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Carefulness Knob
          </h1>
          <p className="text-slate-600 mt-2 text-sm md:text-base">
            Interactive parameter visualization • Sum: {currentSum}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Bubble Chart */}
        <Card className="backdrop-blur-sm bg-white/70 border-white/20 shadow-xl">
          <CardContent className="p-4 md:p-6">
            <div className="h-64 md:h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  margin={{
                    top: 20,
                    right: 20,
                    bottom: 40,
                    left: 40,
                  }}
                >
                  <defs>
                    <radialGradient id="bubbleGradient" cx="0.5" cy="0.3">
                      <stop offset="0%" stopColor="rgba(99, 102, 241, 0.8)" />
                      <stop offset="100%" stopColor="rgba(168, 85, 247, 0.6)" />
                    </radialGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Time"
                    domain={[1, 10]}
                    tickCount={6}
                    tick={{ fontSize: 12, fill: "#64748b" }}
                    label={{
                      value: "Time",
                      position: "insideBottom",
                      offset: -5,
                      style: { textAnchor: "middle", fontSize: "14px", fill: "#475569" },
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="Carefulness"
                    domain={[1, 10]}
                    tickCount={6}
                    tick={{ fontSize: 12, fill: "#64748b" }}
                    label={{
                      value: "Carefulness",
                      angle: -90,
                      position: "insideLeft",
                      style: { textAnchor: "middle", fontSize: "14px", fill: "#475569" },
                    }}
                  />
                  <ZAxis type="number" dataKey="z" range={[60, 400]} name="Cost" />
                  <Scatter
                    name="Data Point"
                    data={data}
                    fill="url(#bubbleGradient)"
                    stroke="rgba(99, 102, 241, 0.8)"
                    strokeWidth={2}
                    dataKey="z"
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Control Knobs */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Carefulness Knob */}
            <Card className="backdrop-blur-sm bg-gradient-to-br from-indigo-50/80 to-indigo-100/50 border-indigo-200/30 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-indigo-900 mb-1">Carefulness</h3>
                    <p className="text-sm text-indigo-600 mb-3">Controls Y-axis position</p>
                    <div className="text-3xl font-bold text-indigo-700">{carefulness}</div>
                  </div>
                  <div className="flex-shrink-0">
                    <RotatingKnob
                      value={carefulness}
                      onChange={(value) => redistributeValues("carefulness", value)}
                      min={1}
                      max={10}
                      color="#6366f1"
                      size={100}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Time Knob */}
            <Card className="backdrop-blur-sm bg-gradient-to-br from-emerald-50/80 to-emerald-100/50 border-emerald-200/30 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-emerald-900 mb-1">Time</h3>
                    <p className="text-sm text-emerald-600 mb-3">Controls X-axis position</p>
                    <div className="text-3xl font-bold text-emerald-700">{time}</div>
                  </div>
                  <div className="flex-shrink-0">
                    <RotatingKnob
                      value={time}
                      onChange={(value) => redistributeValues("time", value)}
                      min={1}
                      max={10}
                      color="#10b981"
                      size={100}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cost Knob */}
            <Card className="backdrop-blur-sm bg-gradient-to-br from-purple-50/80 to-purple-100/50 border-purple-200/30 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-purple-900 mb-1">Cost</h3>
                    <p className="text-sm text-purple-600 mb-3">Controls bubble size</p>
                    <div className="text-3xl font-bold text-purple-700">{cost}</div>
                  </div>
                  <div className="flex-shrink-0">
                    <RotatingKnob
                      value={cost}
                      onChange={(value) => redistributeValues("cost", value)}
                      min={1}
                      max={10}
                      color="#a855f7"
                      size={100}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Summary Card */}
        <Card className="backdrop-blur-sm bg-white/70 border-white/20 shadow-xl">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 text-center">
              Current Configuration (Total: {currentSum})
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 rounded-lg bg-indigo-50/50">
                <div className="text-2xl font-bold text-indigo-600">{carefulness}</div>
                <div className="text-xs text-indigo-500 mt-1">Carefulness</div>
                <div className="text-xs text-indigo-400 mt-1">{Math.round((carefulness / currentSum) * 100)}%</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-emerald-50/50">
                <div className="text-2xl font-bold text-emerald-600">{time}</div>
                <div className="text-xs text-emerald-500 mt-1">Time</div>
                <div className="text-xs text-emerald-400 mt-1">{Math.round((time / currentSum) * 100)}%</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-purple-50/50">
                <div className="text-2xl font-bold text-purple-600">{cost}</div>
                <div className="text-xs text-purple-500 mt-1">Cost</div>
                <div className="text-xs text-purple-400 mt-1">{Math.round((cost / currentSum) * 100)}%</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
