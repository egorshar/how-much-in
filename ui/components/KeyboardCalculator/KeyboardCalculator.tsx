import {
  InputAccessoryView,
  StyleProp,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import tw from '@ui/tailwind';
import Ionicons from '@expo/vector-icons/Ionicons';

type KeyboardCalculatorProps = {
  inputAccessoryViewID: string;
  onPress: (type: AllowedMathOperation) => void;
};

function KeyboardCalculatorButton({
  type,
  icon,
  iconStyle,
  buttonStyle,
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
        `flex flex-grow ml-2 h-10 bg-violet-300 items-center justify-center rounded`,
        buttonStyle,
      )}
      onPress={() => onPress(type)}
    >
      <Ionicons
        name={icon}
        size={30}
        color={tw.color('violet-900')}
        style={iconStyle}
      />
    </TouchableOpacity>
  );
}

KeyboardCalculatorButton.defaultProps = {
  iconStyle: {},
  buttonStyle: {},
};

export default function KeyboardCalculator(props: KeyboardCalculatorProps) {
  const { inputAccessoryViewID, onPress } = props;
  return (
    <InputAccessoryView
      nativeID={inputAccessoryViewID}
      style={tw.style(`w-full`)}
    >
      <View style={tw`p-1.5`}>
        <View style={tw`flex-row bg-violet-50 rounded w-full p-2`}>
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
            iconStyle={{ transform: [{ rotateY: '180deg' }] }}
            onPress={onPress}
          />
          <KeyboardCalculatorButton
            type="equal"
            icon="reorder-two-outline"
            onPress={onPress}
          />
        </View>
      </View>
    </InputAccessoryView>
  );
}
