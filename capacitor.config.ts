
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.77b719d23c9f4b84b4d2fa43eed563d5',
  appName: 'portal-pal-quest-fun',
  webDir: 'dist',
  server: {
    url: 'https://77b719d2-3c9f-4b84-b4d2-fa43eed563d5.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#EB459E',
      showSpinner: true,
      spinnerColor: '#FFFFFF'
    },
    Geolocation: {
      permissions: ["location"]
    },
    DeviceMotion: {
      permissions: ["motion"]
    }
  }
};

export default config;
