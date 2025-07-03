
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
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-blue-50 to-purple-100 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-6 pt-6">
          <div className="text-6xl mb-4">👤✨</div>
          <h1 className="text-3xl font-bold text-purple-800 mb-2">
            Mon Profil
          </h1>
          <p className="text-purple-600">
            Explorateur de portails magiques
          </p>
        </div>

        {/* Stats Card */}
        <Card className="mb-6 bg-white/90 backdrop-blur-sm shadow-lg border-2 border-purple-200">
          <CardHeader>
            <CardTitle className="text-center text-purple-800">
              🏆 Mes Statistiques
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-green-100 p-4 rounded-lg border-2 border-green-300">
                <div className="text-3xl font-bold text-green-800">
                  {unlockedBadges.length}
                </div>
                <p className="text-green-600 font-semibold">
                  Portails Trouvés
                </p>
              </div>
              <div className="bg-blue-100 p-4 rounded-lg border-2 border-blue-300">
                <div className="text-3xl font-bold text-blue-800">
                  {Math.round((unlockedBadges.length / totalBadges) * 100)}%
                </div>
                <p className="text-blue-600 font-semibold">
                  Progression
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Bar */}
        <Card className="mb-6 bg-white/90 backdrop-blur-sm shadow-lg">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-purple-800 mb-4 text-center">
              🎯 Progression Globale
            </h3>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
              <div 
                className="bg-gradient-to-r from-green-500 to-blue-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${(unlockedBadges.length / totalBadges) * 100}%` }}
              ></div>
            </div>
            <p className="text-center text-purple-600">
              {unlockedBadges.length} / {totalBadges} portails découverts
            </p>
          </CardContent>
        </Card>

        {/* Badges Collection */}
        <Card className="mb-6 bg-white/90 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-purple-800">
              🏅 Ma Collection de Badges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`flex items-center p-4 rounded-lg border-2 transition-all duration-200 ${
                    badge.unlocked
                      ? 'bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-300 shadow-md'
                      : 'bg-gray-100 border-gray-300 opacity-60'
                  }`}
                >
                  <div className={`text-4xl mr-4 ${badge.unlocked ? 'animate-pulse' : 'grayscale'}`}>
                    {badge.emoji}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-bold ${badge.unlocked ? 'text-orange-800' : 'text-gray-600'}`}>
                      {badge.name}
                    </h4>
                    <p className={`text-sm ${badge.unlocked ? 'text-orange-600' : 'text-gray-500'}`}>
                      {badge.description}
                    </p>
                  </div>
                  {badge.unlocked ? (
                    <Badge className="bg-green-200 text-green-800 font-bold">
                      ✓ Débloqué
                    </Badge>
                  ) : (
                    <Badge className="bg-gray-200 text-gray-600">
                      🔒 Verrouillé
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card className="mb-6 bg-white/90 backdrop-blur-sm shadow-lg">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-purple-800 mb-4 text-center">
              🌟 Prochains Objectifs
            </h3>
            <div className="space-y-3">
              <div className="bg-blue-100 p-3 rounded-lg border-2 border-blue-300">
                <p className="text-blue-800 font-bold">🎯 Trouve 3 portails</p>
                <p className="text-blue-600 text-sm">Récompense : Badge Explorateur</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg border-2 border-purple-300">
                <p className="text-purple-800 font-bold">🏆 Trouve tous les portails</p>
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
            className="bg-white/80 backdrop-blur-sm border-2 border-gray-300 hover:bg-gray-50 font-bold py-3 rounded-2xl"
          >
            🏠 Accueil
          </Button>
          
          <Button
            onClick={() => navigate('/mission')}
            variant="outline"
            className="bg-white/80 backdrop-blur-sm border-2 border-purple-300 hover:bg-purple-50 text-purple-700 font-bold py-3 rounded-2xl"
          >
            🎯 Continuer
          </Button>
        </div>

        {/* Decorative elements */}
        <div className="fixed top-8 right-8 text-3xl animate-spin">🏆</div>
        <div className="fixed bottom-32 right-6 text-2xl animate-bounce">⭐</div>
      </div>
    </div>
  );
};

export default Profile;
