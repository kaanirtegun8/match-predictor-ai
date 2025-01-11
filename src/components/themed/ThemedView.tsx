import { View, ViewProps } from 'react-native';

interface ThemedViewProps extends ViewProps {}

export function ThemedView(props: ThemedViewProps) {
  return (
    <View 
      {...props}
      style={[
        { backgroundColor: '#fff' },
        props.style
      ]}
    />
  );
} 