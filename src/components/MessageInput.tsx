import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
};

export default function MessageInput({
  value,
  onChangeText,
  onSend,
}: Props) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Ask StudyAI anything..."
        placeholderTextColor="#94A3B8"
        value={value}
        onChangeText={onChangeText}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={onSend}
      >
        <Text style={styles.buttonText}>Send</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 15,
    backgroundColor: "#0F172A",
    alignItems: "center",
  },

  input: {
    flex: 1,
    backgroundColor: "#1E293B",
    color: "#FFFFFF",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 12,
    fontSize: 16,
    marginRight: 10,
  },

  button: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },

  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});