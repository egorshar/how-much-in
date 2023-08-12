import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { FormattedDate, FormattedMessage } from 'react-intl';
import { useNavigation, ParamListBase } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BlurView } from '@react-native-community/blur';
import Ionicons from '@expo/vector-icons/Ionicons';
import tw from '@ui/tailwind';
import { useCallback } from 'react';

type MainFooterProps = {
  isEditing: boolean;
  setEditing: (isEditing: boolean) => void;
  lastSync: number;
  refreshing: boolean;
  refreshingMessage: string;
};

export default function MainFooter({
  isEditing,
  setEditing,
  lastSync,
  refreshing,
  refreshingMessage,
}: MainFooterProps) {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const getRefreshingMessage = useCallback(() => {
    switch (true) {
      case refreshing && refreshingMessage.length > 0:
        return (
          <FormattedMessage
            id={`app.error.${refreshingMessage}`}
            defaultMessage={refreshingMessage}
          />
        );

      case refreshing && !refreshingMessage.length:
        return <FormattedMessage id="app.Refreshing rates" />;

      default:
        return (
          <>
            <FormattedMessage id="app.Rates from" />{' '}
            <FormattedDate value={new Date(lastSync)} />
          </>
        );
    }
  }, [lastSync, refreshing, refreshingMessage]);

  return (
    <BlurView
      style={tw.style(tw`absolute bottom-0 w-full h-[82px]`)}
      blurType="regular"
      reducedTransparencyFallbackColor="white"
    >
      <View
        style={tw.style(tw`bg-slate-300`, {
          height: StyleSheet.hairlineWidth,
        })}
      />

      <View style={tw`flex-row items-center justify-center px-5 mt-3`}>
        {isEditing ? (
          <TouchableOpacity
            style={tw`p-4 -m-4 ml-auto`}
            onPress={() => setEditing(!isEditing)}
          >
            <Text style={tw`font-sansSemiBold text-base`}>
              <FormattedMessage id="app.Done" />
            </Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity
              onPress={() => navigation.navigate('AboutModal')}
              style={tw`p-4 -m-4`}
            >
              <Ionicons
                name="information-circle-outline"
                size={25}
                color={tw.color('slate-500')}
              />
            </TouchableOpacity>

            <View style={tw`grow flex-row items-center justify-center`}>
              {refreshing && !refreshingMessage && (
                <ActivityIndicator style={tw`mr-2`} />
              )}

              <Text style={tw`text-center text-slate-500 text-sm font-sans`}>
                {getRefreshingMessage()}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => setEditing(!isEditing)}
              style={tw`p-4 -m-4`}
            >
              <Ionicons
                name="list-outline"
                size={25}
                color={tw.color('slate-500')}
              />
            </TouchableOpacity>
          </>
        )}
      </View>
    </BlurView>
  );
}
