
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowDown, MapPin } from "lucide-react";
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
          // Simulation de distance à un portail
          const simulatedDistance = Math.random() * 500 + 50;
          setDistance(simulatedDistance);
          updateTemperature(simulatedDistance);
        },
        (error) => {
          console.error("Erreur de géolocalisation:", error);
          // Simulation pour les tests
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
      case 'hot': return { text: "🔥 Tu brûles ! Le portail est tout proche !", color: "text-red-600", bg: "bg-red-100" };
      case 'warm': return { text: "😊 Tu chauffes ! Continue dans cette direction !", color: "text-orange-600", bg: "bg-orange-100" };
      case 'cold': return { text: "❄️ Tu refroidis... Cherche ailleurs !", color: "text-blue-600", bg: "bg-blue-100" };
      default: return { text: "", color: "", bg: "" };
    }
  };

  const canScanPortal = temperature === 'hot';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-yellow-100 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-6 pt-6">
          <div className="text-5xl mb-3">🎯🔮</div>
          <h1 className="text-3xl font-bold text-purple-800 mb-2">
            Mission Active
          </h1>
          <Badge className="bg-purple-200 text-purple-800 font-bold px-4 py-2">
            Portail 1/5
          </Badge>
        </div>

        {/* Mission Description */}
        <Card className="mb-6 bg-white/90 backdrop-blur-sm shadow-lg border-2 border-purple-200">
          <CardHeader>
            <CardTitle className="text-purple-800 text-xl">
              🏰 Le Portail de la Bibliothèque
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-purple-600 mb-4">
              Un portail magique se cache près de la grande bibliothèque ! 
              Utilise ton détecteur de magie pour le trouver.
            </p>
            <div className="bg-yellow-100 p-3 rounded-lg border-2 border-yellow-300">
              <p className="text-yellow-800 font-bold text-sm">
                💡 Indice : Cherche près des grandes fenêtres !
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Location Status */}
        {!locationEnabled ? (
          <Card className="mb-6 bg-white/90 backdrop-blur-sm shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4">📍</div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Active ta localisation
              </h3>
              <p className="text-gray-600 mb-4">
                Pour trouver les portails magiques, j'ai besoin de savoir où tu es !
              </p>
              <Button 
                onClick={enableLocation}
                className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-bold py-4 rounded-full text-lg"
              >
                🎯 Activer la localisation
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Temperature Indicator */}
            <Card className={`mb-6 ${getTemperatureMessage().bg} border-2 shadow-lg`}>
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-3">
                  {temperature === 'hot' ? '🔥' : temperature === 'warm' ? '😊' : '❄️'}
                </div>
                <p className={`${getTemperatureMessage().color} font-bold text-lg`}>
                  {getTemperatureMessage().text}
                </p>
                {distance && (
                  <p className="text-gray-600 mt-2">
                    Distance estimée : {Math.round(distance)}m
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Portal Scanner */}
            <Card className="mb-6 bg-white/90 backdrop-blur-sm shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="text-5xl mb-4">🔍✨</div>
                <Button 
                  onClick={() => navigate('/portal/1')}
                  disabled={!canScanPortal}
                  className={`w-full font-bold py-4 rounded-full text-lg shadow-lg transform hover:scale-105 transition-all duration-200 ${
                    canScanPortal 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {canScanPortal ? '🔮 Scanner le portail' : '🔒 Rapproche-toi du portail'}
                </Button>
                {!canScanPortal && (
                  <p className="text-gray-500 text-sm mt-2">
                    Tu dois être très proche pour scanner !
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
            className="bg-white/80 backdrop-blur-sm border-2 border-gray-300 hover:bg-gray-50 font-bold py-3 rounded-2xl"
          >
            🏠 Accueil
          </Button>
          
          <Button
            onClick={() => navigate('/map')}
            variant="outline"
            className="bg-white/80 backdrop-blur-sm border-2 border-blue-300 hover:bg-blue-50 text-blue-700 font-bold py-3 rounded-2xl"
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
