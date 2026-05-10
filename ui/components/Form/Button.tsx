import { ReactNode } from 'react';
import { Pressable, PressableProps, Platform, Text } from 'react-native';
import tw from '@ui/tailwind';

import FormElement, { FormElementProps } from './Element';

export type ButtonProps = PressableProps &
  Omit<FormElementProps, 'children' | 'hasStaticHeight'> & {
    title: string;
    titleColor?: string;
    icon?: ReactNode;
  };

function Button({
  icon = null,
  titleColor = undefined,
  title,
  onPress,
  ...formElementProps
}: ButtonProps) {
  let pressedColor = '#e5e5ea';

  switch (true) {
    case tw.prefixMatch('ios') && tw.prefixMatch('dark'):
      pressedColor = 'rgb(58, 57, 59)';
      break;

    case tw.prefixMatch('android'):
      pressedColor = tw.color('slate-600') || '';
      break;

    default:
  }

  return (
    <Pressable onPress={onPress}>
      {({ pressed }) => (
        <FormElement
          hasStaticHeight
          style={[
            tw.style(
              'flex-row items-center android:px-4',
              'android:dark:bg-slate-700',
            ),
            pressed &&
              Platform.OS === 'ios' && { backgroundColor: pressedColor },
            pressed && Platform.OS === 'android' && { opacity: 0.2 },
          ]}
          {...formElementProps}
        >
          <>
            {icon}
            <Text
              style={tw.style(
                tw`text-base font-sans text-black dark:text-slate-100`,
                titleColor ? { color: titleColor } : null,
              )}
            >
              {title}
            </Text>
          </>
        </FormElement>
      )}
    </Pressable>
  );
}

export default Button;
