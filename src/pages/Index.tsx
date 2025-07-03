
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge, Star, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-yellow-50 to-blue-100 p-4">
      <div className="max-w-md mx-auto">
        {/* Header avec titre */}
        <div className="text-center mb-8 pt-8">
          <div className="text-6xl mb-4">🏰✨</div>
          <h1 className="text-4xl font-bold text-purple-800 mb-2">
            Chasse aux Portails
          </h1>
          <p className="text-lg text-purple-600">
            Trouve les portails magiques cachés dans ta ville !
          </p>
        </div>

        {/* Carte principale */}
        <Card className="mb-6 bg-white/80 backdrop-blur-sm shadow-lg border-2 border-purple-200">
          <CardContent className="p-6 text-center">
            <div className="text-5xl mb-4">🗺️🔍</div>
            <h2 className="text-2xl font-bold text-purple-800 mb-4">
              Prêt pour l'aventure ?
            </h2>
            <p className="text-purple-600 mb-6">
              Utilise ton téléphone pour découvrir des portails magiques cachés autour de toi !
            </p>
            <Button 
              onClick={() => navigate('/mission')}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-full text-lg shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              🚀 Commencer la quête
            </Button>
          </CardContent>
        </Card>

        {/* Navigation du bas */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => navigate('/profile')}
            variant="outline"
            className="bg-white/80 backdrop-blur-sm border-2 border-green-300 hover:bg-green-50 text-green-700 font-bold py-4 rounded-2xl shadow-md"
          >
            <Badge className="mr-2 h-5 w-5" />
            Mes Récompenses
          </Button>
          
          <Button
            onClick={() => navigate('/map')}
            variant="outline"
            className="bg-white/80 backdrop-blur-sm border-2 border-blue-300 hover:bg-blue-50 text-blue-700 font-bold py-4 rounded-2xl shadow-md"
          >
            <MapPin className="mr-2 h-5 w-5" />
            Carte Magique
          </Button>
        </div>

        {/* Éléments décoratifs */}
        <div className="fixed top-10 left-10 text-4xl animate-bounce">⭐</div>
        <div className="fixed top-32 right-8 text-3xl animate-pulse">🌟</div>
        <div className="fixed bottom-20 left-6 text-2xl animate-bounce">✨</div>
      </div>
    </div>
  );
};

export default Index;
