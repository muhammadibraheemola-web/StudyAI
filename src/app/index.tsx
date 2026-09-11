import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  const [checkingStartup, setCheckingStartup] = useState(true);

  useEffect(() => {
    async function checkStartup() {
      try {
        const hasStarted = await AsyncStorage.getItem(
          "studyai_has_started"
        );

        if (hasStarted !== "true") {
          router.replace("/welcome");
          return;
        }

        setCheckingStartup(false);
      } catch (error) {
        console.log("Startup check error:", error);
        router.replace("/welcome");
      }
    }

    checkStartup();
  }, []);

  if (checkingStartup) {
    return (
      <View style={styles.loadingScreen}>
        <Text style={styles.loadingLogo}>✦</Text>
        <Text style={styles.loadingTitle}>StudyAI</Text>

        <ActivityIndicator
          size="small"
          color="#38BDF8"
          style={styles.loadingIndicator}
        />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.greeting}>WELCOME BACK 👋</Text>

            <View style={styles.logoRow}>
              <View style={styles.logoDot}>
                <Text style={styles.logoDotText}>✦</Text>
              </View>

              <Text style={styles.logo}>StudyAI</Text>
            </View>

            <Text style={styles.subtitle}>
              Your personal AI study assistant
            </Text>
          </View>

          <TouchableOpacity
            style={styles.settingsButton}
            activeOpacity={0.75}
            onPress={() => router.push("/settings")}
          >
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* PRO BUTTON */}
        <TouchableOpacity
          style={styles.proBanner}
          activeOpacity={0.85}
          onPress={() => router.push("/pro")}
        >
          <View style={styles.proIcon}>
            <Text style={styles.proEmoji}>⭐</Text>
          </View>

          <View style={styles.proContent}>
            <Text style={styles.proTitle}>StudyAI Pro</Text>

            <Text style={styles.proText}>
              Unlock more powerful study tools
            </Text>
          </View>

          <View style={styles.proArrowBox}>
            <Text style={styles.proArrow}>→</Text>
          </View>
        </TouchableOpacity>

        {/* AI HERO */}
        <TouchableOpacity
          style={styles.aiCard}
          activeOpacity={0.88}
          onPress={() => router.push("/ai")}
        >
          <View style={styles.aiTopRow}>
            <View style={styles.aiIconBox}>
              <Text style={styles.aiEmoji}>🤖</Text>
            </View>

            <View style={styles.aiBadge}>
              <View style={styles.onlineDot} />

              <Text style={styles.aiBadgeText}>
                AI READY
              </Text>
            </View>
          </View>

          <Text style={styles.aiTitle}>Ask StudyAI</Text>

          <Text style={styles.aiDescription}>
            Ask questions, understand difficult topics, and get help with
            your studies.
          </Text>

          <View style={styles.aiAction}>
            <Text style={styles.aiActionText}>
              Start learning
            </Text>

            <Text style={styles.aiArrow}>→</Text>
          </View>
        </TouchableOpacity>

        {/* SECTION TITLE */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              Study Tools
            </Text>

            <Text style={styles.sectionSubtitle}>
              Everything you need to learn smarter
            </Text>
          </View>

          <View style={styles.sectionLine} />
        </View>

        {/* TOOL GRID */}
        <View style={styles.grid}>
          {/* NOTES */}
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => router.push("/notes")}
          >
            <View
              style={[
                styles.iconBox,
                styles.notesIcon,
              ]}
            >
              <Text style={styles.emoji}>📝</Text>
            </View>

            <Text style={styles.cardTitle}>
              Study Notes
            </Text>

            <Text style={styles.cardDescription}>
              Create and organize your notes
            </Text>

            <Text style={styles.cardArrow}>↗</Text>
          </TouchableOpacity>

          {/* QUIZ */}
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => router.push("/quiz")}
          >
            <View
              style={[
                styles.iconBox,
                styles.quizIcon,
              ]}
            >
              <Text style={styles.emoji}>🧠</Text>
            </View>

            <Text style={styles.cardTitle}>
              Quiz Me
            </Text>

            <Text style={styles.cardDescription}>
              Test your knowledge
            </Text>

            <Text style={styles.cardArrow}>↗</Text>
          </TouchableOpacity>

          {/* FLASHCARDS */}
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => router.push("/flashcards")}
          >
            <View
              style={[
                styles.iconBox,
                styles.flashcardIcon,
              ]}
            >
              <Text style={styles.emoji}>🃏</Text>
            </View>

            <Text style={styles.cardTitle}>
              Flashcards
            </Text>

            <Text style={styles.cardDescription}>
              Remember things faster
            </Text>

            <Text style={styles.cardArrow}>↗</Text>
          </TouchableOpacity>

          {/* HOMEWORK */}
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => router.push("/scan")}
          >
            <View
              style={[
                styles.iconBox,
                styles.scanIcon,
              ]}
            >
              <Text style={styles.emoji}>📷</Text>
            </View>

            <Text style={styles.cardTitle}>
              Homework
            </Text>

            <Text style={styles.cardDescription}>
              Get help with homework
            </Text>

            <Text style={styles.cardArrow}>↗</Text>
          </TouchableOpacity>

          {/* CALCULATOR */}
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => router.push("/calculator")}
          >
            <View
              style={[
                styles.iconBox,
                styles.calculatorIcon,
              ]}
            >
              <Text style={styles.emoji}>🧮</Text>
            </View>

            <Text style={styles.cardTitle}>
              Calculator
            </Text>

            <Text style={styles.cardDescription}>
              Solve math problems quickly
            </Text>

            <Text style={styles.cardArrow}>↗</Text>
          </TouchableOpacity>

          {/* PROGRESS */}
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => router.push("/progress")}
          >
            <View
              style={[
                styles.iconBox,
                styles.progressIcon,
              ]}
            >
              <Text style={styles.emoji}>📊</Text>
            </View>

            <Text style={styles.cardTitle}>
              Progress
            </Text>

            <Text style={styles.cardDescription}>
              Track your study activities
            </Text>

            <Text style={styles.cardArrow}>↗</Text>
          </TouchableOpacity>
        </View>

        {/* PROGRESS BANNER */}
        <TouchableOpacity
          style={styles.progressBanner}
          activeOpacity={0.85}
          onPress={() => router.push("/progress")}
        >
          <View style={styles.progressGlow}>
            <Text style={styles.progressEmoji}>🚀</Text>
          </View>

          <View style={styles.progressContent}>
            <Text style={styles.progressBannerTitle}>
              Keep learning
            </Text>

            <Text style={styles.progressBannerText}>
              Check your study progress and see how you're improving.
            </Text>
          </View>

          <View style={styles.bannerArrowBox}>
            <Text style={styles.bannerArrow}>→</Text>
          </View>
        </TouchableOpacity>

        {/* FOOTER */}
        <View style={styles.footerContainer}>
          <View style={styles.footerLine} />

          <Text style={styles.footer}>
            Study smarter • Learn faster • Grow 🚀
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    backgroundColor: "#050B18",
    alignItems: "center",
    justifyContent: "center",
  },

  loadingLogo: {
    color: "#38BDF8",
    fontSize: 42,
    fontWeight: "900",
    marginBottom: 5,
  },

  loadingTitle: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "900",
  },

  loadingIndicator: {
    marginTop: 22,
  },

  safeArea: {
    flex: 1,
    backgroundColor: "#050B18",
  },

  screen: {
    flex: 1,
    backgroundColor: "#050B18",
  },

  container: {
    padding: 20,
    paddingTop: 8,
    paddingBottom: 45,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },

  headerText: {
    flex: 1,
  },

  greeting: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.8,
    color: "#38BDF8",
    marginBottom: 6,
  },

  logoRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  logoDot: {
    width: 31,
    height: 31,
    borderRadius: 10,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 9,
  },

  logoDotText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },

  logo: {
    fontSize: 30,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: -0.8,
  },

  subtitle: {
    fontSize: 12,
    color: "#7C8BA5",
    marginTop: 6,
  },

  settingsButton: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: "#0D1930",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#1A3154",
    marginLeft: 15,
  },

  settingsIcon: {
    fontSize: 20,
  },

  proBanner: {
    backgroundColor: "#101D38",
    borderRadius: 20,
    padding: 13,
    marginBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#294A78",
  },

  proIcon: {
    width: 45,
    height: 45,
    borderRadius: 15,
    backgroundColor: "#1D3A68",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  proEmoji: {
    fontSize: 22,
  },

  proContent: {
    flex: 1,
  },

  proTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
    marginBottom: 3,
  },

  proText: {
    color: "#8194B2",
    fontSize: 11,
  },

  proArrowBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#18325A",
    alignItems: "center",
    justifyContent: "center",
  },

  proArrow: {
    color: "#60A5FA",
    fontSize: 19,
    fontWeight: "900",
  },

  aiCard: {
    backgroundColor: "#1455D9",
    borderRadius: 28,
    padding: 22,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#3182FF",
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 7,
  },

  aiTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  aiIconBox: {
    width: 54,
    height: 54,
    borderRadius: 17,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
  },

  aiEmoji: {
    fontSize: 30,
  },

  aiBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0B3D9C",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 20,
  },

  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#4ADE80",
    marginRight: 6,
  },

  aiBadgeText: {
    color: "#DBEAFE",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1,
  },

  aiTitle: {
    color: "#FFFFFF",
    fontSize: 27,
    fontWeight: "900",
    marginBottom: 8,
  },

  aiDescription: {
    color: "#DCE9FF",
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 20,
  },

  aiAction: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  aiActionText: {
    color: "#1455D9",
    fontWeight: "900",
    fontSize: 14,
  },

  aiArrow: {
    color: "#1455D9",
    fontSize: 21,
    fontWeight: "900",
  },

  sectionHeader: {
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 21,
    fontWeight: "900",
    color: "#FFFFFF",
  },

  sectionSubtitle: {
    fontSize: 12,
    color: "#6F809C",
    marginTop: 4,
  },

  sectionLine: {
    width: 42,
    height: 3,
    borderRadius: 3,
    backgroundColor: "#38BDF8",
    marginTop: 10,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  card: {
    width: "48%",
    backgroundColor: "#0B162B",
    borderRadius: 22,
    padding: 17,
    minHeight: 170,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#172B49",
  },

  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },

  notesIcon: {
    backgroundColor: "#102F5C",
  },

  quizIcon: {
    backgroundColor: "#2A2054",
  },

  flashcardIcon: {
    backgroundColor: "#49321B",
  },

  scanIcon: {
    backgroundColor: "#123D31",
  },

  calculatorIcon: {
    backgroundColor: "#1C4428",
  },

  progressIcon: {
    backgroundColor: "#103D55",
  },

  emoji: {
    fontSize: 25,
  },

  cardTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
    marginBottom: 6,
  },

  cardDescription: {
    color: "#71819A",
    fontSize: 11,
    lineHeight: 17,
    paddingRight: 8,
  },

  cardArrow: {
    position: "absolute",
    right: 15,
    bottom: 13,
    color: "#38BDF8",
    fontSize: 17,
    fontWeight: "900",
  },

  progressBanner: {
    backgroundColor: "#0B162B",
    borderRadius: 22,
    padding: 16,
    marginTop: 6,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#173455",
  },

  progressGlow: {
    width: 51,
    height: 51,
    borderRadius: 17,
    backgroundColor: "#102D50",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  progressEmoji: {
    fontSize: 25,
  },

  progressContent: {
    flex: 1,
  },

  progressBannerTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
    marginBottom: 4,
  },

  progressBannerText: {
    color: "#71819A",
    fontSize: 11,
    lineHeight: 16,
  },

  bannerArrowBox: {
    width: 37,
    height: 37,
    borderRadius: 13,
    backgroundColor: "#102A48",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },

  bannerArrow: {
    color: "#38BDF8",
    fontSize: 20,
    fontWeight: "900",
  },

  footerContainer: {
    alignItems: "center",
    marginTop: 28,
  },

  footerLine: {
    width: 45,
    height: 2,
    borderRadius: 2,
    backgroundColor: "#1A3154",
    marginBottom: 12,
  },

  footer: {
    textAlign: "center",
    color: "#50617A",
    fontSize: 10,
    fontWeight: "600",
  },
});