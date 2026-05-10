import { Pressable, Text, View } from 'react-native';
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
      style={tw`flex-row flex-1 rounded-full border border-slate-300 dark:border-slate-600 overflow-hidden`}
    >
      {options.map((opt, i) => {
        const selected = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            android_ripple={{
              color:
                tw.color(
                  tw.prefixMatch('dark') ? 'slate-600' : 'slate-300',
                ) ?? undefined,
            }}
            style={tw.style(
              `flex-1 items-center justify-center py-2`,
              selected && `bg-slate-200 dark:bg-slate-700`,
              i > 0 && `border-l border-slate-300 dark:border-slate-600`,
            )}
          >
            <Text
              style={tw.style(
                `text-sm font-sans`,
                selected
                  ? `text-slate-900 dark:text-slate-100 font-sansSemiBold`
                  : `text-slate-600 dark:text-slate-400`,
              )}
            >
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
