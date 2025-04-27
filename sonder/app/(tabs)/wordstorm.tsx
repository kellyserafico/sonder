import { StyleSheet, View, Dimensions } from 'react-native';
import { Svg, Text as SvgText } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

export default function WordStorm() {
  const responses = [
    { id: '1', text: 'cats are cool' },
    { id: '2', text: 'dogs cool' },
    { id: '3', text: 'i love cats' },
    { id: '4', text: 'cats nice' },
    { id: '5', text: 'cats cats cats' },
    { id: '6', text: 'cats are the best' },
    { id: '7', text: 'cool cats' },
    { id: '8', text: 'cats and dogs' },
    { id: '9', text: 'cats rule' },
    { id: '10', text: 'i have two cats' },
    { id: '11', text: 'cool vibes only' },
    { id: '12', text: 'cool cats chill' },
    { id: '13', text: 'cats chill' },
    { id: '14', text: 'cats on the roof' },
    { id: '15', text: 'i love cool dogs but cats better' },
  ];

  // Count word frequencies
  const wordCounts: Record<string, number> = {};
  responses.forEach(response => {
    response.text.toLowerCase().split(' ').forEach(word => {
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    });
  });

  const wordList = Object.entries(wordCounts)
    .sort((a, b) => (b[1] as number) - (a[1] as number)); // Sort by frequency

  const maxFontSize = 48;
  const minFontSize = 16;
  const maxCount = Math.max(...wordList.map(([_, count]) => count));

  // Layout variables
  let x = width / 2;
  let y = height / 2;
  let lineHeight = 60; // vertical space between lines
  let currentLineWidth = 0;
  let currentLine = 0;

  return (
    <View style={styles.container}>
      <Svg width={width} height={height}>
        {wordList.map(([word, count], index) => {
          const fontSize = ((count as number) / maxCount) * (maxFontSize - minFontSize) + minFontSize;
          const wordWidth = fontSize * word.length * 0.6; // Estimate width
          const rotate = Math.random() < 0.25 ? 90 : 0;

          // If too wide for screen, move to next line
          if (currentLineWidth + wordWidth > width * 0.9) {
            currentLine++;
            currentLineWidth = 0;
          }

          const wordX = width / 2 - (width * 0.4) + currentLineWidth;
          const wordY = height / 2 - 100 + currentLine * lineHeight;

          currentLineWidth += wordWidth + 10; // 10px padding between words

          return (
            <SvgText
              key={index}
              x={wordX}
              y={wordY}
              fontSize={fontSize}
              fontFamily="JosefinSans-Regular"
              fill="white"
              textAnchor="start"
              transform={`rotate(${rotate}, ${wordX}, ${wordY})`}
            >
              {word}
            </SvgText>
          );
        })}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
});
