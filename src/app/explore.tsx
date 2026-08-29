import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Topic = {
  title: string;
  description: string;
  emoji: string;
  color: string;
};

const topics: Topic[] = [
  {
    title: "Mathematics",
    description: "Numbers, algebra, geometry and more",
    emoji: "➗",
    color: "#E8F1FF",
  },
  {
    title: "Science",
    description: "Explore physics, chemistry and biology",
    emoji: "🔬",
    color: "#E5F8EF",
  },
  {
    title: "English",
    description: "Improve grammar, writing and vocabulary",
    emoji: "📖",
    color: "#FFF0E2",
  },
  {
    title: "Computer Science",
    description: "Programming, computers and technology",
    emoji: "💻",
    color: "#F0E9FF",
  },
  {
    title: "Geography",
    description: "Discover countries, maps and our planet",
    emoji: "🌍",
    color: "#E5F5FF",
  },
  {
    title: "History",
    description: "Learn about people and events from the past",
    emoji: "🏛️",
    color: "#FFF4D9",
  },
];

const popularTopics = [
  "Algebra",
  "Photosynthesis",
  "World War II",
  "Grammar",
  "Programming",
  "Geometry",
];

export default function ExplorerScreen() {
  const [search, setSearch] = useState("");

  const filteredTopics = useMemo(() => {
    const text = search.trim().toLowerCase();

    if (!text) {
      return topics;
    }

    return topics.filter(
      (topic) =>
        topic.title.toLowerCase().includes(text) ||
        topic.description.toLowerCase().includes(text),
    );
  }, [search]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>

          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Explorer</Text>

            <Text style={styles.headerSubtitle}>
              Discover something new
            </Text>
          </View>
        </View>

        {/* INTRO */}
        <View style={styles.intro}>
          <Text style={styles.introEmoji}>🔎</Text>

          <View style={styles.introContent}>
            <Text style={styles.introTitle}>What do you want to learn?</Text>

            <Text style={styles.introText}>
              Explore subjects and find topics to help you study smarter.
            </Text>
          </View>
        </View>

        {/* SEARCH */}
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔎</Text>

          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search subjects or topics..."
            placeholderTextColor="#9AA5B5"
            style={styles.searchInput}
          />
        </View>

        {/* POPULAR */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular Topics</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.popularContainer}
        >
          {popularTopics.map((topic) => (
            <TouchableOpacity
              key={topic}
              style={styles.topicPill}
              onPress={() => setSearch(topic)}
            >
              <Text style={styles.topicPillText}>{topic}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* SUBJECTS */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Subjects</Text>

          <Text style={styles.sectionSubtitle}>
            Choose a subject to explore
          </Text>
        </View>

        <View style={styles.subjectList}>
          {filteredTopics.map((topic) => (
            <TouchableOpacity
              key={topic.title}
              style={styles.subjectCard}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.subjectIcon,
                  { backgroundColor: topic.color },
                ]}
              >
                <Text style={styles.subjectEmoji}>{topic.emoji}</Text>
              </View>

              <View style={styles.subjectContent}>
                <Text style={styles.subjectTitle}>{topic.title}</Text>

                <Text style={styles.subjectDescription}>
                  {topic.description}
                </Text>
              </View>

              <Text style={styles.subjectArrow}>→</Text>
            </TouchableOpacity>
          ))}
        </View>

        {filteredTopics.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🔎</Text>

            <Text style={styles.emptyTitle}>No subjects found</Text>

            <Text style={styles.emptyText}>
              Try searching for another subject.
            </Text>
          </View>
        )}

        {/* AI DISCOVERY */}
        <TouchableOpacity
          style={styles.aiCard}
          onPress={() => router.push("/ai")}
          activeOpacity={0.85}
        >
          <View style={styles.aiIcon}>
            <Text style={styles.aiEmoji}>🤖</Text>
          </View>

          <View style={styles.aiContent}>
            <Text style={styles.aiTitle}>Can't find what you need?</Text>

            <Text style={styles.aiText}>
              Ask StudyAI about any topic and get help instantly.
            </Text>
          </View>

          <Text style={styles.aiArrow}>→</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>
          Keep exploring • Keep learning 🚀
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F4F8FC",
  },

  screen: {
    flex: 1,
  },

  container: {
    padding: 20,
    paddingBottom: 40,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 25,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E1E8F0",
    marginRight: 13,
  },

  backText: {
    fontSize: 25,
    color: "#172B4D",
    marginTop: -2,
  },

  headerText: {
    flex: 1,
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#172B4D",
  },

  headerSubtitle: {
    fontSize: 12,
    color: "#7D899B",
    marginTop: 3,
  },

  intro: {
    backgroundColor: "#2474E8",
    borderRadius: 24,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  introEmoji: {
    fontSize: 38,
    marginRight: 15,
  },

  introContent: {
    flex: 1,
  },

  introTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 5,
  },

  introText: {
    color: "#E5F0FF",
    fontSize: 12,
    lineHeight: 18,
  },

  searchBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    height: 54,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E1E8F0",
    marginBottom: 25,
  },

  searchIcon: {
    fontSize: 18,
    marginRight: 10,
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#172B4D",
  },

  sectionHeader: {
    marginBottom: 13,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#172B4D",
  },

  sectionSubtitle: {
    fontSize: 12,
    color: "#8290A3",
    marginTop: 3,
  },

  popularContainer: {
    paddingBottom: 25,
  },

  topicPill: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E1E8F0",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 9,
  },

  topicPillText: {
    color: "#3A4B63",
    fontSize: 12,
    fontWeight: "700",
  },

  subjectList: {
    marginBottom: 10,
  },

  subjectCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 15,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E4EAF1",
  },

  subjectIcon: {
    width: 52,
    height: 52,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  subjectEmoji: {
    fontSize: 27,
  },

  subjectContent: {
    flex: 1,
  },

  subjectTitle: {
    color: "#1B2A41",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 5,
  },

  subjectDescription: {
    color: "#8793A5",
    fontSize: 11,
    lineHeight: 16,
  },

  subjectArrow: {
    color: "#2474E8",
    fontSize: 20,
    fontWeight: "800",
    marginLeft: 10,
  },

  emptyState: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    marginBottom: 20,
  },

  emptyEmoji: {
    fontSize: 34,
    marginBottom: 10,
  },

  emptyTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#172B4D",
    marginBottom: 5,
  },

  emptyText: {
    fontSize: 12,
    color: "#8793A5",
  },

  aiCard: {
    backgroundColor: "#EAF3FF",
    borderRadius: 21,
    padding: 17,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#D8E9FF",
  },

  aiIcon: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  aiEmoji: {
    fontSize: 25,
  },

  aiContent: {
    flex: 1,
  },

  aiTitle: {
    color: "#1B2A41",
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 4,
  },

  aiText: {
    color: "#718096",
    fontSize: 11,
    lineHeight: 16,
  },

  aiArrow: {
    color: "#2474E8",
    fontSize: 20,
    fontWeight: "800",
    marginLeft: 8,
  },

  footer: {
    textAlign: "center",
    color: "#9AA5B5",
    fontSize: 11,
    marginTop: 30,
  },
});