import { Text, View } from 'react-native';
import { ClassInput } from 'twrnc/dist/esm/types';
import tw from '@ui/tailwind';

import FormElement, { FormElementProps } from './Element';

export type FormTextProps = Omit<FormElementProps, 'children'> & {
  text: string;
  hasStaticHeight?: boolean;
  textStyle?: ClassInput;
};

function FormText(props: FormTextProps) {
  const { text, description, textStyle, hasStaticHeight, isFirst, isLast } =
    props;

  return (
    <FormElement
      isFirst={isFirst}
      isLast={isLast}
      hasStaticHeight={hasStaticHeight}
      description={description}
    >
      <View style={tw`h-full flex flex-row items-center`}>
        <Text style={tw.style(tw`text-base font-sans`, textStyle)}>{text}</Text>
      </View>
    </FormElement>
  );
}

FormText.defaultProps = {
  hasStaticHeight: true,
  textStyle: {},
};

export default FormText;
