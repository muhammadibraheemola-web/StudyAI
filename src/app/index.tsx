import { router } from "expo-router";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>WELCOME BACK 👋</Text>

            <Text style={styles.logo}>StudyAI</Text>

            <Text style={styles.subtitle}>
              Your personal AI study assistant
            </Text>
          </View>

          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => router.push("/settings")}
            activeOpacity={0.8}
          >
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* ASK STUDYAI */}
        <TouchableOpacity
          style={styles.aiCard}
          onPress={() => router.push("/ai")}
          activeOpacity={0.85}
        >
          <Text style={styles.aiEmoji}>🤖</Text>

          <Text style={styles.aiTitle}>Ask StudyAI</Text>

          <Text style={styles.aiDescription}>
            Ask questions, understand difficult topics, and get help with
            your studies.
          </Text>

          <View style={styles.aiAction}>
            <Text style={styles.aiActionText}>Start learning</Text>

            <Text style={styles.aiArrow}>→</Text>
          </View>
        </TouchableOpacity>

        {/* STUDY TOOLS */}
        <Text style={styles.sectionTitle}>Study Tools</Text>

        <Text style={styles.sectionSubtitle}>
          Everything you need to learn
        </Text>

        <View style={styles.grid}>
          {/* NOTES */}
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push("/notes")}
            activeOpacity={0.8}
          >
            <View style={[styles.iconBox, styles.notesIcon]}>
              <Text style={styles.emoji}>📝</Text>
            </View>

            <Text style={styles.cardTitle}>Study Notes</Text>

            <Text style={styles.cardDescription}>
              Create and organize your notes
            </Text>
          </TouchableOpacity>

          {/* QUIZ */}
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push("/quiz")}
            activeOpacity={0.8}
          >
            <View style={[styles.iconBox, styles.quizIcon]}>
              <Text style={styles.emoji}>🧠</Text>
            </View>

            <Text style={styles.cardTitle}>Quiz Me</Text>

            <Text style={styles.cardDescription}>
              Test your knowledge
            </Text>
          </TouchableOpacity>

          {/* FLASHCARDS */}
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push("/flashcards")}
            activeOpacity={0.8}
          >
            <View style={[styles.iconBox, styles.flashcardIcon]}>
              <Text style={styles.emoji}>🃏</Text>
            </View>

            <Text style={styles.cardTitle}>Flashcards</Text>

            <Text style={styles.cardDescription}>
              Remember things faster
            </Text>
          </TouchableOpacity>

          {/* HOMEWORK */}
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push("/scan")}
            activeOpacity={0.8}
          >
            <View style={[styles.iconBox, styles.scanIcon]}>
              <Text style={styles.emoji}>📷</Text>
            </View>

            <Text style={styles.cardTitle}>Homework</Text>

            <Text style={styles.cardDescription}>
              Get help with homework
            </Text>
          </TouchableOpacity>

          {/* CALCULATOR */}
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push("/calculator")}
            activeOpacity={0.8}
          >
            <View style={[styles.iconBox, styles.calculatorIcon]}>
              <Text style={styles.emoji}>🧮</Text>
            </View>

            <Text style={styles.cardTitle}>Calculator</Text>

            <Text style={styles.cardDescription}>
              Solve math problems quickly
            </Text>
          </TouchableOpacity>

          {/* PROGRESS */}
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push("/progress")}
            activeOpacity={0.8}
          >
            <View style={[styles.iconBox, styles.progressIcon]}>
              <Text style={styles.emoji}>📊</Text>
            </View>

            <Text style={styles.cardTitle}>Progress</Text>

            <Text style={styles.cardDescription}>
              Track your study activities
            </Text>
          </TouchableOpacity>
        </View>

        {/* PROGRESS BANNER */}
        <TouchableOpacity
          style={styles.progressBanner}
          onPress={() => router.push("/progress")}
          activeOpacity={0.8}
        >
          <View style={styles.progressContent}>
            <Text style={styles.progressBannerTitle}>
              Keep learning 🚀
            </Text>

            <Text style={styles.progressBannerText}>
              Check your study progress and see how you're improving.
            </Text>
          </View>

          <Text style={styles.bannerArrow}>→</Text>
        </TouchableOpacity>

        {/* FOOTER */}
        <Text style={styles.footer}>
          Study smarter • Learn faster • Grow 🚀
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#07152E",
  },

  screen: {
    flex: 1,
    backgroundColor: "#07152E",
  },

  container: {
    padding: 20,
    paddingBottom: 40,
  },

  /* HEADER */

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 28,
  },

  greeting: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
    color: "#7DD3FC",
  },

  logo: {
    fontSize: 32,
    fontWeight: "900",
    color: "#FFFFFF",
    marginTop: 4,
  },

  subtitle: {
    fontSize: 13,
    color: "#94A3B8",
    marginTop: 4,
  },

  settingsButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#10254A",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#1E3A66",
  },

  settingsIcon: {
    fontSize: 21,
  },

  /* ASK AI */

  aiCard: {
    backgroundColor: "#2563EB",
    borderRadius: 26,
    padding: 22,
    marginBottom: 28,
    shadowColor: "#2563EB",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 6,
  },

  aiEmoji: {
    fontSize: 34,
    marginBottom: 10,
  },

  aiTitle: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "900",
    marginBottom: 8,
  },

  aiDescription: {
    color: "#DBEAFE",
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 20,
  },

  aiAction: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  aiActionText: {
    color: "#2563EB",
    fontWeight: "800",
    fontSize: 15,
  },

  aiArrow: {
    color: "#2563EB",
    fontSize: 20,
    fontWeight: "800",
  },

  /* STUDY TOOLS */

  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  sectionSubtitle: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 3,
    marginBottom: 14,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  card: {
    width: "48%",
    backgroundColor: "#10254A",
    borderRadius: 21,
    padding: 17,
    minHeight: 160,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#1E3A66",
  },

  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  notesIcon: {
    backgroundColor: "#173B70",
  },

  quizIcon: {
    backgroundColor: "#30245C",
  },

  flashcardIcon: {
    backgroundColor: "#513C22",
  },

  scanIcon: {
    backgroundColor: "#174B3A",
  },

  calculatorIcon: {
    backgroundColor: "#24502F",
  },

  progressIcon: {
    backgroundColor: "#164A67",
  },

  emoji: {
    fontSize: 25,
  },

  cardTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 6,
  },

  cardDescription: {
    color: "#94A3B8",
    fontSize: 11,
    lineHeight: 17,
  },

  /* PROGRESS */

  progressBanner: {
    backgroundColor: "#10254A",
    borderRadius: 21,
    padding: 18,
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1E3A66",
  },

  progressContent: {
    flex: 1,
  },

  progressBannerTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 5,
  },

  progressBannerText: {
    color: "#94A3B8",
    fontSize: 11,
    lineHeight: 16,
  },

  bannerArrow: {
    color: "#38BDF8",
    fontSize: 24,
    fontWeight: "800",
    marginLeft: 12,
  },

  /* FOOTER */

  footer: {
    textAlign: "center",
    color: "#64748B",
    fontSize: 11,
    marginTop: 28,
  },
});