"use client";

/**
 * Hallim in-app homepage.
 *
 * Drop into `components/home/hallim-homepage.tsx`, import
 * `styles/hallim-theme.css` once globally, and `npm i lucide-react`.
 * Wire real data via the `HallimHomeData` prop — see `page.tsx` for the
 * server-side wrapper.
 *
 * Structure follows a specific layout brief (top bar → promo banner → 6-up
 * icon grid → Companion journey card → mobile tab bar), adapted from an
 * existing HSK-prep app's skeleton, restyled with Hallim's own single-accent
 * palette rather than that app's visual treatment.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import type { ComponentType } from "react";
import {
  BookOpen,
  Bell,
  ChevronDown,
  ClipboardCheck,
  ClipboardList,
  Compass,
  Headphones,
  Home,
  Layers,
  Library,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  User,
  ArrowUpRight,
  CalendarClock,
  CalendarDays,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types — replace the mock data below with real session/roadmap data.
// ---------------------------------------------------------------------------

export type TopikLevel = "I" | "II";

export interface HallimHomeData {
  user: { name: string };
  level: TopikLevel;
  isPlus: boolean;
  hasUnreadNotifications: boolean;
  examDateISO: string;
  streakDays: number;
  wordsLearned: number;
  companion: {
    readinessPercent: number;
    unitNumber: number;
    lessonNumber: number;
    lessonTitleKo: string;
  };
  quickAccess: {
    listeningSets: number;
    readingSets: number;
    vocabDueToday: number;
    nextMockExamLabel: string;
    mockExamSets: number;
    incorrectToReview: number;
  };
}

const mockData: HallimHomeData = {
  user: { name: "Seo-yeon" },
  level: "II",
  isPlus: false,
  hasUnreadNotifications: true,
  examDateISO: "2026-08-31",
  streakDays: 12,
  wordsLearned: 482,
  companion: {
    readinessPercent: 63,
    unitNumber: 4,
    lessonNumber: 3,
    lessonTitleKo: "이유와 근거 말하기",
  },
  quickAccess: {
    listeningSets: 18,
    readingSets: 22,
    vocabDueToday: 34,
    nextMockExamLabel: "Set 6",
    mockExamSets: 12,
    incorrectToReview: 37,
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function daysUntil(dateISO: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateISO);
  target.setHours(0, 0, 0, 0);
  return Math.max(0, Math.round((target.getTime() - today.getTime()) / 86_400_000));
}

// ---------------------------------------------------------------------------
// Root component
// ---------------------------------------------------------------------------

export default function HallimHomepage({ data = mockData }: { data?: HallimHomeData }) {
  const [level, setLevel] = useState<TopikLevel>(data.level);
  const daysRemaining = useMemo(() => daysUntil(data.examDateISO), [data.examDateISO]);

  return (
    <div className="hallim-home relative min-h-screen pb-20 lg:pb-0">
      <TopBar
        level={level}
        onLevelChange={setLevel}
        isPlus={data.isPlus}
        hasUnreadNotifications={data.hasUnreadNotifications}
      />

      <main className="mx-auto max-w-5xl px-5 pb-16 pt-6 sm:px-8 sm:pt-8">
        <StatsStrip
          streakDays={data.streakDays}
          wordsLearned={data.wordsLearned}
          daysRemaining={daysRemaining}
        />

        <PromoBanner />

        <IconGrid quickAccess={data.quickAccess} />

        <CompanionCard level={level} companion={data.companion} />
      </main>

      <BottomTabBar />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Top bar: logo, level dropdown, upgrade badge, notifications
// ---------------------------------------------------------------------------

function TopBar({
  level,
  onLevelChange,
  isPlus,
  hasUnreadNotifications,
}: {
  level: TopikLevel;
  onLevelChange: (level: TopikLevel) => void;
  isPlus: boolean;
  hasUnreadNotifications: boolean;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--hl-hairline)] bg-[var(--hl-canvas)]/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4 sm:px-8">
        <div className="flex items-center gap-3">
          <div className="flex items-baseline gap-2">
            <span className="text-[18px] font-semibold tracking-tight">할림</span>
            <span className="text-[15px] font-medium text-[var(--hl-secondary)]">Hallim</span>
          </div>
          <LevelDropdown level={level} onChange={onLevelChange} />
        </div>

        <div className="flex items-center gap-2.5">
          {!isPlus && (
            <a
              href="#upgrade"
              className="inline-flex items-center gap-1.5 rounded-full bg-[var(--hl-accent-tint)] px-3 py-1.5 text-[13px] font-medium text-[var(--hl-accent-ink)] transition-colors hover:bg-[var(--hl-accent)] hover:text-white"
            >
              <Sparkles size={13} strokeWidth={2} />
              Upgrade
            </a>
          )}
          <button
            type="button"
            aria-label="Notifications"
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[var(--hl-hairline)] text-[var(--hl-secondary)] transition-colors hover:border-[var(--hl-hairline-strong)] hover:text-[var(--hl-ink)]"
          >
            <Bell size={16} strokeWidth={1.75} />
            {hasUnreadNotifications && (
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[var(--hl-accent)]" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

function LevelDropdown({
  level,
  onChange,
}: {
  level: TopikLevel;
  onChange: (level: TopikLevel) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 rounded-full border border-[var(--hl-hairline)] bg-[var(--hl-surface)] py-1.5 pl-3 pr-2.5 text-[13px] font-medium text-[var(--hl-ink)] transition-colors hover:border-[var(--hl-hairline-strong)]"
      >
        TOPIK {level}
        <ChevronDown size={14} strokeWidth={2} className={cx("transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute left-0 top-[calc(100%+8px)] z-50 w-32 overflow-hidden rounded-2xl border border-[var(--hl-hairline)] bg-[var(--hl-surface)] py-1 shadow-[0_1px_2px_rgba(18,21,26,0.04),0_20px_40px_-20px_rgba(18,21,26,0.25)]"
        >
          {(["I", "II"] as const).map((l) => (
            <button
              key={l}
              type="button"
              role="option"
              aria-selected={level === l}
              onClick={() => {
                onChange(l);
                setOpen(false);
              }}
              className={cx(
                "flex w-full items-center justify-between px-3.5 py-2 text-left text-[13.5px] font-medium transition-colors hover:bg-[var(--hl-accent-tint)]",
                level === l ? "text-[var(--hl-accent-ink)]" : "text-[var(--hl-ink)]",
              )}
            >
              TOPIK {l}
              {level === l && <span className="h-1.5 w-1.5 rounded-full bg-[var(--hl-accent)]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Compact stats strip — the numbers a dated-exam student checks daily
// ---------------------------------------------------------------------------

function StatsStrip({
  streakDays,
  wordsLearned,
  daysRemaining,
}: {
  streakDays: number;
  wordsLearned: number;
  daysRemaining: number;
}) {
  const items: Array<{ icon: ComponentType<{ size?: number; strokeWidth?: number }>; label: string; value: string | number }> = [
    { icon: CalendarDays, label: "day streak", value: streakDays },
    { icon: Library, label: "words learned", value: wordsLearned.toLocaleString() },
    { icon: CalendarClock, label: "to exam day", value: `D-${daysRemaining}` },
  ];

  return (
    <div className="mb-6 flex items-center gap-5 overflow-x-auto sm:gap-8">
      {items.map((item, i) => (
        <div key={item.label} className={cx("flex items-center gap-2 whitespace-nowrap", i > 0 && "border-l border-[var(--hl-hairline)] pl-5 sm:pl-8")}>
          <item.icon size={15} strokeWidth={1.75} className="text-[var(--hl-muted)]" />
          <span className="hl-num text-[15px] font-semibold text-[var(--hl-ink)]">{item.value}</span>
          <span className="text-[13px] text-[var(--hl-secondary)]">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Promo banner
// ---------------------------------------------------------------------------

function PromoBanner() {
  return (
    <a
      href="#vocab"
      className="group relative mb-6 flex h-[220px] items-center justify-between overflow-hidden rounded-[28px] bg-[var(--hl-accent)] px-7 sm:h-[250px] sm:px-10"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/[0.06]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 right-16 h-72 w-72 rounded-full bg-white/[0.05]"
      />

      <div className="relative z-10 max-w-xs sm:max-w-sm">
        <h2 className="text-[22px] font-semibold leading-tight text-white sm:text-[26px]">
          TOPIK vocabulary is live
        </h2>
        <p className="mt-2 text-[14px] leading-relaxed text-white/80">
          1,200+ curated words across every level, ready to study today.
        </p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-medium text-white">
          Explore vocab
          <ArrowUpRight size={15} strokeWidth={2} />
        </span>
      </div>

      <div className="relative z-10 hidden shrink-0 sm:block">
        <div className="flex h-28 w-28 items-center justify-center rounded-full bg-white/10">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/15">
            <BookOpen size={36} strokeWidth={1.5} className="text-white" />
          </div>
        </div>
      </div>
    </a>
  );
}

// ---------------------------------------------------------------------------
// Icon grid — six core sections, same accent throughout
// ---------------------------------------------------------------------------

function IconGrid({ quickAccess }: { quickAccess: HallimHomeData["quickAccess"] }) {
  const tiles: Array<{ icon: ComponentType<{ size?: number; strokeWidth?: number }>; label: string; meta: string; href: string }> = [
    { icon: Headphones, label: "Listening", meta: `${quickAccess.listeningSets} sets`, href: "#listening" },
    { icon: BookOpen, label: "Reading", meta: `${quickAccess.readingSets} sets`, href: "#reading" },
    { icon: Layers, label: "Vocab training", meta: `${quickAccess.vocabDueToday} due`, href: "#vocab" },
    { icon: ClipboardCheck, label: "Real mock exam", meta: quickAccess.nextMockExamLabel, href: "#real-mock" },
    { icon: ClipboardList, label: "Mock exams", meta: `${quickAccess.mockExamSets} sets`, href: "#mock-exams" },
    { icon: RotateCcw, label: "Incorrect answers", meta: `${quickAccess.incorrectToReview} to review`, href: "#incorrect" },
  ];

  return (
    <div className="mb-6 grid grid-cols-3 gap-x-3 gap-y-6 sm:grid-cols-6 sm:gap-x-4">
      {tiles.map((tile) => (
        <a
          key={tile.label}
          href={tile.href}
          className="group flex flex-col items-center gap-2.5 text-center"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--hl-accent-tint)] text-[var(--hl-accent-ink)] transition-transform group-hover:scale-105 group-active:scale-95">
            <tile.icon size={22} strokeWidth={1.75} />
          </span>
          <span>
            <span className="block text-[13px] font-medium leading-snug text-[var(--hl-ink)]">
              {tile.label}
            </span>
            <span className="block text-[11.5px] text-[var(--hl-muted)]">{tile.meta}</span>
          </span>
        </a>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Companion journey card
// ---------------------------------------------------------------------------

function CompanionCard({
  level,
  companion,
}: {
  level: TopikLevel;
  companion: HallimHomeData["companion"];
}) {
  const percent = companion.readinessPercent;
  const size = 64;
  const stroke = 6;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-b from-[var(--hl-ink)] to-[var(--hl-accent-dark)] px-7 py-8 sm:px-10 sm:py-10">
      <MountainSilhouettes />

      <div className="relative z-10 flex items-start justify-between">
        <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-[12.5px] font-medium text-white/80">
          TOPIK {level}
        </span>
        <span
          aria-label="Structured curriculum"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/80"
        >
          <ShieldCheck size={17} strokeWidth={1.75} />
        </span>
      </div>

      <div className="relative z-10 mt-6 flex flex-col gap-8 sm:mt-10 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-sm">
          <h2 className="text-[24px] font-semibold text-white sm:text-[28px]">Hallim Companion</h2>
          <p className="mt-2 text-[14.5px] leading-relaxed text-white/70">
            A structured roadmap built with TOPIK instructors — unit by unit, at your pace.
          </p>
          <p className="mt-4 text-[13px] text-white/60">
            Continue: Unit {companion.unitNumber} · Lesson {companion.lessonNumber} ·{" "}
            <span className="text-white/85">{companion.lessonTitleKo}</span>
          </p>
        </div>

        <div className="flex items-center gap-5">
          <div className="relative h-16 w-16">
            <svg width={size} height={size} className="-rotate-90">
              <circle cx={size / 2} cy={size / 2} r={radius} stroke="rgba(255,255,255,0.15)" strokeWidth={stroke} fill="none" />
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="white"
                strokeWidth={stroke}
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="hl-num text-[14px] font-semibold text-white">{percent}%</span>
            </div>
          </div>

          <a
            href="#companion"
            aria-label="Continue in Companion"
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white text-[var(--hl-ink)] shadow-[0_10px_24px_-8px_rgba(0,0,0,0.5)] transition-transform hover:scale-105 active:scale-95"
          >
            <ArrowUpRight size={22} strokeWidth={2} />
          </a>
        </div>
      </div>
    </section>
  );
}

function MountainSilhouettes() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 800 320"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-90"
    >
      <path d="M0 320 L0 220 L140 130 L260 210 L400 90 L520 190 L650 120 L800 210 L800 320 Z" fill="rgba(255,255,255,0.05)" />
      <path d="M0 320 L0 260 L180 180 L320 240 L470 150 L620 230 L800 170 L800 320 Z" fill="rgba(255,255,255,0.08)" />
      <path
        d="M40 250 C 160 210, 220 150, 320 140 S 480 190, 620 130 S 720 90, 760 100"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="2"
        fill="none"
        className="hl-path-dash"
      />
      {[
        [40, 250],
        [320, 140],
        [620, 130],
        [760, 100],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={i === 3 ? 5 : 3.5} fill={i === 3 ? "white" : "rgba(255,255,255,0.5)"} />
      ))}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Bottom tab bar — mobile only; TOPIK has no HSKK-equivalent, so the four
// tabs are reinterpreted around what this app actually has: an overview,
// the structured roadmap, a hub for the six practice sections, and profile.
// ---------------------------------------------------------------------------

function BottomTabBar() {
  const tabs: Array<{ icon: ComponentType<{ size?: number; strokeWidth?: number }>; label: string; active?: boolean }> = [
    { icon: Home, label: "Home", active: true },
    { icon: Compass, label: "Companion" },
    { icon: Headphones, label: "Practice" },
    { icon: User, label: "Me" },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-[var(--hl-hairline)] bg-[var(--hl-surface)]/95 backdrop-blur-md lg:hidden">
      {tabs.map((tab) => (
        <button
          key={tab.label}
          type="button"
          className={cx(
            "flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium",
            tab.active ? "text-[var(--hl-accent-ink)]" : "text-[var(--hl-muted)]",
          )}
        >
          <tab.icon size={20} strokeWidth={1.75} />
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
