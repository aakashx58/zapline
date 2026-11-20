'use client';

import {useEffect, useState} from 'react';
import {Check, ChevronRight, Lock, Shield, Terminal, X, Zap} from 'lucide-react';

export type ModalKind =
  | null
  | 'get-started'
  | 'learn-more'
  | 'features'
  | 'advantage'
  | 'referral'
  | 'faq'
  | 'upgrade';

interface ZaplineModalsProps {
  activeModal: ModalKind;
  onClose: () => void;
  onConnectWallet: (method: string) => void;
  walletConnected: boolean;
}

const MODAL_COPY: Record<
  Exclude<ModalKind, null | 'get-started' | 'upgrade'>,
  {title: string; subtitle: string; items: Array<{heading: string; body: string; metric?: string}>}
> = {
  'learn-more': {
    title: 'Zapline Inline Execution Architecture',
    subtitle:
      'Execute protected swaps, limit triggers, and snipes directly inside any DeFi interface without tab-switching.',
    items: [
      {
        heading: 'Zero-Dashboard Overlay',
        body: 'Trade directly from charting surfaces and terminal feeds with a unified keybinding and signing layer.',
        metric: '0.42s avg',
      },
      {
        heading: 'Private Orderflow Routing',
        body: 'Transactions route through sealed validator relays to prevent sandwich attacks and mempool leakage.',
        metric: '99.4% MEV shield',
      },
      {
        heading: 'Deterministic Slippage Guard',
        body: 'Pre-flight state simulation verifies exact output bounds before a single signature is requested.',
        metric: '0 failed fills',
      },
    ],
  },
  features: {
    title: 'Built-In Trading Capabilities',
    subtitle: 'Every primitive required for high-frequency on-chain execution, embedded cleanly in your workflow.',
    items: [
      {
        heading: 'Sub-Second Liquidity Snipes',
        body: 'Trigger automated pool entries on verified contract deployments with custom gas ceilings.',
        metric: '1,284 fills',
      },
      {
        heading: 'Multi-Wallet Split Orders',
        body: 'Distribute position sizing across cold and hot execution vaults in one atomic batch.',
        metric: 'Up to 12 wallets',
      },
      {
        heading: 'Live PnL & Tax Ledger',
        body: 'Track realized performance, gas overhead, and win rates across every integrated terminal.',
        metric: '68.2% win rate',
      },
    ],
  },
  advantage: {
    title: 'The Zapline Advantage',
    subtitle: 'Why on-chain desks replace fragmented web dashboards with Zapline inline execution.',
    items: [
      {
        heading: 'Direct RPC Co-Location',
        body: 'Edge-routed submission nodes cut broadcast latency compared to public wallet RPC endpoints.',
        metric: '4.3x faster',
      },
      {
        heading: 'Unified Security Policy',
        body: 'Set per-session spend limits, token allowlists, and hardware confirmations across every connected app.',
        metric: 'Zero blind signs',
      },
      {
        heading: 'Cross-App State Sync',
        body: 'Positions opened from charting views sync immediately to your terminal order book and analytics.',
        metric: 'Real-time sync',
      },
    ],
  },
  referral: {
    title: 'Zapline Referral Program',
    subtitle: 'Share routing rebates with your trading desk and earn protocol fee shares on every executed swap.',
    items: [
      {
        heading: '25% Execution Fee Share',
        body: 'Earn recurring on-chain rebates whenever invited traders route volume through Zapline.',
        metric: 'Instant claim',
      },
      {
        heading: '10% Fee Discount for Invites',
        body: 'Anyone joining via your desk link receives reduced routing fees for their first 90 days.',
        metric: '90-day boost',
      },
    ],
  },
  faq: {
    title: 'Frequently Asked Questions',
    subtitle: 'Key operational details on custody, supported terminals, and routing protection.',
    items: [
      {
        heading: 'Does Zapline ever hold user keys?',
        body: 'No. Signing stays 100% local in your hardware signer or browser key vault. Zapline only simulates and routes signed payloads.',
      },
      {
        heading: 'Which DeFi apps are supported?',
        body: 'Zapline integrates natively with standard EVM charting overlays and standalone on-chain terminals.',
      },
      {
        heading: 'How is 0.42s average execution measured?',
        body: 'Measured end-to-end from signature confirmation to block inclusion across our private relay network.',
      },
    ],
  },
};

