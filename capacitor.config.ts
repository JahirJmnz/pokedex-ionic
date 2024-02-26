import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.pokedex.app',
  appName: 'pokedex',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
