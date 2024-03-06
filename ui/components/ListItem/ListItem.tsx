/* eslint-disable react/style-prop-object */

import { memo, MutableRefObject, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import tw from '@ui/tailwind';

import CountryFlag from '@ui/components/CountryFlag/CountryFlag';
import { EDITING_INPUT_ACC_VIEW_ID, ITEM_HEIGHT } from '@constants';

export type ListItemProps = {
  activeInputRef: MutableRefObject<TextInput | null>;
  item: CurrencyItem & {
    key: string;
  };
  value: number;
  setValues: (code: CurrencyCode, v: number, fully?: boolean) => void;
  activeCurrency: CurrencyCode;
  setActiveCurrency: CurrenciesStore['setActiveCurrency'];
  isFirst: boolean;
  isLast: boolean;
};

const parseCommaFloat = (n: string) => {
  return parseFloat(n.replace(',', '.'));
};

const ListItem = memo(
  (props: ListItemProps) => {
    const {
      activeInputRef,
      item,
      value = 0,
      setValues,
      activeCurrency,
      setActiveCurrency,
      isFirst,
      isLast,
    } = props;

    const [isNotAFirstRender, setIsNotAFirstRender] = useState(false);
    const inputRef = useRef<TextInput>(null);
    const rowRef = useRef<View>(null);
    const valueRef = useRef(value > 0 ? value.toString() : '');
    const initialValueRef = useRef('');
    const selectionRef = useRef<{ start?: number; end?: number }>({});

    useEffect(() => {
      if (rowRef.current && isNotAFirstRender) {
        rowRef.current.setNativeProps({
          style: { backgroundColor: 'white' },
        });

        setIsNotAFirstRender(true);
      }
    });

    return (
      <View
        style={tw.style(tw`justify-center`, {
          marginTop: -StyleSheet.hairlineWidth,
        })}
      >
        <View
          style={tw.style(
            tw`flex flex-row items-center px-5 bg-white h-[${ITEM_HEIGHT}px]`,
            activeCurrency === item.code && {
              backgroundColor: tw.color('violet-50'),
            },
          )}
          ref={rowRef}
        >
          <View
            style={tw.style(
              tw`absolute top-0 bg-slate-400 left-21 right-5 z-10`,
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
              style={tw`text-sm font-bold pb-1 pl-2 font-sansBold font-bold`}
            >
              <FormattedMessage
                id={`currencies.prepositional.${item.code.toLowerCase()}`}
                defaultMessage={item.label}
              />
            </Text>

            <View>
              <TextInput
                ref={inputRef}
                defaultValue={valueRef.current}
                selectTextOnFocus
                contextMenuHidden
                keyboardType="numeric"
                placeholderTextColor={tw.color('violet-400')}
                inputAccessoryViewID={EDITING_INPUT_ACC_VIEW_ID}
                style={tw`text-lg py-1 android:py-[1px] px-2 leading-tight font-sans bg-violet-300 text-violet-900 rounded-md opacity-0`}
                onChangeText={v => {
                  setValues(item.code, parseCommaFloat(v));
                  valueRef.current = v;
                  setActiveCurrency(item.code);

                  setTimeout(() => {
                    rowRef.current?.setNativeProps({
                      style: { backgroundColor: tw.color('violet-50') },
                    });
                  });
                }}
                onFocus={() => {
                  let currentText = value.toFixed(2);

                  if (currentText.indexOf('.00') !== -1) {
                    currentText = currentText.replace('.00', '');
                  }

                  setValues(item.code, parseCommaFloat(currentText), false);

                  activeInputRef.current = inputRef.current;
                  inputRef.current?.setNativeProps({
                    text:
                      currentText === '0' ? '' : currentText.replace('.', ','),
                    style: { opacity: 1, zIndex: 1 },
                  });

                  setTimeout(() => {
                    inputRef.current?.setNativeProps({
                      selection: {
                        start: 0,
                        end: currentText.length,
                      },
                    });
                  });

                  valueRef.current = currentText;
                  initialValueRef.current = currentText;
                }}
                onSelectionChange={e => {
                  selectionRef.current = e.nativeEvent.selection;
                }}
                onPressIn={() => {
                  if (
                    selectionRef.current.start === 0 &&
                    selectionRef.current.end === valueRef.current.length
                  ) {
                    inputRef.current?.setNativeProps({
                      selection: {
                        start: valueRef.current.length,
                        end: valueRef.current.length,
                      },
                    });
                  }
                }}
                onBlur={() => {
                  inputRef.current?.setNativeProps({
                    style: { opacity: 0, zIndex: -1 },
                  });
                }}
                onEndEditing={e => {
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
                pointerEvents="none"
                style={tw`absolute rounded-md bg-violet-200`}
              >
                <Text
                  style={tw`text-lg py-1 px-2 leading-tight font-sans text-violet-700`}
                >
                  <FormattedNumber
                    value={value}
                    style="currency"
                    currency={item.code.toUpperCase()}
                  />
                </Text>
              </View>
            </View>
          </View>
          <View
            style={tw.style(
              tw`absolute bottom-0 left-21 right-4 bg-slate-400`,
              !isLast && {
                height: StyleSheet.hairlineWidth,
              },
            )}
          />
        </View>
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
