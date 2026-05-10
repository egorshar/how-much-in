/* eslint-disable react/style-prop-object */

import { memo, MutableRefObject, useRef, useState } from 'react';
import {
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import tw from '@ui/tailwind';

import CountryFlag from '@ui/components/CountryFlag/CountryFlag';
import { useStore } from '@services/store';
import { IS_IOS26, ITEM_HEIGHT } from '@constants';

export type ListItemProps = {
  activeInputRef: MutableRefObject<TextInput | null>;
  item: CurrencyItem & {
    key: string;
  };
  value: number;
  setValues: (code: CurrencyCode, v: number, fully?: boolean) => void;
  onInputFocus: (code: CurrencyCode, v: number) => void;
  onInputBlur: () => void;
  consumeAutoEqualsFlag: () => boolean;
  activeCurrency: CurrencyCode;
  setActiveCurrency: CurrenciesStore['setActiveCurrency'];
  isFirst: boolean;
  isLast: boolean;
};

const parseCommaFloat = (n: string): number => {
  if (!n) return 0;

  const lastDot = n.lastIndexOf('.');
  const lastComma = n.lastIndexOf(',');
  const decimalIdx = Math.max(lastDot, lastComma);

  if (decimalIdx === -1) {
    return parseFloat(n) || 0;
  }

  const integerPart = n.substring(0, decimalIdx).replace(/[.,\s]/g, '');
  const fractionPart = n.substring(decimalIdx + 1);

  return parseFloat(`${integerPart}.${fractionPart}`) || 0;
};

const ListItem = memo(
  (props: ListItemProps) => {
    const {
      activeInputRef,
      item,
      value = 0,
      setValues,
      onInputFocus,
      onInputBlur,
      consumeAutoEqualsFlag,
      activeCurrency,
      setActiveCurrency,
      isFirst,
      isLast,
    } = props;

    // Subscribe to scheme changes so memoized rows re-evaluate dark variants.
    useStore(s => s.colorScheme);

    const [inputVisible, setInputVisible] = useState(false);
    const inputRef = useRef<TextInput>(null);
    const valueRef = useRef(value > 0 ? value.toString() : '');
    const initialValueRef = useRef('');

    return (
      <View
        style={tw.style(tw`justify-center`, {
          marginTop: -StyleSheet.hairlineWidth,
        })}
      >
        <Pressable
          onPress={() => {
            Keyboard.dismiss();
            activeInputRef.current?.blur();
          }}
          style={tw.style(
            IS_IOS26
              ? tw`flex flex-row items-center px-4 bg-white dark:bg-transparent h-[${ITEM_HEIGHT}px]`
              : tw`flex flex-row items-center px-5 bg-white dark:bg-transparent h-[${ITEM_HEIGHT}px]`,
            activeCurrency === item.code && {
              backgroundColor: tw.color(
                tw.prefixMatch('dark') ? 'slate-800' : 'violet-50',
              ),
            },
          )}
        >
          <View
            style={tw.style(
              IS_IOS26
                ? tw`absolute top-0 bg-slate-400 dark:bg-slate-700 left-20 right-4 z-10`
                : tw`absolute top-0 bg-slate-400 dark:bg-slate-700 left-21 right-5 z-10`,
              !isFirst && {
                height: StyleSheet.hairlineWidth,
              },
            )}
          />

          <CountryFlag isoCode={item.code} />
          <View style={tw`overflow-hidden flex-1`}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={tw`text-sm font-bold pb-1 pl-2 font-sansBold font-bold text-black dark:text-slate-100`}
            >
              <FormattedMessage
                id={`currencies.prepositional.${item.code.toLowerCase()}`}
                defaultMessage={item.label}
              />
            </Text>

            <Pressable onPress={() => inputRef.current?.focus()}>
              <TextInput
                ref={inputRef}
                defaultValue={valueRef.current}
                contextMenuHidden
                keyboardType="numeric"
                placeholderTextColor={tw.color(
                  tw.prefixMatch('dark') ? 'violet-700' : 'violet-400',
                )}
                style={tw.style(
                  tw`text-lg py-1 android:py-[1px] px-2 ios:leading-tight font-sans bg-violet-300 dark:bg-violet-800 text-violet-900 dark:text-violet-100 rounded-md z-10`,
                  { opacity: inputVisible ? 1 : 0 },
                )}
                onChangeText={v => {
                  setValues(item.code, parseCommaFloat(v));
                  valueRef.current = v;
                  setActiveCurrency(item.code);
                }}
                onFocus={() => {
                  let currentText = value.toFixed(2);

                  if (currentText.indexOf('.00') !== -1) {
                    currentText = currentText.replace('.00', '');
                  }

                  onInputFocus(item.code, parseCommaFloat(currentText));

                  activeInputRef.current = inputRef.current;
                  setInputVisible(true);

                  const formattedText =
                    parseCommaFloat(currentText) === 0
                      ? ''
                      : currentText.replace('.', ',');

                  if (!formattedText) {
                    setTimeout(() => inputRef.current?.clear());
                  } else {
                    inputRef.current?.setNativeProps({
                      text: formattedText,
                      placeholder: '',
                      selection: {
                        start: 0,
                        end: formattedText.length,
                      },
                    });
                  }

                  valueRef.current = currentText;
                  initialValueRef.current = currentText;
                }}
                onBlur={() => {
                  setInputVisible(false);
                  onInputBlur();
                }}
                onEndEditing={e => {
                  if (consumeAutoEqualsFlag()) {
                    return;
                  }

                  const v = e.nativeEvent.text;

                  if (initialValueRef.current !== v) {
                    setTimeout(
                      () => setValues(item.code, parseCommaFloat(v), true),
                      500,
                    );
                  }
                }}
              />

              <View
                style={tw.style(
                  tw`absolute top-0 left-0 rounded-md bg-violet-200 dark:bg-violet-900`,
                  { pointerEvents: 'none' },
                )}
              >
                <Text
                  style={tw`text-lg py-1 android:py-[1px] px-2 ios:leading-tight font-sans text-violet-700 dark:text-violet-300`}
                >
                  <FormattedNumber
                    value={value}
                    style="currency"
                    currency={item.code.toUpperCase()}
                  />
                </Text>
              </View>
            </Pressable>
          </View>
          <View
            style={tw.style(
              IS_IOS26
                ? tw`absolute bottom-0 left-20 right-3 bg-slate-400 dark:bg-slate-700`
                : tw`absolute bottom-0 left-21 right-4 bg-slate-400 dark:bg-slate-700`,
              !isLast && {
                height: StyleSheet.hairlineWidth,
              },
            )}
          />
        </Pressable>
      </View>
    );
  },
  (oldProps, newProps) => {
    return (
      oldProps.item.code === newProps.item.code &&
      oldProps.value === newProps.value &&
      oldProps.activeCurrency === newProps.activeCurrency &&
      oldProps.setValues === newProps.setValues
    );
  },
);

export default ListItem;
