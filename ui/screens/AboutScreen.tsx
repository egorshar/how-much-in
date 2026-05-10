import { Children, useEffect } from 'react';
import {
  Linking,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FormattedMessage, useIntl } from 'react-intl';
import tw from '@ui/tailwind';

import { APP_ID, IS_IOS26 } from '@constants';
import Ionicons from '@expo/vector-icons/Ionicons';

import FormButton from '@ui/components/Form/Button';
import FormText from '@ui/components/Form/Text';
import FormElement from '@ui/components/Form/Element';
import SegmentedControl from '@ui/components/Form/SegmentedControl';

import { useStore } from '@services/store';

export default function AboutScreen() {
  const intl = useIntl();
  const navigation = useNavigation();
  const store = useStore();

  useEffect(() => {
    if (Platform.OS === 'ios') {
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity
            style={
              IS_IOS26
                ? tw`w-8 h-8 rounded-full items-center justify-center`
                : tw`p-4 -m-4`
            }
            onPress={() => {
              navigation.goBack();
            }}
          >
            {IS_IOS26 ? (
              <Ionicons
                name="close-outline"
                size={30}
                color={tw.color('violet-600')}
              />
            ) : (
              <Text style={tw`font-sansSemiBold text-base`}>
                <FormattedMessage id="app.Close" />
              </Text>
            )}
          </TouchableOpacity>
        ),
      });
    }
  }, []);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={tw`pb-10`}
    >
      <FormElement isFirst isLast hasStaticHeight={false}>
        <View style={tw`flex-1 py-3`}>
          <Text
            style={tw`text-base font-sans text-black dark:text-slate-100 mb-2`}
          >
            {intl.formatMessage({ id: 'app.about.Appearance' })}
          </Text>
          <SegmentedControl<ColorScheme>
            value={store.colorScheme}
            onChange={store.setColorScheme}
            options={[
              {
                value: 'system',
                label: intl.formatMessage({ id: 'app.about.theme.System' }),
              },
              {
                value: 'light',
                label: intl.formatMessage({ id: 'app.about.theme.Light' }),
              },
              {
                value: 'dark',
                label: intl.formatMessage({ id: 'app.about.theme.Dark' }),
              },
            ]}
          />
        </View>
      </FormElement>

      <FormText
        text={`${intl.formatMessage({
          id: 'app.about.Rates updated',
        })} ${intl.formatDate(new Date(store.lastSync))}`}
        description={
          <>
            {Children.toArray(
              intl.formatMessage(
                { id: 'app.about.Sources info' },
                {
                  link: chunks => (
                    <Text
                      style={tw`text-violet-600`}
                      onPress={() =>
                        Linking.openURL(
                          'https://github.com/fawazahmed0/exchange-api',
                        )
                      }
                    >
                      {chunks}
                    </Text>
                  ),
                },
              ),
            )}
            {'\n\n'}
            {intl.formatMessage({ id: 'app.about.Purposes info' })}
          </>
        }
        isFirst
        isLast
      />

      <FormButton
        title={intl.formatMessage({ id: 'app.about.Feedback' })}
        description={intl.formatMessage({
          id: 'app.about.Feedback description',
        })}
        onPress={() =>
          Linking.openURL(`https://github.com/egorshar/howmuchin/issues`)
        }
        isFirst
        isLast
      />

      <FormButton
        title={intl.formatMessage({ id: 'app.about.Privacy' })}
        onPress={() => Linking.openURL(`https://www.how-much.in/privacy.html`)}
        isFirst
        isLast={Platform.OS !== 'ios'}
      />
      {Platform.OS === 'ios' && (
        <FormButton
          title={intl.formatMessage({ id: 'app.about.Rate in AppStore' })}
          onPress={() =>
            Linking.openURL(
              `https://itunes.apple.com/us/app/appName/id${APP_ID}?mt=8&action=write-review`,
            )
          }
          isFirst={false}
          isLast={false}
        />
      )}
      <FormButton
        title={intl.formatMessage({ id: 'app.about.GitHub repo' })}
        description={intl.formatMessage({
          id: 'app.about.No responsibility message',
        })}
        onPress={() => Linking.openURL(`https://github.com/egorshar/howmuchin`)}
        isFirst={false}
        isLast
      />
    </ScrollView>
  );
}
