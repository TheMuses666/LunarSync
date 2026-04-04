'use client'

import { useEffect, useState } from 'react'
import ModeToggle from '@/components/ModeToggle'
import ShichenClock from '@/components/ShichenClock'
import { useMode } from '@/contexts/ModeContext'
import { getNow, formatGregorianDate, formatTime, normalizeTimeInZone } from '@/lib/time'
import { getBaZiDate } from '@/lib/rules'
import { getShichen, getShichenRange, getShichenRuleLabel } from '@/lib/shichen'
import { computeLunar } from '@/lib/lunar'
import { calculateSolarNoon } from '@/lib/solar'
import type { NormalizedTime } from '@/lib/time'
import type { LunarResult } from '@/lib/lunar'
import type { Shichen } from '@/lib/shichen'

interface TimeData {
  t: NormalizedTime
  shichen: Shichen
  lunar: LunarResult
}

interface LocationOption {
  id: string
  label: string
  country: string
  latitude?: number
  longitude?: number
  timezone: string
}

const LOCATION_OPTIONS: LocationOption[] = [
  {
    id: 'london',
    label: 'London',
    country: 'United Kingdom',
    latitude: 51.5072,
    longitude: -0.1276,
    timezone: 'Europe/London',
  },
  {
    id: 'beijing',
    label: 'Beijing',
    country: 'China',
    latitude: 39.9042,
    longitude: 116.4074,
    timezone: 'Asia/Shanghai',
  },
  {
    id: 'new-york',
    label: 'New York',
    country: 'United States',
    latitude: 40.7128,
    longitude: -74.006,
    timezone: 'America/New_York',
  },
  {
    id: 'san-francisco',
    label: 'San Francisco',
    country: 'United States',
    latitude: 37.7749,
    longitude: -122.4194,
    timezone: 'America/Los_Angeles',
  },
  {
    id: 'paris',
    label: 'Paris',
    country: 'France',
    latitude: 48.8566,
    longitude: 2.3522,
    timezone: 'Europe/Paris',
  },
  {
    id: 'helsinki',
    label: 'Helsinki',
    country: 'Finland',
    latitude: 60.1699,
    longitude: 24.9384,
    timezone: 'Europe/Helsinki',
  },
  {
    id: 'amsterdam',
    label: 'Amsterdam',
    country: 'Netherlands',
    latitude: 52.3676,
    longitude: 4.9041,
    timezone: 'Europe/Amsterdam',
  },
  {
    id: 'tokyo',
    label: 'Tokyo',
    country: 'Japan',
    latitude: 35.6762,
    longitude: 139.6503,
    timezone: 'Asia/Tokyo',
  },
  {
    id: 'singapore',
    label: 'Singapore',
    country: 'Singapore',
    latitude: 1.3521,
    longitude: 103.8198,
    timezone: 'Asia/Singapore',
  },
  {
    id: 'sydney',
    label: 'Sydney',
    country: 'Australia',
    latitude: -33.8688,
    longitude: 151.2093,
    timezone: 'Australia/Sydney',
  },
]

function recompute(mode: 'beijing' | 'local', localTimezone?: string): TimeData {
  const t = mode === 'local' && localTimezone
    ? normalizeTimeInZone(new Date(), localTimezone, localTimezone)
    : getNow(mode)
  const baziDate = getBaZiDate(t)
  const shichen = getShichen(t.hour)
  const lunar = computeLunar(baziDate, t)
  return { t, shichen, lunar }
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[9px] tracking-[0.2em] uppercase text-[#777777] font-medium">
      {children}
    </div>
  )
}

function Panel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white border border-[#D4D4D4] p-5 ${className}`}>
      {children}
    </div>
  )
}

