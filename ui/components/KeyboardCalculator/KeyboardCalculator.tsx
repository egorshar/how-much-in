import { useEffect, useState } from 'react';
import {
  Keyboard,
  KeyboardEvent,
  StyleProp,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import tw from '@ui/tailwind';
import Ionicons from '@expo/vector-icons/Ionicons';

type KeyboardCalculatorProps = {
  onPress: (type: AllowedMathOperation) => void;
};

function KeyboardCalculatorButton({
  type,
  icon,
  iconStyle = {},
  buttonStyle = {},
  onPress,
}: {
  type: AllowedMathOperation;
  icon: keyof typeof Ionicons.glyphMap;
  iconStyle?: StyleProp<ViewStyle>;
  buttonStyle?: ViewStyle;
  onPress: (type: AllowedMathOperation) => void;
}) {
  return (
    <TouchableOpacity
      style={tw.style(
        `flex flex-grow ml-2 h-10 bg-violet-300 dark:bg-violet-800 items-center justify-center rounded`,
        buttonStyle,
      )}
      onPress={() => onPress(type)}
    >
      <Ionicons
        name={icon}
        size={30}
        color={tw.color('violet-900 dark:violet-200')}
        style={iconStyle}
      />
    </TouchableOpacity>
  );
}

export default function KeyboardCalculator(props: KeyboardCalculatorProps) {
  const { onPress } = props;
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showSub = Keyboard.addListener(
      'keyboardWillShow',
      (e: KeyboardEvent) => setKeyboardHeight(e.endCoordinates.height),
    );
    const hideSub = Keyboard.addListener('keyboardWillHide', () =>
      setKeyboardHeight(0),
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  if (keyboardHeight === 0) {
    return null;
  }

  return (
    <View
      style={tw.style(`absolute left-0 right-0 bg-white dark:bg-slate-900`, {
        bottom: keyboardHeight,
      })}
    >
      <View style={tw`p-1.5`}>
        <View
          style={tw`flex-row bg-violet-50 dark:bg-violet-950 rounded w-full p-2`}
        >
          <KeyboardCalculatorButton
            type="plus"
            icon="add-outline"
            buttonStyle={tw`ml-0`}
            onPress={onPress}
          />
          <KeyboardCalculatorButton
            type="minus"
            icon="remove-outline"
            onPress={onPress}
          />
          <KeyboardCalculatorButton
            type="multiply"
            icon="close-outline"
            onPress={onPress}
          />
          <KeyboardCalculatorButton
            type="divide"
            icon="remove-outline"
            iconStyle={{ transform: [{ rotate: '-60deg' }] }}
            onPress={onPress}
          />
          <KeyboardCalculatorButton
            type="equal"
            icon="reorder-two-outline"
            onPress={onPress}
          />
        </View>
      </View>
    </View>
  );
}
