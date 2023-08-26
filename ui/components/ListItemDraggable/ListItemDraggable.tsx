import { memo, useRef } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Pressable,
  StyleSheet,
} from 'react-native';
import { FormattedMessage } from 'react-intl';
import SwipeableItem, {
  SwipeableItemImperativeRef,
  OpenDirection,
  useSwipeableItemParams,
} from 'react-native-swipeable-item';
import Ionicons from '@expo/vector-icons/Ionicons';
import tw from '@ui/tailwind';

import { ITEM_HEIGHT } from '@constants';
import CountryFlag from '@ui/components/CountryFlag/CountryFlag';

function UnderlayLeft(props: { onPress: () => void }) {
  const { onPress } = props;
  const { close } = useSwipeableItemParams();

  return (
    <TouchableOpacity
      onPress={() => {
        onPress();
        close();
      }}
      style={tw`absolute right-0 w-[${ITEM_HEIGHT}px] h-[${
        ITEM_HEIGHT - 1
      }px] flex-row justify-center items-center bg-red-500`}
    >
      <Ionicons name="trash-outline" size={20} color={tw.color('white')} />
    </TouchableOpacity>
  );
}

export type ListItemDraggableProps = {
  item: CurrencyItem & { key: string };
  drag: any;
  isActive: boolean;
  deleteSelectedCurrency: CurrenciesStore['deleteSelectedCurrency'];
};

const ListItemDraggable = memo(
  (props: ListItemDraggableProps) => {
    const { item, drag, isActive, deleteSelectedCurrency } = props;

    const swipeItemRef = useRef<SwipeableItemImperativeRef>(null);

    return (
      <SwipeableItem
        ref={swipeItemRef}
        item={item}
        key={item.key}
        renderUnderlayLeft={() => (
          <UnderlayLeft onPress={() => deleteSelectedCurrency(item.code)} />
        )}
        snapPointsLeft={[ITEM_HEIGHT]}
      >
        <TouchableOpacity
          onLongPress={drag}
          onPress={() => swipeItemRef.current?.close()}
          disabled={isActive}
          style={tw.style(tw`relative bg-white`, {
            marginTop: -StyleSheet.hairlineWidth,
          })}
        >
          <View
            style={tw.style(tw`absolute top-0 bg-slate-400 left-31 right-5`, {
              height: StyleSheet.hairlineWidth,
            })}
          />

          <View style={tw`justify-center h-[${ITEM_HEIGHT}px]`}>
            <View style={tw`flex flex-row items-center px-5 w-full`}>
              <Pressable
                style={tw`p-4 -ml-5 mr-1`}
                onPress={() => {
                  swipeItemRef.current?.open(OpenDirection.LEFT);
                }}
              >
                <Ionicons
                  name="remove-circle"
                  size={22}
                  color={tw.color('red-500')}
                />
              </Pressable>

              <CountryFlag isoCode={item.code} />

              <View style={tw`overflow-hidden flex-1`}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={tw`text-base px-2 font-sansBold`}
                >
                  <FormattedMessage
                    id={`currencies.prepositional.${item.code.toLowerCase()}`}
                    defaultMessage={item.label}
                  />
                </Text>
              </View>

              <Ionicons name="menu-outline" size={20} />
            </View>
          </View>

          <View
            style={tw.style(
              tw`absolute bottom-0 bg-slate-400 left-31 right-5`,
              {
                height: StyleSheet.hairlineWidth,
              },
            )}
          />
        </TouchableOpacity>
      </SwipeableItem>
    );
  },
  (oldProps, newProps) => {
    return oldProps.item.code === newProps.item.code;
  },
);

export default ListItemDraggable;
