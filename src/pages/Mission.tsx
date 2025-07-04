
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Mission = () => {
  const navigate = useNavigate();
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [distance, setDistance] = useState<number | null>(null);
  const [temperature, setTemperature] = useState<'cold' | 'warm' | 'hot' | null>(null);

  const enableLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationEnabled(true);
          const simulatedDistance = Math.random() * 500 + 50;
          setDistance(simulatedDistance);
          updateTemperature(simulatedDistance);
        },
        (error) => {
          console.error("Erreur de géolocalisation:", error);
          setLocationEnabled(true);
          const simulatedDistance = Math.random() * 500 + 50;
          setDistance(simulatedDistance);
          updateTemperature(simulatedDistance);
        }
      );
    }
  };

  const updateTemperature = (dist: number) => {
    if (dist < 50) setTemperature('hot');
    else if (dist < 150) setTemperature('warm');
    else setTemperature('cold');
  };

  const getTemperatureMessage = () => {
    switch (temperature) {
      case 'hot': return { text: "Très proche ! Le portail est à proximité", color: "text-green-700", bg: "bg-green-50 border-green-200" };
      case 'warm': return { text: "Tu te rapproches ! Continue dans cette direction", color: "text-amber-700", bg: "bg-amber-50 border-amber-200" };
      case 'cold': return { text: "Éloigné... Cherche ailleurs", color: "text-slate-600", bg: "bg-slate-50 border-slate-200" };
      default: return { text: "", color: "", bg: "" };
    }
  };

  const canScanPortal = temperature === 'hot';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-6 pt-6">
          <div className="text-4xl mb-3 text-slate-600">🎯</div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            Mission Active
          </h1>
          <Badge className="bg-slate-100 text-slate-700 font-medium px-3 py-1">
            Portail 1/5
          </Badge>
        </div>

        {/* Mission Description */}
        <Card className="mb-6 bg-white/90 backdrop-blur-sm shadow-md border border-slate-200">
          <CardHeader>
            <CardTitle className="text-slate-800 text-lg">
              Le Portail de la Bibliothèque
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 mb-4">
              Un portail se cache près de la grande bibliothèque. 
              Utilise ton détecteur pour le localiser.
            </p>
            <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
              <p className="text-amber-800 font-medium text-sm">
                💡 Indice : Cherche près des grandes fenêtres
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Location Status */}
        {!locationEnabled ? (
          <Card className="mb-6 bg-white/90 backdrop-blur-sm shadow-md border border-slate-200">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-4 text-slate-600">📍</div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                Active ta localisation
              </h3>
              <p className="text-slate-600 mb-4">
                Pour trouver les portails, nous avons besoin de ta position
              </p>
              <Button 
                onClick={enableLocation}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 rounded-lg"
              >
                Activer la localisation
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Temperature Indicator */}
            <Card className={`mb-6 ${getTemperatureMessage().bg} border shadow-sm`}>
              <CardContent className="p-6 text-center">
                <p className={`${getTemperatureMessage().color} font-medium text-base`}>
                  {getTemperatureMessage().text}
                </p>
                {distance && (
                  <p className="text-slate-500 mt-2 text-sm">
                    Distance estimée : {Math.round(distance)}m
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Portal Scanner */}
            <Card className="mb-6 bg-white/90 backdrop-blur-sm shadow-md border border-slate-200">
              <CardContent className="p-6 text-center space-y-3">
                <Button 
                  onClick={() => navigate('/navigation')}
                  className="w-full bg-slate-700 hover:bg-slate-600 text-white font-medium py-3 rounded-lg"
                >
                  🧭 Naviguer vers le portail
                </Button>
                {canScanPortal && (
                  <Button 
                    onClick={() => navigate('/portal/1')}
                    className="w-full bg-green-700 hover:bg-green-600 text-white font-medium py-3 rounded-lg"
                  >
                    Scanner le portail
                  </Button>
                )}
                {!canScanPortal && (
                  <p className="text-slate-500 text-sm">
                    Rapproche-toi pour scanner le portail
                  </p>
                )}
              </CardContent>
            </Card>
          </>
        )}

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
            onClick={() => navigate('/map')}
            variant="outline"
            className="bg-white border border-slate-300 hover:bg-slate-50 font-medium py-3 rounded-lg"
          >
            <MapPin className="mr-2 h-4 w-4" />
            Carte
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Mission;
