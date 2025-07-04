
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { usePortalContext } from "@/contexts/PortalContext";

const Portal = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showAnimation, setShowAnimation] = useState(true);
  const { markPortalAsFound, foundPortals } = usePortalContext();

  const portals = {
    '1': {
      name: "Portail de la Bibliothèque",
      description: "Ce portail garde les secrets de tous les livres du monde. Les mots s'envolent et dansent autour de toi.",
      reward: "Badge Lecteur",
      emoji: "📚",
      color: "from-slate-600 to-slate-700"
    },
    '2': {
      name: "Portail du Parc",
      description: "Un portail de la nature où les arbres murmurent des histoires anciennes et les fleurs brillent comme des étoiles.",
      reward: "Badge Nature",
      emoji: "🌳",
      color: "from-green-600 to-green-700"
    },
    '3': {
      name: "Portail de l'École", 
      description: "Le portail de la connaissance ! Ici, chaque question trouve sa réponse et chaque rêve devient possible.",
      reward: "Badge Étudiant",
      emoji: "🎓",
      color: "from-slate-600 to-slate-700"
    }
  };

  const currentPortal = portals[id as keyof typeof portals] || portals['1'];

  useEffect(() => {
    if (id) {
      markPortalAsFound(parseInt(id));
    }
    const timer = setTimeout(() => {
      setShowAnimation(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [id, markPortalAsFound]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-md mx-auto">
        {showAnimation && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold text-white mb-4">
                PORTAIL DÉCOUVERT !
              </h2>
              <div className="text-5xl">🏆</div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-6 pt-6">
          <div className="text-5xl mb-4">{currentPortal.emoji}</div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            Félicitations !
          </h1>
          <Badge className="bg-green-100 text-green-700 font-medium px-3 py-1 border-0">
            ✅ Portail Découvert
          </Badge>
        </div>

        {/* Portal Card */}
        <Card className="mb-6 bg-white/90 backdrop-blur-sm shadow-md border border-slate-200 overflow-hidden">
          <div className={`h-24 bg-gradient-to-r ${currentPortal.color} flex items-center justify-center`}>
            <div className="text-4xl">{currentPortal.emoji}</div>
          </div>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-4 text-center">
              {currentPortal.name}
            </h2>
            <p className="text-slate-600 mb-6 text-center leading-relaxed text-sm">
              {currentPortal.description}
            </p>
            
            {/* Reward */}
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 text-center">
              <div className="text-2xl mb-2">🏆</div>
              <p className="text-amber-800 font-medium text-sm">
                Nouvelle récompense débloquée !
              </p>
              <p className="text-amber-700 font-medium text-sm">
                {currentPortal.reward}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Progress */}
        <Card className="mb-6 bg-white/90 backdrop-blur-sm shadow-md border border-slate-200">
          <CardContent className="p-6">
            <h3 className="text-base font-semibold text-slate-800 mb-4 text-center">
              Ta progression
            </h3>
            <div className="flex justify-center items-center space-x-2 mb-4">
              {[1, 2, 3, 4, 5].map((num) => (
                <div
                  key={num}
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium ${
                    foundPortals.includes(num)
                      ? 'bg-green-600 text-white' 
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {foundPortals.includes(num) ? '✓' : num}
                </div>
              ))}
            </div>
            <p className="text-center text-slate-600 text-sm">
              {foundPortals.length}/5 portails découverts
            </p>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button 
            onClick={() => navigate('/mission')}
            className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 rounded-lg"
          >
            🎯 Chercher le prochain portail
          </Button>
          
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={() => navigate('/profile')}
              variant="outline"
              className="bg-white border border-slate-300 hover:bg-slate-50 font-medium py-3 rounded-lg"
            >
              <Star className="mr-2 h-4 w-4" />
              Mes Badges
            </Button>
            
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="bg-white border border-slate-300 hover:bg-slate-50 font-medium py-3 rounded-lg"
            >
              🏠 Accueil
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portal;
