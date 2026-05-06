import { ReactNode } from 'react';
import { StyleProp, Text, View, ViewStyle } from 'react-native';
import { ClassInput } from 'twrnc/dist/esm/types';
import tw from '@ui/tailwind';

import { IS_IOS26 } from '@constants';

export type FormElementProps = {
  children: ReactNode;
  caption?: string;
  description?: string;
  hasStaticHeight: boolean;
  isFirst?: boolean;
  isLast?: boolean;
  borderStyle?: ClassInput;
  style?: StyleProp<ViewStyle>;
};

function FormElement({
  children,
  caption = '',
  description = '',
  hasStaticHeight,
  isFirst = true,
  isLast = true,
  borderStyle = {},
  style = {},
}: FormElementProps) {
  return (
    <>
      {isFirst && caption && (
        <View
          style={tw.style(
            `ios:bg-transparent ios:px-9 ios:mb-2.5`,
            `android:px-4 android:pt-2.5`,
          )}
        >
          <Text
            style={tw.style(
              `ios:font-semibold ios:text-lg`,
              `android:text-[#B49389] android:font-medium`,
            )}
          >
            {caption}
          </Text>
        </View>
      )}
      <View
        style={[
          tw.style(
            'ios:bg-white ios:pl-4 ios:mx-5 ios:pr-1 ios:dark:bg-[#1C1C1E]',
            'android:px-4 relative android:bg-white',
            hasStaticHeight &&
              (IS_IOS26
                ? 'ios:min-h-12 android:min-h-14'
                : 'ios:min-h-11 android:min-h-14'),
            isFirst && (IS_IOS26 ? 'ios:rounded-t-3xl' : 'ios:rounded-t-xl'),
            isLast &&
              (IS_IOS26 ? 'ios:rounded-b-3xl mb-8' : 'ios:rounded-b-xl mb-8'),
            isLast && description && 'mb-1.5',
          ),
          style,
        ]}
      >
        <>
          {children}

          <View
            style={tw.style(
              'absolute bottom-0 left-4 right-0',
              'ios:bg-[#ECEEF5] ios:-mr-1',
              'android:bg-[#ECEEF5] android:right-4',
              isLast && 'ios:bg-transparent',
              isLast &&
                'android:left-0 android:right-0 android:h-1.5 android:bg-[rgba(0,0,0,0.1)]',
              {
                zIndex: 1,
                height: 1,
              },
              borderStyle,
            )}
          />
        </>
      </View>

      {isLast && description ? (
        <Text
          style={tw.style(
            `mb-8 text-[#A29EAA] text-xs font-sans`,
            `ios:mx-9`,
            `android:mx-4`,
          )}
        >
          {description}
        </Text>
      ) : null}
    </>
  );
}

export default FormElement;
