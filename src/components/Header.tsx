import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  onClear: () => void;
};

export default function Header({ onClear }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View>
          <Text style={styles.title}>🤖 StudyAI Assistant</Text>
          <Text style={styles.subtitle}>
            Ask anything and learn smarter
          </Text>
        </View>

        <TouchableOpacity
          style={styles.clearButton}
          onPress={onClear}
        >
          <Text style={styles.clearText}>🗑 Clear</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1E293B",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    color: "#38BDF8",
    fontSize: 24,
    fontWeight: "bold",
  },

  subtitle: {
    color: "#CBD5E1",
    marginTop: 5,
    fontSize: 15,
  },

  clearButton: {
    backgroundColor: "#DC2626",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },

  clearText: {
    color: "white",
    fontWeight: "bold",
  },
});