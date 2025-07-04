
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PortalContextType {
  foundPortals: number[];
  markPortalAsFound: (portalId: number) => void;
}

const PortalContext = createContext<PortalContextType | undefined>(undefined);

export const usePortalContext = () => {
  const context = useContext(PortalContext);
  if (!context) {
    throw new Error('usePortalContext must be used within a PortalProvider');
  }
  return context;
};

interface PortalProviderProps {
  children: ReactNode;
}

export const PortalProvider: React.FC<PortalProviderProps> = ({ children }) => {
  const [foundPortals, setFoundPortals] = useState<number[]>([]);

  const markPortalAsFound = (portalId: number) => {
    setFoundPortals(prev => {
      if (!prev.includes(portalId)) {
        return [...prev, portalId];
      }
      return prev;
    });
  };

  return (
    <PortalContext.Provider value={{ foundPortals, markPortalAsFound }}>
      {children}
    </PortalContext.Provider>
  );
};
