
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navigation = () => {
  const navigate = useNavigate();
  const [distance, setDistance] = useState<number>(150);
  const [temperature, setTemperature] = useState<'cold' | 'warm' | 'hot'>('cold');
  const [direction, setDirection] = useState<'north' | 'south' | 'east' | 'west'>('north');
  const [compass, setCompass] = useState(0);

  useEffect(() => {
    // Simulation du mouvement et de la direction
    const interval = setInterval(() => {
      const newDistance = Math.max(10, distance - Math.random() * 30);
      setDistance(newDistance);
      
      if (newDistance < 50) setTemperature('hot');
      else if (newDistance < 100) setTemperature('warm');
      else setTemperature('cold');

      // Changer la direction aléatoirement
      const directions = ['north', 'south', 'east', 'west'] as const;
      setDirection(directions[Math.floor(Math.random() * directions.length)]);
      
      // Animation de la boussole
      setCompass(prev => (prev + 5) % 360);
    }, 2000);

    return () => clearInterval(interval);
  }, [distance]);

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
        </div>

        {/* Boussole */}
        <Card className="mb-6 bg-white/90 backdrop-blur-sm shadow-lg border-2 border-purple-200">
          <CardContent className="p-8 text-center">
            <div className="relative mb-4">
              <div 
                className="w-32 h-32 mx-auto rounded-full border-4 border-purple-300 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center"
                style={{ transform: `rotate(${compass}deg)` }}
              >
                <div className="text-4xl">🧭</div>
              </div>
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 text-red-600 font-bold">
                N
              </div>
            </div>
            <p className="text-purple-800 font-bold text-lg mb-2">Boussole Magique</p>
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
              Distance estimée : {Math.round(distance)}m
            </p>
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
