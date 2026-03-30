# LunarSync

LunarSync is a Next.js 16 interface for observing and analyzing traditional Chinese shichen (时辰), lunar calendar data, and timezone-aware date conversions.

The project currently includes:

- `Observatory`: a live dashboard showing the current Gregorian date, local solar noon, selected region, shichen clock, and traditional coordinates.
- `Navigator`: a manual analysis page where you choose a date/time and region, then inspect the corresponding shichen and lunar result.
- `Compare`: a multi-timezone comparison view for the same UTC moment.

## Features

- Live shichen clock with highlighted current double-hour.
- Region-aware time conversion using IANA timezones.
- Lunar date and Eight Characters (`年 / 月 / 日 / 时`) calculation via `lunar-javascript`.
- Solar noon estimation based on longitude and timezone offset.
- Traditional date display for both dashboard and query workflows.
- Route-aware header navigation that highlights the current page.

## Time Rules

This project follows the astronomical convention already implemented in the codebase:

- Zi-Shi (`子时`) spans `23:00 - 00:59`.
- Calendar day change occurs strictly at `00:00`.
- Traditional coordinate calculation uses the Gregorian calendar date boundary at midnight.

## Tech Stack

- Next.js 16.2.1
- React 19
- TypeScript
- Tailwind CSS 4
- `dayjs`
- `lunar-javascript`

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Project Structure

```text
app/
  layout.tsx        Root layout and shared header
  page.tsx          Observatory dashboard
  query/page.tsx    Manual time analysis page
  compare/page.tsx  Multi-timezone comparison page

components/
  HeaderNav.tsx     Route-aware top navigation
  ModeToggle.tsx    Time mode toggle used by dashboard
  ShichenClock.tsx  SVG shichen clock

lib/
  time.ts           Time normalization and formatting helpers
  solar.ts          Solar noon calculation
  shichen.ts        Shichen definitions and ranges
  lunar.ts          Lunar and Eight Characters conversion
  rules.ts          Day-boundary rules for calculation
```

## Notes

- The `Navigator` page now uses manual region selection instead of the older local/beijing toggle.
- The dashboard uses a manually selected region for solar noon and location display.
- Styling is intentionally minimal and editorial, matching the current monochrome UI direction.

## Verification

Before shipping changes, run:

```bash
npm run lint
npm run build
```
