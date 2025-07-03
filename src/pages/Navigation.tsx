import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Motion } from '@capacitor/motion';
import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';

const Navigation = () => {
  const navigate = useNavigate();
  const [distance, setDistance] = useState<number>(150);
  const [temperature, setTemperature] = useState<'cold' | 'warm' | 'hot'>('cold');
  const [direction, setDirection] = useState<'north' | 'south' | 'east' | 'west'>('north');
  const [compass, setCompass] = useState(0);
  const [userPosition, setUserPosition] = useState<{lat: number, lon: number} | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isNative, setIsNative] = useState(false);
  const [watchId, setWatchId] = useState<number | null>(null);

  // Position du portail à Croix - Place Jean Jaurès (centre ville)
  const targetPosition = { lat: 50.6765, lon: 3.1516 };

  useEffect(() => {
    // Vérifier si on est sur une plateforme native
    setIsNative(Capacitor.isNativePlatform());
    
    // Demander les permissions et initialiser les capteurs
    initializeSensors();

    return () => {
      // Nettoyer les listeners
      if (isNative) {
        Motion.removeAllListeners();
      }
      // Arrêter le suivi de position
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  const initializeSensors = async () => {
    try {
      console.log('Initialisation des capteurs, plateforme native:', Capacitor.isNativePlatform());
      
      if (Capacitor.isNativePlatform()) {
        // Mode natif - utiliser les capteurs Capacitor
        await initializeNativeSensors();
      } else {
        // Mode web - utiliser les APIs standard du navigateur
        await initializeWebSensors();
      }
      
    } catch (error) {
      console.error('Erreur lors de l\'initialisation des capteurs:', error);
      setError('Impossible d\'accéder aux capteurs du dispositif');
    }
  };

  const initializeNativeSensors = async () => {
    // Vérifier et demander les permissions de géolocalisation
    const permissions = await Geolocation.checkPermissions();
    if (permissions.location !== 'granted') {
      const request = await Geolocation.requestPermissions();
      if (request.location !== 'granted') {
        setError('Permissions de géolocalisation requises pour utiliser la navigation');
        return;
      }
    }

    setPermissionGranted(true);
    
    // Démarrer la géolocalisation native
    await startNativeGeolocation();
    
    // Démarrer le gyroscope/boussole natif
    await startNativeCompass();
  };

  const initializeWebSensors = async () => {
    console.log('Initialisation des capteurs web...');
    
    // Vérifier si la géolocalisation est disponible
    if (!navigator.geolocation) {
      setError('Géolocalisation non supportée par ce navigateur');
      return;
    }

    setPermissionGranted(true);
    
    // Démarrer la géolocalisation web
    await startWebGeolocation();
    
    // Démarrer la boussole web
    await startWebCompass();
  };

  const startNativeGeolocation = async () => {
    try {
      // Position initiale
      const position = await Geolocation.getCurrentPosition();
      const userPos = {
        lat: position.coords.latitude,
        lon: position.coords.longitude
      };
      setUserPosition(userPos);
      calculateDistanceAndDirection(userPos);

      // Surveiller les changements de position
      const watchId = Geolocation.watchPosition(
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 3600
        },
        (position) => {
          const newPos = {
            lat: position.coords.latitude,
            lon: position.coords.longitude
          };
          setUserPosition(newPos);
          calculateDistanceAndDirection(newPos);
        }
      );

    } catch (error) {
      console.error('Erreur de géolocalisation native:', error);
      setError('Impossible d\'accéder à la géolocalisation');
    }
  };

  const startWebGeolocation = async () => {
    try {
      console.log('Démarrage de la géolocalisation web...');
      
      // Position initiale
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Position initiale obtenue:', position);
          const userPos = {
            lat: position.coords.latitude,
            lon: position.coords.longitude
          };
          setUserPosition(userPos);
          calculateDistanceAndDirection(userPos);
        },
        (error) => {
          console.error('Erreur de géolocalisation initiale:', error);
          setError('Impossible d\'accéder à la géolocalisation');
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );

      // Surveiller les changements de position en continu
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          console.log('Position mise à jour:', position);
          const newPos = {
            lat: position.coords.latitude,
            lon: position.coords.longitude
          };
          setUserPosition(newPos);
          calculateDistanceAndDirection(newPos);
        },
        (error) => {
          console.error('Erreur de surveillance géolocalisation:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 5000 // Actualiser au maximum toutes les 5 secondes
        }
      );

      setWatchId(watchId);

    } catch (error) {
      console.error('Erreur de géolocalisation web:', error);
      setError('Impossible d\'accéder à la géolocalisation');
    }
  };

  const startNativeCompass = async () => {
    try {
      // Démarrer l'écoute de l'orientation du dispositif
      await Motion.addListener('orientation', (event) => {
        if (event.alpha !== null) {
          // Alpha représente la rotation autour de l'axe Z (boussole)
          setCompass(Math.round(event.alpha));
        }
      });
    } catch (error) {
      console.error('Erreur du gyroscope natif:', error);
      setError('Impossible d\'accéder au gyroscope');
    }
  };

  const startWebCompass = async () => {
    try {
      console.log('Démarrage de la boussole web...');
      
      // Vérifier si l'orientation est supportée
      if (window.DeviceOrientationEvent) {
        // Demander les permissions pour iOS 13+
        if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
          const permission = await (DeviceOrientationEvent as any).requestPermission();
          if (permission !== 'granted') {
            console.log('Permission d\'orientation refusée');
            return;
          }
        }

        window.addEventListener('deviceorientation', (event) => {
          if (event.alpha !== null) {
            setCompass(Math.round(event.alpha));
          }
        });
        
        console.log('Écoute de l\'orientation activée');
      } else {
        console.log('DeviceOrientationEvent non supporté');
      }
    } catch (error) {
      console.error('Erreur de la boussole web:', error);
    }
  };

  const calculateDistanceAndDirection = (userPos: {lat: number, lon: number}) => {
    console.log('Calcul distance et direction:', userPos, 'vers', targetPosition);
    
    // Calculer la distance en utilisant la formule de Haversine
    const R = 6371e3; // Rayon de la Terre en mètres
    const φ1 = userPos.lat * Math.PI/180;
    const φ2 = targetPosition.lat * Math.PI/180;
    const Δφ = (targetPosition.lat - userPos.lat) * Math.PI/180;
    const Δλ = (targetPosition.lon - userPos.lon) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    const calculatedDistance = R * c;
    console.log('Distance calculée:', calculatedDistance);
    setDistance(calculatedDistance);

    // Calculer la direction (bearing)
    const y = Math.sin(Δλ) * Math.cos(φ2);
    const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
    const θ = Math.atan2(y, x);
    const bearing = (θ * 180/Math.PI + 360) % 360;

    console.log('Direction calculée:', bearing);

    // Convertir en direction cardinale
    if (bearing >= 315 || bearing < 45) setDirection('north');
    else if (bearing >= 45 && bearing < 135) setDirection('east');
    else if (bearing >= 135 && bearing < 225) setDirection('south');
    else setDirection('west');

    // Mettre à jour la température selon la distance (distances ajustées pour Croix)
    if (calculatedDistance < 20) setTemperature('hot');
    else if (calculatedDistance < 100) setTemperature('warm');
    else setTemperature('cold');
  };

  const getTemperatureMessage = () => {
    switch (temperature) {
      case 'hot': return { text: "🔥 Tu brûles ! Tout proche !", color: "text-red-600", bg: "bg-red-100" };
      case 'warm': return { text: "😊 Tu chauffes ! Continue !", color: "text-orange-600", bg: "bg-orange-100" };
      case 'cold': return { text: "❄️ Tu refroidis... Cherche ailleurs !", color: "text-blue-600", bg: "bg-blue-100" };
    }
  };

  const getDirectionArrow = () => {
    switch (direction) {
      case 'north': return <ArrowUp className="h-12 w-12" />;
      case 'south': return <ArrowDown className="h-12 w-12" />;
      case 'east': return <ArrowRight className="h-12 w-12" />;
      case 'west': return <ArrowLeft className="h-12 w-12" />;
    }
  };

  const getDirectionText = () => {
    switch (direction) {
      case 'north': return "Va vers le Nord 🧭";
      case 'south': return "Va vers le Sud 🧭";
      case 'east': return "Va vers l'Est 🧭";
      case 'west': return "Va vers l'Ouest 🧭";
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-yellow-100 p-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-6 pt-6">
            <div className="text-5xl mb-3">⚠️</div>
            <h1 className="text-3xl font-bold text-red-800 mb-2">
              Erreur
            </h1>
            <p className="text-red-600">{error}</p>
          </div>
          
          <Card className="mb-6 bg-white/90 backdrop-blur-sm shadow-lg border-2 border-red-200">
            <CardContent className="p-6 text-center">
              <p className="text-red-700 mb-4">
                {isNative 
                  ? "Pour utiliser la navigation, vous devez activer les permissions de géolocalisation et de mouvement."
                  : "Assurez-vous d'autoriser l'accès à la géolocalisation dans votre navigateur."
                }
              </p>
              <Button 
                onClick={initializeSensors}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-4 rounded-full text-lg"
              >
                🔄 Réessayer
              </Button>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={() => navigate('/mission')}
              variant="outline"
              className="bg-white/80 backdrop-blur-sm border-2 border-gray-300 hover:bg-gray-50 font-bold py-3 rounded-2xl"
            >
              ← Retour Mission
            </Button>
            
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="bg-white/80 backdrop-blur-sm border-2 border-blue-300 hover:bg-blue-50 text-blue-700 font-bold py-3 rounded-2xl"
            >
              🏠 Accueil
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!permissionGranted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-yellow-100 p-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-6 pt-6">
            <div className="text-5xl mb-3">🧭✨</div>
            <h1 className="text-3xl font-bold text-purple-800 mb-2">
              Navigation Magique
            </h1>
            <p className="text-purple-600">Activation des capteurs en cours...</p>
          </div>
          
          <Card className="mb-6 bg-white/90 backdrop-blur-sm shadow-lg border-2 border-purple-200">
            <CardContent className="p-6 text-center">
              <div className="animate-spin text-4xl mb-4">🔄</div>
              <p className="text-purple-700">
                {isNative ? "Demande d'accès aux capteurs..." : "Demande d'accès à la géolocalisation..."}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-yellow-100 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-6 pt-6">
          <div className="text-5xl mb-3">🧭✨</div>
          <h1 className="text-3xl font-bold text-purple-800 mb-2">
            Navigation Magique
          </h1>
          <p className="text-purple-600">Suis les flèches pour trouver le portail !</p>
          <p className="text-purple-500 text-sm">
            Mode: {isNative ? 'Natif' : 'Web'} • Suivi GPS continu
          </p>
        </div>

        {/* Boussole */}
        <Card className="mb-6 bg-white/90 backdrop-blur-sm shadow-lg border-2 border-purple-200">
          <CardContent className="p-8 text-center">
            <div className="relative mb-4">
              <div 
                className="w-32 h-32 mx-auto rounded-full border-4 border-purple-300 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center transition-transform duration-200"
                style={{ transform: `rotate(${compass}deg)` }}
              >
                <div className="text-4xl">🧭</div>
              </div>
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 text-red-600 font-bold">
                N
              </div>
            </div>
            <p className="text-purple-800 font-bold text-lg mb-2">
              Boussole GPS
            </p>
            <p className="text-purple-600">Orientation : {compass}°</p>
          </CardContent>
        </Card>

        {/* Direction */}
        <Card className="mb-6 bg-white/90 backdrop-blur-sm shadow-lg border-2 border-green-200">
          <CardContent className="p-8 text-center">
            <div className="text-green-600 mb-4">
              {getDirectionArrow()}
            </div>
            <p className="text-green-800 font-bold text-xl mb-2">
              {getDirectionText()}
            </p>
            <p className="text-green-600">
              Distance estimée : {distance < 1000 ? `${Math.round(distance)}m` : `${(distance/1000).toFixed(1)}km`}
            </p>
            {userPosition && (
              <p className="text-green-500 text-sm mt-2">
                📍 Position GPS: {userPosition.lat.toFixed(4)}, {userPosition.lon.toFixed(4)}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Temperature Status */}
        <Card className={`mb-6 ${getTemperatureMessage().bg} border-2 shadow-lg`}>
          <CardContent className="p-6 text-center">
            <div className="text-4xl mb-3">
              {temperature === 'hot' ? '🔥' : temperature === 'warm' ? '😊' : '❄️'}
            </div>
            <p className={`${getTemperatureMessage().color} font-bold text-lg`}>
              {getTemperatureMessage().text}
            </p>
          </CardContent>
        </Card>

        {/* Scanner Button */}
        {temperature === 'hot' && (
          <Card className="mb-6 bg-white/90 backdrop-blur-sm shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-5xl mb-4 animate-bounce">✨🔍✨</div>
              <Button 
                onClick={() => navigate('/portal/1')}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold py-4 rounded-full text-lg shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                🔮 Scanner le portail maintenant !
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => navigate('/mission')}
            variant="outline"
            className="bg-white/80 backdrop-blur-sm border-2 border-gray-300 hover:bg-gray-50 font-bold py-3 rounded-2xl"
          >
            ← Retour Mission
          </Button>
          
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="bg-white/80 backdrop-blur-sm border-2 border-blue-300 hover:bg-blue-50 text-blue-700 font-bold py-3 rounded-2xl"
          >
            🏠 Accueil
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
