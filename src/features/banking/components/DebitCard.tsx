import { useRef, useState } from "react";
import type { MouseEvent } from "react";
import { Wifi } from "lucide-react";
import { maskIban } from "../hooks/useCurrency";

interface DebitCardProps {
  holderName: string;
  iban: string;
  balance: string;
  server?: string;
}

export function DebitCard({ holderName, iban, balance, server = "LIBERTY ROLEPLAY" }: DebitCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: -py * 10, y: px * 14 });
  };
  const onLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <div className="[perspective:1200px]">
      <div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="relative aspect-[1.586/1] w-full rounded-3xl p-6 text-white transition-transform duration-200 ease-out will-change-transform"
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          background:
            "linear-gradient(135deg, #0a1530 0%, #122149 35%, #1b3a78 60%, #6BBFFF 130%)",
          boxShadow:
            "0 30px 60px -20px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.12), 0 0 0 1px rgba(107,191,255,0.18)",
        }}
      >
        {/* shine layer */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-3xl opacity-60 mix-blend-screen"
          style={{
            background:
              "radial-gradient(600px circle at var(--mx,30%) var(--my,20%), rgba(255,255,255,0.18), transparent 40%)",
          }}
        />
        <div className="relative flex h-full flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-white/60">{server}</div>
              <div className="mt-1 text-xs font-medium text-white/80">Pacific Standard Bank</div>
            </div>
            <Wifi className="h-5 w-5 -rotate-90 text-white/80" />
          </div>

          {/* chip */}
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-12 rounded-md"
              style={{
                background:
                  "linear-gradient(135deg, #d4af37 0%, #f6e6a8 50%, #b88a1a 100%)",
                boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.2)",
              }}
            >
              <div className="grid h-full grid-cols-3 gap-px p-1 opacity-70">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="rounded-[1px] bg-black/20" />
                ))}
              </div>
            </div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-white/60">Debit</div>
          </div>

          <div className="font-mono text-lg tracking-[0.25em] text-white/90">{maskIban(iban)}</div>

          <div className="flex items-end justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-white/50">Card Holder</div>
              <div className="text-sm font-semibold uppercase tracking-wide">{holderName}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-[0.2em] text-white/50">Balance</div>
              <div className="text-base font-semibold">{balance}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
