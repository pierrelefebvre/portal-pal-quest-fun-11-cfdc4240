
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Mission = () => {
  const navigate = useNavigate();
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [distance, setDistance] = useState<number | null>(null);
  const [temperature, setTemperature] = useState<'cold' | 'warm' | 'hot' | null>(null);

  const enableLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationEnabled(true);
          // Simulation de distance à un portail
          const simulatedDistance = Math.random() * 500 + 50;
          setDistance(simulatedDistance);
          updateTemperature(simulatedDistance);
        },
        (error) => {
          console.error("Erreur de géolocalisation:", error);
          // Simulation pour les tests
          setLocationEnabled(true);
          const simulatedDistance = Math.random() * 500 + 50;
          setDistance(simulatedDistance);
          updateTemperature(simulatedDistance);
        }
      );
    }
  };

  const updateTemperature = (dist: number) => {
    if (dist < 50) setTemperature('hot');
    else if (dist < 150) setTemperature('warm');
    else setTemperature('cold');
  };

  const getTemperatureMessage = () => {
    switch (temperature) {
      case 'hot': return { text: "🔥 Tu brûles ! Le portail est tout proche !", color: "text-red-600", bg: "bg-red-50" };
      case 'warm': return { text: "😊 Tu chauffes ! Continue dans cette direction !", color: "text-orange-600", bg: "bg-orange-50" };
      case 'cold': return { text: "❄️ Tu refroidis... Cherche ailleurs !", color: "text-blue-600", bg: "bg-blue-50" };
      default: return { text: "", color: "", bg: "" };
    }
  };

  const canScanPortal = temperature === 'hot';

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-secondary p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-6 pt-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Mission Active
          </h1>
          <Badge className="bg-primary/10 text-primary font-medium px-4 py-2">
            Portail 1/5
          </Badge>
        </div>

        {/* Mission Description */}
        <Card className="mb-6 bg-card/95 backdrop-blur-sm shadow-lg border border-border">
          <CardHeader>
            <CardTitle className="text-foreground text-xl">
              Le Portail de la Bibliothèque
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Un portail magique se cache près de la grande bibliothèque ! 
              Utilise ton détecteur de magie pour le trouver.
            </p>
            <div className="bg-accent p-3 rounded-lg border border-border">
              <p className="text-accent-foreground font-medium text-sm">
                💡 Indice : Cherche près des grandes fenêtres !
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Location Status */}
        {!locationEnabled ? (
          <Card className="mb-6 bg-card/95 backdrop-blur-sm shadow-lg border border-border">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4">📍</div>
              <h3 className="text-xl font-bold text-foreground mb-4">
                Active ta localisation
              </h3>
              <p className="text-muted-foreground mb-4">
                Pour trouver les portails magiques, j'ai besoin de savoir où tu es !
              </p>
              <Button 
                onClick={enableLocation}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-4 rounded-lg text-lg"
              >
                Activer la localisation
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Temperature Indicator */}
            <Card className={`mb-6 ${getTemperatureMessage().bg} border border-border shadow-lg`}>
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-3">
                  {temperature === 'hot' ? '🔥' : temperature === 'warm' ? '😊' : '❄️'}
                </div>
                <p className={`${getTemperatureMessage().color} font-medium text-lg`}>
                  {getTemperatureMessage().text}
                </p>
                {distance && (
                  <p className="text-muted-foreground mt-2">
                    Distance estimée : {Math.round(distance)}m
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Portal Scanner */}
            <Card className="mb-6 bg-card/95 backdrop-blur-sm shadow-lg border border-border">
              <CardContent className="p-6 text-center">
                <div className="text-5xl mb-4">🔍</div>
                <Button 
                  onClick={() => navigate('/navigation')}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-4 rounded-lg text-lg mb-3"
                >
                  Naviguer vers le portail
                </Button>
                {canScanPortal && (
                  <Button 
                    onClick={() => navigate('/portal/1')}
                    className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-medium py-4 rounded-lg text-lg"
                  >
                    Scanner le portail maintenant !
                  </Button>
                )}
                {!canScanPortal && (
                  <p className="text-muted-foreground text-sm mt-2">
                    Utilise la navigation pour te rapprocher !
                  </p>
                )}
              </CardContent>
            </Card>
          </>
        )}

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
            onClick={() => navigate('/map')}
            variant="outline"
            className="bg-card/80 backdrop-blur-sm border-border hover:bg-accent text-foreground font-medium py-3 rounded-lg"
          >
            <MapPin className="mr-2 h-4 w-4" />
            Carte
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Mission;
