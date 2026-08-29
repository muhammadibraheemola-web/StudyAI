import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function WelcomeScreen() {
  async function getStarted() {
    try {
      await SecureStore.setItemAsync(
        "studyai_has_started",
        "true"
      );

      router.replace("/");
    } catch (error) {
      console.log("Could not save startup setting:", error);

      // Still allow the user to enter the app
      router.replace("/");
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.topGlow} />

      <View style={styles.content}>
        {/* StudyAI Logo */}
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>📚</Text>
        </View>

        <Text style={styles.title}>
          StudyAI
        </Text>

        <Text style={styles.subtitle}>
          Learn Smarter with AI
        </Text>

        <Text style={styles.description}>
          Your personal AI study assistant for learning,
          practicing, and understanding more.
        </Text>

        {/* Features */}
        <View style={styles.features}>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>
              🤖
            </Text>

            <Text style={styles.featureText}>
              Ask AI
            </Text>
          </View>

          <View style={styles.feature}>
            <Text style={styles.featureIcon}>
              🧠
            </Text>

            <Text style={styles.featureText}>
              Quiz
            </Text>
          </View>

          <View style={styles.feature}>
            <Text style={styles.featureIcon}>
              📚
            </Text>

            <Text style={styles.featureText}>
              Study
            </Text>
          </View>
        </View>

        {/* Get Started */}
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={getStarted}
        >
          <Text style={styles.buttonText}>
            Get Started 🚀
          </Text>
        </TouchableOpacity>

        <Text style={styles.footer}>
          Built for learners everywhere 🌍
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  topGlow: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "#1D4ED8",
    opacity: 0.12,
    top: -80,
  },

  content: {
    width: "100%",
    maxWidth: 500,
    alignItems: "center",
  },

  logoContainer: {
    width: 150,
    height: 150,
    borderRadius: 40,
    backgroundColor: "#1E293B",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
    borderWidth: 2,
    borderColor: "#2563EB",
  },

  logo: {
    fontSize: 78,
  },

  title: {
    color: "#38BDF8",
    fontSize: 46,
    fontWeight: "bold",
    letterSpacing: 1,
  },

  subtitle: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "600",
    marginTop: 5,
  },

  description: {
    color: "#CBD5E1",
    fontSize: 17,
    lineHeight: 27,
    textAlign: "center",
    marginTop: 18,
    maxWidth: 420,
  },

  features: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 30,
    marginBottom: 30,
  },

  feature: {
    backgroundColor: "#1E293B",
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 12,
    width: "31%",
    alignItems: "center",
  },

  featureIcon: {
    fontSize: 28,
    marginBottom: 7,
  },

  featureText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },

  button: {
    width: "100%",
    backgroundColor: "#2563EB",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 5,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "bold",
  },

  footer: {
    color: "#64748B",
    fontSize: 13,
    marginTop: 25,
  },
});