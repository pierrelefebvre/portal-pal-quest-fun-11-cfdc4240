
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge, Star, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-md mx-auto">
        {/* Header avec titre */}
        <div className="text-center mb-8 pt-8">
          <div className="text-4xl mb-4 text-slate-600">🏰</div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Chasse aux Portails
          </h1>
          <p className="text-lg text-slate-600">
            Découvre les portails cachés dans ta ville
          </p>
        </div>

        {/* Carte principale */}
        <Card className="mb-6 bg-white/90 backdrop-blur-sm shadow-md border border-slate-200">
          <CardContent className="p-6 text-center">
            <div className="text-4xl mb-4 text-slate-600">🗺️</div>
            <h2 className="text-xl font-semibold text-slate-800 mb-4">
              Prêt pour l'aventure ?
            </h2>
            <p className="text-slate-600 mb-6">
              Utilise ton téléphone pour découvrir des portails cachés autour de toi
            </p>
            <Button 
              onClick={() => navigate('/mission')}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 px-6 rounded-lg text-base shadow-sm hover:shadow-md transition-all duration-200"
            >
              Commencer la quête
            </Button>
          </CardContent>
        </Card>

        {/* Navigation du bas */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => navigate('/profile')}
            variant="outline"
            className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium py-3 rounded-lg shadow-sm"
          >
            <Badge className="mr-2 h-4 w-4" />
            Mes Récompenses
          </Button>
          
          <Button
            onClick={() => navigate('/map')}
            variant="outline"
            className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium py-3 rounded-lg shadow-sm"
          >
            <MapPin className="mr-2 h-4 w-4" />
            Carte
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