export default function ZaplineModals({
  activeModal,
  onClose,
  onConnectWallet,
  walletConnected,
}: ZaplineModalsProps) {
  const [selectedMode, setSelectedMode] = useState<'extension' | 'hardware' | 'terminal'>('extension');
  const [upgraded, setUpgraded] = useState(false);

  useEffect(() => {
    if (!activeModal) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeModal, onClose]);

  if (!activeModal) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-[#9312ff]/40 bg-[#0b0812]/95 p-6 text-[#f7f7f8] shadow-[0_24px_80px_rgba(147,18,255,0.28)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top violet hairline */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, #9312ff 50%, transparent 100%)',
          }}
        />

        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-[#8b8988] transition-colors hover:border-[#9312ff]/50 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        {activeModal === 'get-started' ? (
          <div>
            <div className="mb-4 flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#9312ff]/20 text-[#c988ff]">
                <Zap className="h-4 w-4" />
              </div>
              <div>
                <h2 className="font-display-grotesk text-xl font-bold tracking-tight text-[#f7f7f8]">
                  Get Started with Zapline
                </h2>
                <p className="text-xs text-[#8b8988]">
                  Choose how you want to route on-chain trades
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              {[
                {
                  id: 'extension' as const,
                  title: 'Browser Inline Overlay',
                  desc: 'Inject execution controls directly into Charting & DEX views.',
                  icon: Zap,
                },
                {
                  id: 'hardware' as const,
                  title: 'Hardware Vault Signer',
                  desc: 'Pair an offline key for policy-guarded 1-click confirmations.',
                  icon: Shield,
                },
                {
                  id: 'terminal' as const,
                  title: 'Terminal Relay Key',
                  desc: 'Connect CLI or custom trading terminals via private RPC.',
                  icon: Terminal,
                },
              ].map((option) => {
                const Icon = option.icon;
                const active = selectedMode === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setSelectedMode(option.id)}
                    className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-all ${
                      active
                        ? 'border-[#9312ff]/70 bg-[#9312ff]/15 shadow-[0_0_20px_rgba(147,18,255,0.2)]'
                        : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`h-4 w-4 shrink-0 ${active ? 'text-[#d49dff]' : 'text-[#8b8988]'}`}
                      />
                      <div>
                        <div className="text-sm font-medium text-[#f7f7f8]">{option.title}</div>
                        <div className="text-xs text-[#8b8988]">{option.desc}</div>
                      </div>
                    </div>
                    {active && <Check className="h-4 w-4 shrink-0 text-[#45b558]" />}
                  </button>
                );
              })}
            </div>

            <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
              <div className="text-xs text-[#8b8988]">
                {walletConnected ? (
                  <span className="text-[#45b558]">Active session: Alex T. (0x3f4…9c7e)</span>
                ) : (
                  <span>Session disconnected</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  onConnectWallet(selectedMode);
                  onClose();
                }}
                className="zap-btn-primary inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-medium text-white whitespace-nowrap"
              >
                {walletConnected ? 'Sync Active Workspace' : 'Connect 0x3f4…9c7e'}
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : activeModal === 'upgrade' ? (
          <div>
            <div className="mb-4 flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#9312ff]/25 text-[#d49dff]">
                <Lock className="h-4 w-4" />
              </div>
              <div>
                <h2 className="font-display-grotesk text-xl font-bold tracking-tight text-[#f7f7f8]">
                  Zapline Pro
                </h2>
                <p className="text-xs text-[#8b8988]">
                  Dedicated private validator lane and multi-wallet parallel sniping
                </p>
              </div>
            </div>

            <div className="space-y-2.5 rounded-xl border border-white/10 bg-white/[0.02] p-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-[#f7f7f8]">Execution speed target</span>
                <span className="font-semibold text-[#45b558] tabular-nums">&lt; 180ms</span>
              </div>
              <div className="flex items-center justify-between border-t border-white/[0.06] pt-2.5">
                <span className="text-[#f7f7f8]">Parallel snipe slots</span>
                <span className="font-semibold text-[#f7f7f8] tabular-nums">Unlimited</span>
              </div>
              <div className="flex items-center justify-between border-t border-white/[0.06] pt-2.5">
                <span className="text-[#f7f7f8]">MEV protection refund</span>
                <span className="font-semibold text-[#f7f7f8] tabular-nums">100% gas covered</span>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="zap-btn-secondary rounded-full px-4 py-2 text-sm font-medium text-[#f7f7f8]"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => setUpgraded(true)}
                className="zap-btn-primary rounded-full px-5 py-2 text-sm font-medium text-white"
              >
                {upgraded ? 'Pro Trial Activated' : 'Activate Pro Pass'}
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="font-display-grotesk pr-8 text-xl font-bold tracking-tight text-[#f7f7f8]">
              {MODAL_COPY[activeModal].title}
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-[#8b8988]">
              {MODAL_COPY[activeModal].subtitle}
            </p>

            <div className="mt-5 space-y-3">
              {MODAL_COPY[activeModal].items.map((item) => (
                <div
                  key={item.heading}
                  className="rounded-xl border border-white/10 bg-white/[0.025] p-3.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-[#f7f7f8]">{item.heading}</h3>
                    {item.metric && (
                      <span className="text-xs font-medium text-[#c988ff] tabular-nums">
                        {item.metric}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-[#8b8988]">{item.body}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="zap-btn-primary rounded-full px-5 py-2 text-sm font-medium text-white"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
