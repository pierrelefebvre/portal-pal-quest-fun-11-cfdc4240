
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowDown, MapPin, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Map = () => {
  const navigate = useNavigate();
  
  // Portails basés sur des lieux réels de Croix près de Lille
  const portals = [
    { id: 1, name: "Place Jean Jaurès", found: false, x: 50, y: 50, hint: "Au centre de la place" },
    { id: 2, name: "Parc Barbieux", found: false, x: 30, y: 30, hint: "Près de l'étang" },
    { id: 3, name: "Église Saint-Martin", found: true, x: 60, y: 45, hint: "Devant le parvis" },
    { id: 4, name: "Mairie de Croix", found: false, x: 45, y: 55, hint: "À l'entrée principale" },
    { id: 5, name: "Stade Amédée Prouvost", found: false, x: 70, y: 70, hint: "Près du terrain" },
  ];

  const handlePortalClick = (portal: typeof portals[0]) => {
    if (portal.found) {
      toast.success(`📍 Portail ${portal.name} déjà découvert !`);
      navigate(`/portal/${portal.id}`);
    } else {
      toast.info(`🧭 Navigation vers ${portal.name} activée !`);
      navigate('/navigation');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-green-50 to-yellow-100 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-6 pt-6">
          <div className="text-5xl mb-3">🗺️✨</div>
          <h1 className="text-3xl font-bold text-blue-800 mb-2">
            Carte de Croix
          </h1>
          <p className="text-blue-600">
            Découvre tous les portails de ta ville !
          </p>
          <p className="text-blue-500 text-sm mt-2">
            💡 Clique sur un portail pour naviguer vers lui
          </p>
        </div>

        {/* Map Container */}
        <Card className="mb-6 bg-white/90 backdrop-blur-sm shadow-lg border-2 border-blue-200">
          <CardContent className="p-4">
            <div className="relative bg-gradient-to-br from-green-200 to-green-300 rounded-lg h-80 overflow-hidden border-2 border-green-400">
              {/* Terrain elements représentant Croix */}
              <div className="absolute top-6 left-6 w-12 h-8 bg-blue-400 rounded-lg" title="Parc Barbieux"></div>
              <div className="absolute top-12 right-8 w-8 h-8 bg-brown-600 rounded-sm" title="Église"></div>
              <div className="absolute bottom-12 left-12 w-10 h-6 bg-gray-500 rounded-lg" title="Mairie"></div>
              <div className="absolute bottom-8 right-8 w-14 h-10 bg-green-600 rounded-lg" title="Stade"></div>
              
              {/* Routes principales */}
              <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-300 transform -translate-y-1/2"></div>
              <div className="absolute top-0 bottom-0 left-1/2 w-2 bg-gray-300 transform -translate-x-1/2"></div>
              
              {/* User position */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                <div className="text-xs text-blue-800 font-bold mt-1 text-center">Moi</div>
              </div>
              
              {/* Portals */}
              {portals.map((portal) => (
                <div
                  key={portal.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform"
                  style={{ left: `${portal.x}%`, top: `${portal.y}%` }}
                  onClick={() => handlePortalClick(portal)}
                >
                  <div className={`w-6 h-6 rounded-full border-2 border-white shadow-lg ${
                    portal.found 
                      ? 'bg-green-500 animate-pulse' 
                      : 'bg-purple-500 animate-bounce'
                  }`}>
                    <div className="text-white text-xs text-center leading-6">
                      {portal.found ? '✓' : '?'}
                    </div>
                  </div>
                  <div className="text-xs font-bold text-center mt-1 text-purple-800">
                    {portal.name}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Portal List */}
        <Card className="mb-6 bg-white/90 backdrop-blur-sm shadow-lg">
          <CardContent className="p-4">
            <h3 className="text-lg font-bold text-purple-800 mb-4 text-center">
              🎯 Portails de Croix à découvrir
            </h3>
            <div className="space-y-2">
              {portals.map((portal) => (
                <div
                  key={portal.id}
                  className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer hover:scale-105 transition-transform ${
                    portal.found 
                      ? 'bg-green-100 border-green-300' 
                      : 'bg-purple-100 border-purple-300'
                  }`}
                  onClick={() => handlePortalClick(portal)}
                >
                  <div className="flex items-center">
                    <div className={`w-6 h-6 rounded-full mr-3 flex items-center justify-center text-white font-bold ${
                      portal.found ? 'bg-green-500' : 'bg-purple-500'
                    }`}>
                      {portal.found ? '✓' : portal.id}
                    </div>
                    <div>
                      <p className="font-bold text-purple-800">{portal.name}</p>
                      <p className="text-sm text-purple-600">{portal.hint}</p>
                    </div>
                  </div>
                  <Badge className={portal.found ? 'bg-green-200 text-green-800' : 'bg-purple-200 text-purple-800'}>
                    {portal.found ? 'Trouvé' : 'Naviguer'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="bg-white/80 backdrop-blur-sm border-2 border-gray-300 hover:bg-gray-50 font-bold py-3 rounded-2xl"
          >
            🏠 Accueil
          </Button>
          
          <Button
            onClick={() => navigate('/mission')}
            variant="outline"
            className="bg-white/80 backdrop-blur-sm border-2 border-purple-300 hover:bg-purple-50 text-purple-700 font-bold py-3 rounded-2xl"
          >
            🎯 Mission
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Map;
