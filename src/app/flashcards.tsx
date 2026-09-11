import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { askGroq } from "../services/groq";
import { addProgress } from "../services/progress";

type Flashcard = {
  question: string;
  answer: string;
};

export default function FlashcardsScreen() {
  const [topic, setTopic] = useState("");
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [current, setCurrent] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(false);

  async function generateCards() {
    if (!topic.trim()) {
      Alert.alert("Enter a topic", "Please enter a topic first.");
      return;
    }

    setLoading(true);
    setCards([]);
    setCurrent(0);
    setShowAnswer(false);

    const prompt = `
Create exactly 10 educational flashcards about "${topic.trim()}".

Return ONLY valid JSON.

Format:

[
  {
    "question": "Question here",
    "answer": "Answer here"
  }
]

Rules:
- Exactly 10 flashcards.
- Every card must have a question and answer.
- Keep answers clear and educational.
- Make them appropriate for students.
- Do not use markdown.
- Do not include anything before or after the JSON.
`;

    try {
      const response = await askGroq(prompt);

      const cleaned = response
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      const parsed = JSON.parse(cleaned);

      if (!Array.isArray(parsed)) {
        throw new Error("Invalid flashcard data.");
      }

      const validCards: Flashcard[] = parsed
        .filter(
          (card: any) =>
            card &&
            typeof card.question === "string" &&
            typeof card.answer === "string"
        )
        .slice(0, 10);

      if (validCards.length !== 10) {
        throw new Error("StudyAI did not generate 10 valid cards.");
      }

      setCards(validCards);

      // Save this activity to the logged-in/guest user's Progress.
      // A database error should not make successful flashcard generation fail.
      try {
        await addProgress("flashcard");
      } catch (error) {
        console.log(
          "Could not save flashcard progress:",
          error
        );
      }
    } catch (error) {
      console.log("Flashcard error:", error);

      Alert.alert(
        "Flashcards Error",
        "StudyAI could not generate the flashcards. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function nextCard() {
    if (current < cards.length - 1) {
      setCurrent((previous) => previous + 1);
      setShowAnswer(false);
    }
  }

  function previousCard() {
    if (current > 0) {
      setCurrent((previous) => previous - 1);
      setShowAnswer(false);
    }
  }

  function restart() {
    setCards([]);
    setCurrent(0);
    setShowAnswer(false);
    setTopic("");
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingEmoji}>🃏</Text>

        <ActivityIndicator size="large" color="#38BDF8" />

        <Text style={styles.loading}>
          Creating your flashcards...
        </Text>

        <Text style={styles.loadingSubtext}>
          StudyAI is preparing your study cards.
        </Text>
      </View>
    );
  }

  if (cards.length > 0) {
    const card = cards[current];

    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>🃏 AI Flashcards</Text>

        <Text style={styles.progress}>
          Card {current + 1} of {cards.length}
        </Text>

        <Text style={styles.topicText}>
          Topic: {topic}
        </Text>

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setShowAnswer(!showAnswer)}
          style={[
            styles.card,
            showAnswer
              ? styles.answerCard
              : styles.questionCard,
          ]}
        >
          <Text style={styles.cardLabel}>
            {showAnswer ? "💡 ANSWER" : "❓ QUESTION"}
          </Text>

          <Text style={styles.cardText}>
            {showAnswer ? card.answer : card.question}
          </Text>

          <Text style={styles.tapText}>
            Tap the card to{" "}
            {showAnswer
              ? "see the question"
              : "reveal the answer"}
          </Text>
        </TouchableOpacity>

        <View style={styles.navigation}>
          <TouchableOpacity
            style={[
              styles.navButton,
              current === 0 && styles.disabledButton,
            ]}
            disabled={current === 0}
            onPress={previousCard}
          >
            <Text style={styles.navText}>⬅ Previous</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.navButton,
              current === cards.length - 1 &&
                styles.disabledButton,
            ]}
            disabled={current === cards.length - 1}
            onPress={nextCard}
          >
            <Text style={styles.navText}>Next ➜</Text>
          </TouchableOpacity>
        </View>

        {current === cards.length - 1 && (
          <TouchableOpacity
            style={styles.finishButton}
            onPress={restart}
          >
            <Text style={styles.finishText}>
              🎉 Finish & Create Another
            </Text>
          </TouchableOpacity>
        )}

        <Text style={styles.tip}>
          💡 Try answering the question yourself before
          revealing the answer.
        </Text>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.generateContent}
    >
      <Text style={styles.bigEmoji}>🃏</Text>

      <Text style={styles.title}>AI Flashcards</Text>

      <Text style={styles.subtitle}>
        Turn any topic into smart study cards.
      </Text>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>
          📚 How it works
        </Text>

        <Text style={styles.infoText}>
          1. Enter a school topic{"\n\n"}
          2. StudyAI creates 10 flashcards{"\n\n"}
          3. Tap each card to reveal the answer
        </Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Enter a topic..."
        placeholderTextColor="#94A3B8"
        value={topic}
        onChangeText={setTopic}
        autoCapitalize="sentences"
      />

      <TouchableOpacity
        style={styles.generateButton}
        onPress={generateCards}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          ✨ Generate Flashcards
        </Text>
      </TouchableOpacity>

      <Text style={styles.example}>
        Example: Photosynthesis, Algebra, Biology,
        Chemistry, Physics
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
  },

  content: {
    padding: 20,
    paddingTop: 30,
    alignItems: "center",
    paddingBottom: 50,
  },

  generateContent: {
    padding: 20,
    paddingTop: 40,
    justifyContent: "center",
    flexGrow: 1,
  },

  center: {
    flex: 1,
    backgroundColor: "#0F172A",
    justifyContent: "center",
    alignItems: "center",
    padding: 25,
  },

  bigEmoji: {
    fontSize: 70,
    textAlign: "center",
    marginBottom: 10,
  },

  loadingEmoji: {
    fontSize: 60,
    marginBottom: 20,
  },

  title: {
    color: "#38BDF8",
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },

  subtitle: {
    color: "#CBD5E1",
    fontSize: 17,
    textAlign: "center",
    lineHeight: 25,
    marginBottom: 25,
  },

  loading: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
  },

  loadingSubtext: {
    color: "#94A3B8",
    fontSize: 15,
    marginTop: 8,
    textAlign: "center",
  },

  progress: {
    color: "#38BDF8",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },

  topicText: {
    color: "#94A3B8",
    fontSize: 14,
    marginTop: 6,
    marginBottom: 15,
  },

  infoCard: {
    backgroundColor: "#1E293B",
    borderRadius: 18,
    padding: 20,
    marginBottom: 25,
  },

  infoTitle: {
    color: "#38BDF8",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },

  infoText: {
    color: "#E2E8F0",
    fontSize: 16,
    lineHeight: 24,
  },

  input: {
    backgroundColor: "#1E293B",
    color: "white",
    borderRadius: 14,
    padding: 16,
    fontSize: 17,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#334155",
  },

  generateButton: {
    backgroundColor: "#2563EB",
    padding: 17,
    borderRadius: 14,
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 17,
  },

  example: {
    color: "#64748B",
    fontSize: 14,
    textAlign: "center",
    marginTop: 20,
    lineHeight: 21,
  },

  card: {
    width: "100%",
    minHeight: 360,
    borderRadius: 24,
    padding: 30,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
    borderWidth: 2,
  },

  questionCard: {
    backgroundColor: "#1E293B",
    borderColor: "#38BDF8",
  },

  answerCard: {
    backgroundColor: "#172554",
    borderColor: "#2563EB",
  },

  cardLabel: {
    color: "#38BDF8",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 25,
  },

  cardText: {
    color: "white",
    fontSize: 23,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 34,
  },

  tapText: {
    color: "#94A3B8",
    fontSize: 14,
    textAlign: "center",
    marginTop: 30,
  },

  navigation: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  navButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    width: "47%",
    alignItems: "center",
  },

  navText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  disabledButton: {
    opacity: 0.4,
  },

  finishButton: {
    width: "100%",
    backgroundColor: "#16A34A",
    padding: 17,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 18,
  },

  finishText: {
    color: "white",
    fontSize: 17,
    fontWeight: "bold",
  },

  tip: {
    color: "#64748B",
    textAlign: "center",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 25,
  },
});