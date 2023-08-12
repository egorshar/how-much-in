import { useIntl } from 'react-intl';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import tw from '@ui/tailwind';

import AboutScreen from '@ui/screens/AboutScreen';
import AddCurrencyScreen from '@ui/screens/AddCurrencyScreen';
import MainScreen from '@ui/screens/Main';

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
          headerTitleStyle: tw`font-sansBold`,
        })}
      />

      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen
          name="AboutModal"
          component={AboutScreen}
          options={() => ({
            title: intl.formatMessage({ id: 'app.About' }),
            headerTitleStyle: tw`font-sansBold`,
          })}
        />

        <Stack.Screen
          name="AddCurrencyModal"
          component={AddCurrencyScreen}
          options={() => ({
            title: intl.formatMessage({ id: 'app.Add currency' }),
            headerTitleStyle: tw`font-sansBold`,
          })}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}

export default function Navigation() {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}
