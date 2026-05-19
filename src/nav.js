// Tiny navigator: 4 root tabs + a screen stack pushed on top. Dependency-free
// so it behaves identically on web and native.
import React, { createContext, useContext, useState, useCallback } from 'react';

const NavCtx = createContext(null);
export const useNav = () => useContext(NavCtx);

export function NavProvider({ children }) {
  const [tab, setTab] = useState('home');
  const [stack, setStack] = useState([]); // [{ screen, params }]

  const navigate = useCallback((screen, params = {}) => {
    setStack((s) => [...s, { screen, params }]);
  }, []);
  const goBack = useCallback(() => setStack((s) => s.slice(0, -1)), []);
  const reset = useCallback((t = 'home') => { setStack([]); setTab(t); }, []);
  const switchTab = useCallback((t) => { setStack([]); setTab(t); }, []);

  const top = stack[stack.length - 1] || null;

  return (
    <NavCtx.Provider value={{ tab, stack, top, navigate, goBack, reset, switchTab }}>
      {children}
    </NavCtx.Provider>
  );
}
