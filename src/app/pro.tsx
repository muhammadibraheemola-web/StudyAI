import { router } from "expo-router";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function ProScreen() {
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.hero}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>⭐ STUDYAI PRO</Text>
          </View>

          <Text style={styles.title}>Learn Without Limits</Text>

          <Text style={styles.subtitle}>
            Unlock more powerful study tools and get the most out of StudyAI.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Everything in Pro</Text>

          <Feature
            icon="🤖"
            title="More AI Help"
            text="Ask more questions and get help when you need it."
          />

          <Feature
            icon="📸"
            title="More Homework Scans"
            text="Get more help with your homework using the scanner."
          />

          <Feature
            icon="📝"
            title="More Quizzes"
            text="Generate more practice quizzes to test your knowledge."
          />

          <Feature
            icon="🧠"
            title="More Flashcards"
            text="Create more flashcard sets for smarter revision."
          />

          <Feature
            icon="📊"
            title="Advanced Progress"
            text="Keep track of your learning activity and progress."
          />
        </View>

        <View style={styles.priceCard}>
          <Text style={styles.priceTitle}>StudyAI Pro</Text>

          <View style={styles.priceRow}>
            <Text style={styles.price}>Coming Soon</Text>
          </View>

          <Text style={styles.priceText}>
            We're preparing StudyAI Pro for launch.
          </Text>

          <TouchableOpacity
            style={styles.upgradeButton}
            onPress={() => {}}
          >
            <Text style={styles.upgradeText}>⭐ Pro Coming Soon</Text>
          </TouchableOpacity>

          <Text style={styles.smallText}>
            Payments will be added after the Pro system is ready.
          </Text>
        </View>

        <Text style={styles.footer}>
          Study smarter. Learn faster. 🚀
        </Text>
      </ScrollView>
    </View>
  );
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <View style={styles.feature}>
      <View style={styles.iconBox}>
        <Text style={styles.icon}>{icon}</Text>
      </View>

      <View style={styles.featureText}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050B18",
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  backButton: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginBottom: 20,
  },

  backText: {
    color: "#94A3B8",
    fontSize: 16,
    fontWeight: "600",
  },

  hero: {
    alignItems: "center",
    marginBottom: 28,
  },

  badge: {
    backgroundColor: "#172554",
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginBottom: 16,
  },

  badgeText: {
    color: "#BFDBFE",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
  },

  title: {
    color: "#F8FAFC",
    fontSize: 34,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 10,
  },

  subtitle: {
    color: "#94A3B8",
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    maxWidth: 420,
  },

  card: {
    backgroundColor: "#0B1220",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#1E293B",
    padding: 20,
    marginBottom: 18,
  },

  cardTitle: {
    color: "#F8FAFC",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 18,
  },

  feature: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#111C31",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  icon: {
    fontSize: 21,
  },

  featureText: {
    flex: 1,
  },

  featureTitle: {
    color: "#F8FAFC",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 3,
  },

  featureDescription: {
    color: "#94A3B8",
    fontSize: 13,
    lineHeight: 19,
  },

  priceCard: {
    backgroundColor: "#0F172A",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#334155",
    padding: 24,
    alignItems: "center",
    marginBottom: 24,
  },

  priceTitle: {
    color: "#F8FAFC",
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 10,
  },

  priceRow: {
    marginBottom: 8,
  },

  price: {
    color: "#BFDBFE",
    fontSize: 25,
    fontWeight: "900",
  },

  priceText: {
    color: "#94A3B8",
    textAlign: "center",
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 20,
  },

  upgradeButton: {
    width: "100%",
    backgroundColor: "#2563EB",
    borderRadius: 15,
    paddingVertical: 15,
    alignItems: "center",
  },

  upgradeText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },

  smallText: {
    color: "#64748B",
    fontSize: 11,
    textAlign: "center",
    marginTop: 12,
  },

  footer: {
    color: "#64748B",
    textAlign: "center",
    fontSize: 13,
    fontWeight: "600",
  },
});