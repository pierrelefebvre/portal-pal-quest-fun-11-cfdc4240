import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, ArrowUpLeft, ArrowDownRight, ArrowDownLeft } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Motion } from '@capacitor/motion';
import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';

const Navigation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [distance, setDistance] = useState<number>(150);
  const [temperature, setTemperature] = useState<'cold' | 'warm' | 'hot'>('cold');
  const [direction, setDirection] = useState<'north' | 'northeast' | 'east' | 'southeast' | 'south' | 'southwest' | 'west' | 'northwest'>('north');
  const [compass, setCompass] = useState(0);
  const [userPosition, setUserPosition] = useState<{lat: number, lon: number} | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isNative, setIsNative] = useState(false);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [targetBearing, setTargetBearing] = useState(0); // Direction absolue vers le portail

  // Portails avec coordonnées GPS précises de Croix
  const portals = [
    { id: 1, name: "Place Jean Jaurès", lat: 50.67648, lon: 3.15159 },
    { id: 2, name: "Parc Barbieux", lat: 50.67204, lon: 3.14502 },
    { id: 3, name: "Église Saint-Martin", lat: 50.67801, lon: 3.15298 },
    { id: 4, name: "Mairie de Croix", lat: 50.67502, lon: 3.15001 },
    { id: 5, name: "Stade Amédée Prouvost", lat: 50.68001, lon: 3.15798 },
    { id: 6, name: "Decathlon", lat: 50.67289594117399, lon: 3.148318881734259 },
  ];

  // Déterminer le portail cible basé sur l'URL
  const targetId = searchParams.get('target') ? parseInt(searchParams.get('target')!) : 1;
  const targetPortal = portals.find(p => p.id === targetId) || portals[0];
  const targetPosition = { lat: targetPortal.lat, lon: targetPortal.lon };
  const targetName = targetPortal.name;

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

  // Recalculer la direction relative quand la boussole change
  useEffect(() => {
    if (userPosition) {
      updateRelativeDirection();
    }
  }, [compass, targetBearing]);

  // Recalculer la position et direction quand le portail cible change
  useEffect(() => {
    if (userPosition) {
      console.log('Destination changée, recalcul de la direction vers:', targetName);
      calculateDistanceAndDirection(userPosition);
    }
  }, [targetId, targetName]);

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

    // Calculer la direction absolue (bearing) vers le portail
    const y = Math.sin(Δλ) * Math.cos(φ2);
    const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
    const θ = Math.atan2(y, x);
    const bearing = (θ * 180/Math.PI + 360) % 360;

    console.log('Direction absolue calculée:', bearing, 'vers', targetName);
    setTargetBearing(bearing);

    // Mettre à jour la température selon la distance (distances ajustées pour Croix)
    if (calculatedDistance < 20) setTemperature('hot');
    else if (calculatedDistance < 100) setTemperature('warm');
    else setTemperature('cold');

    // Calculer la direction relative immédiatement
    updateRelativeDirection(bearing);
  };

  const updateRelativeDirection = (bearing?: number) => {
    const targetBear = bearing !== undefined ? bearing : targetBearing;
    
    // Calculer la différence entre la direction du portail et l'orientation de l'appareil
    let relativeBearing = targetBear - compass;
    
    // Normaliser l'angle entre -180 et 180
    if (relativeBearing > 180) relativeBearing -= 360;
    if (relativeBearing < -180) relativeBearing += 360;

    console.log('Direction relative:', relativeBearing, 'compass:', compass, 'target:', targetBear);

    // Convertir en direction relative à l'appareil (8 directions, tous les 45°)
    if (relativeBearing >= -22.5 && relativeBearing < 22.5) {
      setDirection('north'); // Le portail est devant nous
    } else if (relativeBearing >= 22.5 && relativeBearing < 67.5) {
      setDirection('northwest'); // Devant-gauche
    } else if (relativeBearing >= 67.5 && relativeBearing < 112.5) {
      setDirection('west'); // À gauche
    } else if (relativeBearing >= 112.5 && relativeBearing < 157.5) {
      setDirection('southwest'); // Derrière-gauche
    } else if (relativeBearing >= 157.5 || relativeBearing < -157.5) {
      setDirection('south'); // Le portail est derrière nous
    } else if (relativeBearing >= -157.5 && relativeBearing < -112.5) {
      setDirection('southeast'); // Derrière-droite
    } else if (relativeBearing >= -112.5 && relativeBearing < -67.5) {
      setDirection('east'); // À droite
    } else {
      setDirection('northeast'); // Devant-droite
    }
  };

  const getTemperatureMessage = () => {
    switch (temperature) {
      case 'hot': return { text: "🔥 Tu brûles ! Tout proche !", color: "text-red-600", bg: "bg-red-50" };
      case 'warm': return { text: "😊 Tu chauffes ! Continue !", color: "text-orange-600", bg: "bg-orange-50" };
      case 'cold': return { text: "❄️ Tu refroidis... Cherche ailleurs !", color: "text-blue-600", bg: "bg-blue-50" };
    }
  };

  const getDirectionArrow = () => {
    switch (direction) {
      case 'north': return <ArrowUp className="h-12 w-12" />;
      case 'northeast': return <ArrowUpRight className="h-12 w-12" />;
      case 'east': return <ArrowRight className="h-12 w-12" />;
      case 'southeast': return <ArrowDownRight className="h-12 w-12" />;
      case 'south': return <ArrowDown className="h-12 w-12" />;
      case 'southwest': return <ArrowDownLeft className="h-12 w-12" />;
      case 'west': return <ArrowLeft className="h-12 w-12" />;
      case 'northwest': return <ArrowUpLeft className="h-12 w-12" />;
    }
  };

  const getDirectionText = () => {
    switch (direction) {
      case 'north': return "Continue tout droit 🧭";
      case 'northeast': return "Léger virage à droite 🧭";
      case 'east': return "Tourne à droite 🧭";
      case 'southeast': return "Tourne à droite et recule 🧭";
      case 'south': return "Fais demi-tour 🧭";
      case 'southwest': return "Tourne à gauche et recule 🧭";
      case 'west': return "Tourne à gauche 🧭";
      case 'northwest': return "Léger virage à gauche 🧭";
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-6 pt-6">
            <div className="text-5xl mb-3">⚠️</div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              Erreur
            </h1>
            <p className="text-slate-600">{error}</p>
          </div>
          
          <Card className="mb-6 bg-white/90 backdrop-blur-sm shadow-md border border-slate-200">
            <CardContent className="p-6 text-center">
              <p className="text-slate-700 mb-4">
                {isNative 
                  ? "Pour utiliser la navigation, vous devez activer les permissions de géolocalisation et de mouvement."
                  : "Assurez-vous d'autoriser l'accès à la géolocalisation dans votre navigateur."
                }
              </p>
              <Button 
                onClick={initializeSensors}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-4 px-6 rounded-lg"
              >
                🔄 Réessayer
              </Button>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={() => navigate('/mission')}
              variant="outline"
              className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium py-3 rounded-lg"
            >
              ← Retour Mission
            </Button>
            
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium py-3 rounded-lg"
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-6 pt-6">
            <div className="text-5xl mb-3">🧭</div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              Navigation
            </h1>
            <p className="text-slate-600">Activation des capteurs en cours...</p>
          </div>
          
          <Card className="mb-6 bg-white/90 backdrop-blur-sm shadow-md border border-slate-200">
            <CardContent className="p-6 text-center">
              <div className="animate-spin text-4xl mb-4">🔄</div>
              <p className="text-slate-700">
                {isNative ? "Demande d'accès aux capteurs..." : "Demande d'accès à la géolocalisation..."}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-6 pt-6">
          <div className="text-5xl mb-3">🧭</div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Navigation
          </h1>
          <p className="text-slate-600">Suis les flèches pour trouver le portail !</p>
          <p className="text-slate-500 text-sm">
            Mode: {isNative ? 'Natif' : 'Web'} • Suivi GPS continu
          </p>
        </div>

        {/* Destination */}
        <Card className="mb-6 bg-white/90 backdrop-blur-sm shadow-md border border-slate-200">
          <CardContent className="p-6 text-center">
            <div className="text-4xl mb-3">🎯</div>
            <p className="text-slate-800 font-medium text-lg mb-2">
              Destination actuelle
            </p>
            <p className="text-slate-600 text-xl font-medium">
              📍 {targetName}
            </p>
            <Button
              onClick={() => navigate('/map')}
              variant="outline"
              className="mt-3 bg-slate-50 border-slate-300 text-slate-700 hover:bg-slate-100"
            >
              📍 Changer de destination
            </Button>
          </CardContent>
        </Card>

        {/* Boussole */}
        <Card className="mb-6 bg-white/90 backdrop-blur-sm shadow-md border border-slate-200">
          <CardContent className="p-8 text-center">
            <div className="relative mb-4">
              <div 
                className="w-32 h-32 mx-auto rounded-full border-4 border-slate-300 bg-slate-50 flex items-center justify-center transition-transform duration-200"
                style={{ transform: `rotate(${compass}deg)` }}
              >
                <div className="text-4xl">🧭</div>
              </div>
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 text-red-600 font-bold">
                N
              </div>
            </div>
            <p className="text-slate-800 font-medium text-lg mb-2">
              Boussole GPS
            </p>
            <p className="text-slate-600">Orientation : {compass}°</p>
          </CardContent>
        </Card>

        {/* Direction */}
        <Card className="mb-6 bg-white/90 backdrop-blur-sm shadow-md border border-slate-200">
          <CardContent className="p-8 text-center">
            <div className="text-slate-600 mb-4">
              {getDirectionArrow()}
            </div>
            <p className="text-slate-800 font-medium text-xl mb-2">
              {getDirectionText()}
            </p>
            <p className="text-slate-600">
              Distance estimée : {distance < 1000 ? `${Math.round(distance)}m` : `${(distance/1000).toFixed(1)}km`}
            </p>
            {userPosition && (
              <p className="text-slate-500 text-sm mt-2">
                📍 Position GPS: {userPosition.lat.toFixed(4)}, {userPosition.lon.toFixed(4)}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Temperature Status */}
        <Card className={`mb-6 ${getTemperatureMessage().bg} border border-slate-200 shadow-md`}>
          <CardContent className="p-6 text-center">
            <div className="text-4xl mb-3">
              {temperature === 'hot' ? '🔥' : temperature === 'warm' ? '😊' : '❄️'}
            </div>
            <p className={`${getTemperatureMessage().color} font-medium text-lg`}>
              {getTemperatureMessage().text}
            </p>
          </CardContent>
        </Card>

        {/* Scanner Button */}
        {temperature === 'hot' && (
          <Card className="mb-6 bg-white/90 backdrop-blur-sm shadow-md border border-slate-200">
            <CardContent className="p-6 text-center">
              <div className="text-5xl mb-4 animate-bounce">🔍</div>
              <Button 
                onClick={() => navigate('/portal/1')}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-4 px-6 rounded-lg"
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
            className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium py-3 rounded-lg"
          >
            ← Retour Mission
          </Button>
          
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium py-3 rounded-lg"
          >
            🏠 Accueil
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
