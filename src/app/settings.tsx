import { router } from "expo-router";
import { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type ModalType = "about" | "help" | "founder" | null;

export default function SettingsScreen() {
  const [modalType, setModalType] = useState<ModalType>(null);

  function closeModal() {
    setModalType(null);
  }

  function openAbout() {
    setModalType("about");
  }

  function openHelp() {
    setModalType("help");
  }

  function openFounder() {
    setModalType("founder");
  }

  function goTo(path: string) {
    router.push(path as any);
  }

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.emoji}>⚙️</Text>

        <Text style={styles.title}>Settings</Text>

        <Text style={styles.subtitle}>
          Your StudyAI control center
        </Text>

        {/* STUDYAI SECTION */}
        <Text style={styles.sectionTitle}>StudyAI</Text>

        <TouchableOpacity
          style={styles.card}
          onPress={openAbout}
          activeOpacity={0.7}
        >
          <View style={styles.iconBox}>
            <Text style={styles.icon}>📚</Text>
          </View>

          <View style={styles.textBox}>
            <Text style={styles.cardTitle}>
              About StudyAI
            </Text>

            <Text style={styles.cardDescription}>
              Learn more about StudyAI
            </Text>
          </View>

          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={openHelp}
          activeOpacity={0.7}
        >
          <View style={styles.iconBox}>
            <Text style={styles.icon}>❓</Text>
          </View>

          <View style={styles.textBox}>
            <Text style={styles.cardTitle}>
              Help & Tips
            </Text>

            <Text style={styles.cardDescription}>
              Learn how to use StudyAI
            </Text>
          </View>

          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={openFounder}
          activeOpacity={0.7}
        >
          <View style={styles.iconBox}>
            <Text style={styles.icon}>👨‍💻</Text>
          </View>

          <View style={styles.textBox}>
            <Text style={styles.cardTitle}>
              Founder Information
            </Text>

            <Text style={styles.cardDescription}>
              Learn about the creator of StudyAI
            </Text>
          </View>

          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        {/* STUDY TOOLS */}
        <Text style={styles.sectionTitle}>
          Study Tools
        </Text>

        <TouchableOpacity
          style={styles.card}
          onPress={() => goTo("/ai")}
          activeOpacity={0.7}
        >
          <View style={styles.iconBox}>
            <Text style={styles.icon}>🤖</Text>
          </View>

          <View style={styles.textBox}>
            <Text style={styles.cardTitle}>
              Ask AI
            </Text>

            <Text style={styles.cardDescription}>
              Ask questions and get explanations
            </Text>
          </View>

          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => goTo("/notes")}
          activeOpacity={0.7}
        >
          <View style={styles.iconBox}>
            <Text style={styles.icon}>📝</Text>
          </View>

          <View style={styles.textBox}>
            <Text style={styles.cardTitle}>
              Study Notes
            </Text>

            <Text style={styles.cardDescription}>
              Create and organize your notes
            </Text>
          </View>

          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => goTo("/quiz")}
          activeOpacity={0.7}
        >
          <View style={styles.iconBox}>
            <Text style={styles.icon}>🧠</Text>
          </View>

          <View style={styles.textBox}>
            <Text style={styles.cardTitle}>
              Quiz Me
            </Text>

            <Text style={styles.cardDescription}>
              Test your knowledge with AI quizzes
            </Text>
          </View>

          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => goTo("/flashcards")}
          activeOpacity={0.7}
        >
          <View style={styles.iconBox}>
            <Text style={styles.icon}>🃏</Text>
          </View>

          <View style={styles.textBox}>
            <Text style={styles.cardTitle}>
              Flashcards
            </Text>

            <Text style={styles.cardDescription}>
              Create AI flashcards for revision
            </Text>
          </View>

          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => goTo("/calculator")}
          activeOpacity={0.7}
        >
          <View style={styles.iconBox}>
            <Text style={styles.icon}>🧮</Text>
          </View>

          <View style={styles.textBox}>
            <Text style={styles.cardTitle}>
              Calculator
            </Text>

            <Text style={styles.cardDescription}>
              Perform quick calculations
            </Text>
          </View>

          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => goTo("/scan")}
          activeOpacity={0.7}
        >
          <View style={styles.iconBox}>
            <Text style={styles.icon}>📷</Text>
          </View>

          <View style={styles.textBox}>
            <Text style={styles.cardTitle}>
              Homework
            </Text>

            <Text style={styles.cardDescription}>
              Get help with homework
            </Text>
          </View>

          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => goTo("/progress")}
          activeOpacity={0.7}
        >
          <View style={styles.iconBox}>
            <Text style={styles.icon}>📊</Text>
          </View>

          <View style={styles.textBox}>
            <Text style={styles.cardTitle}>
              My Progress
            </Text>

            <Text style={styles.cardDescription}>
              Track your study activities
            </Text>
          </View>

          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        {/* INFO */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>
            📚 StudyAI
          </Text>

          <Text style={styles.infoText}>
            AI-powered tools designed to help students
            understand, practice, and organize their studies.
          </Text>

          <Text style={styles.version}>
            Version 1.0.0
          </Text>
        </View>

        <Text style={styles.footer}>
          Study smarter • Learn faster • Grow 🚀
        </Text>
      </ScrollView>

      {/* ABOUT MODAL */}
      <Modal
        visible={modalType === "about"}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalEmoji}>📚</Text>

            <Text style={styles.modalTitle}>
              About StudyAI
            </Text>

            <Text style={styles.modalText}>
              StudyAI is your personal AI study assistant.
            </Text>

            <Text style={styles.modalText}>
              Study smarter, learn faster, and grow with
              tools for AI learning, notes, quizzes,
              flashcards, homework, calculators, and more.
            </Text>

            <Text style={styles.modalVersion}>
              Version 1.0.0
            </Text>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeModal}
              activeOpacity={0.8}
            >
              <Text style={styles.closeButtonText}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* HELP MODAL */}
      <Modal
        visible={modalType === "help"}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalEmoji}>❓</Text>

            <Text style={styles.modalTitle}>
              Help & Tips
            </Text>

            <ScrollView
              style={styles.helpScroll}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.helpText}>
                🤖 Ask AI{"\n"}
                Ask StudyAI questions about your school
                subjects and get explanations.
                {"\n\n"}
                📝 Study Notes{"\n"}
                Create, edit, and save your study notes.
                {"\n\n"}
                🧠 Quiz Me{"\n"}
                Enter a topic and StudyAI creates a
                10-question quiz.
                {"\n\n"}
                🃏 Flashcards{"\n"}
                Generate 10 flashcards to help you revise.
                {"\n\n"}
                🧮 Calculator{"\n"}
                Use the calculator for quick calculations.
                {"\n\n"}
                📊 Progress{"\n"}
                See how many study activities you have
                completed.
                {"\n\n"}
                💡 Study Tip{"\n"}
                Use several StudyAI tools together for
                better revision.
              </Text>
            </ScrollView>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeModal}
              activeOpacity={0.8}
            >
              <Text style={styles.closeButtonText}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* FOUNDER MODAL */}
      <Modal
        visible={modalType === "founder"}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalEmoji}>👨‍💻</Text>

            <Text style={styles.modalTitle}>
              Founder
            </Text>

            <Text style={styles.founderName}>
              Muhammad Ibraheem
            </Text>

            <Text style={styles.modalText}>
              Founder & Creator of StudyAI
            </Text>

            <Text style={styles.modalText}>
              StudyAI was created to help students learn,
              practice, and organize their studies with
              useful AI-powered tools.
            </Text>

            <Text style={styles.contactTitle}>
              Contact
            </Text>

            <Text style={styles.email}>
              muhammadibraheemola@gmail.com
            </Text>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeModal}
              activeOpacity={0.8}
            >
              <Text style={styles.closeButtonText}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
  },

  content: {
    padding: 20,
    paddingBottom: 50,
  },

  emoji: {
    fontSize: 55,
    textAlign: "center",
    marginTop: 15,
  },

  title: {
    color: "#38BDF8",
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 5,
  },

  subtitle: {
    color: "#94A3B8",
    fontSize: 16,
    textAlign: "center",
    marginTop: 7,
    marginBottom: 25,
  },

  sectionTitle: {
    color: "#38BDF8",
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 12,
    marginTop: 8,
  },

  card: {
    backgroundColor: "#1E293B",
    borderRadius: 18,
    padding: 15,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#334155",
  },

  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: "#172554",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  icon: {
    fontSize: 25,
  },

  textBox: {
    flex: 1,
  },

  cardTitle: {
    color: "white",
    fontSize: 17,
    fontWeight: "bold",
  },

  cardDescription: {
    color: "#94A3B8",
    fontSize: 13,
    marginTop: 4,
  },

  arrow: {
    color: "#64748B",
    fontSize: 30,
    marginLeft: 8,
  },

  infoCard: {
    backgroundColor: "#172554",
    borderRadius: 18,
    padding: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#2563EB",
  },

  infoTitle: {
    color: "#38BDF8",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },

  infoText: {
    color: "#CBD5E1",
    fontSize: 15,
    lineHeight: 23,
  },

  version: {
    color: "#64748B",
    fontSize: 13,
    marginTop: 15,
  },

  footer: {
    color: "#64748B",
    textAlign: "center",
    fontSize: 13,
    marginTop: 25,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  modalCard: {
    width: "100%",
    maxWidth: 500,
    maxHeight: "85%",
    backgroundColor: "#1E293B",
    borderRadius: 24,
    padding: 25,
    borderWidth: 1,
    borderColor: "#334155",
  },

  modalEmoji: {
    fontSize: 50,
    textAlign: "center",
    marginBottom: 8,
  },

  modalTitle: {
    color: "#38BDF8",
    fontSize: 27,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },

  modalText: {
    color: "#CBD5E1",
    fontSize: 16,
    lineHeight: 25,
    textAlign: "center",
    marginBottom: 15,
  },

  modalVersion: {
    color: "#64748B",
    fontSize: 14,
    textAlign: "center",
    marginTop: 5,
  },

  founderName: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },

  contactTitle: {
    color: "#38BDF8",
    fontSize: 17,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 7,
  },

  email: {
    color: "#E2E8F0",
    fontSize: 15,
    textAlign: "center",
    marginBottom: 10,
  },

  helpScroll: {
    maxHeight: 430,
    marginBottom: 10,
  },

  helpText: {
    color: "#CBD5E1",
    fontSize: 16,
    lineHeight: 25,
  },

  closeButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 15,
  },

  closeButtonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "bold",
  },
});