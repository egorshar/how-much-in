/* eslint-disable global-require */

import { useCallback, useEffect, useRef } from 'react';
import { Appearance } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { IntlProvider } from 'react-intl';
import { useAppColorScheme, useDeviceContext } from 'twrnc';
import { getLocales } from 'expo-localization';

import RU_MESSAGES from '@locales/ru.json';
import EN_MESSAGES from '@locales/en.json';

import { useStore } from '@services/store';

import tw from './ui/tailwind';
import Navigation from './navigation';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [{ languageCode }] = getLocales();
  const colorScheme = useStore(s => s.colorScheme);

  const [fontsLoaded] = useFonts({
    Inter: require('@assets/fonts/Inter-Regular.otf'),
    'Inter-Bold': require('@assets/fonts/Inter-Bold.otf'),
    'Inter-SemiBold': require('@assets/fonts/Inter-SemiBold.otf'),
  });

  // twrnc's useDeviceContext runs its initializer once per mount; ongoing
  // scheme changes are pushed imperatively. We keep useAppColorScheme so the
  // tree re-renders when the scheme flips, but capture its setter through a
  // ref so the listener-effect doesn't churn on every render.
  useDeviceContext(tw, {
    observeDeviceColorSchemeChanges: false,
    initialColorScheme: colorScheme === 'system' ? 'device' : colorScheme,
  });
  const [, , setTwScheme] = useAppColorScheme(tw);
  const setTwSchemeRef = useRef(setTwScheme);
  setTwSchemeRef.current = setTwScheme;

  useEffect(() => {
    if (colorScheme !== 'system') {
      setTwSchemeRef.current(colorScheme);
      return undefined;
    }
    const resolveSystem = (sys: string | null | undefined) =>
      sys === 'dark' ? 'dark' : 'light';
    setTwSchemeRef.current(resolveSystem(Appearance.getColorScheme()));
    const sub = Appearance.addChangeListener(({ colorScheme: sys }) =>
      setTwSchemeRef.current(resolveSystem(sys)),
    );
    return () => sub.remove();
  }, [colorScheme]);

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
      locale={languageCode || 'en'}
      defaultLocale="en"
    >
      <SafeAreaProvider onLayout={onLayoutRootView}>
        {/* eslint-disable-next-line react/style-prop-object */}
        <StatusBar style="auto" />
        <Navigation />
      </SafeAreaProvider>
    </IntlProvider>
  );
}
