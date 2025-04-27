import React, { useMemo, useEffect } from 'react';
import { StyleSheet, View, Dimensions, Animated, Easing } from 'react-native';
import { Svg, Text as SvgText } from 'react-native-svg';
import responses from "../../responses.json";
import { Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Types
interface WordFrequency {
  word: string;
  count: number;
}

interface WordCloudProps {
  word: string;
  fontSize: number;
  position: {
    x: number;
    y: number;
  };
  rotate: number;
  color: string;
  opacity: Animated.Value;
  scale: Animated.Value;
}

interface WordPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Constants
const WINDOW = Dimensions.get('window');
const LAYOUT = {
  maxFontSize: 56,
  minFontSize: 24,
  wordSpacing: 70,
  screenPadding: 0.85,
  centerX: WINDOW.width / 2,
  centerY: WINDOW.height / 2,
  rotationRange: 0,
  colorVariations: [
    '#64ffda',  // Mint
    '#a5f3fc',  // Light Cyan
    '#818cf8',  // Indigo
    '#c4b5fd',  // Lavender
    '#f0abfc',  // Pink
    '#93c5fd',  // Light Blue
    '#fcd34d',  // Amber
  ],
  animationDuration: 2000,
  jitterAmount: 1.1,
  placementAttempts: 400,
  spiralStep: 12,
  safetyMargin: 1.2,
  gridSize: 50,
  shadowOffset: { width: 1, height: 1 },
  shadowRadius: 2,
  shadowOpacity: 0.2,
  floatDuration: 3000,
  floatAmount: 8,
} as const;

// Spatial partitioning grid for faster overlap checking
interface Grid {
  [key: string]: WordPosition[];
}

// Interface to include rotation
interface WordData extends WordFrequency {
  rotation?: number;
}

// Helper functions
const calculateFontSize = (count: number, maxCount: number): number => {
  return ((count / maxCount) * (LAYOUT.maxFontSize - LAYOUT.minFontSize)) + LAYOUT.minFontSize;
};

const getRandomColor = () => {
  return LAYOUT.colorVariations[Math.floor(Math.random() * LAYOUT.colorVariations.length)];
};

const getRandomRotation = () => {
  return (Math.random() * 2 - 1) * LAYOUT.rotationRange;
};

// Get grid cells that a box intersects with
const getGridCells = (box: WordPosition): string[] => {
  const startX = Math.floor(box.x / LAYOUT.gridSize);
  const endX = Math.floor((box.x + box.width) / LAYOUT.gridSize);
  const startY = Math.floor(box.y / LAYOUT.gridSize);
  const endY = Math.floor((box.y + box.height) / LAYOUT.gridSize);
  
  const cells: string[] = [];
  for (let x = startX; x <= endX; x++) {
    for (let y = startY; y <= endY; y++) {
      cells.push(`${x},${y}`);
    }
  }
  return cells;
};

// Enhanced overlap detection
const doBoxesOverlap = (box1: WordPosition, box2: WordPosition): boolean => {
  const margin = LAYOUT.safetyMargin;
  const box1Width = box1.width * margin;
  const box1Height = box1.height * margin;
  const box2Width = box2.width * margin;
  const box2Height = box2.height * margin;

  const box1CenterX = box1.x + box1.width / 2;
  const box1CenterY = box1.y + box1.height / 2;
  const box2CenterX = box2.x + box2.width / 2;
  const box2CenterY = box2.y + box2.height / 2;

  return !(
    box1CenterX + box1Width/2 < box2CenterX - box2Width/2 ||
    box1CenterX - box1Width/2 > box2CenterX + box2Width/2 ||
    box1CenterY + box1Height/2 < box2CenterY - box2Height/2 ||
    box1CenterY - box1Height/2 > box2CenterY + box2Height/2
  );
};

// Check if a position overlaps with any placed words using spatial partitioning
const hasAnyOverlap = (newBox: WordPosition, grid: Grid): boolean => {
  const cells = getGridCells(newBox);
  const checkedBoxes = new Set<WordPosition>();

  for (const cell of cells) {
    if (grid[cell]) {
      for (const placedBox of grid[cell]) {
        if (!checkedBoxes.has(placedBox)) {
          checkedBoxes.add(placedBox);
          if (doBoxesOverlap(newBox, placedBox)) {
            return true;
          }
        }
      }
    }
  }
  return false;
};

// Add a box to the spatial partitioning grid
const addToGrid = (box: WordPosition, grid: Grid) => {
  const cells = getGridCells(box);
  for (const cell of cells) {
    if (!grid[cell]) {
      grid[cell] = [];
    }
    grid[cell].push(box);
  }
};

// Enhanced position finding with spatial partitioning
const findValidPosition = (
  fontSize: number,
  word: string,
  placedWords: WordPosition[],
  grid: Grid
): { x: number; y: number } | null => {
  const wordWidth = fontSize * word.length * 0.6;
  const wordHeight = fontSize * 1.2;
  const padding = LAYOUT.wordSpacing;

  // Try positions in multiple spiral patterns from different starting points
  const startingPoints = [
    { x: LAYOUT.centerX, y: LAYOUT.centerY }, // Center
    { x: LAYOUT.centerX - WINDOW.width/4, y: LAYOUT.centerY }, // Left
    { x: LAYOUT.centerX + WINDOW.width/4, y: LAYOUT.centerY }, // Right
    { x: LAYOUT.centerX, y: LAYOUT.centerY - WINDOW.height/4 }, // Top
    { x: LAYOUT.centerX, y: LAYOUT.centerY + WINDOW.height/4 }, // Bottom
  ];

  for (const startPoint of startingPoints) {
    let angle = Math.random() * Math.PI * 2;
    let radius = 0;

    for (let i = 0; i < LAYOUT.placementAttempts; i++) {
      radius += LAYOUT.spiralStep;
      angle += Math.PI / 4;

      const x = startPoint.x + Math.cos(angle) * radius;
      const y = startPoint.y + Math.sin(angle) * radius;

      // Check if position is within bounds with padding
      if (
        x - wordWidth/2 < padding ||
        x + wordWidth/2 > WINDOW.width - padding ||
        y - wordHeight/2 < padding ||
        y + wordHeight/2 > WINDOW.height - padding
      ) {
        continue;
      }

      const newBox: WordPosition = {
        x: x - (wordWidth + padding)/2,
        y: y - (wordHeight + padding)/2,
        width: wordWidth + padding,
        height: wordHeight + padding,
      };

      // If position has no overlaps, use it
      if (!hasAnyOverlap(newBox, grid)) {
        placedWords.push(newBox);
        addToGrid(newBox, grid);
        return { x, y };
      }
    }
  }

  // If no valid position found, return null
  return null;
};

// WordCloud component with simplified animations
const WordCloud: React.FC<WordCloudProps> = ({ word, fontSize, position, rotate, color, opacity, scale }) => {
  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: position.x - (fontSize * word.length * 0.3),
        top: position.y - (fontSize * 0.5),
        opacity,
        transform: [
          { scale },
          { rotate: `${rotate}deg` },
        ],
        shadowColor: '#000',
        shadowOffset: LAYOUT.shadowOffset,
        shadowRadius: LAYOUT.shadowRadius,
        shadowOpacity: LAYOUT.shadowOpacity,
        elevation: 5,
      }}
    >
      <Text
        style={{
          fontSize,
          color,
          fontWeight: '500',
          textAlign: 'center',
          fontFamily: 'System',
          letterSpacing: 0.5,
        }}
      >
        {word}
      </Text>
    </Animated.View>
  );
};

