import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function WordStorm() {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <script src="https://cdnjs.cloudflare.com/ajax/libs/wordcloud2.js/1.1.2/wordcloud2.min.js"></script>
      <style>
        html, body {
          margin: 0;
          padding: 0;
          background: #000;
          height: 100%;
          width: 100%;
        }
        #canvas {
          width: 100%;
          height: 100%;
        }
      </style>
    </head>
    <body>
      <canvas id="canvas"></canvas>
      <script>
        WordCloud(document.getElementById('canvas'), {
          list: [
            ["network", 50],
            ["complex", 30],
            ["description", 20],
            ["systems", 15],
            ["theoretical", 10]
          ],
          gridSize: 8,
          weightFactor: 4,
          fontFamily: "Josefin Sans, sans-serif",
          color: "random-dark",
          backgroundColor: "#000",
          rotateRatio: 0.5
        });
      </script>
    </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        style={{ flex: 1 }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
});
