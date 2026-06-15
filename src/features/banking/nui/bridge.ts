/**
 * FiveM NUI bridge.
 *
 * Drop-in usage from a FiveM resource:
 *   - The Lua side sends UI messages via SendNUIMessage({ action = 'setVisible', data = true })
 *   - The UI talks back via fetch('https://<resource>/<action>', { method: 'POST', body })
 *
 * Expected outbound actions (UI -> client.lua):
 *   close, deposit, withdraw, transfer, payInvoice, switchAccount
 *
 * Expected inbound actions (client.lua -> UI):
 *   setVisible, setCharacter, setAccounts, pushTransaction, pushInvoice
 *
 * In a normal browser preview, fetchNui resolves with { ok: true, preview: true }
 * so the UI never breaks when GetParentResourceName is not present.
 */
import { useEffect } from "react";

declare global {
  interface Window {
    GetParentResourceName?: () => string;
    invokeNative?: (...args: unknown[]) => void;
  }
}

export const isNuiEnvironment = (): boolean =>
  typeof window !== "undefined" && typeof window.GetParentResourceName === "function";

export const getResourceName = (): string =>
  (typeof window !== "undefined" && window.GetParentResourceName?.()) || "banking-ui";

export async function fetchNui<TResponse = unknown, TPayload = unknown>(
  action: string,
  data?: TPayload,
): Promise<TResponse | { ok: true; preview: true }> {
  if (!isNuiEnvironment()) {
    // Browser preview: echo back so the UI flow continues.
    return { ok: true, preview: true } as const;
  }
  try {
    const res = await fetch(`https://${getResourceName()}/${action}`, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=UTF-8" },
      body: JSON.stringify(data ?? {}),
    });
    return (await res.json()) as TResponse;
  } catch (err) {
    console.warn(`[NUI] ${action} failed`, err);
    return { ok: true, preview: true } as const;
  }
}

export interface NuiMessage<T = unknown> {
  action: string;
  data: T;
}

export function useNuiEvent<T = unknown>(action: string, handler: (data: T) => void) {
  useEffect(() => {
    const listener = (event: MessageEvent<NuiMessage<T>>) => {
      const payload = event.data;
      if (payload && payload.action === action) handler(payload.data);
    };
    window.addEventListener("message", listener);
    return () => window.removeEventListener("message", listener);
  }, [action, handler]);
}
