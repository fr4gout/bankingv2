import type { ReactNode } from "react";

/**
 * Fixed NUI canvas frame. In a real FiveM resource the browser is fullscreen
 * at the display's native resolution, so we render a 16:9 canvas that scales
 * to fit the viewport while preserving the layout.
 */
export function CanvasFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#060810]">
      {/* ambient bg flares */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(900px circle at 15% 20%, rgba(107,191,255,0.10), transparent 50%), radial-gradient(700px circle at 90% 90%, rgba(120,80,255,0.08), transparent 55%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(107,191,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(107,191,255,0.5) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="relative mx-auto flex min-h-screen w-full max-w-[1480px] flex-col px-6 py-6">
        {children}
      </div>
    </div>
  );
}
