import { Text, View } from 'react-native';
import { ClassInput } from 'twrnc/dist/esm/types';
import tw from '@ui/tailwind';

import FormElement, { FormElementProps } from './Element';

export type FormTextProps = Omit<FormElementProps, 'children'> & {
  text: string;
  hasStaticHeight?: boolean;
  textStyle?: ClassInput;
};

function FormText({
  text,
  description,
  textStyle = {},
  hasStaticHeight = true,
  isFirst,
  isLast,
}: FormTextProps) {
  return (
    <FormElement
      isFirst={isFirst}
      isLast={isLast}
      hasStaticHeight={hasStaticHeight}
      description={description}
    >
      <View style={tw`flex flex-row flex-1 items-center`}>
        <Text
          style={tw.style(
            tw`text-base font-sans flex-1 text-black dark:text-slate-100`,
            textStyle,
          )}
        >
          {text}
        </Text>
      </View>
    </FormElement>
  );
}

export default FormText;
