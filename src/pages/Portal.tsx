
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { usePortals } from "@/contexts/PortalContext";

const Portal = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showAnimation, setShowAnimation] = useState(true);
  const { markPortalAsFound } = usePortals();

  const portals = {
    '1': {
      name: "Portail de la Place Jean Jaurès",
      description: "Ce portail magique garde les secrets du cœur de la ville ! Les énergies se rassemblent ici depuis des siècles.",
      reward: "Badge Explorateur du Centre",
      emoji: "🏛️",
      color: "from-primary to-primary/80"
    },
    '2': {
      name: "Portail du Parc Barbieux",
      description: "Un portail de la nature où les arbres murmurent des histoires anciennes et les fleurs brillent comme des étoiles.",
      reward: "Badge Ami des Arbres",
      emoji: "🌳",
      color: "from-green-500 to-green-600"
    },
    '3': {
      name: "Portail de l'Église Saint-Martin", 
      description: "Le portail de la spiritualité ! Ici, les prières se transforment en lumière et l'histoire résonne.",
      reward: "Badge Gardien du Patrimoine",
      emoji: "⛪",
      color: "from-amber-500 to-amber-600"
    },
    '4': {
      name: "Portail de la Mairie",
      description: "Le portail du civisme où les décisions importantes prennent vie et la communauté se rassemble.",
      reward: "Badge Citoyen Engagé",
      emoji: "🏛️",
      color: "from-blue-500 to-blue-600"
    },
    '5': {
      name: "Portail du Stade",
      description: "Le portail du sport et de l'effort ! L'énergie des champions résonne encore ici.",
      reward: "Badge Champion",
      emoji: "⚽",
      color: "from-green-600 to-emerald-600"
    },
    '6': {
      name: "Portail du Decathlon",
      description: "Le portail de l'aventure moderne ! Ici, tous les sports se rencontrent dans l'harmonie.",
      reward: "Badge Sportif Moderne",
      emoji: "🏃‍♂️",
      color: "from-orange-500 to-orange-600"
    }
  };

  const currentPortal = portals[id as keyof typeof portals] || portals['1'];

  useEffect(() => {
    // Marquer le portail comme trouvé dès qu'on arrive sur la page
    if (id) {
      markPortalAsFound(parseInt(id));
    }

    const timer = setTimeout(() => {
      setShowAnimation(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [id, markPortalAsFound]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-secondary p-4">
      <div className="max-w-md mx-auto">
        {showAnimation && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="text-center animate-pulse">
              <div className="text-8xl mb-4">🎉</div>
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
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Félicitations !
          </h1>
          <Badge className="bg-green-100 text-green-800 font-medium px-4 py-2">
            ✅ Portail Découvert
          </Badge>
        </div>

        {/* Portal Card */}
        <Card className="mb-6 bg-card/95 backdrop-blur-sm shadow-lg border border-border overflow-hidden">
          <div className={`h-32 bg-gradient-to-r ${currentPortal.color} flex items-center justify-center`}>
            <div className="text-6xl animate-pulse">{currentPortal.emoji}</div>
          </div>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-foreground mb-4 text-center">
              {currentPortal.name}
            </h2>
            <p className="text-muted-foreground mb-6 text-center leading-relaxed">
              {currentPortal.description}
            </p>
            
            <div className="bg-accent p-4 rounded-lg border border-border text-center">
              <div className="text-3xl mb-2">🏆</div>
              <p className="text-accent-foreground font-medium">
                Nouvelle récompense débloquée !
              </p>
              <p className="text-accent-foreground font-medium">
                {currentPortal.reward}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 bg-card/95 backdrop-blur-sm shadow-lg border border-border">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-foreground mb-4 text-center">
              Ta progression
            </h3>
            <div className="flex justify-center items-center space-x-2 mb-4">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <div
                  key={num}
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                    num <= parseInt(id || '1') 
                      ? 'bg-green-500 text-white' 
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {num <= parseInt(id || '1') ? '✓' : num}
                </div>
              ))}
            </div>
            <p className="text-center text-muted-foreground">
              {id}/6 portails découverts
            </p>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Button 
            onClick={() => navigate('/mission')}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-4 rounded-lg text-lg"
          >
            Chercher le prochain portail
          </Button>
          
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={() => navigate('/profile')}
              variant="outline"
              className="bg-card/80 backdrop-blur-sm border-border hover:bg-accent text-foreground font-medium py-3 rounded-lg"
            >
              <Star className="mr-2 h-4 w-4" />
              Mes Badges
            </Button>
            
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="bg-card/80 backdrop-blur-sm border-border hover:bg-accent text-foreground font-medium py-3 rounded-lg"
            >
              Accueil
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portal;
