
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { usePortalContext } from "@/contexts/PortalContext";

const Map = () => {
  const navigate = useNavigate();
  const { foundPortals } = usePortalContext();
  
  const portals = [
    { id: 1, name: "Place Jean Jaurès", x: 50, y: 50, hint: "Au centre de la place", lat: 50.67648, lon: 3.15159 },
    { id: 2, name: "Parc Barbieux", x: 30, y: 30, hint: "Près de l'étang", lat: 50.67204, lon: 3.14502 },
    { id: 3, name: "Église Saint-Martin", x: 60, y: 45, hint: "Devant le parvis", lat: 50.67801, lon: 3.15298 },
    { id: 4, name: "Mairie de Croix", x: 45, y: 55, hint: "À l'entrée principale", lat: 50.67502, lon: 3.15001 },
    { id: 5, name: "Stade Amédée Prouvost", x: 70, y: 70, hint: "Près du terrain", lat: 50.68001, lon: 3.15798 },
    { id: 6, name: "Decathlon", x: 100, y: 100, hint: "proche d'ynov", lat: 50.67289594117399, lon: 3.148318881734259 },
  ];

  const handlePortalClick = (portal: typeof portals[0]) => {
    const isFound = foundPortals.includes(portal.id);
    if (isFound) {
      toast.success(`Portail ${portal.name} déjà découvert`);
      navigate(`/portal/${portal.id}`);
    } else {
      toast.info(`Navigation vers ${portal.name} activée`);
      navigate(`/navigation?target=${portal.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-6 pt-6">
          <div className="text-4xl mb-3 text-slate-600">🗺️</div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            Carte de Croix
          </h1>
          <p className="text-slate-600">
            Découvre tous les portails de ta ville
          </p>
          <p className="text-slate-500 text-sm mt-2">
            💡 Clique sur un portail pour naviguer vers lui
          </p>
        </div>

        {/* Map Container */}
        <Card className="mb-6 bg-white/90 backdrop-blur-sm shadow-md border border-slate-200">
          <CardContent className="p-4">
            <div className="relative bg-gradient-to-br from-green-100 to-green-200 rounded-lg h-80 overflow-hidden border border-green-300">
              {/* Terrain elements */}
              <div className="absolute top-6 left-6 w-12 h-8 bg-blue-300 rounded-lg"></div>
              <div className="absolute top-12 right-8 w-8 h-8 bg-stone-500 rounded-sm"></div>
              <div className="absolute bottom-12 left-12 w-10 h-6 bg-slate-400 rounded-lg"></div>
              <div className="absolute bottom-8 right-8 w-14 h-10 bg-green-500 rounded-lg"></div>
              
              {/* Routes */}
              <div className="absolute top-1/2 left-0 right-0 h-2 bg-slate-300 transform -translate-y-1/2"></div>
              <div className="absolute top-0 bottom-0 left-1/2 w-2 bg-slate-300 transform -translate-x-1/2"></div>
              
              {/* User position */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-3 h-3 bg-slate-700 rounded-full border-2 border-white shadow-md"></div>
                <div className="text-xs text-slate-700 font-medium mt-1 text-center">Moi</div>
              </div>
              
              {/* Portals */}
              {portals.map((portal) => {
                const isFound = foundPortals.includes(portal.id);
                return (
                  <div
                    key={portal.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform"
                    style={{ left: `${portal.x}%`, top: `${portal.y}%` }}
                    onClick={() => handlePortalClick(portal)}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 border-white shadow-md ${
                      isFound ? 'bg-green-600' : 'bg-slate-500'
                    }`}>
                      <div className="text-white text-xs text-center leading-5">
                        {isFound ? '✓' : '?'}
                      </div>
                    </div>
                    <div className="text-xs font-medium text-center mt-1 text-slate-700">
                      {portal.name}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Portal List */}
        <Card className="mb-6 bg-white/90 backdrop-blur-sm shadow-md border border-slate-200">
          <CardContent className="p-4">
            <h3 className="text-base font-semibold text-slate-800 mb-4 text-center">
              Portails à découvrir
            </h3>
            <div className="space-y-2">
              {portals.map((portal) => {
                const isFound = foundPortals.includes(portal.id);
                return (
                  <div
                    key={portal.id}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer hover:shadow-sm transition-all ${
                      isFound 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                    onClick={() => handlePortalClick(portal)}
                  >
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center text-white text-xs font-medium ${
                        isFound ? 'bg-green-600' : 'bg-slate-500'
                      }`}>
                        {isFound ? '✓' : portal.id}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{portal.name}</p>
                        <p className="text-sm text-slate-600">{portal.hint}</p>
                      </div>
                    </div>
                    <Badge className={`${isFound ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'} border-0`}>
                      {isFound ? 'Trouvé' : 'Naviguer'}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="bg-white border border-slate-300 hover:bg-slate-50 font-medium py-3 rounded-lg"
          >
            🏠 Accueil
          </Button>
          
          <Button
            onClick={() => navigate('/mission')}
            variant="outline"
            className="bg-white border border-slate-300 hover:bg-slate-50 font-medium py-3 rounded-lg"
          >
            🎯 Mission
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Map;
