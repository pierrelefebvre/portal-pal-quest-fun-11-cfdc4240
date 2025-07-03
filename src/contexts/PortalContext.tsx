
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Portal {
  id: number;
  name: string;
  found: boolean;
  x: number;
  y: number;
  hint: string;
  lat: number;
  lon: number;
}

interface PortalContextType {
  portals: Portal[];
  markPortalAsFound: (portalId: number) => void;
  getPortalById: (portalId: number) => Portal | undefined;
}

const PortalContext = createContext<PortalContextType | undefined>(undefined);

const initialPortals: Portal[] = [
  { id: 1, name: "Place Jean Jaurès", found: false, x: 50, y: 50, hint: "Au centre de la place", lat: 50.67648, lon: 3.15159 },
  { id: 2, name: "Parc Barbieux", found: false, x: 30, y: 30, hint: "Près de l'étang", lat: 50.67204, lon: 3.14502 },
  { id: 3, name: "Église Saint-Martin", found: true, x: 60, y: 45, hint: "Devant le parvis", lat: 50.67801, lon: 3.15298 },
  { id: 4, name: "Mairie de Croix", found: false, x: 45, y: 55, hint: "À l'entrée principale", lat: 50.67502, lon: 3.15001 },
  { id: 5, name: "Stade Amédée Prouvost", found: false, x: 70, y: 70, hint: "Près du terrain", lat: 50.68001, lon: 3.15798 },
  { id: 6, name: "Decathlon", found: false, x: 100, y: 100, hint: "proche d'ynov", lat: 50.67289594117399, lon: 3.148318881734259 },
];

export const PortalProvider = ({ children }: { children: ReactNode }) => {
  const [portals, setPortals] = useState<Portal[]>(initialPortals);

  const markPortalAsFound = (portalId: number) => {
    setPortals(prevPortals => 
      prevPortals.map(portal => 
        portal.id === portalId ? { ...portal, found: true } : portal
      )
    );
  };

  const getPortalById = (portalId: number) => {
    return portals.find(portal => portal.id === portalId);
  };

  return (
    <PortalContext.Provider value={{ portals, markPortalAsFound, getPortalById }}>
      {children}
    </PortalContext.Provider>
  );
};

export const usePortals = () => {
  const context = useContext(PortalContext);
  if (context === undefined) {
    throw new Error('usePortals must be used within a PortalProvider');
  }
  return context;
};
