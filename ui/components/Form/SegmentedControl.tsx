import { Text, TouchableOpacity, View } from 'react-native';
import tw from '@ui/tailwind';

export type SegmentedControlOption<T extends string> = {
  value: T;
  label: string;
};

export type SegmentedControlProps<T extends string> = {
  value: T;
  onChange: (value: T) => void;
  options: SegmentedControlOption<T>[];
};

export default function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
}: SegmentedControlProps<T>) {
  return (
    <View
      style={tw`flex-row p-1 rounded-lg bg-slate-200 dark:bg-slate-800 flex-1`}
    >
      {options.map(opt => {
        const selected = opt.value === value;
        return (
          <TouchableOpacity
            key={opt.value}
            onPress={() => onChange(opt.value)}
            style={tw.style(
              `flex-1 items-center justify-center py-1.5 rounded-md`,
              selected && `bg-white dark:bg-slate-700 shadow`,
            )}
          >
            <Text
              style={tw.style(
                `text-sm font-sans`,
                selected
                  ? `text-slate-900 dark:text-slate-100 font-sansSemiBold`
                  : `text-slate-600 dark:text-slate-300`,
              )}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
