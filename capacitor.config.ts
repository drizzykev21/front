import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'cl.pinolabs.am',
  appName: 'tellevoapp',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
