import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function WelcomeScreen() {
  async function getStarted() {
    try {
      await AsyncStorage.setItem(
        "studyai_has_started",
        "true"
      );

      router.replace("/auth");
    } catch (error) {
      console.log("Could not save startup setting:", error);

      router.replace("/auth");
    }
  }

  return (
    <View style={styles.container}>
      {/* Background glow */}
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoOuter}>
          <View style={styles.logoInner}>
            <Text style={styles.logo}>📚</Text>
          </View>
        </View>

        {/* Brand */}
        <Text style={styles.title}>StudyAI</Text>

        <View style={styles.aiBadge}>
          <View style={styles.dot} />
          <Text style={styles.aiBadgeText}>
            AI-POWERED LEARNING
          </Text>
        </View>

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
            <View style={styles.featureIconBox}>
              <Text style={styles.featureIcon}>🤖</Text>
            </View>

            <Text style={styles.featureTitle}>
              Ask AI
            </Text>

            <Text style={styles.featureDescription}>
              Get answers
            </Text>
          </View>

          <View style={styles.feature}>
            <View style={styles.featureIconBox}>
              <Text style={styles.featureIcon}>🧠</Text>
            </View>

            <Text style={styles.featureTitle}>
              Practice
            </Text>

            <Text style={styles.featureDescription}>
              Quiz & learn
            </Text>
          </View>

          <View style={styles.feature}>
            <View style={styles.featureIconBox}>
              <Text style={styles.featureIcon}>📚</Text>
            </View>

            <Text style={styles.featureTitle}>
              Study
            </Text>

            <Text style={styles.featureDescription}>
              Stay organized
            </Text>
          </View>
        </View>

        {/* Get Started */}
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.85}
          onPress={getStarted}
        >
          <Text style={styles.buttonText}>
            Get Started
          </Text>

          <Text style={styles.buttonArrow}>
            →
          </Text>
        </TouchableOpacity>

        {/* Footer */}
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
    backgroundColor: "#050B18",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    overflow: "hidden",
  },

  glowTop: {
    position: "absolute",
    width: 360,
    height: 360,
    borderRadius: 180,
    backgroundColor: "#2563EB",
    opacity: 0.13,
    top: -170,
    right: -100,
  },

  glowBottom: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "#38BDF8",
    opacity: 0.06,
    bottom: -140,
    left: -100,
  },

  content: {
    width: "100%",
    maxWidth: 520,
    alignItems: "center",
  },

  logoOuter: {
    width: 142,
    height: 142,
    borderRadius: 38,
    backgroundColor: "#0B1730",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2563EB",
    marginBottom: 20,
    shadowOpacity: 0.25,
    shadowRadius: 25,
    shadowOffset: {
      width: 0,
      height: 10,
    },
  },

  logoInner: {
    width: 112,
    height: 112,
    borderRadius: 30,
    backgroundColor: "#111F3A",
    justifyContent: "center",
    alignItems: "center",
  },

  logo: {
    fontSize: 64,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 44,
    fontWeight: "800",
    letterSpacing: 0.5,
  },

  aiBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0B1730",
    borderWidth: 1,
    borderColor: "#1D4ED8",
    borderRadius: 30,
    paddingHorizontal: 13,
    paddingVertical: 6,
    marginTop: 10,
  },

  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#22C55E",
    marginRight: 7,
  },

  aiBadgeText: {
    color: "#60A5FA",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },

  subtitle: {
    color: "#38BDF8",
    fontSize: 21,
    fontWeight: "700",
    marginTop: 18,
  },

  description: {
    color: "#94A3B8",
    fontSize: 16,
    lineHeight: 25,
    textAlign: "center",
    marginTop: 12,
    maxWidth: 430,
  },

  features: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 28,
    marginBottom: 28,
    gap: 10,
  },

  feature: {
    flex: 1,
    backgroundColor: "#0D1729",
    borderRadius: 18,
    paddingVertical: 15,
    paddingHorizontal: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1E293B",
  },

  featureIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#111F3A",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 9,
  },

  featureIcon: {
    fontSize: 24,
  },

  featureTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },

  featureDescription: {
    color: "#64748B",
    fontSize: 11,
    marginTop: 4,
  },

  button: {
    width: "100%",
    backgroundColor: "#2563EB",
    minHeight: 58,
    borderRadius: 17,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowOpacity: 0.2,
    shadowRadius: 15,
    shadowOffset: {
      width: 0,
      height: 8,
    },
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },

  buttonArrow: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "500",
    marginLeft: 12,
  },

  footer: {
    color: "#475569",
    fontSize: 12,
    marginTop: 20,
  },
});