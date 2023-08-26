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
  Platform,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import DraggableFlatList, {
  ScaleDecorator,
  RenderItemParams,
} from 'react-native-draggable-flatlist';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
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

export default function MainScreen() {
  const store = useStore();
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const locales = getLocales();

  const appState = useRef(AppState.currentState);
  const valuesRef = useRef(store.values);
  const [refreshing, setRefreshing] = useState(false);
  const [bottomRefreshing, setBottomRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState('');
  const [isEditing, setEditing] = useState(false);

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

  const onValueChange = useCallback(
    (code: CurrencyCode, v: number, fully?: boolean) => {
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
          item={item}
          value={store.values[item.code]}
          setValues={onValueChange}
          activeCurrency={store.activeCurrency}
          setActiveCurrency={store.setActiveCurrency}
          isFirst={item === data[0]}
          isLast={item === data[data.length - 1]}
        />
      );
    },
    [data, locales, onValueChange, store.values],
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
    navigation.setOptions({
      headerLargeTitle: Platform.OS === 'ios',
      headerTransparent: Platform.OS === 'ios',
      headerBlurEffect: 'regular',
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('AddCurrencyModal')}
          style={tw`p-2 -m-2`}
        >
          <Ionicons
            name="add-outline"
            size={30}
            color={tw.color('slate-500')}
          />
        </TouchableOpacity>
      ),
    });
  }, [isEditing, navigation]);

  return (
    <GestureHandlerRootView>
      {isEditing ? (
        <DraggableFlatList
          data={data}
          keyExtractor={item => item.code}
          onDragEnd={({ data: sortedData }) => {
            store.setSelectedCurrencies(sortedData.map(item => item.code));
          }}
          onPlaceholderIndexChange={() =>
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
          }
          renderItem={renderItemEditingWrapped}
          style={tw`bg-white h-full`}
          contentContainerStyle={{ paddingBottom: 82 }}
          contentInsetAdjustmentBehavior="automatic"
        />
      ) : (
        <KeyboardAwareFlatList
          data={data}
          keyExtractor={item => item.code}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={renderItem}
          style={tw`bg-white h-full`}
          contentContainerStyle={{ paddingBottom: 82 }}
          contentInsetAdjustmentBehavior="automatic"
        />
      )}

      <MainFooter
        lastSync={store.lastSync}
        isEditing={isEditing}
        setEditing={setEditing}
        refreshing={refreshing || bottomRefreshing}
        refreshingMessage={refreshError}
      />
    </GestureHandlerRootView>
  );
}
