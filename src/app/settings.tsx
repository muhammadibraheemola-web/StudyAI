import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../services/supabase";

const FOUNDER_EMAIL = "muhammadibraheemola@gmail.com";

type ModalType = "about" | "help" | "founder" | null;

export default function SettingsScreen() {
  const [showLogout, setShowLogout] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [modalType, setModalType] = useState<ModalType>(null);

  const [fullName, setFullName] = useState("StudyAI Student");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const [notifications, setNotifications] = useState(true);
  const [studyReminders, setStudyReminders] = useState(true);

  useEffect(() => {
    loadAccount();
  }, []);

  async function loadAccount() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const metadata = user.user_metadata || {};

    setEmail(user.email || "");

    setFullName(
      metadata.full_name ||
        metadata.fullName ||
        metadata.name ||
        "StudyAI Student"
    );

    setUsername(metadata.username || "");
    setAvatarUrl(metadata.avatar_url || "");
  }

  async function chooseProfilePicture() {
    if (uploadingPhoto) return;

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        Alert.alert("Login required", "Please log in to add a profile picture.");
        return;
      }

      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Photo permission needed",
          "Please allow StudyAI to access your photos so you can choose a profile picture."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled || !result.assets[0]?.uri) {
        return;
      }

      setUploadingPhoto(true);

      const asset = result.assets[0];

      const response = await fetch(asset.uri);
      const arrayBuffer = await response.arrayBuffer();

      const extension =
        asset.mimeType?.split("/")[1]?.replace("jpeg", "jpg") || "jpg";

      const filePath = `${user.id}/${Date.now()}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, arrayBuffer, {
          contentType: asset.mimeType || "image/jpeg",
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: publicUrlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const newAvatarUrl = publicUrlData.publicUrl;

      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          avatar_url: newAvatarUrl,
        },
      });

      if (updateError) {
        throw updateError;
      }

      setAvatarUrl(`${newAvatarUrl}?t=${Date.now()}`);

      Alert.alert("Profile picture updated", "Your new photo is saved.");
    } catch (error) {
      console.log("Profile picture error:", error);

      Alert.alert(
        "Upload failed",
        error instanceof Error
          ? error.message
          : "Could not update your profile picture."
      );
    } finally {
      setUploadingPhoto(false);
    }
  }

  async function handleLogout() {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        Alert.alert("Logout failed", error.message);
        setLoggingOut(false);
        return;
      }

      setShowLogout(false);
      router.replace("/auth");
    } catch (error) {
      console.log("Logout error:", error);
      Alert.alert("Error", "Something went wrong while logging out.");
      setLoggingOut(false);
    }
  }

  async function openEmail() {
    try {
      await Linking.openURL(`mailto:${FOUNDER_EMAIL}`);
    } catch (error) {
      console.log("Email error:", error);
    }
  }

  function openModal(type: ModalType) {
    setModalType(type);
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.smallHeader}>STUDYAI</Text>
            <Text style={styles.header}>Settings</Text>
          </View>

          <View style={styles.headerIcon}>
            <Text style={styles.headerIconText}>⚙️</Text>
          </View>
        </View>

        {/* PROFILE */}
        <TouchableOpacity
          style={styles.profileCard}
          onPress={chooseProfilePicture}
          activeOpacity={0.85}
          disabled={uploadingPhoto}
        >
          <View style={styles.avatarWrapper}>
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {fullName.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}

            <View style={styles.cameraBadge}>
              {uploadingPhoto ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.cameraText}>📷</Text>
              )}
            </View>
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{fullName}</Text>

            {username ? (
              <Text style={styles.username}>@{username}</Text>
            ) : null}

            <Text style={styles.profileEmail}>
              {email || "StudyAI account"}
            </Text>

            <Text style={styles.changePhotoText}>
              {uploadingPhoto ? "Uploading photo..." : "Tap to change photo"}
            </Text>
          </View>

          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedText}>✓</Text>
          </View>
        </TouchableOpacity>

        {/* ACCOUNT */}
        <Text style={styles.sectionTitle}>Account</Text>

        <View style={styles.card}>
          <TouchableOpacity
            style={styles.option}
            activeOpacity={0.8}
            onPress={chooseProfilePicture}
          >
            <View style={styles.iconBox}>
              <Text style={styles.icon}>👤</Text>
            </View>

            <View style={styles.optionInfo}>
              <Text style={styles.optionTitle}>My Profile</Text>
              <Text style={styles.optionSubtitle}>
                Change your photo and view your account
              </Text>
            </View>

            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.option}
            activeOpacity={0.8}
            onPress={() =>
              Alert.alert(
                "Account & Security",
                `Account email: ${email || "Not available"}\n\nYour StudyAI account is securely managed by Supabase.`
              )
            }
          >
            <View style={styles.iconBox}>
              <Text style={styles.icon}>🔐</Text>
            </View>

            <View style={styles.optionInfo}>
              <Text style={styles.optionTitle}>Account & Security</Text>
              <Text style={styles.optionSubtitle}>
                Manage your login and account
              </Text>
            </View>

            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* PREFERENCES */}
        <Text style={styles.sectionTitle}>Preferences</Text>

        <View style={styles.card}>
          <View style={styles.option}>
            <View style={styles.iconBox}>
              <Text style={styles.icon}>🔔</Text>
            </View>

            <View style={styles.optionInfo}>
              <Text style={styles.optionTitle}>Notifications</Text>
              <Text style={styles.optionSubtitle}>
                StudyAI notifications
              </Text>
            </View>

            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{
                false: "#334155",
                true: "#2563EB",
              }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.option}>
            <View style={styles.iconBox}>
              <Text style={styles.icon}>📚</Text>
            </View>

            <View style={styles.optionInfo}>
              <Text style={styles.optionTitle}>Study Reminders</Text>
              <Text style={styles.optionSubtitle}>
                Stay consistent with your studies
              </Text>
            </View>

            <Switch
              value={studyReminders}
              onValueChange={setStudyReminders}
              trackColor={{
                false: "#334155",
                true: "#2563EB",
              }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.option}
            activeOpacity={0.8}
            onPress={() =>
              Alert.alert(
                "Appearance",
                "StudyAI currently uses Dark Mode for the best study experience."
              )
            }
          >
            <View style={styles.iconBox}>
              <Text style={styles.icon}>🌙</Text>
            </View>

            <View style={styles.optionInfo}>
              <Text style={styles.optionTitle}>Appearance</Text>
              <Text style={styles.optionSubtitle}>Dark Mode</Text>
            </View>

            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* STUDYAI */}
        <Text style={styles.sectionTitle}>StudyAI</Text>

        <View style={styles.card}>
          <TouchableOpacity
            style={styles.option}
            activeOpacity={0.8}
            onPress={() => openModal("about")}
          >
            <View style={styles.iconBox}>
              <Text style={styles.icon}>ℹ️</Text>
            </View>

            <View style={styles.optionInfo}>
              <Text style={styles.optionTitle}>About StudyAI</Text>
              <Text style={styles.optionSubtitle}>
                Learn more about the app
              </Text>
            </View>

            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.option}
            activeOpacity={0.8}
            onPress={() => openModal("help")}
          >
            <View style={styles.iconBox}>
              <Text style={styles.icon}>❓</Text>
            </View>

            <View style={styles.optionInfo}>
              <Text style={styles.optionTitle}>Help & Support</Text>
              <Text style={styles.optionSubtitle}>
                Get help using StudyAI
              </Text>
            </View>

            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.option}
            activeOpacity={0.8}
            onPress={() => openModal("founder")}
          >
            <View style={styles.iconBox}>
              <Text style={styles.icon}>👨‍💻</Text>
            </View>

            <View style={styles.optionInfo}>
              <Text style={styles.optionTitle}>Founder</Text>
              <Text style={styles.optionSubtitle}>
                Meet the creator of StudyAI
              </Text>
            </View>

            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.option}
            activeOpacity={0.8}
            onPress={() =>
              Alert.alert(
                "StudyAI",
                "You are using StudyAI version 1.0.0."
              )
            }
          >
            <View style={styles.iconBox}>
              <Text style={styles.icon}>📱</Text>
            </View>

            <View style={styles.optionInfo}>
              <Text style={styles.optionTitle}>App Version</Text>
              <Text style={styles.optionSubtitle}>Version 1.0.0</Text>
            </View>

            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* LOGOUT */}
        <Text style={styles.sectionTitle}>Account Actions</Text>

        <TouchableOpacity
          style={styles.logoutCard}
          onPress={() => setShowLogout(true)}
          activeOpacity={0.85}
          disabled={loggingOut}
        >
          <View style={styles.logoutIcon}>
            <Text style={styles.logoutEmoji}>🚪</Text>
          </View>

          <View style={styles.logoutInfo}>
            <Text style={styles.logoutTitle}>Log Out</Text>
            <Text style={styles.logoutSubtitle}>
              Sign out of your StudyAI account
            </Text>
          </View>

          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>
          StudyAI • Your Personal AI Study Assistant
        </Text>
      </ScrollView>

      {/* LOGOUT MODAL */}
      <Modal
        visible={showLogout}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLogout(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.confirmBox}>
            <View style={styles.confirmIconBox}>
              <Text style={styles.confirmIcon}>🚪</Text>
            </View>

            <Text style={styles.confirmTitle}>Log Out?</Text>

            <Text style={styles.confirmText}>
              Are you sure you want to log out of your StudyAI account?
            </Text>

            <TouchableOpacity
              style={styles.confirmLogout}
              onPress={handleLogout}
              disabled={loggingOut}
              activeOpacity={0.8}
            >
              {loggingOut ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.confirmLogoutText}>Log Out</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowLogout(false)}
              disabled={loggingOut}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* INFORMATION MODAL */}
      <Modal
        visible={modalType !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setModalType(null)}
      >
        <View style={styles.overlay}>
          <View style={styles.infoModal}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalType(null)}
            >
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>

            {modalType === "about" && (
              <>
                <Text style={styles.modalIcon}>📚</Text>
                <Text style={styles.modalTitle}>About StudyAI</Text>

                <Text style={styles.modalText}>
                  StudyAI is your personal AI study assistant, designed to
                  help students learn, practice, understand, and organize
                  their studies.
                </Text>

                <View style={styles.featureRow}>
                  <Text style={styles.featureIcon}>🤖</Text>
                  <Text style={styles.featureText}>
                    AI Study Assistant
                  </Text>
                </View>

                <View style={styles.featureRow}>
                  <Text style={styles.featureIcon}>📝</Text>
                  <Text style={styles.featureText}>
                    Notes & Quizzes
                  </Text>
                </View>

                <View style={styles.featureRow}>
                  <Text style={styles.featureIcon}>🧠</Text>
                  <Text style={styles.featureText}>
                    Flashcards & Practice
                  </Text>
                </View>

                <View style={styles.featureRow}>
                  <Text style={styles.featureIcon}>📊</Text>
                  <Text style={styles.featureText}>
                    Study Progress
                  </Text>
                </View>
              </>
            )}

            {modalType === "help" && (
              <>
                <Text style={styles.modalIcon}>❓</Text>
                <Text style={styles.modalTitle}>Help & Support</Text>

                <Text style={styles.modalText}>
                  Need help with StudyAI? You can contact the StudyAI
                  founder by email.
                </Text>

                <TouchableOpacity
                  style={styles.emailButton}
                  onPress={openEmail}
                >
                  <Text style={styles.emailButtonText}>
                    Contact StudyAI
                  </Text>
                </TouchableOpacity>

                <Text style={styles.modalEmail}>
                  {FOUNDER_EMAIL}
                </Text>
              </>
            )}

            {modalType === "founder" && (
              <>
                <Text style={styles.modalIcon}>👨‍💻</Text>
                <Text style={styles.modalTitle}>StudyAI Founder</Text>

                <Text style={styles.founderName}>
                  Muhammad Ibraheem
                </Text>

                <Text style={styles.modalText}>
                  Founder and creator of StudyAI, built to make studying
                  smarter, easier, and more accessible with AI.
                </Text>

                <TouchableOpacity
                  style={styles.emailButton}
                  onPress={openEmail}
                >
                  <Text style={styles.emailButtonText}>
                    Contact Founder
                  </Text>
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity
              style={styles.modalDone}
              onPress={() => setModalType(null)}
            >
              <Text style={styles.modalDoneText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 60,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
  },

  smallHeader: {
    color: "#38BDF8",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: 4,
  },

  header: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "800",
  },

  headerIcon: {
    width: 52,
    height: 52,
    borderRadius: 17,
    backgroundColor: "#1E293B",
    borderWidth: 1,
    borderColor: "#334155",
    justifyContent: "center",
    alignItems: "center",
  },

  headerIconText: {
    fontSize: 23,
  },

  profileCard: {
    backgroundColor: "#172554",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#2563EB",
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
  },

  avatarWrapper: {
    position: "relative",
  },

  avatar: {
    width: 70,
    height: 70,
    borderRadius: 22,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarImage: {
    width: 70,
    height: 70,
    borderRadius: 22,
  },

  avatarText: {
    color: "#FFFFFF",
    fontSize: 29,
    fontWeight: "800",
  },

  cameraBadge: {
    position: "absolute",
    right: -5,
    bottom: -5,
    width: 29,
    height: 29,
    borderRadius: 15,
    backgroundColor: "#2563EB",
    borderWidth: 2,
    borderColor: "#172554",
    justifyContent: "center",
    alignItems: "center",
  },

  cameraText: {
    fontSize: 13,
  },

  profileInfo: {
    flex: 1,
    marginLeft: 15,
  },

  profileName: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },

  username: {
    color: "#38BDF8",
    fontSize: 14,
    marginTop: 3,
    fontWeight: "600",
  },

  profileEmail: {
    color: "#94A3B8",
    fontSize: 13,
    marginTop: 4,
  },

  changePhotoText: {
    color: "#60A5FA",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 5,
  },

  verifiedBadge: {
    width: 25,
    height: 25,
    borderRadius: 13,
    backgroundColor: "#16A34A",
    justifyContent: "center",
    alignItems: "center",
  },

  verifiedText: {
    color: "#FFFFFF",
    fontWeight: "900",
  },

  sectionTitle: {
    color: "#94A3B8",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 10,
    marginTop: 4,
  },

  card: {
    backgroundColor: "#1E293B",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#334155",
    overflow: "hidden",
    marginBottom: 25,
  },

  option: {
    minHeight: 78,
    paddingHorizontal: 15,
    paddingVertical: 13,
    flexDirection: "row",
    alignItems: "center",
  },

  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: "#0F172A",
    justifyContent: "center",
    alignItems: "center",
  },

  icon: {
    fontSize: 22,
  },

  optionInfo: {
    flex: 1,
    marginLeft: 14,
  },

  optionTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  optionSubtitle: {
    color: "#94A3B8",
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },

  arrow: {
    color: "#64748B",
    fontSize: 30,
    marginLeft: 8,
  },

  divider: {
    height: 1,
    backgroundColor: "#334155",
    marginLeft: 77,
  },

  logoutCard: {
    backgroundColor: "#3B1722",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#7F1D1D",
    padding: 17,
    flexDirection: "row",
    alignItems: "center",
  },

  logoutIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#541827",
    justifyContent: "center",
    alignItems: "center",
  },

  logoutEmoji: {
    fontSize: 23,
  },

  logoutInfo: {
    flex: 1,
    marginLeft: 14,
  },

  logoutTitle: {
    color: "#FCA5A5",
    fontSize: 17,
    fontWeight: "800",
  },

  logoutSubtitle: {
    color: "#CBD5E1",
    fontSize: 13,
    marginTop: 4,
  },

  footer: {
    color: "#475569",
    fontSize: 12,
    textAlign: "center",
    marginTop: 30,
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(2,6,23,0.82)",
    justifyContent: "center",
    alignItems: "center",
    padding: 22,
  },

  confirmBox: {
    width: "100%",
    maxWidth: 430,
    backgroundColor: "#1E293B",
    borderRadius: 25,
    padding: 27,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#475569",
  },

  confirmIconBox: {
    width: 70,
    height: 70,
    borderRadius: 22,
    backgroundColor: "#3B1722",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },

  confirmIcon: {
    fontSize: 31,
  },

  confirmTitle: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "800",
  },

  confirmText: {
    color: "#CBD5E1",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    marginTop: 10,
    marginBottom: 22,
  },

  confirmLogout: {
    width: "100%",
    backgroundColor: "#DC2626",
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
  },

  confirmLogoutText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },

  cancelButton: {
    width: "100%",
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 5,
  },

  cancelText: {
    color: "#38BDF8",
    fontSize: 16,
    fontWeight: "700",
  },

  infoModal: {
    width: "100%",
    maxWidth: 450,
    backgroundColor: "#1E293B",
    borderRadius: 25,
    padding: 28,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#475569",
  },

  closeButton: {
    position: "absolute",
    right: 18,
    top: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#0F172A",
    justifyContent: "center",
    alignItems: "center",
  },

  closeText: {
    color: "#94A3B8",
    fontSize: 17,
  },

  modalIcon: {
    fontSize: 48,
    marginBottom: 10,
  },

  modalTitle: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "800",
    textAlign: "center",
  },

  modalText: {
    color: "#CBD5E1",
    fontSize: 15,
    lineHeight: 23,
    textAlign: "center",
    marginTop: 12,
    marginBottom: 18,
  },

  featureRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0F172A",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },

  featureIcon: {
    fontSize: 19,
    width: 35,
  },

  featureText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },

  founderName: {
    color: "#38BDF8",
    fontSize: 20,
    fontWeight: "800",
    marginTop: 10,
  },

  emailButton: {
    width: "100%",
    backgroundColor: "#2563EB",
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 5,
  },

  emailButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },

  modalEmail: {
    color: "#38BDF8",
    fontSize: 13,
    marginTop: 12,
  },

  modalDone: {
    width: "100%",
    backgroundColor: "#334155",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 14,
  },

  modalDoneText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});