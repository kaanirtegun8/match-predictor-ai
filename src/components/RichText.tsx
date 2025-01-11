import { Text, TextStyle } from 'react-native';
import { ThemedText } from './themed/ThemedText';

interface RichTextProps {
    text: string;
    style?: TextStyle;
}

export function RichText({ text, style }: RichTextProps) {
    // Split by newlines
    const lines = text.split('\\n');
    
    const processText = (text: string) => {
        // Handle double asterisks (bold)
        const parts = text.split(/\*\*(.*?)\*\*/g);
        return parts.map((part, index) => {
            if (index % 2 === 0) {
                // Handle single asterisks in remaining text
                const singleParts = part.split(/\*(.*?)\*/g);
                return singleParts.map((singlePart, singleIndex) => (
                    singleIndex % 2 === 0 ? 
                        singlePart : 
                        <Text key={`single-${singleIndex}`} style={{ fontWeight: '700' }}>{singlePart}</Text>
                ));
            } else {
                // Extra bold for double asterisks
                return <Text key={`double-${index}`} style={{ fontWeight: '900' }}>{part}</Text>;
            }
        });
    };

    return (
        <ThemedText style={style}>
            {lines.map((line, lineIndex) => (
                <Text key={lineIndex}>
                    {processText(line)}
                    {lineIndex < lines.length - 1 ? '\n' : ''}
                </Text>
            ))}
        </ThemedText>
    );
} 