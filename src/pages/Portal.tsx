
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const Portal = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showAnimation, setShowAnimation] = useState(true);

  const portals = {
    '1': {
      name: "Portail de la Bibliothèque",
      description: "Ce portail magique garde les secrets de tous les livres du monde ! Les mots s'envolent et dansent autour de toi.",
      reward: "Badge Lecteur Magique",
      emoji: "📚✨",
      color: "from-blue-500 to-purple-600"
    },
    '2': {
      name: "Portail du Parc",
      description: "Un portail de la nature où les arbres murmurent des histoires anciennes et les fleurs brillent comme des étoiles.",
      reward: "Badge Ami des Arbres",
      emoji: "🌳🌟",
      color: "from-green-500 to-teal-600"
    },
    '3': {
      name: "Portail de l'École", 
      description: "Le portail de la connaissance ! Ici, chaque question trouve sa réponse et chaque rêve devient possible.",
      reward: "Badge Super Élève",
      emoji: "🎓⭐",
      color: "from-yellow-500 to-orange-600"
    }
  };

  const currentPortal = portals[id as keyof typeof portals] || portals['1'];

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimation(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-yellow-100 p-4">
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
          <div className="text-6xl mb-4 animate-bounce">{currentPortal.emoji}</div>
          <h1 className="text-3xl font-bold text-purple-800 mb-2">
            Félicitations !
          </h1>
          <Badge className="bg-green-200 text-green-800 font-bold px-4 py-2">
            ✅ Portail Découvert
          </Badge>
        </div>

        {/* Portal Card */}
        <Card className="mb-6 bg-white/90 backdrop-blur-sm shadow-lg border-2 border-purple-200 overflow-hidden">
          <div className={`h-32 bg-gradient-to-r ${currentPortal.color} flex items-center justify-center`}>
            <div className="text-6xl animate-pulse">{currentPortal.emoji}</div>
          </div>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-purple-800 mb-4 text-center">
              {currentPortal.name}
            </h2>
            <p className="text-purple-600 mb-6 text-center leading-relaxed">
              {currentPortal.description}
            </p>
            
            {/* Reward */}
            <div className="bg-yellow-100 p-4 rounded-lg border-2 border-yellow-300 text-center">
              <div className="text-3xl mb-2">🏆</div>
              <p className="text-yellow-800 font-bold">
                Nouvelle récompense débloquée !
              </p>
              <p className="text-yellow-700 font-semibold">
                {currentPortal.reward}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Progress */}
        <Card className="mb-6 bg-white/90 backdrop-blur-sm shadow-lg">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-purple-800 mb-4 text-center">
              🎯 Ta progression
            </h3>
            <div className="flex justify-center items-center space-x-2 mb-4">
              {[1, 2, 3, 4, 5].map((num) => (
                <div
                  key={num}
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    num <= parseInt(id || '1') 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {num <= parseInt(id || '1') ? '✓' : num}
                </div>
              ))}
            </div>
            <p className="text-center text-purple-600">
              {id}/5 portails découverts
            </p>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button 
            onClick={() => navigate('/mission')}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold py-4 rounded-full text-lg shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            🎯 Chercher le prochain portail
          </Button>
          
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={() => navigate('/profile')}
              variant="outline"
              className="bg-white/80 backdrop-blur-sm border-2 border-green-300 hover:bg-green-50 text-green-700 font-bold py-3 rounded-2xl"
            >
              <Star className="mr-2 h-4 w-4" />
              Mes Badges
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
        <div className="fixed top-10 left-10 text-4xl animate-spin">⭐</div>
        <div className="fixed top-20 right-8 text-3xl animate-bounce">🎉</div>
        <div className="fixed bottom-32 left-6 text-2xl animate-pulse">✨</div>
      </div>
    </div>
  );
};

export default Portal;
