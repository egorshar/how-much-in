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

function Button(props: ButtonProps) {
  const { icon, titleColor, title, onPress, ...formElementProps } = props;
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
              style={tw.style(tw`text-base font-sans`, { color: titleColor })}
            >
              {title}
            </Text>
          </>
        </FormElement>
      )}
    </Pressable>
  );
}

Button.defaultProps = {
  titleColor: undefined,
  icon: null,
};

export default Button;
