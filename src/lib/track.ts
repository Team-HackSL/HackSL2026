/**
 * Fires a best-effort engagement beacon to the analytics endpoint.
 *
 * Uses `navigator.sendBeacon` so the request survives the page navigation that
 * follows a card click (a normal `fetch` would be cancelled when the browser
 * unloads the page). Falls back to a keepalive fetch where sendBeacon is
 * unavailable. Any failure is silently ignored - analytics must never get in
 * the way of the user's click.
 */
export function trackEngagement(payload: {
  type: "blog" | "hackathon";
  event: "view" | "click";
  id: string;
}): void {
  if (typeof navigator === "undefined") return;
  try {
    const body = JSON.stringify(payload);
    if (typeof navigator.sendBeacon === "function") {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon("/api/analytics", blob);
      return;
    }
    void fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    });
  } catch {
    // Ignore - tracking is non-critical.
  }
}
