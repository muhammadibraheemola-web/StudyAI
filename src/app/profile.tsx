import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { supabase } from "../services/supabase";

export default function ProfileScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const savedName = await AsyncStorage.getItem("studyai_profile_name");
      const savedPicture = await AsyncStorage.getItem(
        "studyai_profile_picture"
      );

      const {
        data: { user },
      } = await supabase.auth.getUser();

      setName(savedName || "");
      setProfilePicture(savedPicture || null);
      setEmail(user?.email || "");
    } catch (error) {
      console.log("Could not load profile:", error);
    }
  }

  async function chooseProfilePicture() {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Permission needed",
          "Please allow StudyAI to access your photos."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;

        setProfilePicture(uri);
        await AsyncStorage.setItem(
          "studyai_profile_picture",
          uri
        );
      }
    } catch (error) {
      console.log("Could not choose profile picture:", error);
      Alert.alert("Error", "Could not select the picture.");
    }
  }

  async function saveProfile() {
    try {
      setSaving(true);

      await AsyncStorage.setItem(
        "studyai_profile_name",
        name.trim()
      );

      Alert.alert("Profile Updated", "Your profile has been saved.");
    } catch (error) {
      console.log("Could not save profile:", error);
      Alert.alert("Error", "Could not save your profile.");
    } finally {
      setSaving(false);
    }
  }

  async function logOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      Alert.alert("Error", error.message);
      return;
    }

    router.replace("/auth");
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.emoji}>👤</Text>

      <Text style={styles.title}>My Profile</Text>

      <Text style={styles.subtitle}>
        Manage your StudyAI account
      </Text>

      {/* PROFILE PICTURE */}
      <View style={styles.profileSection}>
        <TouchableOpacity
          style={styles.avatarContainer}
          onPress={chooseProfilePicture}
          activeOpacity={0.8}
        >
          {profilePicture ? (
            <Image
              source={{ uri: profilePicture }}
              style={styles.avatar}
            />
          ) : (
            <Text style={styles.avatarEmoji}>👤</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={chooseProfilePicture}
          activeOpacity={0.7}
        >
          <Text style={styles.changePicture}>
            📷 Change Profile Picture
          </Text>
        </TouchableOpacity>
      </View>

      {/* NAME */}
      <View style={styles.card}>
        <Text style={styles.label}>Display Name</Text>

        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
          placeholderTextColor="#64748B"
          style={styles.input}
        />
      </View>

      {/* EMAIL */}
      <View style={styles.card}>
        <Text style={styles.label}>Email</Text>

        <View style={styles.emailBox}>
          <Text style={styles.email}>{email || "No email found"}</Text>
        </View>
      </View>

      {/* SAVE */}
      <TouchableOpacity
        style={styles.saveButton}
        onPress={saveProfile}
        disabled={saving}
        activeOpacity={0.8}
      >
        <Text style={styles.saveText}>
          {saving ? "Saving..." : "Save Profile"}
        </Text>
      </TouchableOpacity>

      {/* PROGRESS */}
      <TouchableOpacity
        style={styles.option}
        onPress={() => router.push("/progress")}
        activeOpacity={0.8}
      >
        <Text style={styles.optionIcon}>📊</Text>

        <View style={styles.optionText}>
          <Text style={styles.optionTitle}>My Progress</Text>

          <Text style={styles.optionDescription}>
            View your study activities
          </Text>
        </View>

        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>

      {/* LOG OUT */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={logOut}
        activeOpacity={0.8}
      >
        <Text style={styles.logoutText}>🚪 Log Out</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>
        Study smarter • Learn faster • Grow 🚀
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

  backButton: {
    alignSelf: "flex-start",
    marginBottom: 10,
  },

  backText: {
    color: "#38BDF8",
    fontSize: 16,
    fontWeight: "600",
  },

  emoji: {
    fontSize: 50,
    textAlign: "center",
    marginTop: 5,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 5,
  },

  subtitle: {
    color: "#94A3B8",
    fontSize: 15,
    textAlign: "center",
    marginTop: 6,
    marginBottom: 25,
  },

  profileSection: {
    alignItems: "center",
    marginBottom: 25,
  },

  avatarContainer: {
    width: 125,
    height: 125,
    borderRadius: 63,
    backgroundColor: "#1E293B",
    borderWidth: 3,
    borderColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  avatar: {
    width: "100%",
    height: "100%",
  },

  avatarEmoji: {
    fontSize: 60,
  },

  changePicture: {
    color: "#38BDF8",
    fontSize: 15,
    fontWeight: "700",
    marginTop: 12,
  },

  card: {
    backgroundColor: "#1E293B",
    borderRadius: 18,
    padding: 17,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#334155",
  },

  label: {
    color: "#94A3B8",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 9,
  },

  input: {
    backgroundColor: "#0F172A",
    color: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#334155",
  },

  emailBox: {
    backgroundColor: "#0F172A",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#334155",
  },

  email: {
    color: "#CBD5E1",
    fontSize: 15,
  },

  saveButton: {
    backgroundColor: "#2563EB",
    borderRadius: 15,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 20,
  },

  saveText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
  },

  option: {
    backgroundColor: "#1E293B",
    borderRadius: 18,
    padding: 17,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#334155",
    marginBottom: 14,
  },

  optionIcon: {
    fontSize: 27,
    marginRight: 14,
  },

  optionText: {
    flex: 1,
  },

  optionTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },

  optionDescription: {
    color: "#94A3B8",
    fontSize: 12,
    marginTop: 4,
  },

  arrow: {
    color: "#64748B",
    fontSize: 30,
  },

  logoutButton: {
    backgroundColor: "#3F1D2B",
    borderRadius: 15,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 5,
  },

  logoutText: {
    color: "#FCA5A5",
    fontSize: 17,
    fontWeight: "800",
  },

  footer: {
    color: "#64748B",
    fontSize: 12,
    textAlign: "center",
    marginTop: 25,
  },
});