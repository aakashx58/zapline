'use client';

import {useEffect, useMemo, useRef, useState, useSyncExternalStore} from 'react';
import {motion} from 'motion/react';
import {Menu, X, Zap} from 'lucide-react';
import StarfieldCanvas from './StarfieldCanvas';
import PlanetRimCanvas from './PlanetRimCanvas';
import ZaplineDashboard from './ZaplineDashboard';
import ZaplineModals, {ModalKind} from './ZaplineModals';

const GLOW_VIDEO_URL =
  'https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/e859f229-8ebd-43fb-a5a0-58006ba75327.mp4';

const DESIGN_W = 1672;
const DESIGN_H = 941;

const NAV_ITEMS: Array<{label: string; modal: ModalKind}> = [
  {label: 'Home', modal: null},
  {label: 'Features', modal: 'features'},
  {label: 'Zapline Advantage', modal: 'advantage'},
  {label: 'Referral', modal: 'referral'},
  {label: 'FAQ', modal: 'faq'},
];

function subscribeViewport(cb: () => void) {
  window.addEventListener('resize', cb);
  return () => window.removeEventListener('resize', cb);
}

function getViewportSnapshot() {
  return `${window.innerWidth}x${window.innerHeight}`;
}

function getViewportServerSnapshot() {
  return '1440x960';
}

function subscribeReducedMotion(cb: () => void) {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
}

function getReducedMotionSnapshot() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

