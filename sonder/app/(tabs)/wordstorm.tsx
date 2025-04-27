"use client"

import { useEffect, useState, useRef } from "react"
import { StyleSheet, View, Dimensions } from "react-native"
import { Svg, Text as SvgText, Defs, RadialGradient, Stop } from "react-native-svg"

const { width, height } = Dimensions.get("window")

// Sample data with varied content
const sampleResponses = [
  {
    id: 1,
    response_text:
      "I would compromise on location for a job I truly love. Finding meaningful work matters more than where I live.",
  },
  {
    id: 2,
    response_text: "Sleep. I'll sacrifice sleep to achieve my goals, though I know it's not sustainable long-term.",
  },
  {
    id: 3,
    response_text: "I'm willing to compromise on salary for better work-life balance and a positive company culture.",
  },
  {
    id: 4,
    response_text: "Material possessions. I'd rather have rich experiences than expensive things.",
  },
  {
    id: 5,
    response_text: "I won't compromise on my core values, but I'm flexible on the path to achieving my goals.",
  },
  {
    id: 6,
    response_text:
      "Comfort. Growth happens outside the comfort zone, so I'll endure temporary discomfort for long-term growth.",
  },
  {
    id: 7,
    response_text: "I'll compromise on immediate gratification for long-term success and stability.",
  },
  {
    id: 8,
    response_text:
      "Social life sometimes takes a backseat when I'm focused on important projects or personal development.",
  },
  {
    id: 9,
    response_text: "I'm willing to compromise on being right in order to maintain healthy relationships.",
  },
  {
    id: 10,
    response_text: "Time alone. I value solitude but will sacrifice it to support loved ones when they need me.",
  },
]

// Stopwords set
const STOPWORDS = new Set([
  "a", "an", "the", "and", "but", "if", "or", "because", "as", "until", "while", "of", "at", "by", "for", "with",
  "about", "against", "between", "into", "through", "during", "before", "after", "above", "below", "to", "from",
  "up", "down", "in", "out", "on", "off", "over", "under", "again", "further", "then", "once", "here", "there",
  "when", "where", "why", "how", "all", "any", "both", "each", "few", "more", "most", "other", "some", "such",
  "no", "nor", "not", "only", "own", "same", "so", "than", "too", "very", "s", "t", "can", "will", "just", "don",
  "should", "now", "",
])

// Purple color palette
const COLORS = [
  "#8A4FFF", // Base purple
  "#9966FF",
  "#A67CFF",
  "#B38EFF",
  "#C0A0FF",
  "#CDB2FF",
  "#DAC4FF", // Lightest purple
]

// Define interfaces for TypeScript
interface WordData {
  text: string
  count: number
  size: number
  color: string
  opacity: number
  width: number
  height: number
  x?: number
  y?: number
  rotate?: number
  bounds?: {
    left: number
    right: number
    top: number
    bottom: number
  }
}

interface Response {
  id: number
  response_text: string
}

