import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  AppState,
  FlatList,
  Keyboard,
  RefreshControl,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import DraggableFlatList, {
  ScaleDecorator,
  RenderItemParams,
} from 'react-native-draggable-flatlist';
import { useIntl } from 'react-intl';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from '@expo/vector-icons/Ionicons';
import { getLocales } from 'expo-localization';
import * as Haptics from 'expo-haptics';
import tw from '@ui/tailwind';

import ListItem, { ListItemProps } from '@ui/components/ListItem/ListItem';
import ListItemDraggable, {
  ListItemDraggableProps,
} from '@ui/components/ListItemDraggable/ListItemDraggable';
import MainFooter from '@ui/components/MainFooter/MainFooter';

import { useStore } from '@services/store';
import KeyboardCalculator from '@ui/components/KeyboardCalculator/KeyboardCalculator';
import { IS_IOS26 } from '@constants';

const DO_MATH = {
  plus: (x: number, y: number) => x + y,
  minus: (x: number, y: number) => x - y,
  multiply: (x: number, y: number) => x * y,
  divide: (x: number, y: number) => x / y,
};

export default function MainScreen() {
  const store = useStore();
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const intl = useIntl();

  const locales = getLocales();

  const activeTextInputRef = useRef<TextInput>(null);
  const calcActiveRef = useRef<boolean>(false);
  const memoizedValueToCalc = useRef<number>(0);
  const memoizedLastInputValue = useRef<number>(0);
  const memoizedLastCurrencyCode = useRef<string>('');
  const memoizedLastOperation = useRef<'' | AllowedMathOperation>('');

  const appState = useRef(AppState.currentState);
  const valuesRef = useRef(store.values);
  const [refreshing, setRefreshing] = useState(false);
  const [bottomRefreshing, setBottomRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState('');
  const [isEditing, setEditing] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardWillShow', e =>
      setKeyboardHeight(e.endCoordinates.height),
    );
    const hideSub = Keyboard.addListener('keyboardWillHide', () =>
      setKeyboardHeight(0),
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const data: ListItemProps['item'][] = useMemo(() => {
    if (!store.currencies.length) {
      return [];
    }

    return store.selectedCurrencies.reduce(
      (result: ListItemProps['item'][], code) => {
        const currency = store.currencies.find(item => item.code === code);

        if (currency) {
          result.push({
            key: `item-${currency?.code}`,
            code: currency?.code,
            label: currency?.label,
          });
        }

        return result;
      },
      [],
    );
  }, [store.currencies, store.selectedCurrencies]);

  const onRefresh = useCallback(async (isPullToRefresh = true) => {
    setRefreshing(isPullToRefresh);
    setBottomRefreshing(true);

    try {
      await store.getCurrencies();

      setRefreshing(false);
      setBottomRefreshing(false);
    } catch (e: any) {
      setRefreshError(e.message);

      setTimeout(() => {
        setRefreshError('');
        setRefreshing(false);
        setBottomRefreshing(false);
      }, 1000);
    }
  }, []);

  const onInputFocus = useCallback((code: CurrencyCode, v: number) => {
    memoizedLastInputValue.current = v;
    memoizedLastCurrencyCode.current = code;
  }, []);

  const handleAdditionalKeyboardButtonRef =
    useRef<(buttonType: AllowedMathOperation) => void>(() => {});
  const autoEqualsTriggered = useRef(false);

  const onInputBlur = useCallback(() => {
    if (
      memoizedLastOperation.current &&
      memoizedLastOperation.current !== 'equal'
    ) {
      autoEqualsTriggered.current = true;
      handleAdditionalKeyboardButtonRef.current('equal');
    }
  }, []);

  const consumeAutoEqualsFlag = useCallback(() => {
    if (autoEqualsTriggered.current) {
      autoEqualsTriggered.current = false;
      return true;
    }
    if (
      memoizedLastOperation.current &&
      memoizedLastOperation.current !== 'equal'
    ) {
      return true;
    }
    return false;
  }, []);

  const onValueChange = useCallback(
    (code: CurrencyCode, v: number, fully?: boolean) => {
      if (fully !== true) {
        memoizedLastInputValue.current = v;
        memoizedLastCurrencyCode.current = code;
      }

      if (calcActiveRef.current) {
        return;
      }

      const { rates } = store;

      if (!fully) {
        const index = data.findIndex(item => item.code === code);

        for (let i = index - 10; i < index + 10; i += 1) {
          const item = data[i];

          if (item && rates[code]) {
            const rate = rates[code] ? rates[code][item.code] : 0;

            valuesRef.current[item.code] = rate * (v || 0);
          }
        }
      } else {
        valuesRef.current = data.reduce((result, item) => {
          if (rates[item.code]) {
            const rate = rates[code] ? rates[code][item.code] : 0;

            result[item.code] = rate * (v || 0);
          }

          return result;
        }, valuesRef.current);
      }

      store.setValues({ ...valuesRef.current });
    },
    [data, store.rates],
  );

  const renderItem = useCallback(
    (info: { item: ListItemProps['item'] }) => {
      const { item } = info;

      return (
        <ListItem
          activeInputRef={activeTextInputRef}
          item={item}
          value={store.values[item.code]}
          setValues={onValueChange}
          onInputFocus={onInputFocus}
          onInputBlur={onInputBlur}
          consumeAutoEqualsFlag={consumeAutoEqualsFlag}
          activeCurrency={store.activeCurrency}
          setActiveCurrency={store.setActiveCurrency}
          isFirst={item === data[0]}
          isLast={item === data[data.length - 1]}
        />
      );
    },
    [
      data,
      locales,
      onValueChange,
      onInputFocus,
      onInputBlur,
      consumeAutoEqualsFlag,
      store.values,
    ],
  );

  const renderItemEditingWrapped = useCallback(
    (info: RenderItemParams<ListItemDraggableProps['item']>) => {
      const { item, drag, isActive } = info;

      return (
        <ScaleDecorator>
          <ListItemDraggable
            item={item}
            drag={drag}
            isActive={isActive}
            deleteSelectedCurrency={store.deleteSelectedCurrency}
          />
        </ScaleDecorator>
      );
    },
    [isEditing, renderItem],
  );

  const handleAdditionalKeyboardButton = useCallback(
    (buttonType: AllowedMathOperation) => {
      if (activeTextInputRef.current) {
        calcActiveRef.current = buttonType !== 'equal';

        if (
          memoizedLastOperation.current &&
          memoizedLastOperation.current !== 'equal' &&
          (memoizedLastOperation.current !== 'divide' ||
            memoizedLastInputValue.current > 0)
        ) {
          memoizedValueToCalc.current = DO_MATH[memoizedLastOperation.current](
            memoizedValueToCalc.current,
            memoizedLastInputValue.current,
          );
        }

        if (buttonType === 'equal') {
          const finalValue = memoizedLastOperation.current
            ? memoizedValueToCalc.current
            : memoizedLastInputValue.current;

          memoizedLastOperation.current = '';
          memoizedValueToCalc.current = 0;

          onValueChange(memoizedLastCurrencyCode.current, finalValue, false);

          setTimeout(() => {
            let resultText =
              finalValue === 0
                ? ''
                : intl
                    .formatNumber(finalValue, { useGrouping: false })
                    .toString()
                    .replace(/\s/g, '');

            if (resultText && parseFloat(resultText.replace(',', '.')) === 0) {
              resultText = '';
            }

            activeTextInputRef.current?.setNativeProps({
              text: resultText,
              placeholder: '',
              selection: {
                start: 0,
                end: resultText.length,
              },
            });
          });
        } else {
          memoizedLastOperation.current = buttonType;
          memoizedValueToCalc.current = memoizedLastInputValue.current;

          let placeholderText = intl
            .formatNumber(memoizedValueToCalc.current, {
              useGrouping: false,
            })
            .toString();

          if (
            placeholderText &&
            parseFloat(placeholderText.replace(',', '.')) === 0
          ) {
            placeholderText = '';
          }

          activeTextInputRef.current.setNativeProps({
            text: '',
            placeholder: placeholderText,
          });
        }
      }
    },
    [onValueChange],
  );

  useEffect(() => {
    handleAdditionalKeyboardButtonRef.current = handleAdditionalKeyboardButton;
  }, [handleAdditionalKeyboardButton]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        onRefresh(false);
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [onRefresh]);

  useEffect(() => {
    onRefresh(false);
  }, []);

  useLayoutEffect(() => {
    /**
     * Timeout has been added to properly
     * position the `headerRight` component
     * https://github.com/software-mansion/react-native-screens/issues/1570
     */
    setTimeout(() => {
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity
            onPress={() => navigation.navigate('AddCurrencyModal')}
            style={
              IS_IOS26
                ? tw`w-8 h-8 rounded-full items-center justify-center`
                : tw`p-2 -m-2`
            }
          >
            <Ionicons
              name="add-outline"
              size={30}
              color={tw.color(
                tw.prefixMatch('dark') ? 'violet-400' : 'violet-600',
              )}
            />
          </TouchableOpacity>
        ),
      });
    });
  }, [isEditing, navigation]);

  return (
    <GestureHandlerRootView>
      {isEditing ? (
        <DraggableFlatList
          data={data}
          extraData={store.colorScheme}
          keyExtractor={item => item.code}
          onDragEnd={({ data: sortedData }) => {
            store.setSelectedCurrencies(sortedData.map(item => item.code));
          }}
          onPlaceholderIndexChange={() =>
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
          }
          renderItem={renderItemEditingWrapped}
          style={tw`bg-white dark:bg-slate-900 h-full`}
          contentContainerStyle={{ paddingBottom: 82 }}
          contentInsetAdjustmentBehavior="automatic"
        />
      ) : (
        <FlatList
          data={data}
          extraData={store.colorScheme}
          keyExtractor={item => item.code}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={renderItem}
          style={tw`bg-white dark:bg-slate-900 h-full`}
          contentContainerStyle={{ paddingBottom: 82 }}
          contentInset={{
            bottom: keyboardHeight > 0 ? keyboardHeight + 80 : 0,
          }}
          contentInsetAdjustmentBehavior="automatic"
          automaticallyAdjustKeyboardInsets={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        />
      )}

      <MainFooter
        lastSync={store.lastSync}
        isEditing={isEditing}
        setEditing={setEditing}
        refreshing={refreshing || bottomRefreshing}
        refreshingMessage={refreshError}
      />

      <KeyboardCalculator onPress={handleAdditionalKeyboardButton} />
    </GestureHandlerRootView>
  );
}
