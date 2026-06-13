"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { Profile } from "@/lib/portal-api";
import { getMe, getToken, clearToken } from "@/lib/portal-api";

interface PortalContextValue {
  profile: Profile | null;
  loading: boolean;
  setProfile: (p: Profile | null) => void;
  refresh: () => Promise<void>;
  logout: () => void;
}

const PortalContext = createContext<PortalContextValue | undefined>(undefined);

export function PortalProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!getToken()) {
      setProfile(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      setProfile(await getMe());
    } catch {
      // token invalid/expired
      clearToken();
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setProfile(null);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return (
    <PortalContext.Provider value={{ profile, loading, setProfile, refresh, logout }}>
      {children}
    </PortalContext.Provider>
  );
}

export function usePortal(): PortalContextValue {
  const ctx = useContext(PortalContext);
  if (!ctx) throw new Error("usePortal must be used within a PortalProvider");
  return ctx;
}