// Mock data for testing
const mockWords: WordFrequency[] = [
  // Core emotional words (larger)
  { word: "love", count: 10 },
  { word: "joy", count: 10 },
  { word: "peace", count: 10 },
  { word: "hope", count: 10 },
  { word: "faith", count: 10 },
  // Medium-sized words
  { word: "grace", count: 8 },
  { word: "happy", count: 8 },
  { word: "dream", count: 8 },
  { word: "heart", count: 8 },
  { word: "light", count: 8 },
  { word: "soul", count: 8 },
  { word: "spirit", count: 8 },
  { word: "gentle", count: 8 },
  { word: "calm", count: 8 },
  // Floating emojis (medium-large size)
  { word: "✨", count: 9 },
  { word: "💫", count: 9 },
  { word: "🌟", count: 9 },
  { word: "⭐", count: 9 },
  { word: "💝", count: 9 },
  // Smaller supporting words
  { word: "smile", count: 6 },
  { word: "laugh", count: 6 },
  { word: "believe", count: 6 },
  { word: "trust", count: 6 },
  { word: "friend", count: 6 },
  { word: "family", count: 6 },
  { word: "kindness", count: 6 },
  { word: "serenity", count: 6 },
  { word: "harmony", count: 6 },
  { word: "bliss", count: 6 },
  { word: "wonder", count: 6 },
  { word: "dream", count: 6 },
  { word: "shine", count: 6 },
  { word: "glow", count: 6 },
  // More floating emojis (medium size)
  { word: "🌸", count: 7 },
  { word: "✨", count: 7 },
  { word: "💭", count: 7 },
  { word: "🕊️", count: 7 },
  { word: "🤍", count: 7 },
  // Smallest words for filling space
  { word: "life", count: 4 },
  { word: "wish", count: 4 },
  { word: "soft", count: 4 },
  { word: "warm", count: 4 },
  { word: "pure", count: 4 },
  { word: "free", count: 4 },
  { word: "flow", count: 4 },
  { word: "grow", count: 4 },
  { word: "rise", count: 4 },
  { word: "bloom", count: 4 },
  // Small floating emojis
  { word: "✧", count: 5 },
  { word: "⋆", count: 5 },
  { word: "🌙", count: 5 },
  { word: "🌺", count: 5 },
  { word: "💫", count: 5 }
];

