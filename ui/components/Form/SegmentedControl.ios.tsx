import { useColorScheme } from 'react-native';
import { Host, Picker, Text as SwiftText } from '@expo/ui/swift-ui';
import { padding, pickerStyle, tag } from '@expo/ui/swift-ui/modifiers';

import { useStore } from '@services/store';

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
  const stored = useStore(s => s.colorScheme);
  const system = useColorScheme();
  const effective: 'light' | 'dark' =
    stored === 'system' ? (system === 'dark' ? 'dark' : 'light') : stored;

  return (
    <Host
      key={effective}
      matchContents={{ vertical: true }}
      useViewportSizeMeasurement
      colorScheme={effective}
      style={{ width: '100%' }}
    >
      <Picker
        selection={value}
        onSelectionChange={onChange}
        modifiers={[pickerStyle('segmented'), padding({ all: 0 })]}
      >
        {options.map(opt => (
          <SwiftText key={opt.value} modifiers={[tag(opt.value)]}>
            {opt.label}
          </SwiftText>
        ))}
      </Picker>
    </Host>
  );
}
