
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge, Star, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-secondary p-4">
      <div className="max-w-md mx-auto">
        {/* Header avec titre */}
        <div className="text-center mb-8 pt-8">
          <div className="text-6xl mb-4">🏰✨</div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Exploration Urbaine
          </h1>
          <p className="text-lg text-muted-foreground">
            Découvrez les points d'intérêt de votre ville
          </p>
        </div>

        {/* Carte principale */}
        <Card className="mb-6 bg-card/95 backdrop-blur-sm shadow-lg border border-border">
          <CardContent className="p-6 text-center">
            <div className="text-5xl mb-4">🗺️🔍</div>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Commencer l'exploration
            </h2>
            <p className="text-muted-foreground mb-6">
              Utilisez votre appareil pour découvrir les lieux remarquables de votre environnement
            </p>
            <Button 
              onClick={() => navigate('/mission')}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-4 px-6 rounded-lg text-lg shadow-sm transition-colors duration-200"
            >
              Démarrer l'exploration
            </Button>
          </CardContent>
        </Card>

        {/* Navigation du bas */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => navigate('/profile')}
            variant="outline"
            className="bg-card/80 backdrop-blur-sm border-border hover:bg-accent text-foreground font-medium py-4 rounded-lg shadow-sm"
          >
            <Badge className="mr-2 h-5 w-5" />
            Profil
          </Button>
          
          <Button
            onClick={() => navigate('/map')}
            variant="outline"
            className="bg-card/80 backdrop-blur-sm border-border hover:bg-accent text-foreground font-medium py-4 rounded-lg shadow-sm"
          >
            <MapPin className="mr-2 h-5 w-5" />
            Carte
          </Button>
        </div>

      </div>
    </div>
  );
};

export default Index;
