import { memo, useRef } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
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

    const checkboxRef = useRef<BouncyCheckbox>(null);

    return (
      <View style={tw`relative py-px bg-white`}>
        <TouchableOpacity
          style={tw`h-15 justify-center bg-white`}
          onPress={() => {
            checkboxRef.current?.onPress();
          }}
        >
          <View style={tw`flex flex-row items-center px-4 bg-white`}>
            <BouncyCheckbox
              ref={checkboxRef}
              isChecked={isSelected}
              textContainerStyle={tw`m-0`}
              innerIconStyle={tw`border-violet-700`}
              fillColor={tw.color('violet-700')}
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
                style={tw`text-base font-sansBold`}
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
