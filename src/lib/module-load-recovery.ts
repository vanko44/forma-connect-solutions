const RECOVERY_KEY = "forma-module-recovery";
const RETRY_WINDOW_MS = 60_000;

export function isModuleLoadError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return /Importing a module script failed|Failed to fetch dynamically imported module|error loading dynamically imported module|Unable to preload CSS/i.test(message);
}

export function canRetryModuleLoad(lastAttempt: number, now: number): boolean {
  return !Number.isFinite(lastAttempt) || now - lastAttempt > RETRY_WINDOW_MS;
}

export function recoverModuleLoad(error: unknown): boolean {
  if (typeof window === "undefined" || !isModuleLoadError(error)) return false;
  try {
    const stored = window.sessionStorage.getItem(RECOVERY_KEY);
    const lastAttempt = stored === null ? NaN : Number(stored);
    if (!canRetryModuleLoad(lastAttempt, Date.now())) return false;
    window.sessionStorage.setItem(RECOVERY_KEY, String(Date.now()));
    window.location.reload();
    return true;
  } catch {
    return false;
  }
}

let registered = false;
export function registerModuleLoadRecovery() {
  if (typeof window === "undefined" || registered) return;
  registered = true;
  window.addEventListener("vite:preloadError", (event) => {
    const payload = (event as Event & { payload?: unknown }).payload;
    if (recoverModuleLoad(payload)) event.preventDefault();
  });
}