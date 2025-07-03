
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, MapPin, Compass } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { usePortals } from "@/contexts/PortalContext";

const Navigation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const targetId = parseInt(searchParams.get('target') || '1');
  const { getPortalById, markPortalAsFound } = usePortals();
  
  const [userPosition, setUserPosition] = useState({ lat: 50.6763, lon: 3.1518 });
  const [isScanning, setIsScanning] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  const targetPortal = getPortalById(targetId);

  // Calculer la distance et la direction
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371000; // Rayon de la Terre en mètres
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const calculateBearing = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const y = Math.sin(dLon) * Math.cos(lat2 * Math.PI / 180);
    const x = Math.cos(lat1 * Math.PI / 180) * Math.sin(lat2 * Math.PI / 180) -
              Math.sin(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.cos(dLon);
    const bearing = Math.atan2(y, x) * 180 / Math.PI;
    return (bearing + 360) % 360;
  };

  const distance = targetPortal ? calculateDistance(userPosition.lat, userPosition.lon, targetPortal.lat, targetPortal.lon) : 0;
  const bearing = targetPortal ? calculateBearing(userPosition.lat, userPosition.lon, targetPortal.lat, targetPortal.lon) : 0;

  const handleScan = () => {
    if (distance <= 50) {
      setIsScanning(true);
      toast.success("🎉 Portail découvert !");
      
      setTimeout(() => {
        setIsScanning(false);
        setShowAnimation(true);
        
        // Marquer le portail comme trouvé
        if (targetPortal) {
          markPortalAsFound(targetPortal.id);
        }
        
        setTimeout(() => {
          navigate(`/portal/${targetId}`);
        }, 3000);
      }, 2000);
    } else {
      toast.error("🚫 Trop loin ! Rapproche-toi du portail.");
    }
  };

  // Simulation mise à jour position
  useEffect(() => {
    const interval = setInterval(() => {
      navigator.geolocation?.getCurrentPosition(
        (position) => {
          setUserPosition({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        () => {
          // Simulation de mouvement vers le portail si géolocalisation indisponible
          if (targetPortal && distance > 10) {
            const newLat = userPosition.lat + (targetPortal.lat - userPosition.lat) * 0.1;
            const newLon = userPosition.lon + (targetPortal.lon - userPosition.lon) * 0.1;
            setUserPosition({ lat: newLat, lon: newLon });
          }
        }
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [userPosition, targetPortal, distance]);

  if (!targetPortal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-100 to-pink-100 p-4 flex items-center justify-center">
        <Card className="max-w-md mx-auto bg-white/90 backdrop-blur-sm shadow-lg">
          <CardContent className="p-6 text-center">
            <h1 className="text-2xl font-bold text-red-800 mb-4">Portail introuvable</h1>
            <Button onClick={() => navigate('/map')} className="w-full">
              Retour à la carte
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-green-100 p-4">
      <div className="max-w-md mx-auto">
        {showAnimation && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="text-center animate-pulse">
              <div className="text-8xl mb-4">🎉✨</div>
              <h2 className="text-4xl font-bold text-white mb-4">
                PORTAIL DÉCOUVERT !
              </h2>
              <div className="text-6xl animate-bounce">🏆</div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-6 pt-6">
          <div className="text-5xl mb-3">🧭✨</div>
          <h1 className="text-3xl font-bold text-purple-800 mb-2">
            Navigation Active
          </h1>
          <Badge className="bg-blue-200 text-blue-800 font-bold px-4 py-2">
            🎯 Destination: {targetPortal.name}
          </Badge>
        </div>

        {/* Compass Card */}
        <Card className="mb-6 bg-white/90 backdrop-blur-sm shadow-lg border-2 border-purple-200">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <div className="absolute inset-0 rounded-full border-4 border-purple-300 bg-gradient-to-br from-purple-100 to-blue-100"></div>
                <div 
                  className="absolute inset-4 flex items-center justify-center"
                  style={{ transform: `rotate(${bearing}deg)` }}
                >
                  <ArrowUp className="w-8 h-8 text-purple-600" />
                </div>
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-xs font-bold text-purple-800">N</div>
              </div>
              
              <div className="space-y-2">
                <p className="text-2xl font-bold text-purple-800">
                  {Math.round(distance)}m
                </p>
                <p className="text-purple-600">
                  Distance jusqu'au portail
                </p>
                <div className="flex items-center justify-center space-x-2">
                  <Compass className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-purple-600">
                    Direction: {Math.round(bearing)}°
                  </span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.max(10, 100 - (distance / 5))}%` }}
                ></div>
              </div>
              <p className="text-xs text-purple-600 mt-2 text-center">
                Plus tu te rapproches, plus la barre se remplit !
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Portal Info */}
        <Card className="mb-6 bg-white/90 backdrop-blur-sm shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center mb-3">
              <MapPin className="w-5 h-5 text-purple-600 mr-2" />
              <h3 className="text-lg font-bold text-purple-800">
                {targetPortal.name}
              </h3>
            </div>
            <p className="text-purple-600 mb-4">{targetPortal.hint}</p>
            
            <div className={`p-3 rounded-lg border-2 ${
              distance <= 50 
                ? 'bg-green-100 border-green-300' 
                : 'bg-yellow-100 border-yellow-300'
            }`}>
              <p className={`font-bold text-center ${
                distance <= 50 ? 'text-green-800' : 'text-yellow-800'
              }`}>
                {distance <= 50 
                  ? '✅ À portée ! Tu peux scanner le portail' 
                  : '🚶‍♂️ Continue à te rapprocher'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button 
            onClick={handleScan}
            disabled={distance > 50 || isScanning}
            className={`w-full font-bold py-4 rounded-full text-lg shadow-lg transform transition-all duration-200 ${
              distance <= 50 
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 hover:scale-105' 
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {isScanning ? '🔍 Scan en cours...' : '📱 Scanner le Portail'}
          </Button>
          
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={() => navigate('/map')}
              variant="outline"
              className="bg-white/80 backdrop-blur-sm border-2 border-purple-300 hover:bg-purple-50 text-purple-700 font-bold py-3 rounded-2xl"
            >
              🗺️ Carte
            </Button>
            
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="bg-white/80 backdrop-blur-sm border-2 border-gray-300 hover:bg-gray-50 font-bold py-3 rounded-2xl"
            >
              🏠 Accueil
            </Button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="fixed top-10 left-10 text-3xl animate-spin">🧭</div>
        <div className="fixed top-20 right-8 text-2xl animate-bounce">📍</div>
        <div className="fixed bottom-32 left-6 text-2xl animate-pulse">✨</div>
      </div>
    </div>
  );
};

export default Navigation;
