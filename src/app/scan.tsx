import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { askHomework } from "../services/groq";

const HOMEWORK_COUNT_KEY = "homework_count";
const ACTIVITY_COUNT_KEY = "studyai_activity_count";

export default function ScanScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [counted, setCounted] = useState(false);

  async function pickImage() {
    try {
      const result =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          allowsEditing: true,
          quality: 0.9,
        });

      if (!result.canceled && result.assets?.length > 0) {
        setImage(result.assets[0].uri);
        setAnswer("");
        setCounted(false);
      }
    } catch (error) {
      console.log("Image picker error:", error);

      Alert.alert(
        "Error",
        "Could not choose the homework image."
      );
    }
  }

  async function saveHomeworkProgress() {
    try {
      // Get current homework count
      const savedHomeworkCount =
        await AsyncStorage.getItem(
          HOMEWORK_COUNT_KEY
        );

      const oldHomeworkCount = Number(
        savedHomeworkCount || "0"
      );

      // Increase homework count by 1
      await AsyncStorage.setItem(
        HOMEWORK_COUNT_KEY,
        String(oldHomeworkCount + 1)
      );

      // Get total activity count
      const savedActivityCount =
        await AsyncStorage.getItem(
          ACTIVITY_COUNT_KEY
        );

      const oldActivityCount = Number(
        savedActivityCount || "0"
      );

      // Increase total study activities by 1
      await AsyncStorage.setItem(
        ACTIVITY_COUNT_KEY,
        String(oldActivityCount + 1)
      );

      console.log(
        "Homework progress saved:",
        oldHomeworkCount + 1
      );

      console.log(
        "Study activities saved:",
        oldActivityCount + 1
      );

      setCounted(true);
    } catch (error) {
      console.log(
        "Could not save homework progress:",
        error
      );
    }
  }

  async function solveHomework() {
    if (!image) {
      Alert.alert(
        "Choose Homework",
        "Please choose a homework image first."
      );
      return;
    }

    setLoading(true);
    setAnswer("");

    try {
      // Send homework image to the existing
      // working vision function.
      const response = await askHomework(image);

      if (!response || response.trim() === "") {
        throw new Error(
          "No answer received from Homework Scanner."
        );
      }

      setAnswer(response);

      // Only count this homework once.
      if (!counted) {
        await saveHomeworkProgress();
      }
    } catch (error) {
      console.log(
        "Homework error:",
        error
      );

      Alert.alert(
        "Homework Error",
        "StudyAI could not analyze this homework. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function clearHomework() {
    setImage(null);
    setAnswer("");
    setCounted(false);
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>
        📷 Homework Scanner
      </Text>

      <Text style={styles.subtitle}>
        Take a photo or choose a homework image and let
        StudyAI help you understand it.
      </Text>

      {!image ? (
        <TouchableOpacity
          style={styles.chooseButton}
          onPress={pickImage}
          activeOpacity={0.85}
        >
          <Text style={styles.chooseButtonText}>
            📷 Choose Homework Photo
          </Text>
        </TouchableOpacity>
      ) : (
        <>
          {/* IMAGE PREVIEW */}

          <View style={styles.imageCard}>
            <Image
              source={{ uri: image }}
              style={styles.image}
              resizeMode="contain"
            />
          </View>

          {/* IMAGE BUTTONS */}

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.changeButton}
              onPress={pickImage}
              activeOpacity={0.8}
            >
              <Text style={styles.changeText}>
                🔄 Change
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.clearButton}
              onPress={clearHomework}
              activeOpacity={0.8}
            >
              <Text style={styles.clearText}>
                ✕ Clear
              </Text>
            </TouchableOpacity>
          </View>

          {/* SOLVE BUTTON */}

          <TouchableOpacity
            style={[
              styles.solveButton,
              loading && styles.disabledButton,
            ]}
            onPress={solveHomework}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator
                  color="#FFFFFF"
                  size="small"
                />

                <Text style={styles.solveText}>
                  StudyAI is analyzing...
                </Text>
              </View>
            ) : (
              <Text style={styles.solveText}>
                🤖 Help Me Solve This
              </Text>
            )}
          </TouchableOpacity>
        </>
      )}

      {/* ANSWER */}

      {answer ? (
        <View style={styles.answerCard}>
          <Text style={styles.answerTitle}>
            💡 StudyAI Explanation
          </Text>

          <Text style={styles.answerText}>
            {answer}
          </Text>

          {counted && (
            <View style={styles.savedBadge}>
              <Text style={styles.savedText}>
                ⭐ Homework activity saved to Progress
              </Text>
            </View>
          )}
        </View>
      ) : !image ? (
        <View style={styles.readyCard}>
          <Text style={styles.readyEmoji}>
            📚
          </Text>

          <Text style={styles.readyTitle}>
            Ready to Study?
          </Text>

          <Text style={styles.readyText}>
            Choose a clear photo of your homework to
            get help from StudyAI.
          </Text>
        </View>
      ) : null}

      {/* TIP */}

      <View style={styles.tipCard}>
        <Text style={styles.tipTitle}>
          💡 Study Tip
        </Text>

        <Text style={styles.tipText}>
          Choose a clear photo where the entire
          question is visible. StudyAI will explain
          the problem step-by-step.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#07152E",
  },

  content: {
    padding: 20,
    paddingBottom: 50,
  },

  title: {
    color: "#38BDF8",
    fontSize: 30,
    fontWeight: "900",
    marginTop: 20,
    marginBottom: 8,
  },

  subtitle: {
    color: "#CBD5E1",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 25,
  },

  chooseButton: {
    backgroundColor: "#2563EB",
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
  },

  chooseButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
  },

  imageCard: {
    backgroundColor: "#10254A",
    borderRadius: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#1E3A66",
    minHeight: 350,
    justifyContent: "center",
  },

  image: {
    width: "100%",
    height: 350,
    borderRadius: 14,
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },

  changeButton: {
    width: "48%",
    backgroundColor: "#173B70",
    padding: 15,
    borderRadius: 13,
    alignItems: "center",
  },

  changeText: {
    color: "#38BDF8",
    fontSize: 15,
    fontWeight: "800",
  },

  clearButton: {
    width: "48%",
    backgroundColor: "#3B1D2A",
    padding: 15,
    borderRadius: 13,
    alignItems: "center",
  },

  clearText: {
    color: "#FCA5A5",
    fontSize: 15,
    fontWeight: "800",
  },

  solveButton: {
    backgroundColor: "#2563EB",
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
    marginTop: 15,
  },

  disabledButton: {
    opacity: 0.6,
  },

  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  solveText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
  },

  answerCard: {
    backgroundColor: "#172554",
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#2563EB",
  },

  answerTitle: {
    color: "#38BDF8",
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 12,
  },

  answerText: {
    color: "#E2E8F0",
    fontSize: 16,
    lineHeight: 25,
  },

  savedBadge: {
    backgroundColor: "#123B2A",
    borderRadius: 12,
    padding: 12,
    marginTop: 18,
    borderWidth: 1,
    borderColor: "#16A34A",
  },

  savedText: {
    color: "#86EFAC",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },

  readyCard: {
    backgroundColor: "#172554",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    marginTop: 30,
  },

  readyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },

  readyTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 8,
  },

  readyText: {
    color: "#CBD5E1",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 21,
  },

  tipCard: {
    backgroundColor: "#10254A",
    borderRadius: 18,
    padding: 18,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#1E3A66",
  },

  tipTitle: {
    color: "#38BDF8",
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 7,
  },

  tipText: {
    color: "#94A3B8",
    fontSize: 14,
    lineHeight: 21,
  },
});