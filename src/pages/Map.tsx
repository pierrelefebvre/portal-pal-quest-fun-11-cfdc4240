
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { usePortals } from "@/contexts/PortalContext";

const Map = () => {
  const navigate = useNavigate();
  const { portals } = usePortals();
  
  const handlePortalClick = (portal: typeof portals[0]) => {
    if (portal.found) {
      toast.success(`📍 Portail ${portal.name} déjà découvert !`);
      navigate(`/portal/${portal.id}`);
    } else {
      toast.info(`🧭 Navigation vers ${portal.name} activée !`);
      navigate(`/navigation?target=${portal.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-secondary p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-6 pt-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Carte de Croix
          </h1>
          <p className="text-muted-foreground">
            Découvre tous les portails de ta ville !
          </p>
          <p className="text-muted-foreground text-sm mt-2">
            💡 Clique sur un portail pour naviguer vers lui
          </p>
        </div>

        {/* Map Container */}
        <Card className="mb-6 bg-card/95 backdrop-blur-sm shadow-lg border border-border">
          <CardContent className="p-4">
            <div className="relative bg-gradient-to-br from-muted to-secondary rounded-lg h-80 overflow-hidden border border-border">
              {/* Terrain elements représentant Croix */}
              <div className="absolute top-6 left-6 w-12 h-8 bg-primary/20 rounded-lg" title="Parc Barbieux"></div>
              <div className="absolute top-12 right-8 w-8 h-8 bg-accent rounded-sm" title="Église"></div>
              <div className="absolute bottom-12 left-12 w-10 h-6 bg-secondary rounded-lg" title="Mairie"></div>
              <div className="absolute bottom-8 right-8 w-14 h-10 bg-muted rounded-lg" title="Stade"></div>
              
              {/* Routes principales */}
              <div className="absolute top-1/2 left-0 right-0 h-2 bg-border transform -translate-y-1/2"></div>
              <div className="absolute top-0 bottom-0 left-1/2 w-2 bg-border transform -translate-x-1/2"></div>
              
              {/* User position */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-4 h-4 bg-primary rounded-full border-2 border-card shadow-lg animate-pulse"></div>
                <div className="text-xs text-foreground font-medium mt-1 text-center">Moi</div>
              </div>
              
              {/* Portals */}
              {portals.map((portal) => (
                <div
                  key={portal.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform"
                  style={{ left: `${portal.x}%`, top: `${portal.y}%` }}
                  onClick={() => handlePortalClick(portal)}
                >
                  <div className={`w-6 h-6 rounded-full border-2 border-card shadow-lg ${
                    portal.found 
                      ? 'bg-green-500 animate-pulse' 
                      : 'bg-primary animate-bounce'
                  }`}>
                    <div className="text-white text-xs text-center leading-6">
                      {portal.found ? '✓' : '?'}
                    </div>
                  </div>
                  <div className="text-xs font-medium text-center mt-1 text-foreground">
                    {portal.name}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Portal List */}
        <Card className="mb-6 bg-card/95 backdrop-blur-sm shadow-lg border border-border">
          <CardContent className="p-4">
            <h3 className="text-lg font-bold text-foreground mb-4 text-center">
              Portails de Croix à découvrir
            </h3>
            <div className="space-y-2">
              {portals.map((portal) => (
                <div
                  key={portal.id}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer hover:scale-105 transition-transform ${
                    portal.found 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-card border-border'
                  }`}
                  onClick={() => handlePortalClick(portal)}
                >
                  <div className="flex items-center">
                    <div className={`w-6 h-6 rounded-full mr-3 flex items-center justify-center text-white font-medium ${
                      portal.found ? 'bg-green-500' : 'bg-primary'
                    }`}>
                      {portal.found ? '✓' : portal.id}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{portal.name}</p>
                      <p className="text-sm text-muted-foreground">{portal.hint}</p>
                    </div>
                  </div>
                  <Badge className={portal.found ? 'bg-green-100 text-green-800' : 'bg-primary/10 text-primary'}>
                    {portal.found ? 'Trouvé' : 'Naviguer'}
                  </Badge>
                </div>
              ))}
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
            Mission
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Map;
