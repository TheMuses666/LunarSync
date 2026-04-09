'use client'

import { SHICHEN_LIST, type Shichen } from '@/lib/shichen'

const CX = 160
const CY = 160
const R_OUTER = 138
const R_TICK_OUT = 136
const R_TICK_IN = 127
const R_TIME_LABEL = 154
const R_BRANCH_CHAR = 102
const R_SECTOR = 120
const R_MASK = 92
const R_HAND = 64
const R_DOT = 5

const SHICHEN_BOUNDARIES = SHICHEN_LIST.map(item => item.startHour)

function hourToXY(hour: number, mins = 0, r: number) {
  const t = hour + mins / 60
  const a = (t / 24) * 2 * Math.PI
  return { x: CX + r * Math.sin(a), y: CY - r * Math.cos(a) }
}

/** Pie slice from center to r, from startHour to endHour (clockwise) */
function pieSectorPath(startH: number, endH: number, r: number): string {
  const hrs = ((endH - startH + 24) % 24) || 24
  const large = hrs / 24 > 0.5 ? 1 : 0
  const { x: x1, y: y1 } = hourToXY(startH, 0, r)
  const { x: x2, y: y2 } = hourToXY(endH, 0, r)
  return [
    `M ${CX} ${CY}`,
    `L ${x1.toFixed(2)} ${y1.toFixed(2)}`,
    `A ${r} ${r} 0 ${large} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`,
    'Z',
  ].join(' ')
}

interface ShichenClockProps {
  hour: number
  minute: number
  second: number
  shichen: Shichen
  interactiveShichen?: Shichen
  onHoverShichen?: (shichen: Shichen | null) => void
  onSelectShichen?: (shichen: Shichen) => void
}

function formatBoundaryHour(hour: number) {
  return `${String(hour).padStart(2, '0')}:00`
}

export default function ShichenClock({
  hour,
  minute,
  second,
  shichen,
  interactiveShichen,
  onHoverShichen,
  onSelectShichen,
}: ShichenClockProps) {
  const hand = hourToXY(hour, minute + second / 60, R_HAND)
  const hoveredShichen = interactiveShichen && interactiveShichen.index !== shichen.index
    ? interactiveShichen
    : null
  const activeBoundaryHours = new Set([
    shichen.startHour,
    shichen.endHour,
    ...(hoveredShichen ? [hoveredShichen.startHour, hoveredShichen.endHour] : []),
  ])

  return (
    <svg viewBox="0 0 320 320" className="h-[360px] w-[360px] select-none">
      <circle cx={CX} cy={CY} r={R_OUTER + 18} fill="none" stroke="#DDDDDD" strokeWidth="1" />
      <circle
        cx={CX}
        cy={CY}
        r={R_OUTER + 8}
        fill="none"
        stroke="#D5D5D5"
        strokeWidth="1"
        strokeDasharray="3 3"
      />
      <circle cx={CX} cy={CY} r={R_OUTER} fill="#F7F7F7" />

      <path
        d={pieSectorPath(shichen.startHour, shichen.endHour, R_SECTOR)}
        fill="#B7B7B7"
        opacity="0.9"
        className="transition-all duration-200"
      />

      {hoveredShichen && (
        <path
          d={pieSectorPath(hoveredShichen.startHour, hoveredShichen.endHour, R_SECTOR)}
          fill="#D8D8D8"
          opacity="0.95"
          className="transition-all duration-200"
        />
      )}

      {SHICHEN_BOUNDARIES.map(h => {
        const outer = hourToXY(h, 0, R_TICK_OUT)
        const inner = hourToXY(h, 0, R_TICK_IN)
        const isActive = activeBoundaryHours.has(h)
        return (
          <line
            key={h}
            x1={outer.x.toFixed(2)} y1={outer.y.toFixed(2)}
            x2={inner.x.toFixed(2)} y2={inner.y.toFixed(2)}
            stroke={isActive ? '#767676' : '#A0A0A0'}
            strokeWidth={isActive ? '1.2' : '1'}
          />
        )
      })}

      {SHICHEN_BOUNDARIES.map(h => {
        const pos = hourToXY(h, 0, R_TIME_LABEL)
        const isActive = activeBoundaryHours.has(h)
        return (
          <text
            key={`label-${h}`}
            x={pos.x.toFixed(2)}
            y={pos.y.toFixed(2)}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="8.5"
            fill={isActive ? '#4F4F4F' : '#9B9B9B'}
            fontFamily="monospace"
            fontWeight={isActive ? '600' : '400'}
            letterSpacing="0.3"
          >
            {formatBoundaryHour(h)}
          </text>
        )
      })}

      {SHICHEN_LIST.map(s => {
        const midH = s.startHour === 23
          ? 0 // 子时 midpoint is midnight (0)
          : (s.startHour + s.endHour) / 2
        const pos = hourToXY(midH, 0, R_BRANCH_CHAR)
        const isCurrent = s.index === shichen.index
        const isHovered = s.index === hoveredShichen?.index
        return (
          <text
            key={s.branch}
            x={pos.x.toFixed(2)} y={pos.y.toFixed(2)}
            textAnchor="middle" dominantBaseline="middle"
            fontSize={isCurrent ? '17' : isHovered ? '15' : '13'}
            fill={isCurrent ? '#1A1A1A' : isHovered ? '#5E5E5E' : '#B1B1B1'}
            fontWeight={isCurrent ? '600' : isHovered ? '500' : '400'}
          >
            {s.branch}
          </text>
        )
      })}

      {SHICHEN_LIST.map(s => (
        <path
          key={`hit-${s.branch}`}
          d={pieSectorPath(s.startHour, s.endHour, R_OUTER)}
          fill="transparent"
          className="cursor-pointer"
          onMouseEnter={() => onHoverShichen?.(s)}
          onMouseLeave={() => onHoverShichen?.(null)}
          onClick={() => onSelectShichen?.(s)}
        />
      ))}

      <circle cx={CX} cy={CY} r={R_OUTER} fill="none" stroke="#D0D0D0" strokeWidth="1" />

      <circle cx={CX} cy={CY} r={R_MASK} fill="white" />
      <circle cx={CX} cy={CY} r={R_MASK} fill="none" stroke="#D6D6D6" strokeWidth="1" />

      <line
        x1={CX} y1={CY}
        x2={hand.x.toFixed(2)} y2={hand.y.toFixed(2)}
        stroke="#1A1A1A" strokeWidth="1.8" strokeLinecap="round"
      />
      <circle cx={CX} cy={CY} r={R_DOT} fill="#1A1A1A" />
    </svg>
  )
}
