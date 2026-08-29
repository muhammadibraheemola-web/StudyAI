import AsyncStorage from "@react-native-async-storage/async-storage";
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

type Question = {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
};

const QUIZ_COUNT_KEY = "studyai_quiz_count";
const OLD_QUIZ_COUNT_KEY = "quiz_count";
const ACTIVITY_COUNT_KEY = "studyai_activity_count";

export default function QuizScreen() {
  const [topic, setTopic] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(false);

  async function generateQuiz() {
    if (!topic.trim()) {
      Alert.alert(
        "Enter a topic",
        "Please enter a topic first."
      );
      return;
    }

    setLoading(true);
    setFinished(false);
    setQuestions([]);
    setCurrent(0);
    setSelected(null);
    setSubmitted(false);
    setScore(0);

    const prompt = `
Create exactly 10 educational multiple-choice questions about "${topic.trim()}".

Return ONLY valid JSON.

The format MUST be:

[
  {
    "question": "Question text",
    "options": [
      "Option A",
      "Option B",
      "Option C",
      "Option D"
    ],
    "answer": 0,
    "explanation": "Short explanation of why this answer is correct."
  }
]

Rules:
- Exactly 10 questions.
- Every question must have exactly 4 options.
- "answer" must be a number from 0 to 3.
- The answer number represents the correct option's position.
- Every question must have one correct answer.
- Make the questions educational and appropriate for students.
- Keep explanations clear and reasonably short.
- Do not use markdown.
- Do not include any text before or after the JSON.
`;

    try {
      const response = await askGroq(prompt);

      const cleaned = response
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      const parsed = JSON.parse(cleaned);

      if (!Array.isArray(parsed)) {
        throw new Error("Invalid quiz format.");
      }

      const validQuestions: Question[] = parsed
        .filter((item: any) => {
          return (
            item &&
            typeof item.question === "string" &&
            Array.isArray(item.options) &&
            item.options.length === 4 &&
            item.options.every(
              (option: any) =>
                typeof option === "string"
            ) &&
            typeof item.answer === "number" &&
            item.answer >= 0 &&
            item.answer <= 3 &&
            Number.isInteger(item.answer) &&
            typeof item.explanation === "string"
          );
        })
        .slice(0, 10);

      if (validQuestions.length !== 10) {
        throw new Error(
          "StudyAI did not generate 10 valid questions."
        );
      }

      setQuestions(validQuestions);
    } catch (error) {
      console.log(
        "Quiz generation error:",
        error
      );

      Alert.alert(
        "Quiz Error",
        "StudyAI could not generate the quiz. Please try another topic."
      );
    } finally {
      setLoading(false);
    }
  }

  function chooseAnswer(index: number) {
    if (submitted) return;

    setSelected(index);
  }

  function submitAnswer() {
    if (selected === null) return;

    setSubmitted(true);

    if (selected === questions[current].answer) {
      setScore((previous) => previous + 1);
    }
  }

  async function saveQuizProgress() {
    try {
      // New StudyAI quiz count
      const savedQuizCount =
        await AsyncStorage.getItem(
          QUIZ_COUNT_KEY
        );

      const quizCount =
        Number(savedQuizCount || "0");

      await AsyncStorage.setItem(
        QUIZ_COUNT_KEY,
        String(quizCount + 1)
      );

      // Keep the older key working too
      const oldSavedQuizCount =
        await AsyncStorage.getItem(
          OLD_QUIZ_COUNT_KEY
        );

      const oldQuizCount =
        Number(oldSavedQuizCount || "0");

      await AsyncStorage.setItem(
        OLD_QUIZ_COUNT_KEY,
        String(oldQuizCount + 1)
      );

      // Increase total study activities
      const savedActivityCount =
        await AsyncStorage.getItem(
          ACTIVITY_COUNT_KEY
        );

      const activityCount =
        Number(savedActivityCount || "0");

      await AsyncStorage.setItem(
        ACTIVITY_COUNT_KEY,
        String(activityCount + 1)
      );

      console.log(
        "Quiz progress saved:",
        quizCount + 1
      );
    } catch (error) {
      console.log(
        "Could not save quiz progress:",
        error
      );
    }
  }

  async function nextQuestion() {
    if (current + 1 >= questions.length) {
      await saveQuizProgress();

      setFinished(true);
      return;
    }

    setCurrent(
      (previous) => previous + 1
    );

    setSelected(null);
    setSubmitted(false);
  }

  function resetQuiz() {
    setTopic("");
    setQuestions([]);
    setCurrent(0);
    setSelected(null);
    setSubmitted(false);
    setScore(0);
    setFinished(false);
  }

  // -------------------------
  // LOADING
  // -------------------------

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingEmoji}>
          🧠
        </Text>

        <ActivityIndicator
          size="large"
          color="#38BDF8"
        />

        <Text style={styles.loading}>
          Creating your AI quiz...
        </Text>

        <Text style={styles.loadingSubtext}>
          StudyAI is preparing your questions.
        </Text>
      </View>
    );
  }

  // -------------------------
  // FINISHED
  // -------------------------

  if (finished) {
    return (
      <View style={styles.center}>
        <Text style={styles.finishedEmoji}>
          🏆
        </Text>

        <Text style={styles.title}>
          Quiz Finished!
        </Text>

        <Text style={styles.scoreLabel}>
          Your Score
        </Text>

        <Text style={styles.bigScore}>
          {score} / {questions.length}
        </Text>

        <Text style={styles.resultText}>
          {score === questions.length
            ? "Perfect score! 🎉"
            : score >= questions.length / 2
            ? "Great job! Keep studying! 🔥"
            : "Keep practicing — you can do it! 💪"}
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={resetQuiz}
        >
          <Text style={styles.buttonText}>
            Try Another Quiz
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // -------------------------
  // QUESTIONS
  // -------------------------

  if (questions.length > 0) {
    const question = questions[current];

    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.quizContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>
          🧠 AI Quiz
        </Text>

        <Text style={styles.progress}>
          Question {current + 1} of{" "}
          {questions.length}
        </Text>

        <View style={styles.questionCard}>
          <Text style={styles.question}>
            {question.question}
          </Text>
        </View>

        {question.options.map(
          (option, index) => {
            let backgroundColor =
              "#1E293B";

            if (submitted) {
              if (
                index === question.answer
              ) {
                backgroundColor =
                  "#16A34A";
              } else if (
                index === selected
              ) {
                backgroundColor =
                  "#DC2626";
              }
            } else if (
              index === selected
            ) {
              backgroundColor =
                "#2563EB";
            }

            return (
              <TouchableOpacity
                key={index}
                disabled={submitted}
                style={[
                  styles.option,
                  { backgroundColor },
                ]}
                onPress={() =>
                  chooseAnswer(index)
                }
              >
                <Text
                  style={
                    styles.optionLetter
                  }
                >
                  {String.fromCharCode(
                    65 + index
                  )}
                </Text>

                <Text
                  style={
                    styles.optionText
                  }
                >
                  {option}
                </Text>
              </TouchableOpacity>
            );
          }
        )}

        {!submitted ? (
          <TouchableOpacity
            style={[
              styles.button,
              selected === null &&
                styles.buttonDisabled,
            ]}
            disabled={selected === null}
            onPress={submitAnswer}
          >
            <Text
              style={styles.buttonText}
            >
              Submit Answer
            </Text>
          </TouchableOpacity>
        ) : (
          <View
            style={
              styles.explanationCard
            }
          >
            <Text
              style={
                styles.explanationTitle
              }
            >
              💡 Explanation
            </Text>

            <Text
              style={styles.explanation}
            >
              {question.explanation}
            </Text>

            <TouchableOpacity
              style={styles.button}
              onPress={nextQuestion}
            >
              <Text
                style={styles.buttonText}
              >
                {current + 1 ===
                questions.length
                  ? "Finish Quiz 🏆"
                  : "Next Question ➜"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    );
  }

  // -------------------------
  // START SCREEN
  // -------------------------

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.startContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.bigEmoji}>
        🧠
      </Text>

      <Text style={styles.title}>
        AI Quiz
      </Text>

      <Text style={styles.subtitle}>
        Test your knowledge with StudyAI
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter a topic..."
        placeholderTextColor="#94A3B8"
        value={topic}
        onChangeText={setTopic}
        autoCapitalize="sentences"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={generateQuiz}
      >
        <Text style={styles.buttonText}>
          🚀 Generate Quiz
        </Text>
      </TouchableOpacity>

      <View style={styles.tipCard}>
        <Text style={styles.tipTitle}>
          💡 Try topics like:
        </Text>

        <Text style={styles.tipText}>
          • Mathematics{"\n"}
          • Biology{"\n"}
          • History{"\n"}
          • Physics{"\n"}
          • Computer Science
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
  },

  quizContent: {
    padding: 20,
    paddingBottom: 50,
  },

  startContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
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

  finishedEmoji: {
    fontSize: 80,
    marginBottom: 15,
  },

  loadingEmoji: {
    fontSize: 60,
    marginBottom: 20,
  },

  title: {
    color: "#38BDF8",
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },

  subtitle: {
    color: "#94A3B8",
    fontSize: 17,
    textAlign: "center",
    marginBottom: 30,
  },

  input: {
    backgroundColor: "#1E293B",
    color: "white",
    padding: 17,
    borderRadius: 14,
    fontSize: 18,
    marginBottom: 15,
  },

  button: {
    backgroundColor: "#2563EB",
    padding: 17,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 18,
  },

  buttonDisabled: {
    opacity: 0.45,
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
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
    fontSize: 17,
    textAlign: "center",
    marginBottom: 20,
  },

  questionCard: {
    backgroundColor: "#1E293B",
    borderRadius: 18,
    padding: 20,
    marginBottom: 20,
  },

  question: {
    color: "white",
    fontSize: 23,
    fontWeight: "bold",
    lineHeight: 32,
  },

  option: {
    minHeight: 65,
    padding: 15,
    borderRadius: 14,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  optionLetter: {
    color: "#38BDF8",
    fontSize: 18,
    fontWeight: "bold",
    width: 35,
  },

  optionText: {
    color: "white",
    fontSize: 17,
    flex: 1,
  },

  explanationCard: {
    backgroundColor: "#172554",
    padding: 20,
    borderRadius: 18,
    marginTop: 10,
  },

  explanationTitle: {
    color: "#FACC15",
    fontSize: 21,
    fontWeight: "bold",
    marginBottom: 10,
  },

  explanation: {
    color: "#E2E8F0",
    fontSize: 17,
    lineHeight: 27,
  },

  scoreLabel: {
    color: "#CBD5E1",
    fontSize: 22,
    marginTop: 20,
  },

  bigScore: {
    color: "#38BDF8",
    fontSize: 64,
    fontWeight: "bold",
    marginVertical: 15,
  },

  resultText: {
    color: "#CBD5E1",
    fontSize: 18,
    textAlign: "center",
  },

  tipCard: {
    backgroundColor: "#1E293B",
    borderRadius: 16,
    padding: 20,
    marginTop: 25,
  },

  tipTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  tipText: {
    color: "#CBD5E1",
    fontSize: 16,
    lineHeight: 28,
  },
});