export default function ObservatoryPage() {
  const { mode } = useMode()
  const [locationId, setLocationId] = useState('london')
  const selectedLocation = LOCATION_OPTIONS.find(option => option.id === locationId) ?? LOCATION_OPTIONS[0]
  const beijingLocation = LOCATION_OPTIONS.find(option => option.id === 'beijing') ?? LOCATION_OPTIONS[0]
  const effectiveLocation = mode === 'beijing' ? beijingLocation : selectedLocation
  const [, setTick] = useState(() => Date.now())

  useEffect(() => {
    const id = setInterval(() => setTick(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const data = recompute(mode, effectiveLocation.timezone)
  const { t, shichen, lunar } = data
  const locationTime = normalizeTimeInZone(new Date(), effectiveLocation.timezone)
  const solarNoon = calculateSolarNoon(
    effectiveLocation.longitude ?? 0,
    new Date(),
    locationTime.tzOffset
  )
  const locationDisplay = `${effectiveLocation.label}, ${effectiveLocation.country}`
  const coordinateLine = `${effectiveLocation.latitude?.toFixed(2)}°, ${effectiveLocation.longitude?.toFixed(2)}°`

  const tzLine = mode === 'beijing'
    ? 'CST (UTC+8)'
    : effectiveLocation.timezone

  return (
    <div className="min-h-[calc(100vh-41px)] flex flex-col items-center justify-center py-10 px-6">
      <div className="mb-12 flex w-full justify-center">
        <div className="w-full max-w-[620px] flex justify-center">
          <ModeToggle />
        </div>
      </div>

      <div className="flex w-full max-w-[1850px] flex-col items-center justify-center gap-0 lg:flex-row lg:items-center lg:justify-center lg:gap-3">
        <div className="flex w-full max-w-[980px] flex-col justify-center gap-4 lg:max-w-[400px]">
          <Panel>
            <Label>Gregorian Coordinate</Label>
            <div className="mt-4 font-serif-display text-4xl tracking-tight text-[#1A1A1A]">
              {formatGregorianDate(t)}
            </div>
            <div className="mt-1 font-serif-display text-2xl text-[#1A1A1A] tracking-wide">
              {formatTime(t)}
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-[10px] text-[#777777] tracking-widest uppercase">
              <span>◷</span>
              <span>{tzLine}</span>
            </div>
          </Panel>

          <Panel>
            <div className="flex justify-between items-center py-1.5 border-b border-[#EEEEEE]">
              <span className="text-[9px] tracking-[0.2em] uppercase text-[#777777]">Solar Noon</span>
              <span className="font-mono text-sm text-[#1A1A1A]">{solarNoon}</span>
            </div>
            <div className="flex justify-between items-center py-1.5 mt-0.5">
              <span className="text-[9px] tracking-[0.2em] uppercase text-[#777777]">Location</span>
              <span className="text-sm text-[#1A1A1A] text-right max-w-[160px]">{locationDisplay}</span>
            </div>
            <div className="mt-3 border-t border-[#EEEEEE] pt-3">
              <label className="flex items-center justify-between gap-4">
                <span className="text-[9px] tracking-[0.2em] uppercase text-[#777777]">Region</span>
                <select
                  value={locationId}
                  onChange={event => setLocationId(event.target.value)}
                  disabled={mode === 'beijing'}
                  className="min-w-[180px] border border-[#D4D4D4] bg-white px-3 py-2 text-[11px] tracking-[0.12em] uppercase text-[#1A1A1A] outline-none"
                >
                  {LOCATION_OPTIONS.map(option => (
                    <option key={option.id} value={option.id}>
                      {option.country} / {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="mt-3 text-[9px] tracking-[0.18em] uppercase text-[#777777]">
              {coordinateLine} / {effectiveLocation.timezone}
            </div>
          </Panel>
        </div>

        <div className="flex w-full max-w-[400px] flex-col items-center justify-center pt-2 lg:max-w-[400px] lg:flex-none">
          <div className="w-full flex justify-center">
            <ShichenClock
              hour={t.hour}
              minute={t.minute}
              second={t.second}
              shichen={shichen}
            />
          </div>
        </div>

        <div className="flex w-full max-w-[980px] flex-col justify-center gap-4 lg:max-w-[400px]">
          <Panel>
            <Label>Traditional Coordinates</Label>
            <div className="mt-4 font-serif-display text-3xl leading-snug text-[#1A1A1A]">
              {lunar.lunarYear}年{' '}
              {lunar.isLeapMonth && <span className="text-[#777777]">闰</span>}
              {lunar.lunarMonth}月{' '}
              {lunar.lunarDay}
            </div>
            <div className="mt-2 text-[13px] text-[#777777] tracking-widest uppercase">
              {shichen.name} ({shichen.englishName}) · {getShichenRuleLabel(shichen)}
            </div>
            <div className="mt-4 flex items-center gap-2 text-[9px] tracking-[0.15em] uppercase border border-[#D4D4D4] w-fit px-3 py-1.5 text-[#777777]">
              <span>✓</span> Day Divination Verified
            </div>
          </Panel>

          <Panel>
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="font-serif-display text-2xl">{shichen.branch}</span>
                  <span className="text-[9px] tracking-[0.2em] uppercase text-[#777777]">{shichen.animal}</span>
                  <span className="text-[9px] tracking-[0.2em] uppercase text-[#777777]">{getShichenRuleLabel(shichen)}</span>
                </div>
                <div className="text-[9px] tracking-[0.12em] text-[#777777] mt-0.5">
                  {getShichenRange(shichen)}
                </div>
              </div>
              <div className="text-right grid grid-cols-2 gap-x-3 gap-y-0.5 text-[9px] tracking-widest text-[#777777] uppercase">
                <span>年</span><span className="text-[#1A1A1A] font-medium">{lunar.yearGanZhi}</span>
                <span>月</span><span className="text-[#1A1A1A] font-medium">{lunar.monthGanZhi}</span>
                <span>日</span><span className="text-[#1A1A1A] font-medium">{lunar.dayGanZhi}</span>
                <span>时</span><span className="text-[#1A1A1A] font-medium">{lunar.timeGanZhi}</span>
              </div>
            </div>
            <p className="text-[12px] text-[#777777] italic font-serif-display leading-relaxed border-t border-[#EEEEEE] pt-3">
              {shichen.description}
            </p>
          </Panel>
        </div>
      </div>
    </div>
  )
}
