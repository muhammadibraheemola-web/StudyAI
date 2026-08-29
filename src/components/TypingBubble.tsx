import { StyleSheet, Text, View } from "react-native";

export default function TypingBubble() {
  return (
    <View style={styles.container}>
      <Text style={styles.sender}>🤖 StudyAI</Text>

      <View style={styles.bubble}>
        <Text style={styles.text}>StudyAI is typing...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
    marginBottom: 15,
  },

  sender: {
    color: "#38BDF8",
    fontWeight: "bold",
    marginBottom: 5,
  },

  bubble: {
    backgroundColor: "#1E293B",
    padding: 14,
    borderRadius: 16,
    maxWidth: "80%",
  },

  text: {
    color: "white",
    fontSize: 16,
    fontStyle: "italic",
  },
});