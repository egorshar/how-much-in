import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  NativeSyntheticEvent,
  Platform,
  SectionList,
  StyleSheet,
  Text,
  TextInputChangeEventData,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { FormattedMessage, useIntl } from 'react-intl';
import tw from '@ui/tailwind';

import ListItemAdd from '@ui/components/ListItemAdd/ListItemAdd';

import { useStore } from '@services/store';

type AddCurrencyItem = Omit<CurrencyItem, 'label'> & {
  key: CurrencyCode;
  value: string;
};

type AddCurrenciesSection = {
  title: string;
  data: AddCurrencyItem[];
};

type CurrenciesDataWithSections = AddCurrenciesSection[];

export default function AddCurrencyScreen() {
  const store = useStore();
  const navigation = useNavigation();
  const intl = useIntl();

  const [searchValue, setSearchValue] = useState('');
  const selectedItems = useRef<CurrenciesStore['selectedCurrencies']>([
    ...store.selectedCurrencies,
  ]);

  const data: CurrenciesDataWithSections = useMemo(() => {
    const searchValueLower = searchValue.toLowerCase();
    const searchRegEx = new RegExp(`(^|\\s)${searchValueLower}`, 'i');

    const indexedData = store.currencies.reduce(
      (result: { [key: string]: AddCurrencyItem[] }, item) => {
        const countryName = intl.formatMessage({
          id: `currencies.nominative.${item.label}`,
        });

        if (
          !searchValue ||
          item.code.toLowerCase().match(searchRegEx) ||
          countryName.toLowerCase().match(searchRegEx) ||
          item.label.toLowerCase().match(searchRegEx)
        ) {
          if (!result[countryName[0]]) {
            result[countryName[0]] = [];
          }

          result[countryName[0]].push({
            key: item.code,
            code: item.code,
            value: countryName,
          });
        }

        return result;
      },
      {},
    );

    return Object.keys(indexedData)
      .map(letter => ({
        title: letter,
        data: indexedData[letter].sort((a, b) => {
          if (a.value === b.value) {
            return 0;
          }

          return a.value < b.value ? -1 : 1;
        }),
      }))
      .sort((a, b) => {
        if (a.title === b.title) {
          return 0;
        }

        return a.title < b.title ? -1 : 1;
      });
  }, [searchValue, intl, store.currencies]);

  const onCheckboxChange = useCallback(
    (code: CurrencyCode, state: boolean) => {
      const index = selectedItems.current.indexOf(code);

      if (!state) {
        selectedItems.current.splice(index, 1);
      } else if (index === -1) {
        selectedItems.current.push(code);
      }
    },
    [selectedItems],
  );

  const renderItem = useCallback(
    (info: { item: AddCurrencyItem }) => {
      const { item } = info;

      return (
        <ListItemAdd
          item={item}
          isSelected={selectedItems.current.indexOf(item.code) !== -1}
          onCheckboxChange={onCheckboxChange}
        />
      );
    },
    [onCheckboxChange],
  );

  const renderHeader = useCallback(
    (info: { section: AddCurrenciesSection }) => {
      const { section } = info;

      return (
        <View
          style={tw.style(tw`relative px-6 py-2 bg-slate-200 bg-violet-200`, {
            marginBottom: -StyleSheet.hairlineWidth,
          })}
        >
          <View
            style={tw.style(tw`absolute top-0 bg-slate-400 left-0 right-0`, {
              height: StyleSheet.hairlineWidth,
            })}
          />

          <Text style={tw`text-violet-700 font-sans`}>{section.title}</Text>

          <View
            style={tw.style(tw`absolute bottom-0 bg-slate-400 left-0 right-0`, {
              height: StyleSheet.hairlineWidth,
            })}
          />
        </View>
      );
    },
    [],
  );

  const onAddingDone = useCallback(
    (withBackNavigate = true) => {
      const { activeCurrency, values: currentValues, rates } = store;

      store.setSelectedCurrencies([...selectedItems.current]);

      if (activeCurrency) {
        store.setValues(
          selectedItems.current.reduce(
            (result: CurrenciesStore['values'], currencyCode) => {
              if (rates[currencyCode]) {
                result[currencyCode] =
                  rates[activeCurrency][currencyCode] *
                  (currentValues[activeCurrency] || 0);
              }

              return result;
            },
            {},
          ),
        );
      }

      if (withBackNavigate) {
        navigation.goBack();
      }
    },
    [store.rates, store.values],
  );

  const onPressAddingDone = useCallback(() => {
    onAddingDone();
  }, [onAddingDone]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      if (Platform.OS === 'android') {
        onAddingDone(false);
      }
    });

    return unsubscribe;
  }, [navigation, onAddingDone]);

  useEffect(() => {
    navigation.setOptions({
      headerSearchBarOptions: {
        placeholder: intl.formatMessage({
          id: 'app.Search by country or currency',
        }),
        cancelButtonText: intl.formatMessage({ id: 'app.Cancel' }),
        onChangeText: (e: NativeSyntheticEvent<TextInputChangeEventData>) =>
          setSearchValue(e.nativeEvent.text),
      },
      headerRight: () =>
        Platform.OS === 'ios' ? (
          <TouchableOpacity style={tw`p-4 -m-4`} onPress={onPressAddingDone}>
            <Text style={tw`font-sansSemiBold text-base`}>
              <FormattedMessage id="app.Done" />
            </Text>
          </TouchableOpacity>
        ) : null,
    });
  }, [onAddingDone]);

  return (
    <GestureHandlerRootView style={tw`flex-1 bg-white`}>
      <SectionList
        sections={data}
        keyExtractor={item => item.code}
        renderItem={renderItem}
        renderSectionHeader={renderHeader}
        contentInsetAdjustmentBehavior="automatic"
        stickySectionHeadersEnabled
        SectionSeparatorComponent={() => null}
        ItemSeparatorComponent={() => (
          <View
            style={tw.style(tw`mx-4 bg-slate-400`, {
              height: StyleSheet.hairlineWidth,
            })}
          />
        )}
        contentContainerStyle={tw`bg-white`}
        style={tw`bg-white`}
      />
    </GestureHandlerRootView>
  );
}
