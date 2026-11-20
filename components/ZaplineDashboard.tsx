'use client';

import {useState} from 'react';
import Image from 'next/image';
import {motion} from 'motion/react';
import {
  Bell,
  Check,
  Crosshair,
  LayoutDashboard,
  LogOut,
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  TrendingDown,
  TrendingUp,
  Users,
  Wallet,
  Zap,
} from 'lucide-react';
import SalesAreaChart from './SalesAreaChart';

export type DashboardTab = 'dashboard' | 'snipes' | 'wallets' | 'referral' | 'settings';

interface ZaplineDashboardProps {
  isMobile: boolean;
  reducedMotion: boolean;
  walletConnected: boolean;
  onToggleConnect: () => void;
  onOpenUpgrade: () => void;
  minHeightPx?: number;
}

const GLOW_STRIP_URL =
  'https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/e0e14572-12e1-4c08-b471-a21521844945.png';

export default function ZaplineDashboard({
  isMobile,
  reducedMotion,
  walletConnected,
  onToggleConnect,
  onOpenUpgrade,
  minHeightPx,
}: ZaplineDashboardProps) {
  const [activeTab, setActiveTab] = useState<DashboardTab>('dashboard');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [timeframe, setTimeframe] = useState<'30D' | '7D'>('30D');
  const [calendarPeriod, setCalendarPeriod] = useState<'Start date–Now (monthly)' | 'Last 30 days'>(
    'Start date–Now (monthly)'
  );
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [glowImgFailed, setGlowImgFailed] = useState(false);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [mevShield, setMevShield] = useState(true);
  const [connectedApps, setConnectedApps] = useState({
    charting: true,
    terminals: true,
  });

  const handleCopyAddress = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText('0x3f4a92c1b04e8d217f8c9c7e').catch(() => {});
    }
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 1600);
  };

  const staggerItem = (delay: number) =>
    reducedMotion
      ? {}
      : {
          initial: {opacity: 0, y: 14},
          animate: {opacity: 1, y: 0},
          transition: {duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] as const},
        };

  const primaryItems: Array<{id: DashboardTab; label: string; icon: typeof LayoutDashboard}> = [
    {id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard},
    {id: 'snipes', label: 'Snipes', icon: Crosshair},
  ];

  const secondaryItems: Array<{id: DashboardTab; label: string; icon: typeof Wallet}> = [
    {id: 'wallets', label: 'Wallets', icon: Wallet},
    {id: 'referral', label: 'Referral', icon: Users},
    {id: 'settings', label: 'Settings', icon: SlidersHorizontal},
  ];

  const allMobileChips = [
    {id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard},
    {id: 'snipes' as const, label: 'Snipes', icon: Crosshair},
    {id: 'wallets' as const, label: 'Wallets', icon: Wallet},
    {id: 'referral' as const, label: 'Referral', icon: Users},
    {id: 'settings' as const, label: 'Settings', icon: SlidersHorizontal},
  ];

  return (
    <div className="relative w-full">
      {/* Screen-blended dashboard top glow strip */}
      {!glowImgFailed && (
        <Image
          src={GLOW_STRIP_URL}
          alt=""
          width={1204}
          height={56}
          aria-hidden="true"
          referrerPolicy="no-referrer"
          onError={() => setGlowImgFailed(true)}
          style={{mixBlendMode: 'screen'}}
          className="pointer-events-none absolute -top-[42px] left-1/2 z-10 h-[56px] w-[96%] -translate-x-1/2 select-none object-cover opacity-90"
        />
      )}

      {/* CSS fallback subtle top edge bloom */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-5 left-1/2 z-0 h-8 w-3/4 -translate-x-1/2 rounded-full opacity-75 blur-xl"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(160,32,255,0.65), transparent 72%)',
        }}
      />

      {/* Main Dark Glass Dashboard Surface */}
      <div
        className="relative z-10 w-full overflow-hidden rounded-t-[14px] rounded-b-[14px] border border-[#9312ff]/35 bg-[#090611]/90 shadow-[0_-12px_48px_rgba(147,18,255,0.18)] backdrop-blur-xl"
        style={
          !isMobile && minHeightPx
            ? {
                minHeight: `${minHeightPx}px`,
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
              }
            : undefined
        }
      >
        {/* Thin glowing violet line along top edge */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-20 h-[1.5px]"
          style={{
            background:
              'linear-gradient(90deg, rgba(147,18,255,0.08) 0%, rgba(147,18,255,0.55) 18%, #d287ff 50%, rgba(147,18,255,0.55) 82%, rgba(147,18,255,0.08) 100%)',
            boxShadow: '0 0 14px rgba(160, 32, 255, 0.85)',
          }}
        />

        {/* Embedded subtle violet panel-texture sheen */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 opacity-60"
          style={{
            background:
              'radial-gradient(ellipse 65% 40% at 50% 0%, rgba(147, 18, 255, 0.14), transparent 70%)',
          }}
        />

        <div className={`relative z-10 flex ${isMobile ? 'flex-col' : 'flex-row'}`}>
          {/* DESKTOP SIDEBAR */}
          {!isMobile ? (
            <motion.aside
              {...staggerItem(0.55)}
              className="flex w-[216px] shrink-0 flex-col justify-between border-r border-white/[0.07] bg-white/[0.015] p-3.5"
            >
              <div className="space-y-3">
                {/* Brand + gear */}
                <div className="flex items-center justify-between px-2 pt-0.5">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#9312ff]/25 text-[#d49dff]">
                      <Zap className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-[13px] font-semibold tracking-tight text-[#f7f7f8]">
                      Zapline
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('settings')}
                    aria-label="Open Zapline settings"
                    className="rounded-md p-1 text-[#8b8988] transition-colors hover:bg-white/[0.06] hover:text-[#f7f7f8]"
                  >
                    <Settings className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Primary nav group */}
                <nav aria-label="Dashboard navigation" className="space-y-0.5">
                  <button
                    type="button"
                    onClick={() => setSearchOpen((v) => !v)}
                    className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[12px] font-medium transition-colors whitespace-nowrap ${
                      searchOpen
                        ? 'bg-white/[0.07] text-[#f7f7f8]'
                        : 'text-[#8b8988] hover:bg-white/[0.04] hover:text-[#f7f7f8]'
                    }`}
                  >
                    <Search className="h-3.5 w-3.5 shrink-0" />
                    <span>Search</span>
                  </button>

                  {primaryItems.map((item) => {
                    const Icon = item.icon;
                    const active = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setActiveTab(item.id)}
                        className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[12px] font-medium transition-all whitespace-nowrap ${
                          active
                            ? 'border border-[#9312ff]/45 bg-[#9312ff]/20 text-[#f7f7f8] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]'
                            : 'border border-transparent text-[#8b8988] hover:bg-white/[0.04] hover:text-[#f7f7f8]'
                        }`}
                      >
                        <Icon
                          className={`h-3.5 w-3.5 shrink-0 ${active ? 'text-[#d49dff]' : ''}`}
                        />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    onClick={onToggleConnect}
                    className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[12px] font-medium text-[#8b8988] transition-colors hover:bg-white/[0.04] hover:text-[#f7f7f8] whitespace-nowrap"
                  >
                    <LogOut className="h-3.5 w-3.5 shrink-0" />
                    <span>{walletConnected ? 'Disconnect' : 'Reconnect'}</span>
                  </button>
                </nav>

                <div className="h-px bg-white/[0.06]" />

                {/* Secondary nav group */}
                <nav aria-label="Account navigation" className="space-y-0.5">
                  {secondaryItems.map((item) => {
                    const Icon = item.icon;
                    const active = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setActiveTab(item.id)}
                        className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[12px] font-medium transition-all whitespace-nowrap ${
                          active
                            ? 'border border-[#9312ff]/45 bg-[#9312ff]/20 text-[#f7f7f8]'
                            : 'border border-transparent text-[#8b8988] hover:bg-white/[0.04] hover:text-[#f7f7f8]'
                        }`}
                      >
                        <Icon
                          className={`h-3.5 w-3.5 shrink-0 ${active ? 'text-[#d49dff]' : ''}`}
                        />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Zapline Pro Promo Card */}
              <div className="mt-3 rounded-xl border border-[#9312ff]/30 bg-gradient-to-b from-[#9312ff]/16 to-[#0e0918]/90 p-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="text-[12px] font-semibold text-[#f7f7f8]">Zapline Pro</div>
                    <div className="text-[10px] text-[#8b8988]">Private validator lane</div>
                  </div>
                  <button
                    type="button"
                    onClick={onOpenUpgrade}
                    className="zap-btn-primary rounded-full px-2.5 py-1 text-[11px] font-medium text-white whitespace-nowrap shrink-0"
                  >
                    Upgrade
                  </button>
                </div>
              </div>
            </motion.aside>
          ) : (
            /* MOBILE HEADER + CHIPS */
            <div className="border-b border-white/[0.07] bg-white/[0.015] px-4 py-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#9312ff]/25 text-[#d49dff]">
                    <Zap className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-sm font-semibold text-[#f7f7f8]">Zapline</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onOpenUpgrade}
                    className="zap-btn-primary rounded-full px-3 py-1 text-xs font-medium text-white whitespace-nowrap"
                  >
                    Upgrade Pro
                  </button>
                </div>
              </div>

              <div className="zap-scroll mt-3 flex items-center gap-1.5 overflow-x-auto pb-1">
                {allMobileChips.map((chip) => {
                  const Icon = chip.icon;
                  const active = activeTab === chip.id;
                  return (
                    <button
                      key={chip.id}
                      type="button"
                      onClick={() => setActiveTab(chip.id)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                        active
                          ? 'border border-[#9312ff]/55 bg-[#9312ff]/25 text-[#f7f7f8]'
                          : 'border border-white/10 bg-white/[0.03] text-[#8b8988]'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span>{chip.label}</span>
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={onToggleConnect}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-[#8b8988] whitespace-nowrap shrink-0"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>{walletConnected ? 'Disconnect' : 'Reconnect'}</span>
                </button>
              </div>
            </div>
          )}

          {/* MAIN CONTENT */}
          <div className="min-w-0 flex-1 p-3.5 sm:px-5 sm:py-3.5">
            {/* Top bar */}
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.06] pb-2.5">
              <div className="flex items-center gap-2.5">
                {searchOpen ? (
                  <div className="flex items-center gap-2 rounded-lg border border-[#9312ff]/40 bg-black/50 px-2.5 py-1">
                    <Search className="h-3.5 w-3.5 text-[#8b8988]" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Filter snipes, wallets..."
                      aria-label="Filter dashboard"
                      className="w-40 bg-transparent text-xs text-[#f7f7f8] placeholder-[#8b8988] focus:outline-none"
                    />
                  </div>
                ) : (
                  <span className="text-xs font-medium text-[#8b8988]">
                    {activeTab === 'dashboard' && 'On-chain performance'}
                    {activeTab === 'snipes' && 'Automated snipe queue'}
                    {activeTab === 'wallets' && 'Connected execution vaults'}
                    {activeTab === 'referral' && 'Referral fee rebates'}
                    {activeTab === 'settings' && 'Execution & protection policy'}
                  </span>
                )}
              </div>

              {/* Small utility icons + Alex T. 0x3f4…9c7e */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAlertsEnabled((v) => !v)}
                  aria-label="Toggle execution alerts"
                  title={alertsEnabled ? 'Alerts active' : 'Alerts muted'}
                  className={`flex h-7 w-7 items-center justify-center rounded-lg border transition-colors ${
                    alertsEnabled
                      ? 'border-white/10 bg-white/[0.04] text-[#f7f7f8] hover:border-[#9312ff]/45'
                      : 'border-white/[0.06] bg-transparent text-[#8b8988]'
                  }`}
                >
                  <Bell className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setMevShield((v) => !v)}
                  aria-label="Toggle MEV protection"
                  title={mevShield ? 'MEV guard active' : 'MEV guard off'}
                  className={`flex h-7 w-7 items-center justify-center rounded-lg border transition-colors ${
                    mevShield
                      ? 'border-[#9312ff]/40 bg-[#9312ff]/15 text-[#d49dff]'
                      : 'border-white/[0.06] bg-transparent text-[#8b8988]'
                  }`}
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('settings')}
                  aria-label="Open preferences"
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-[#8b8988] transition-colors hover:border-[#9312ff]/45 hover:text-[#f7f7f8]"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                </button>

                <button
                  type="button"
                  onClick={handleCopyAddress}
                  className="ml-1 flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs transition-colors hover:border-[#9312ff]/45"
                >
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-br from-[#a020ff] to-[#7a1cf8] text-[9px] font-semibold text-white">
                    A
                  </span>
                  <span className="font-medium text-[#f7f7f8] whitespace-nowrap">
                    {walletConnected ? 'Alex T.' : 'Disconnected'}
                  </span>
                  <span className="text-[#8b8988] tabular-nums whitespace-nowrap">
                    {copiedAddress ? (
                      <span className="inline-flex items-center gap-1 text-[#45b558]">
                        <Check className="h-3 w-3" /> Copied
                      </span>
                    ) : walletConnected ? (
                      '0x3f4…9c7e'
                    ) : (
                      'Offline'
                    )}
                  </span>
                </button>
              </div>
            </div>

            {/* ACTIVE TAB BODY */}
            {activeTab === 'dashboard' ? (
              <div
                className={`grid gap-3.5 ${
                  isMobile ? 'grid-cols-1' : 'grid-cols-[minmax(0,1fr)_292px]'
                }`}
              >
                {/* Left Column: Stats + Chart */}
                <div className="flex min-w-0 flex-col gap-3">
                  {/* Stats Row */}
                  <motion.div
                    {...staggerItem(0.63)}
                    className="grid grid-cols-1 gap-3 sm:grid-cols-2"
                  >
                    <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-2.5">
                      <div className="text-[11px] text-[#8b8988]">
                        Revenue generated (since inception)
                      </div>
                      <div className="mt-1 flex items-baseline justify-between gap-2">
                        <span className="text-xl font-semibold tracking-tight text-[#f7f7f8] tabular-nums">
                          214,402
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-[#45b558] tabular-nums">
                          <TrendingUp className="h-3 w-3" />
                          +12.5%
                        </span>
                      </div>
                    </div>

                    <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-2.5">
                      <div className="text-[11px] text-[#8b8988]">Active wallets/users</div>
                      <div className="mt-1 flex items-baseline justify-between gap-2">
                        <span className="text-xl font-semibold tracking-tight text-[#f7f7f8] tabular-nums">
                          6412
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-[#f03b2a] tabular-nums">
                          <TrendingDown className="h-3 w-3" />
                          −3.1%
                        </span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Chart Card */}
                  <motion.div
                    {...staggerItem(0.71)}
                    className="rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-2.5"
                  >
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <span className="text-xs font-medium text-[#f7f7f8]">
                        Daily dynamics of sales
                      </span>
                      <div className="flex items-center gap-1 rounded-md border border-white/[0.08] bg-black/40 p-0.5">
                        {(['7D', '30D'] as const).map((tf) => (
                          <button
                            key={tf}
                            type="button"
                            onClick={() => setTimeframe(tf)}
                            className={`rounded px-2 py-0.5 text-[10px] font-medium transition-colors ${
                              timeframe === tf
                                ? 'bg-[#9312ff]/30 text-white'
                                : 'text-[#8b8988] hover:text-white'
                            }`}
                          >
                            {tf}
                          </button>
                        ))}
                      </div>
                    </div>
                    <SalesAreaChart timeframe={timeframe} />
                  </motion.div>
                </div>

                {/* Right Column: Calendar & Monthly Summary */}
                <motion.div
                  {...staggerItem(0.79)}
                  className="flex flex-col justify-between rounded-xl border border-white/[0.07] bg-white/[0.02] p-3.5"
                >
                  <div>
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="text-sm font-semibold text-[#f7f7f8]">January 2024</h3>
                      <button
                        type="button"
                        onClick={() =>
                          setCalendarPeriod((prev) =>
                            prev === 'Start date–Now (monthly)'
                              ? 'Last 30 days'
                              : 'Start date–Now (monthly)'
                          )
                        }
                        className="text-[11px] text-[#8b8988] transition-colors hover:text-[#d49dff] whitespace-nowrap"
                      >
                        {calendarPeriod}
                      </button>
                    </div>

                    <div className="mt-3 divide-y divide-white/[0.06]">
                      <div className="flex items-center justify-between py-2">
                        <span className="text-xs text-[#8b8988]">Total snipes</span>
                        <div className="flex items-center gap-2 tabular-nums">
                          <span className="text-xs font-semibold text-[#f7f7f8]">1,284</span>
                          <span className="text-[11px] font-medium text-[#45b558]">+8.4%</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between py-2">
                        <span className="text-xs text-[#8b8988]">Avg. execution</span>
                        <span className="text-xs font-semibold text-[#f7f7f8] tabular-nums">
                          0.42s
                        </span>
                      </div>

                      <div className="flex items-center justify-between py-2">
                        <span className="text-xs text-[#8b8988]">Win rate</span>
                        <div className="flex items-center gap-2 tabular-nums">
                          <span className="text-xs font-semibold text-[#f7f7f8]">68.2%</span>
                          <span className="text-[11px] font-medium text-[#45b558]">+2.1%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Connected apps row */}
                  <div className="mt-3 flex items-center justify-between border-t border-white/[0.06] pt-2.5 text-[11px]">
                    <span className="text-[#8b8988]">Connected apps:</span>
                    <div className="flex items-center gap-1.5 font-medium">
                      <button
                        type="button"
                        onClick={() =>
                          setConnectedApps((prev) => ({...prev, charting: !prev.charting}))
                        }
                        className={`transition-colors ${
                          connectedApps.charting ? 'text-[#f7f7f8]' : 'text-[#8b8988]/60 line-through'
                        }`}
                      >
                        Charting
                      </button>
                      <span className="text-[#8b8988]" aria-hidden="true">
                        ·
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setConnectedApps((prev) => ({...prev, terminals: !prev.terminals}))
                        }
                        className={`transition-colors ${
                          connectedApps.terminals ? 'text-[#f7f7f8]' : 'text-[#8b8988]/60 line-through'
                        }`}
                      >
                        Terminals
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            ) : activeTab === 'snipes' ? (
              <div className="space-y-2">
                {[
                  {pair: 'ETH / USDC', route: 'Private Relay #2', latency: '0.38s', pnl: '+14.2%', positive: true},
                  {pair: 'SOL / USDC', route: 'Terminal Bridge', latency: '0.41s', pnl: '+9.6%', positive: true},
                  {pair: 'ARB / ETH', route: 'Charting Inline', latency: '0.49s', pnl: '−1.4%', positive: false},
                ]
                  .filter((row) =>
                    row.pair.toLowerCase().includes(searchQuery.trim().toLowerCase())
                  )
                  .map((row) => (
                    <div
                      key={row.pair}
                      className="flex items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-3 text-xs"
                    >
                      <div>
                        <div className="font-semibold text-[#f7f7f8]">{row.pair}</div>
                        <div className="text-[11px] text-[#8b8988]">{row.route}</div>
                      </div>
                      <div className="flex items-center gap-5 tabular-nums">
                        <span className="text-[#8b8988]">{row.latency}</span>
                        <span
                          className={`font-semibold ${
                            row.positive ? 'text-[#45b558]' : 'text-[#f03b2a]'
                          }`}
                        >
                          {row.pnl}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            ) : activeTab === 'wallets' ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  {label: 'Primary Trading Vault', addr: '0x3f4…9c7e', bal: '$142,810', status: 'Active'},
                  {label: 'Cold Yield Reserve', addr: '0x8b1…44a2', bal: '$71,592', status: 'Standby'},
                ].map((w) => (
                  <div
                    key={w.addr}
                    className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-[#f7f7f8]">{w.label}</span>
                      <span className="text-[11px] text-[#45b558]">{w.status}</span>
                    </div>
                    <div className="mt-2 flex items-baseline justify-between tabular-nums">
                      <span className="text-lg font-semibold text-[#f7f7f8]">{w.bal}</span>
                      <span className="text-xs text-[#8b8988]">{w.addr}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : activeTab === 'referral' ? (
              <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="text-sm font-semibold text-[#f7f7f8]">
                      Desk Rebate Share: 25%
                    </div>
                    <div className="mt-0.5 text-xs text-[#8b8988]">
                      18 active referred wallets · $6,420 accrued rebates
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyAddress}
                    className="zap-btn-primary rounded-full px-4 py-1.5 text-xs font-medium text-white"
                  >
                    {copiedAddress ? 'Link Copied' : 'Copy Invite Link'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2.5 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 text-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-[#f7f7f8]">Private MEV Relay</div>
                    <div className="text-[11px] text-[#8b8988]">
                      Submit bundles directly to sealed block builders
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMevShield((v) => !v)}
                    className={`rounded-full px-3 py-1 font-medium transition-colors ${
                      mevShield
                        ? 'bg-[#9312ff]/30 text-white border border-[#9312ff]/55'
                        : 'bg-white/5 text-[#8b8988] border border-white/10'
                    }`}
                  >
                    {mevShield ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
                <div className="flex items-center justify-between border-t border-white/[0.06] pt-2.5">
                  <div>
                    <div className="font-medium text-[#f7f7f8]">Execution Alerts</div>
                    <div className="text-[11px] text-[#8b8988]">
                      Confirm fills and slippage triggers inline
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAlertsEnabled((v) => !v)}
                    className={`rounded-full px-3 py-1 font-medium transition-colors ${
                      alertsEnabled
                        ? 'bg-[#9312ff]/30 text-white border border-[#9312ff]/55'
                        : 'bg-white/5 text-[#8b8988] border border-white/10'
                    }`}
                  >
                    {alertsEnabled ? 'On' : 'Muted'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
