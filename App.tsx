/* eslint-disable global-require */

import { useCallback } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { IntlProvider } from 'react-intl';
import { useDeviceContext } from 'twrnc';
import { getLocales } from 'expo-localization';

import RU_MESSAGES from '@locales/ru.json';
import EN_MESSAGES from '@locales/en.json';

import tw from './ui/tailwind';
import Navigation from './navigation';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [{ languageCode }] = getLocales();

  const [fontsLoaded] = useFonts({
    Inter: require('@assets/fonts/Inter-Regular.otf'),
    'Inter-Bold': require('@assets/fonts/Inter-Bold.otf'),
    'Inter-SemiBold': require('@assets/fonts/Inter-SemiBold.otf'),
  });

  useDeviceContext(tw, { withDeviceColorScheme: false });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <IntlProvider
      messages={languageCode === 'ru' ? RU_MESSAGES : EN_MESSAGES}
      locale={languageCode}
      defaultLocale="en"
    >
      <SafeAreaProvider onLayout={onLayoutRootView}>
        <Navigation />
      </SafeAreaProvider>
    </IntlProvider>
  );
}
