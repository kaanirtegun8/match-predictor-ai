import { Text, TextProps } from 'react-native';

interface ThemedTextProps extends TextProps {}

export function ThemedText(props: ThemedTextProps) {
  return (
    <Text 
      {...props}
      style={[
        { color: '#000' },
        props.style
      ]}
    />
  );
} 