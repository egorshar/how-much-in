import { memo, useRef } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import BouncyCheckbox, {
  BouncyCheckboxHandle,
} from 'react-native-bouncy-checkbox';
import tw from '@ui/tailwind';

import CountryFlag from '@ui/components/CountryFlag/CountryFlag';

type ListItemAdd = {
  item: any;
  isSelected: boolean;
  onCheckboxChange: (code: CurrencyCode, isChecked: boolean) => void;
};

const ListItemAdd = memo(
  (props: ListItemAdd) => {
    const { item, isSelected, onCheckboxChange } = props;

    const checkboxRef = useRef<BouncyCheckboxHandle>(null);

    return (
      <View style={tw`relative py-px bg-white dark:bg-slate-800`}>
        <TouchableOpacity
          style={tw`h-15 justify-center bg-white dark:bg-slate-800`}
          onPress={() => {
            checkboxRef.current?.onCheckboxPress();
          }}
        >
          <View
            style={tw`flex flex-row items-center px-4 bg-white dark:bg-slate-800`}
          >
            <BouncyCheckbox
              ref={checkboxRef}
              isChecked={isSelected}
              disableText
              innerIconStyle={tw`border-violet-700 dark:border-violet-300`}
              fillColor={tw.color('violet-700 dark:violet-300')}
              style={tw`mr-4`}
              onPress={isChecked => {
                onCheckboxChange(item.code, isChecked);
              }}
            />

            <CountryFlag isoCode={item.code} />

            <View style={tw`overflow-hidden flex-1`}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={tw`text-base font-sansBold text-black dark:text-slate-100`}
              >
                {item.value}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  },
  (oldProps, newProps) => {
    return (
      oldProps.item.code === newProps.item.code &&
      oldProps.isSelected === newProps.isSelected
    );
  },
);

export default ListItemAdd;
