import { View, StyleSheet, Dimensions } from "react-native";
import Svg, { Path } from "react-native-svg";

const { width } = Dimensions.get("window");

interface WaveBackgroundProps {
  height?: number;
  style?: any;
}

export const WaveBackground = ({ height = 180, style }: WaveBackgroundProps) => {
  return (
    <View style={[styles.container, { height }, style]}>
      <Svg height={height} width={width} style={styles.svg} viewBox={`0 0 ${width} ${height}`}>
        {/* Darkest wave */}
        <Path
          d={`M0 ${height * 0.6} C ${width * 0.3} ${height * 0.3} ${width * 0.7} ${height * 0.8} ${width} ${
            height * 0.4
          } L${width} ${height} L0 ${height} Z`}
          fill="#2D0B7A" // Much darker purple
          fillOpacity={0.9}
        />
        {/* Medium wave */}
        <Path
          d={`M0 ${height * 0.75} C ${width * 0.4} ${height * 0.5} ${width * 0.6} ${height * 0.9} ${width} ${
            height * 0.6
          } L${width} ${height} L0 ${height} Z`}
          fill="#432191" // Dark muted purple
          fillOpacity={0.7}
        />
        {/* Lightest wave */}
        <Path
          d={`M0 ${height * 0.85} C ${width * 0.3} ${height * 0.7} ${width * 0.7} ${height * 0.95} ${width} ${
            height * 0.8
          } L${width} ${height} L0 ${height} Z`}
          fill="#0C0914" // Very dark near-black
          fillOpacity={0.5}
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: "100%",
    overflow: "hidden",
  },
  svg: {
    position: "absolute",
    bottom: 0,
  },
});
