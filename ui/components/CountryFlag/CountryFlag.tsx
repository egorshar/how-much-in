import { Text, View } from 'react-native';
import FastImage from '@d11/react-native-fast-image';
import tw from '@ui/tailwind';

import * as FLAGS from '@assets/flags/flagsIndex';
import { CURRENCIES, FLAG_ALIGN } from '@constants';

const fixCountryCode = (code: string) => {
  switch (code) {
    case 'in':
      return 'ind';
    case 'do':
      return 'dom';
    default:
      return code;
  }
};

type CountryFlagProps = {
  isoCode: string;
};

export default function CountryFlag({ isoCode }: CountryFlagProps) {
  const isoCodeUpper = isoCode.toUpperCase();
  const countryCode = fixCountryCode(CURRENCIES[isoCodeUpper].toLowerCase());
  const size = 40;
  const align = FLAG_ALIGN[isoCodeUpper] ?? 'center';
  const justifyClass = {
    left: 'justify-start',
    right: 'justify-end',
    center: 'justify-center',
  }[align];

  return (
    <View style={tw`relative mr-4 shrink-0`}>
      <View
        style={tw`overflow-hidden rounded-xl h-[40px] w-10 items-center ${justifyClass} shrink-0 border border-slate-200`}
      >
        {CURRENCIES[isoCodeUpper] ? (
          <FastImage
            source={FLAGS[countryCode]}
            style={{ width: size * 1.6, height: size }}
          />
        ) : null}
      </View>

      <View style={tw`absolute -bottom-1 -right-1 bg-slate-200 px-1 rounded`}>
        <Text style={tw`text-xs font-sans`}>{isoCodeUpper}</Text>
      </View>
    </View>
  );
}
