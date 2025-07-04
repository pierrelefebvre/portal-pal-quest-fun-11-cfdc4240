
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePortalContext } from "@/contexts/PortalContext";

const Profile = () => {
  const navigate = useNavigate();
  const { foundPortals } = usePortalContext();

  const badges = [
    { id: 1, name: "Lecteur", description: "Portail de la Bibliothèque", emoji: "📚" },
    { id: 2, name: "Nature", description: "Portail du Parc", emoji: "🌳" },
    { id: 3, name: "Étudiant", description: "Portail de l'École", emoji: "🎓" },
    { id: 4, name: "Citoyen", description: "Portail de la Mairie", emoji: "🏛️" },
    { id: 5, name: "Sportif", description: "Portail du Stade", emoji: "⚽" },
  ];

  const unlockedBadges = badges.filter(badge => foundPortals.includes(badge.id));
  const totalBadges = badges.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-6 pt-6">
          <div className="text-4xl mb-4 text-slate-600">👤</div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            Mon Profil
          </h1>
          <p className="text-slate-600">
            Explorateur de portails
          </p>
        </div>

        {/* Stats Card */}
        <Card className="mb-6 bg-white/90 backdrop-blur-sm shadow-md border border-slate-200">
          <CardHeader>
            <CardTitle className="text-center text-slate-800 text-lg">
              Mes Statistiques
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="text-2xl font-bold text-green-700">
                  {unlockedBadges.length}
                </div>
                <p className="text-green-600 font-medium text-sm">
                  Portails Trouvés
                </p>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div className="text-2xl font-bold text-slate-700">
                  {Math.round((unlockedBadges.length / totalBadges) * 100)}%
                </div>
                <p className="text-slate-600 font-medium text-sm">
                  Progression
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Bar */}
        <Card className="mb-6 bg-white/90 backdrop-blur-sm shadow-md border border-slate-200">
          <CardContent className="p-6">
            <h3 className="text-base font-semibold text-slate-800 mb-4 text-center">
              Progression Globale
            </h3>
            <div className="w-full bg-slate-200 rounded-full h-3 mb-4">
              <div 
                className="bg-slate-700 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(unlockedBadges.length / totalBadges) * 100}%` }}
              ></div>
            </div>
            <p className="text-center text-slate-600 text-sm">
              {unlockedBadges.length} / {totalBadges} portails découverts
            </p>
          </CardContent>
        </Card>

        {/* Badges Collection */}
        <Card className="mb-6 bg-white/90 backdrop-blur-sm shadow-md border border-slate-200">
          <CardHeader>
            <CardTitle className="text-center text-slate-800 text-lg">
              Ma Collection de Badges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {badges.map((badge) => {
                const isUnlocked = foundPortals.includes(badge.id);
                return (
                  <div
                    key={badge.id}
                    className={`flex items-center p-4 rounded-lg border transition-all duration-200 ${
                      isUnlocked
                        ? 'bg-green-50 border-green-200 shadow-sm'
                        : 'bg-slate-50 border-slate-200 opacity-60'
                    }`}
                  >
                    <div className={`text-3xl mr-4 ${!isUnlocked ? 'grayscale' : ''}`}>
                      {badge.emoji}
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-medium ${isUnlocked ? 'text-green-800' : 'text-slate-600'}`}>
                        {badge.name}
                      </h4>
                      <p className={`text-sm ${isUnlocked ? 'text-green-600' : 'text-slate-500'}`}>
                        {badge.description}
                      </p>
                    </div>
                    {isUnlocked ? (
                      <Badge className="bg-green-100 text-green-700 border-0">
                        ✓ Débloqué
                      </Badge>
                    ) : (
                      <Badge className="bg-slate-100 text-slate-600 border-0">
                        🔒 Verrouillé
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card className="mb-6 bg-white/90 backdrop-blur-sm shadow-md border border-slate-200">
          <CardContent className="p-6">
            <h3 className="text-base font-semibold text-slate-800 mb-4 text-center">
              Prochains Objectifs
            </h3>
            <div className="space-y-3">
              <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                <p className="text-amber-800 font-medium text-sm">🎯 Trouve 3 portails</p>
                <p className="text-amber-600 text-xs">Récompense : Badge Explorateur</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <p className="text-slate-800 font-medium text-sm">🏆 Trouve tous les portails</p>
                <p className="text-slate-600 text-xs">Récompense : Badge Maître des Portails</p>
              </div>
            </div>
          </CardContent>
        </Card>

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
            onClick={() => navigate('/mission')}
            variant="outline"
            className="bg-white border border-slate-300 hover:bg-slate-50 font-medium py-3 rounded-lg"
          >
            🎯 Continuer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
