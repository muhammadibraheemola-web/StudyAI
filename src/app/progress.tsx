import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { getProgress } from "../services/progress";

export default function ProgressScreen() {
  const [quizCount, setQuizCount] = useState(0);
  const [notesCount, setNotesCount] = useState(0);
  const [flashcardCount, setFlashcardCount] = useState(0);
  const [homeworkCount, setHomeworkCount] = useState(0);
  const [activityCount, setActivityCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadProgress();
    }, [])
  );

  async function loadProgress() {
    try {
      const progress = await getProgress();

      setQuizCount(progress.quizCount);
      setNotesCount(progress.notesCount);
      setFlashcardCount(progress.flashcardCount);
      setHomeworkCount(progress.homeworkCount);
      setActivityCount(progress.activityCount);
    } catch (error) {
      console.log(
        "Could not load progress:",
        error
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  async function refreshProgress() {
    setRefreshing(true);
    await loadProgress();
  }

  const stats = [
    {
      emoji: "🧠",
      title: "Quizzes Completed",
      value: quizCount,
      description: "AI quizzes finished",
    },
    {
      emoji: "📝",
      title: "Notes Created",
      value: notesCount,
      description: "Study notes saved",
    },
    {
      emoji: "🃏",
      title: "Flashcard Sessions",
      value: flashcardCount,
      description: "Flashcard sets created",
    },
    {
      emoji: "📷",
      title: "Homework Solved",
      value: homeworkCount,
      description: "Homework questions analyzed",
    },
    {
      emoji: "⭐",
      title: "Study Activities",
      value: activityCount,
      description: "Total learning activities",
    },
  ];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingEmoji}>
          📊
        </Text>

        <ActivityIndicator
          size="large"
          color="#38BDF8"
        />

        <Text style={styles.loadingText}>
          Loading your progress...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={refreshProgress}
          tintColor="#38BDF8"
        />
      }
    >
      <Text style={styles.emoji}>📊</Text>

      <Text style={styles.title}>
        My Progress
      </Text>

      <Text style={styles.subtitle}>
        Keep learning and watch your progress grow.
      </Text>

      <View style={styles.totalCard}>
        <Text style={styles.totalEmoji}>
          🚀
        </Text>

        <Text style={styles.totalLabel}>
          Total Study Activities
        </Text>

        <Text style={styles.totalNumber}>
          {activityCount}
        </Text>

        <Text style={styles.totalText}>
          Every study session helps you improve.
        </Text>
      </View>

      <View style={styles.statsContainer}>
        {stats.map((stat) => (
          <View
            key={stat.title}
            style={styles.statCard}
          >
            <View style={styles.statIcon}>
              <Text style={styles.statEmoji}>
                {stat.emoji}
              </Text>
            </View>

            <View style={styles.statInfo}>
              <Text style={styles.statTitle}>
                {stat.title}
              </Text>

              <Text
                style={styles.statDescription}
              >
                {stat.description}
              </Text>
            </View>

            <Text style={styles.statValue}>
              {stat.value}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.motivationCard}>
        <Text style={styles.motivationEmoji}>
          💪
        </Text>

        <Text style={styles.motivationTitle}>
          Keep Going!
        </Text>

        <Text style={styles.motivationText}>
          Consistent studying is the key to
          understanding difficult topics and
          becoming a stronger learner.
        </Text>
      </View>

      <Text style={styles.refreshText}>
        Pull down to refresh your progress.
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
    paddingBottom: 50,
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: "#0F172A",
    justifyContent: "center",
    alignItems: "center",
    padding: 25,
  },

  loadingEmoji: {
    fontSize: 65,
    marginBottom: 20,
  },

  loadingText: {
    color: "#CBD5E1",
    fontSize: 17,
    marginTop: 15,
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
    lineHeight: 23,
    marginTop: 8,
    marginBottom: 25,
  },

  totalCard: {
    backgroundColor: "#172554",
    borderRadius: 22,
    padding: 25,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2563EB",
    marginBottom: 20,
  },

  totalEmoji: {
    fontSize: 45,
    marginBottom: 8,
  },

  totalLabel: {
    color: "#CBD5E1",
    fontSize: 17,
    fontWeight: "600",
  },

  totalNumber: {
    color: "#38BDF8",
    fontSize: 60,
    fontWeight: "bold",
    marginVertical: 5,
  },

  totalText: {
    color: "#94A3B8",
    fontSize: 14,
    textAlign: "center",
  },

  statsContainer: {
    gap: 12,
  },

  statCard: {
    backgroundColor: "#1E293B",
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#334155",
  },

  statIcon: {
    width: 52,
    height: 52,
    borderRadius: 15,
    backgroundColor: "#172554",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  statEmoji: {
    fontSize: 26,
  },

  statInfo: {
    flex: 1,
  },

  statTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  statDescription: {
    color: "#64748B",
    fontSize: 13,
    marginTop: 4,
  },

  statValue: {
    color: "#38BDF8",
    fontSize: 28,
    fontWeight: "bold",
    marginLeft: 10,
  },

  motivationCard: {
    backgroundColor: "#111F32",
    borderRadius: 20,
    padding: 22,
    marginTop: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1D334C",
  },

  motivationEmoji: {
    fontSize: 42,
    marginBottom: 8,
  },

  motivationTitle: {
    color: "#38BDF8",
    fontSize: 21,
    fontWeight: "bold",
    marginBottom: 8,
  },

  motivationText: {
    color: "#CBD5E1",
    fontSize: 15,
    lineHeight: 23,
    textAlign: "center",
  },

  refreshText: {
    color: "#475569",
    fontSize: 12,
    textAlign: "center",
    marginTop: 20,
  },
});