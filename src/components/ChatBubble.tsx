import { StyleSheet, Text, View } from "react-native";

type Props = {
  message: string;
  sender: "user" | "ai";
};

export default function ChatBubble({ message, sender }: Props) {
  const isUser = sender === "user";

  return (
    <View
      style={[
        styles.container,
        isUser ? styles.userContainer : styles.aiContainer,
      ]}
    >
      <Text style={styles.sender}>
        {isUser ? "🧑 You" : "🤖 StudyAI"}
      </Text>

      <Text
        style={[
          styles.message,
          isUser ? styles.userText : styles.aiText,
        ]}
      >
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: "85%",
    padding: 14,
    borderRadius: 16,
    marginBottom: 15,
  },

  userContainer: {
    backgroundColor: "#2563EB",
    alignSelf: "flex-end",
    borderBottomRightRadius: 5,
  },

  aiContainer: {
    backgroundColor: "#1E293B",
    alignSelf: "flex-start",
    borderBottomLeftRadius: 5,
  },

  sender: {
    color: "#38BDF8",
    fontWeight: "bold",
    fontSize: 13,
    marginBottom: 8,
  },

  message: {
    fontSize: 16,
    lineHeight: 24,
  },

  userText: {
    color: "#FFFFFF",
  },

  aiText: {
    color: "#E2E8F0",
  },
});