
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();

  const badges = [
    { id: 1, name: "Lecteur Magique", description: "Portail de la Bibliothèque", emoji: "📚", unlocked: true },
    { id: 2, name: "Ami des Arbres", description: "Portail du Parc", emoji: "🌳", unlocked: false },
    { id: 3, name: "Super Élève", description: "Portail de l'École", emoji: "🎓", unlocked: true },
    { id: 4, name: "Citoyen Modèle", description: "Portail de la Mairie", emoji: "🏛️", unlocked: false },
    { id: 5, name: "Champion Sportif", description: "Portail du Stade", emoji: "⚽", unlocked: false },
  ];

  const unlockedBadges = badges.filter(badge => badge.unlocked);
  const totalBadges = badges.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-secondary p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-6 pt-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Mon Profil
          </h1>
          <p className="text-muted-foreground">
            Explorateur de portails magiques
          </p>
        </div>

        {/* Stats Card */}
        <Card className="mb-6 bg-card/95 backdrop-blur-sm shadow-lg border border-border">
          <CardHeader>
            <CardTitle className="text-center text-foreground">
              Mes Statistiques
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="text-3xl font-bold text-green-800">
                  {unlockedBadges.length}
                </div>
                <p className="text-green-600 font-medium">
                  Portails Trouvés
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="text-3xl font-bold text-blue-800">
                  {Math.round((unlockedBadges.length / totalBadges) * 100)}%
                </div>
                <p className="text-blue-600 font-medium">
                  Progression
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Bar */}
        <Card className="mb-6 bg-card/95 backdrop-blur-sm shadow-lg border border-border">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-foreground mb-4 text-center">
              Progression Globale
            </h3>
            <div className="w-full bg-muted rounded-full h-4 mb-4">
              <div 
                className="bg-gradient-to-r from-primary to-primary/80 h-4 rounded-full transition-all duration-500"
                style={{ width: `${(unlockedBadges.length / totalBadges) * 100}%` }}
              ></div>
            </div>
            <p className="text-center text-muted-foreground">
              {unlockedBadges.length} / {totalBadges} portails découverts
            </p>
          </CardContent>
        </Card>

        {/* Badges Collection */}
        <Card className="mb-6 bg-card/95 backdrop-blur-sm shadow-lg border border-border">
          <CardHeader>
            <CardTitle className="text-center text-foreground">
              Ma Collection de Badges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`flex items-center p-4 rounded-lg border transition-all duration-200 ${
                    badge.unlocked
                      ? 'bg-accent border-border shadow-md'
                      : 'bg-muted border-border opacity-60'
                  }`}
                >
                  <div className={`text-4xl mr-4 ${badge.unlocked ? '' : 'grayscale'}`}>
                    {badge.emoji}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-medium ${badge.unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {badge.name}
                    </h4>
                    <p className={`text-sm ${badge.unlocked ? 'text-muted-foreground' : 'text-muted-foreground/70'}`}>
                      {badge.description}
                    </p>
                  </div>
                  {badge.unlocked ? (
                    <Badge className="bg-green-100 text-green-800 font-medium">
                      ✓ Débloqué
                    </Badge>
                  ) : (
                    <Badge className="bg-muted text-muted-foreground">
                      🔒 Verrouillé
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card className="mb-6 bg-card/95 backdrop-blur-sm shadow-lg border border-border">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-foreground mb-4 text-center">
              Prochains Objectifs
            </h3>
            <div className="space-y-3">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p className="text-blue-800 font-medium">🎯 Trouve 3 portails</p>
                <p className="text-blue-600 text-sm">Récompense : Badge Explorateur</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                <p className="text-purple-800 font-medium">🏆 Trouve tous les portails</p>
                <p className="text-purple-600 text-sm">Récompense : Badge Maître des Portails</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="bg-card/80 backdrop-blur-sm border-border hover:bg-accent text-foreground font-medium py-3 rounded-lg"
          >
            Accueil
          </Button>
          
          <Button
            onClick={() => navigate('/mission')}
            variant="outline"
            className="bg-card/80 backdrop-blur-sm border-border hover:bg-accent text-foreground font-medium py-3 rounded-lg"
          >
            Continuer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