export default function WordStorm() {
  const [words, setWords] = useState<WordData[]>([])
  const [debugInfo, setDebugInfo] = useState<string>("")
  const [animateOpacity, setAnimateOpacity] = useState(0.8)
  const svgRef = useRef<any>(null)

  // Add animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimateOpacity(prev => (prev === 0.8 ? 0.9 : 0.8))
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Process words on component mount
    processWords()
  }, [])

  // Collision detection function
  const resolveCollisions = (words: WordData[]) => {
    // Calculate word boundaries for collision detection
    words.forEach(word => {
      if (!word.x || !word.y) return
      
      word.bounds = {
        left: word.x - (word.width / 2),
        right: word.x + (word.width / 2),
        top: word.y - (word.height / 2),
        bottom: word.y + (word.height / 2)
      }
    })
    
    // Check for and fix collisions
    let iterations = 0
    const maxIterations = 100 // Increased from 50
    let hasCollision = true
    
    while (hasCollision && iterations < maxIterations) {
      hasCollision = false
      iterations++
      
      for (let i = 0; i < words.length; i++) {
        const wordA = words[i]
        if (!wordA.bounds) continue
        
        for (let j = i + 1; j < words.length; j++) {
          const wordB = words[j]
          if (!wordB.bounds) continue
          
          // Check for collision
          if (!(wordA.bounds.right < wordB.bounds.left || 
                wordA.bounds.left > wordB.bounds.right || 
                wordA.bounds.bottom < wordB.bounds.top || 
                wordA.bounds.top > wordB.bounds.bottom)) {
            
            hasCollision = true
            
            // Move words apart based on importance
            const moveA = i >= 5 // Don't move top 5 words
            const moveB = j >= 5
            const moveDistance = 10 // Increased from 5
            
            if (moveA && moveB) {
              // Move both words
              const angle = Math.random() * Math.PI * 2
              wordA.x! += Math.cos(angle) * moveDistance
              wordA.y! += Math.sin(angle) * moveDistance
              wordB.x! -= Math.cos(angle) * moveDistance
              wordB.y! -= Math.sin(angle) * moveDistance
            } else if (moveA) {
              // Move only word A
              const angle = Math.random() * Math.PI * 2
              wordA.x! += Math.cos(angle) * moveDistance * 2
              wordA.y! += Math.sin(angle) * moveDistance * 2
            } else if (moveB) {
              // Move only word B
              const angle = Math.random() * Math.PI * 2
              wordB.x! += Math.cos(angle) * moveDistance * 2
              wordB.y! += Math.sin(angle) * moveDistance * 2
            }
            
            // Recalculate bounds after moving
            if (moveA) {
              wordA.bounds = {
                left: wordA.x! - (wordA.width / 2),
                right: wordA.x! + (wordA.width / 2),
                top: wordA.y! - (wordA.height / 2),
                bottom: wordA.y! + (wordA.height / 2)
              }
            }
            
            if (moveB) {
              wordB.bounds = {
                left: wordB.x! - (wordB.width / 2),
                right: wordB.x! + (wordB.width / 2),
                top: wordB.y! - (wordB.height / 2),
                bottom: wordB.y! + (wordB.height / 2)
              }
            }
          }
        }
      }
    }
    
    // Add a padding factor to the word sizes for better spacing
    words.forEach(word => {
      word.width *= 1.5 // Increased from 1.2
      word.height *= 1.5 // Increased from 1.2
    })
    
    return words
  }

  const processWords = () => {
    // Count word frequencies
    const wordCounts: Record<string, number> = {}
    let totalWords = 0
    let filteredWords = 0

    // Use the sample responses
    const responses = sampleResponses

    responses.forEach((response: Response) => {
      const text = response.response_text.toLowerCase()
      // Split by spaces and punctuation
      const words = text.split(/[\s.,;:!?()[\]{}'"/\\<>-]+/)

      totalWords += words.length

      words.forEach((word: string) => {
        // Less strict filtering - only filter stopwords and very short words
        if (!STOPWORDS.has(word) && word.length > 1) {
          wordCounts[word] = (wordCounts[word] || 0) + 1
          filteredWords++
        }
      })
    })

    // Debug information
    setDebugInfo(
      `Total words: ${totalWords}, Filtered words: ${filteredWords}, Unique words: ${Object.keys(wordCounts).length}`,
    )

    // Convert to array and sort by frequency
    const wordList = Object.entries(wordCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 40) // Limit to top 40 words

    // If we still don't have enough words, add some manually
    if (wordList.length < 5) {
      const backupWords: [string, number][] = [
        ["compromise", 10],
        ["willing", 8],
        ["values", 7],
        ["work", 6],
        ["balance", 5],
        ["life", 5],
        ["time", 4],
        ["goals", 4],
        ["growth", 3],
        ["meaningful", 3],
      ]

      backupWords.forEach(([word, count]) => {
        if (!wordCounts[word as string]) {
          wordList.push([word, count])
        }
      })
    }

    // Updated sizes for better visual impact
    const maxFontSize = 80
    const minFontSize = 22
    const maxCount = Math.max(...wordList.map(([_, count]) => count as number))

    // Calculate word sizes and prepare for placement
    const wordsWithSizes: WordData[] = wordList.map(([word, count], index) => {
      const countNum = count as number
      const size = (countNum / maxCount) * (maxFontSize - minFontSize) + minFontSize
      const colorIndex = Math.min(Math.floor((countNum / maxCount) * COLORS.length), COLORS.length - 1)
      const color = COLORS[colorIndex]
      // Higher base opacity for better visibility
      const opacity = 0.9 + (countNum / maxCount) * 0.1

      return {
        text: word as string,
        count: countNum,
        size,
        color,
        opacity,
        width: (word as string).length * size * 0.6, // Estimate width
        height: size * 1.2, // Estimate height
      }
    })

    const centerX = width / 2
    const centerY = height / 2
    const maxRadius = Math.min(width, height) * 0.45

    // Define pattern functions
    const patterns = [
      // Circular pattern
      (i: number, total: number) => {
        const angle = (i / total) * Math.PI * 2
        const radius = maxRadius * (0.2 + 0.6 * Math.random())
        return {
          x: centerX + Math.cos(angle) * radius,
          y: centerY + Math.sin(angle) * radius,
          rotate: Math.random() < 0.2 ? 90 : Math.random() * 30 - 15,
        }
      },
      // Vertical wave pattern
      (i: number, total: number) => {
        const progress = i / total
        const x = width * (0.2 + progress * 0.6)
        const waveHeight = height * 0.3
        const y = centerY + Math.sin(progress * Math.PI * 3) * waveHeight
        return {
          x,
          y,
          rotate: Math.sin(progress * Math.PI * 2) * 25,
        }
      },
      // Horizontal wave pattern
      (i: number, total: number) => {
        const progress = i / total
        const y = height * (0.2 + progress * 0.6)
        const waveWidth = width * 0.3
        const x = centerX + Math.sin(progress * Math.PI * 3) * waveWidth
        return {
          x,
          y,
          rotate: Math.sin(progress * Math.PI * 2) * 20,
        }
      }
    ]

    // Group words by importance
    const topWords = wordsWithSizes.slice(0, 5)
    const mediumWords = wordsWithSizes.slice(5, 15)
    const restWords = wordsWithSizes.slice(15)
    
    // Place top words in central positions with increased spacing
    topWords.forEach((word, i) => {
      const angle = (i / topWords.length) * Math.PI * 2
      const radius = maxRadius * 0.35 // Increased from 0.25
      word.x = centerX + Math.cos(angle) * radius
      word.y = centerY + Math.sin(angle) * radius
      word.rotate = 0 // Keep important words straight
    })
    
    // Place medium importance words in a nice pattern
    mediumWords.forEach((word, i) => {
      const pattern = patterns[1] // Use wave pattern
      const position = pattern(i, mediumWords.length)
      word.x = position.x
      word.y = position.y
      word.rotate = position.rotate
    })
    
    // Place remaining words with more variation
    restWords.forEach((word, i) => {
      const patternIndex = i % patterns.length
      const pattern = patterns[patternIndex]
      const position = pattern(i, restWords.length)
      word.x = position.x
      word.y = position.y
      word.rotate = position.rotate
    })

    // Final word set with collisions resolved
    const finalWords = resolveCollisions([...topWords, ...mediumWords, ...restWords])
    setWords(finalWords)
  }

  return (
    <View style={styles.container}>
      <Svg width={width} height={height} ref={svgRef}>
        <Defs>
          <RadialGradient id="backgroundGradient" cx="50%" cy="50%" r="70%" fx="50%" fy="50%">
            <Stop offset="0%" stopColor="#4B0082" stopOpacity={0.3} />
            <Stop offset="100%" stopColor="#000000" stopOpacity={0} />
          </RadialGradient>
        </Defs>

        {/* Enhanced background glow */}
        <SvgText
          x={width / 2}
          y={height / 2}
          fontSize={150}
          fontFamily="JosefinSans-Bold"
          fill="url(#backgroundGradient)"
          textAnchor="middle"
          opacity={animateOpacity}
        >
          sonder
        </SvgText>

        {/* Words with enhanced styling */}
        {words.map((word, index) => (
          <SvgText
            key={index}
            x={word.x}
            y={word.y}
            fontSize={word.size}
            fontFamily={index < 5 ? "JosefinSans-Bold" : "JosefinSans-Regular"}
            fill={word.color}
            fillOpacity={word.opacity}
            textAnchor="middle"
            transform={`rotate(${word.rotate}, ${word.x}, ${word.y})`}
            stroke={index < 5 ? "#6F31EC" : "#000000"}
            strokeWidth={index < 5 ? 0.5 : 0.3}
            strokeOpacity={0.4}
          >
            {word.text}
          </SvgText>
        ))}

        {/* Debug info - remove in production */}
        {debugInfo && (
          <SvgText x={10} y={20} fontSize={10} fill="#ffffff" opacity={0.5}>
            {debugInfo}
          </SvgText>
        )}
      </Svg>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
})