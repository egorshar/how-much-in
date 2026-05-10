import { Platform, useColorScheme } from 'react-native';
import { useIntl } from 'react-intl';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import tw from '@ui/tailwind';

import { IS_IOS26 } from '@constants';
import AboutScreen from '@ui/screens/AboutScreen';
import AddCurrencyScreen from '@ui/screens/AddCurrencyScreen';
import MainScreen from '@ui/screens/Main';
import { useStore } from '@services/store';

const Stack = createNativeStackNavigator();

function RootNavigator() {
  const intl = useIntl();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={MainScreen}
        options={() => ({
          title: intl.formatMessage({ id: 'app.title' }),
          headerTitleStyle: tw`font-sansBold text-black dark:text-slate-100`,
          headerLargeTitleEnabled: Platform.OS === 'ios',
          headerLargeTitleStyle: tw`font-sansBold text-black dark:text-slate-100`,
          headerTransparent: Platform.OS === 'ios',
          headerBlurEffect: !IS_IOS26 ? 'regular' : undefined,
        })}
      />

      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen
          name="AboutModal"
          component={AboutScreen}
          options={() => ({
            title: intl.formatMessage({ id: 'app.About' }),
            headerTitleStyle: tw`font-sansBold text-black dark:text-slate-100`,
            headerLargeTitleEnabled: Platform.OS === 'ios',
            headerLargeTitleStyle: tw`font-sansBold text-black dark:text-slate-100`,
            headerTransparent: Platform.OS === 'ios',
            headerBlurEffect: !IS_IOS26 ? 'regular' : undefined,
          })}
        />

        <Stack.Screen
          name="AddCurrencyModal"
          component={AddCurrencyScreen}
          options={() => ({
            title: intl.formatMessage({ id: 'app.Add currency' }),
            headerTitleStyle: tw`font-sansBold`,
            headerTransparent: Platform.OS === 'ios' && IS_IOS26,
          })}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}

export default function Navigation() {
  const stored = useStore(s => s.colorScheme);
  const system = useColorScheme();
  // useColorScheme() can return null/undefined briefly at cold start; fall
  // back to light rather than flipping the nav header to dark.
  const effective = stored === 'system' ? (system ?? 'light') : stored;

  return (
    <NavigationContainer
      theme={effective === 'dark' ? DarkTheme : DefaultTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}
