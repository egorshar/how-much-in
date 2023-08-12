import { Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import tw from '@ui/tailwind';

import * as flag from '@assets/flags/flagsIndex';
import { CURRENCIES } from '@constants';

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

  return (
    <View style={tw`relative mr-4 shrink-0`}>
      <View
        style={tw`overflow-hidden rounded-xl h-[40px] w-10 items-center justify-center shrink-0 border border-slate-200`}
      >
        {CURRENCIES[isoCodeUpper] ? (
          <FastImage
            source={flag[countryCode]}
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
