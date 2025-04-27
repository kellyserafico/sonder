import React, { useMemo } from 'react';
import { StyleSheet, View, Dimensions, Animated, Easing, Platform } from 'react-native';
import { Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const WINDOW = Dimensions.get('window');
const LAYOUT = {
  maxFontSize: Platform.OS === 'web' ? 48 : 16,
  minFontSize: Platform.OS === 'web' ? 18 : 8,
  wordSpacing: 15,
  colorVariations: [
    '#8A4FFF', '#9966FF', '#A67CFF', '#B38EFF', 
    '#C0A0FF', '#CDB2FF', '#DAC4FF', '#F8F7FF'
  ],
  floatDuration: 3000,
  animationDuration: 2000,
};

// Combined word and emoji data
const wordData = [
  { word: "compromise", count: 10 },
  { word: "willing", count: 9 },
  { word: "✨", count: 9 },
  { word: "values", count: 8 },
  { word: "work", count: 8 },
  { word: "💫", count: 8 },
  { word: "balance", count: 7 },
  { word: "life", count: 7 },
  { word: "🌟", count: 7 },
  { word: "goals", count: 7 },
  { word: "comfort", count: 6 },
  { word: "🔮", count: 6 },
  { word: "meaningful", count: 6 },
  { word: "location", count: 5 },
  { word: "✦", count: 5 },
  { word: "long-term", count: 5 },
  { word: "growth", count: 5 },
  { word: "🌈", count: 5 },
  { word: "sacrifice", count: 5 },
  { word: "sleep", count: 4 },
  { word: "salary", count: 4 },
  { word: "💭", count: 4 },
  { word: "positive", count: 4 },
  { word: "culture", count: 4 },
  { word: "⭐", count: 4 },
  { word: "material", count: 4 },
  { word: "possessions", count: 4 },
  { word: "✧", count: 4 },
  { word: "truly", count: 3 },
  { word: "love", count: 3 },
  { word: "✴️", count: 3 },
  { word: "immediate", count: 3 },
  { word: "gratification", count: 3 },
  { word: "social", count: 3 },
  { word: "success", count: 3 },
  { word: "💜", count: 3 },
  { word: "experiences", count: 3 },
  { word: "solitude", count: 2 },
  { word: "support", count: 2 },
  { word: "⋆", count: 2 },
];

export default function WordStorm() {
  const floatingAnimation = useMemo(() => {
    const floatY = new Animated.Value(0);
    
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
  }, []);

  const wordElements = useMemo(() => {
    const { wordList, maxCount } = {
      wordList: wordData,
      maxCount: Math.max(...wordData.map(item => item.count))
    };

    const screenWidth = WINDOW.width;
    const screenHeight = WINDOW.height;

    const gridResolution = Platform.OS === 'web' ? 20 : 30;
    const grid = new Array(Math.ceil(screenHeight / gridResolution))
      .fill(null)
      .map(() => new Array(Math.ceil(screenWidth / gridResolution)).fill(false));

    const isAreaAvailable = (x, y, width, height) => {
      const startX = Math.max(0, Math.floor(x / gridResolution));
      const startY = Math.max(0, Math.floor(y / gridResolution));
      const endX = Math.min(grid[0].length - 1, Math.floor((x + width) / gridResolution));
      const endY = Math.min(grid.length - 1, Math.floor((y + height) / gridResolution));

      for (let j = startY; j <= endY; j++) {
        for (let i = startX; i <= endX; i++) {
          if (grid[j][i]) return false;
        }
      }
      return true;
    };

    const markAreaOccupied = (x, y, width, height) => {
      const startX = Math.max(0, Math.floor(x / gridResolution));
      const startY = Math.max(0, Math.floor(y / gridResolution));
      const endX = Math.min(grid[0].length - 1, Math.floor((x + width) / gridResolution));
      const endY = Math.min(grid.length - 1, Math.floor((y + height) / gridResolution));

      for (let j = startY; j <= endY; j++) {
        for (let i = startX; i <= endX; i++) {
          grid[j][i] = true;
        }
      }
    };

    const sortedWords = [...wordList].sort((a, b) => b.count - a.count);
    const successfulPlacements = [];

    sortedWords.forEach(item => {
      const fontSize = ((item.count / maxCount) * (LAYOUT.maxFontSize - LAYOUT.minFontSize)) + LAYOUT.minFontSize;
      
      const estimatedWidth = fontSize * item.word.length * 0.6;
      const estimatedHeight = fontSize * 1.1;

      let placed = false;
      for (let spread = 1; spread <= 5 && !placed; spread++) {
        for (let attempt = 0; attempt < 50; attempt++) {
          const position = {
            x: Math.max(10, Math.min(screenWidth - estimatedWidth, 
               screenWidth * Math.random())),
            y: Math.max(10, Math.min(screenHeight - estimatedHeight, 
               screenHeight * Math.random()))
          };

          if (isAreaAvailable(position.x, position.y, estimatedWidth, estimatedHeight)) {
            markAreaOccupied(position.x, position.y, estimatedWidth, estimatedHeight);
            successfulPlacements.push({ item, position, fontSize });
            placed = true;
            break;
          }
        }
      }

      if (!placed) {
        const position = {
          x: Math.random() * (screenWidth - estimatedWidth),
          y: Math.random() * (screenHeight - estimatedHeight)
        };
        successfulPlacements.push({ item, position, fontSize });
      }
    });

    return successfulPlacements.map(({ item, position, fontSize }, index) => {
      const isEmoji = item.word.match(/\p{Emoji}/u);
      const color = LAYOUT.colorVariations[Math.floor(Math.random() * LAYOUT.colorVariations.length)];
      const rotation = Platform.OS === 'web' ? (Math.random() * 2 - 1) * 10 : (Math.random() * 2 - 1) * 5;
      
      const opacity = new Animated.Value(0);
      const scale = new Animated.Value(0.5);

      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: LAYOUT.animationDuration,
          delay: index * (50 + Math.random() * 50),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: LAYOUT.animationDuration,
          delay: index * (50 + Math.random() * 50),
          useNativeDriver: true,
          easing: Easing.elastic(1.2),
        }),
      ]).start();

      const translateY = Animated.multiply(
        floatingAnimation,
        new Animated.Value((isEmoji ? 5 : 3) * (Math.random() * 2 - 1))
      );

      return (
        <Animated.View
          key={`${item.word}-${index}`}
          style={{
            position: 'absolute',
            left: position.x,
            top: position.y,
            opacity,
            transform: [
              { scale },
              { translateY },
              { rotate: isEmoji ? '0deg' : `${rotation}deg` }
            ],
            shadowColor: 'transparent',
            shadowOffset: { width: 0, height: 0 },
            shadowRadius: 0,
            shadowOpacity: 0,
            elevation: 0,
            maxWidth: screenWidth * 0.9,
          }}
        >
          <Text
            adjustsFontSizeToFit
            numberOfLines={1}
            style={{
              fontSize: isEmoji ? fontSize * 1.1 : fontSize,
              color,
              fontWeight: item.count > 7 ? 'bold' : '500',
              textAlign: 'center',
              fontFamily: 'System',
              letterSpacing: 0.2,
              maxWidth: '100%',
            }}
          >
            {item.word}
          </Text>
        </Animated.View>
      );
    });
  }, [floatingAnimation]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0A0218', '#12022B', '#1A034D']}
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