export default function WordStorm() {
  // Process word frequencies
  const { wordList, maxCount } = useMemo(() => {
    return {
      wordList: mockWords,
      maxCount: Math.max(...mockWords.map(item => item.count))
    };
  }, []);

  // Add floating animation
  const createFloatingAnimation = () => {
    const floatY = new Animated.Value(0);
    
    // Smooth floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatY, {
          toValue: 1,
          duration: LAYOUT.floatDuration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatY, {
          toValue: 0,
          duration: LAYOUT.floatDuration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    return floatY;
  };

  const floatingAnimation = useMemo(() => createFloatingAnimation(), []);

  const wordElements = useMemo(() => {
    const placedWords: WordPosition[] = [];
    const grid: Grid = {};
    const successfulPlacements: Array<{
      item: WordFrequency;
      position: { x: number; y: number };
    }> = [];

    wordList.forEach(item => {
      const fontSize = calculateFontSize(item.count, maxCount);
      const position = findValidPosition(fontSize, item.word, placedWords, grid);
      
      if (position) {
        successfulPlacements.push({ item, position });
      }
    });

    return successfulPlacements.map(({ item, position }, index) => {
      const fontSize = calculateFontSize(item.count, maxCount);
      const color = getRandomColor();
      
      const opacity = new Animated.Value(0);
      const scale = new Animated.Value(0.5);

      // Entrance animation
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: LAYOUT.animationDuration,
          delay: index * 150,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: LAYOUT.animationDuration,
          delay: index * 150,
          useNativeDriver: true,
          easing: Easing.elastic(1.2),
        }),
      ]).start();

      const translateY = Animated.multiply(
        floatingAnimation,
        new Animated.Value(LAYOUT.floatAmount * (Math.random() * 2 - 1))
      );

      return (
        <Animated.View
          key={`${item.word}-${index}`}
          style={{
            position: 'absolute',
            left: position.x - (fontSize * item.word.length * 0.3),
            top: position.y - (fontSize * 0.5),
            opacity,
            transform: [
              { scale },
              { translateY }
            ],
            shadowColor: '#000',
            shadowOffset: LAYOUT.shadowOffset,
            shadowRadius: LAYOUT.shadowRadius,
            shadowOpacity: LAYOUT.shadowOpacity,
            elevation: 5,
          }}
        >
          <Text
            style={{
              fontSize,
              color,
              fontWeight: '500',
              textAlign: 'center',
              fontFamily: 'System',
              letterSpacing: 0.5,
            }}
          >
            {item.word}
          </Text>
        </Animated.View>
      );
    });
  }, [wordList, maxCount, floatingAnimation]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0A0218', '#12022B']}
        style={StyleSheet.absoluteFillObject}
      >
        {wordElements}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
});



// import { StyleSheet, View, Dimensions } from 'react-native';
// import { Svg, Text as SvgText } from 'react-native-svg';
// import responses from "../../responses.json"
// const { width, height } = Dimensions.get('window');

// export default function WordStorm() {


//   // Count word frequencies
//   const wordCounts: Record<string, number> = {};
//   responses.forEach(response => {
//     response.response_text.toLowerCase().split(' ').forEach(word => {
//       wordCounts[word] = (wordCounts[word] || 0) + 1;
//     });
//   });

//   const wordList = Object.entries(wordCounts)
//     .sort((a, b) => (b[1] as number) - (a[1] as number)); // Sort by frequency

//   const maxFontSize = 48;
//   const minFontSize = 16;
//   const maxCount = Math.max(...wordList.map(([_, count]) => count));

//   // Layout variables
//   let x = width / 2;
//   let y = height / 2;
//   let lineHeight = 60; // vertical space between lines
//   let currentLineWidth = 0;
//   let currentLine = 0;

//   return (
//     <View style={styles.container}>
//       <Svg width={width} height={height}>
//         {wordList.map(([word, count], index) => {
//           const fontSize = ((count as number) / maxCount) * (maxFontSize - minFontSize) + minFontSize;
//           const wordWidth = fontSize * word.length * 0.6; // Estimate width
//           const rotate = Math.random() < 0.25 ? 90 : 0;

//           // If too wide for screen, move to next line
//           if (currentLineWidth + wordWidth > width * 0.9) {
//             currentLine++;
//             currentLineWidth = 0;
//           }

//           const wordX = width / 2 - (width * 0.4) + currentLineWidth;
//           const wordY = height / 2 - 100 + currentLine * lineHeight;

//           currentLineWidth += wordWidth + 10; // 10px padding between words

//           return (
//             <SvgText
//               key={index}
//               x={wordX}
//               y={wordY}
//               fontSize={fontSize}
//               fontFamily="JosefinSans-Regular"
//               fill="white"
//               textAnchor="start"
//               transform={`rotate(${rotate}, ${wordX}, ${wordY})`}
//             >
//               {word}
//             </SvgText>
//           );
//         })}
//       </Svg>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'black',
//   },
// });
