import { useEffect } from 'react';
import {
  Linking,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FormattedMessage, useIntl } from 'react-intl';
import tw from '@ui/tailwind';

import { FEEDBACK_EMAIL } from '@constants';

import FormButton from '@ui/components/Form/Button';
import FormText from '@ui/components/Form/Text';

import { useStore } from '@services/store';

export default function AddCurrencyScreen() {
  const intl = useIntl();
  const navigation = useNavigation();
  const store = useStore();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={tw`p-4 -m-4`}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Text style={tw`font-sansSemiBold text-base`}>
            <FormattedMessage id="app.Close" />
          </Text>
        </TouchableOpacity>
      ),
    });
  }, []);

  return (
    <ScrollView style={tw`py-5`}>
      <FormText
        text={`Курс обновлен ${intl.formatDate(new Date(store.lastSync))}`}
        description={
          'Информация о курсах валют загружена из публичного источника и обновляется раз в сутки\n\nДанное приложение разработано для информационных целей и не предназначено для использования как профессиональный финансовый инструмент'
        }
        isFirst
        isLast
      />

      <FormButton
        title="Обратная связь"
        description="Если заметили баг или у вас есть пожелания и идеи, то можете поделиться ими с помощью этой кнопки"
        onPress={() =>
          Linking.openURL(
            `mailto:${FEEDBACK_EMAIL}?subject=%5BHow-Much.In%5D%20Feedback`,
          )
        }
        isFirst
        isLast
      />

      <FormButton
        title="Условия использования"
        onPress={() => Linking.openURL(`https://how-much.in/terms/`)}
        isFirst
        isLast={false}
      />
      <FormButton
        title="Политика конфиденциальности"
        onPress={() => Linking.openURL(`https://how-much.in/privacy/`)}
        isFirst={false}
        isLast={false}
      />
      {Platform.OS === 'ios' && (
        <FormButton
          title="Оценка в AppStore"
          onPress={() => Linking.openURL(`https://how-much.in/privacy/`)}
          isFirst={false}
          isLast={false}
        />
      )}
      <FormButton
        title="Исходный код на GitHub"
        description="Разработчики данного приложения не несут ответственность за ошибки и задержки в данных по курсам валют и за действия на основе этих данных"
        onPress={() => Linking.openURL(`https://github.com/egorshar/howmuchin`)}
        isFirst={false}
        isLast
      />
    </ScrollView>
  );
}