export default function ZaplineHero() {
  const viewportKey = useSyncExternalStore(
    subscribeViewport,
    getViewportSnapshot,
    getViewportServerSnapshot
  );
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  const viewport = useMemo(() => {
    const [wStr, hStr] = viewportKey.split('x');
    return {
      vw: Number(wStr) || 1440,
      vh: Number(hStr) || 960,
    };
  }, [viewportKey]);

  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [activeNav, setActiveNav] = useState('Home');
  const [activeModal, setActiveModal] = useState<ModalKind>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [walletConnected, setWalletConnected] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const isMobileLayout = viewport.vw < 900 || viewport.vh > viewport.vw;
  const scale = Math.min(viewport.vw / DESIGN_W, viewport.vh / DESIGN_H);
  const stageTopOffset = Math.max(0, (viewport.vh - DESIGN_H * scale) / 2);
  const stageLeftOffset = Math.max(0, (viewport.vw - DESIGN_W * scale) / 2);

  // Stretch dashboard panel cleanly down to the bottom edge of the viewport
  const dashboardMinHeight = Math.max(
    300,
    Math.ceil((viewport.vh - stageTopOffset) / Math.max(scale, 0.2) - 651 + 8)
  );

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid || isMobileLayout || reducedMotion) return;
    const onReady = () => setVideoReady(true);
    if (vid.readyState >= 3) {
      queueMicrotask(onReady);
    }
    const playPromise = vid.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {
        // Autoplay blocked or failed; fallback canvas remains visible
      });
    }
  }, [isMobileLayout, reducedMotion]);

  const handleNavClick = (label: string, modal: ModalKind) => {
    setActiveNav(label);
    setActiveModal(modal);
    setMobileMenuOpen(false);
  };

  // Motion presets (zero motion when prefers-reduced-motion is active)
  const navAnim = reducedMotion
    ? {}
    : {
        initial: {opacity: 0, y: -14},
        animate: {opacity: 1, y: 0},
        transition: {duration: 0.48, ease: [0.16, 1, 0.3, 1] as const},
      };

  const line1Anim = reducedMotion
    ? {}
    : {
        initial: {opacity: 0, y: 28, clipPath: 'inset(0 0 100% 0)'},
        animate: {opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)'},
        transition: {duration: 0.56, delay: 0.14, ease: [0.16, 1, 0.3, 1] as const},
      };

  const line2Anim = reducedMotion
    ? {}
    : {
        initial: {opacity: 0, y: 28, clipPath: 'inset(0 0 100% 0)'},
        animate: {opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)'},
        transition: {duration: 0.56, delay: 0.24, ease: [0.16, 1, 0.3, 1] as const},
      };

  const ledeAnim = reducedMotion
    ? {}
    : {
        initial: {opacity: 0, y: 16},
        animate: {opacity: 1, y: 0},
        transition: {duration: 0.5, delay: 0.34, ease: [0.16, 1, 0.3, 1] as const},
      };

  const ctaAnim = reducedMotion
    ? {}
    : {
        initial: {opacity: 0, y: 14},
        animate: {opacity: 1, y: 0},
        transition: {duration: 0.46, delay: 0.42, ease: [0.16, 1, 0.3, 1] as const},
      };

  const dashboardAnim = reducedMotion
    ? {}
    : {
        initial: {opacity: 0, y: 42},
        animate: {opacity: 1, y: 0},
        transition: {duration: 0.65, delay: 0.48, ease: [0.16, 1, 0.3, 1] as const},
      };

  return (
    <div
      className={`relative w-full bg-black text-[#f7f7f8] ${
        isMobileLayout
          ? 'min-h-screen overflow-x-hidden overflow-y-auto'
          : 'h-screen overflow-hidden'
      }`}
    >
      {/* Fixed procedural starfield across full viewport */}
      <StarfieldCanvas />

      {!isMobileLayout ? (
        /* DESKTOP: 1672x941 design stage scaled by min(vw/1672, vh/941) & centred */
        <main
          className="relative z-10 origin-top-left"
          style={{
            width: `${DESIGN_W}px`,
            height: `${DESIGN_H}px`,
            transform: `translate3d(${stageLeftOffset}px, ${stageTopOffset}px, 0) scale(${scale})`,
          }}
        >
          {/* Planet Rim Sky Layer (1672x717 at top of stage) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-0 z-0 h-[717px] w-[1672px]"
            style={{
              WebkitMaskImage:
                'radial-gradient(ellipse 92% 90% at 50% 38%, black 60%, transparent 100%)',
              maskImage:
                'radial-gradient(ellipse 92% 90% at 50% 38%, black 60%, transparent 100%)',
            }}
          >
            {/* Polar colour-table canvas fallback (visible until video is ready or when reduced motion) */}
            <div
              className="absolute inset-0 transition-opacity duration-700"
              style={{
                opacity: !reducedMotion && videoReady && !videoFailed ? 0 : 1,
              }}
            >
              <PlanetRimCanvas width={1672} height={717} className="h-full w-full" />
            </div>

            {/* Desktop Glow Video with screen blend mode */}
            {!reducedMotion && !videoFailed && (
              <video
                ref={videoRef}
                src={GLOW_VIDEO_URL}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                onCanPlay={() => setVideoReady(true)}
                onLoadedData={() => setVideoReady(true)}
                onError={() => setVideoFailed(true)}
                style={{
                  mixBlendMode: 'screen',
                  opacity: videoReady ? 1 : 0,
                  transition: 'opacity 0.8s ease-out',
                }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}
          </div>

          {/* Top Navigation Bar */}
          <motion.header
            {...navAnim}
            className="absolute left-[234px] top-[34px] z-20 flex w-[1204px] items-center justify-between gap-8"
          >
            {/* Left: Violet lightning-bolt logo */}
            <a
              href="#top"
              onClick={(e) => {
                e.preventDefault();
                setActiveNav('Home');
                setActiveModal(null);
              }}
              className="group flex items-center gap-2.5 whitespace-nowrap shrink-0"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#9312ff]/55 bg-[#9312ff]/20 shadow-[0_0_20px_rgba(147,18,255,0.45)] transition-transform duration-200 group-hover:scale-105">
                <Zap className="h-5 w-5 text-[#c87dff] drop-shadow-[0_0_8px_rgba(160,32,255,0.9)]" />
              </span>
              <span className="font-display-grotesk text-[18px] font-bold tracking-tight text-[#f7f7f8]">
                Zapline
              </span>
            </a>

            {/* Centered menu */}
            <nav
              aria-label="Primary navigation"
              className="flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-black/50 p-1 backdrop-blur-md"
            >
              {NAV_ITEMS.map((item) => {
                const isActive = activeNav === item.label;
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => handleNavClick(item.label, item.modal)}
                    className={`rounded-full px-4 py-1.5 text-[14px] font-medium transition-colors whitespace-nowrap shrink-0 ${
                      isActive
                        ? 'bg-white/[0.11] text-[#f7f7f8] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]'
                        : 'text-[#8b8988] hover:text-[#f7f7f8]'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {/* Right: Violet Get Started pill */}
            <button
              type="button"
              onClick={() => setActiveModal('get-started')}
              className="zap-btn-primary rounded-full px-5 py-2.5 text-[14px] font-medium text-white whitespace-nowrap shrink-0"
            >
              Get Started
            </button>
          </motion.header>

          {/* Hero Copy & CTAs */}
          <section className="absolute left-0 top-[218px] z-20 flex w-full flex-col items-center px-12 text-center">
            <h1 className="font-display-grotesk text-[84px] font-bold leading-[1.03] tracking-[-0.035em] text-[#f7f7f8]">
              <motion.span {...line1Anim} className="block">
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      'linear-gradient(95deg, #e7c6ff 0%, #b44cff 45%, #8419ff 100%)',
                  }}
                >
                  Zapline
                </span>{' '}
                Trade Smarter,
              </motion.span>
              <motion.span {...line2Anim} className="block">
                Faster, Safer.
              </motion.span>
            </h1>

            <motion.p
              {...ledeAnim}
              className="mt-6 max-w-[780px] text-[18px] font-normal leading-[1.55] text-[#a7a4ad]"
            >
              The first fully integrated on-chain trading experience. No dashboards, no delays —
              Zapline empowers you
              <br />
              to trade directly from your favorite DeFi apps and terminals.
            </motion.p>

            <motion.div {...ctaAnim} className="mt-8 flex items-center justify-center gap-3.5">
              <button
                type="button"
                onClick={() => setActiveModal('get-started')}
                className="zap-btn-primary rounded-full px-7 py-3 text-[15px] font-medium text-white whitespace-nowrap"
              >
                Get Started
              </button>
              <button
                type="button"
                onClick={() => setActiveModal('learn-more')}
                className="zap-btn-secondary rounded-full px-7 py-3 text-[15px] font-medium text-[#f7f7f8] whitespace-nowrap"
              >
                Learn More
              </button>
            </motion.div>
          </section>

          {/* Dashboard Panel (1204px wide, from y = 651) */}
          <motion.section
            {...dashboardAnim}
            aria-label="Zapline product dashboard preview"
            className="absolute left-[234px] top-[651px] z-20 w-[1204px]"
          >
            <ZaplineDashboard
              isMobile={false}
              reducedMotion={reducedMotion}
              walletConnected={walletConnected}
              onToggleConnect={() => setWalletConnected((v) => !v)}
              onOpenUpgrade={() => setActiveModal('upgrade')}
              minHeightPx={dashboardMinHeight}
            />
          </motion.section>
        </main>
      ) : (
        /* MOBILE / PORTRAIT (< 900px or portrait): Stacked Layout */
        <div className="relative z-10 flex min-h-screen w-full flex-col">
          {/* Cropped Planet Rim Canvas across top */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[280px] overflow-hidden"
          >
            <PlanetRimCanvas
              width={Math.max(360, viewport.vw)}
              height={280}
              className="h-full w-full"
            />
          </div>

          {/* Mobile Nav Header (compact, under 15% sticky cap) */}
          <header className="relative z-30 flex items-center justify-between px-4 py-3.5">
            <a
              href="#top"
              onClick={(e) => {
                e.preventDefault();
                setActiveNav('Home');
                setActiveModal(null);
              }}
              className="flex items-center gap-2 whitespace-nowrap shrink-0"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#9312ff]/55 bg-[#9312ff]/20">
                <Zap className="h-4 w-4 text-[#c87dff]" />
              </span>
              <span className="font-display-grotesk text-base font-bold tracking-tight text-[#f7f7f8]">
                Zapline
              </span>
            </a>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveModal('get-started')}
                className="zap-btn-primary rounded-full px-3.5 py-1.5 text-xs font-medium text-white whitespace-nowrap"
              >
                Get Started
              </button>
              <button
                type="button"
                onClick={() => setMobileMenuOpen((v) => !v)}
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-black/60 text-[#f7f7f8] backdrop-blur-md"
              >
                {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            </div>
          </header>

          {/* Mobile Drawer Menu */}
          {mobileMenuOpen && (
            <nav
              aria-label="Mobile navigation"
              className="relative z-30 mx-4 mb-3 flex flex-col gap-1 rounded-xl border border-[#9312ff]/35 bg-[#090611]/95 p-2 backdrop-blur-xl"
            >
              {NAV_ITEMS.map((item) => {
                const isActive = activeNav === item.label;
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => handleNavClick(item.label, item.modal)}
                    className={`rounded-lg px-3 py-2 text-left text-sm font-medium ${
                      isActive ? 'bg-white/[0.1] text-white' : 'text-[#8b8988]'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>
          )}

          {/* Mobile Hero Copy */}
          <main className="relative z-20 flex flex-1 flex-col items-center px-5 pt-10 text-center">
            <h1 className="font-display-grotesk text-[42px] font-bold leading-[1.06] tracking-[-0.03em] text-[#f7f7f8] sm:text-[54px]">
              <span
                className="block bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    'linear-gradient(95deg, #e7c6ff 0%, #b44cff 45%, #8419ff 100%)',
                }}
              >
                Zapline
              </span>
              <span className="block">Trade Smarter,</span>
              <span className="block">Faster, Safer.</span>
            </h1>

            <p className="mt-4 max-w-md text-sm leading-relaxed text-[#a7a4ad] sm:text-base">
              The first fully integrated on-chain trading experience. No dashboards, no delays —
              Zapline empowers you to trade directly from your favorite DeFi apps and terminals.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setActiveModal('get-started')}
                className="zap-btn-primary rounded-full px-6 py-2.5 text-sm font-medium text-white whitespace-nowrap"
              >
                Get Started
              </button>
              <button
                type="button"
                onClick={() => setActiveModal('learn-more')}
                className="zap-btn-secondary rounded-full px-6 py-2.5 text-sm font-medium text-[#f7f7f8] whitespace-nowrap"
              >
                Learn More
              </button>
            </div>

            {/* Mobile Scrolling Dashboard Column */}
            <section
              aria-label="Zapline mobile dashboard preview"
              className="mt-10 w-full max-w-2xl pb-6 text-left"
            >
              <ZaplineDashboard
                isMobile={true}
                reducedMotion={reducedMotion}
                walletConnected={walletConnected}
                onToggleConnect={() => setWalletConnected((v) => !v)}
                onOpenUpgrade={() => setActiveModal('upgrade')}
              />
            </section>
          </main>
        </div>
      )}

      {/* Interactive Modals */}
      <ZaplineModals
        activeModal={activeModal}
        onClose={() => {
          setActiveModal(null);
          setActiveNav('Home');
        }}
        onConnectWallet={() => setWalletConnected(true)}
        walletConnected={walletConnected}
      />
    </div>
  );
}
