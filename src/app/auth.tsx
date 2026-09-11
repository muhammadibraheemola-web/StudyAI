import * as AuthSession from "expo-auth-session";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../services/supabase";

WebBrowser.maybeCompleteAuthSession();

const redirectTo = AuthSession.makeRedirectUri({
  scheme: "studyai",
  path: "auth/callback",
});

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleEmailAuth() {
    setMessage("");

    if (!email.trim() || !password.trim()) {
      setMessage("Please enter your email and password.");
      return;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }

    if (!isLogin) {
      if (!fullName.trim()) {
        setMessage("Please enter your full name.");
        return;
      }

      if (!username.trim()) {
        setMessage("Please choose a username.");
        return;
      }

      const cleanUsername = username
        .trim()
        .toLowerCase()
        .replace(/^@/, "");

      if (cleanUsername.length < 3) {
        setMessage("Username must be at least 3 characters.");
        return;
      }

      if (!/^[a-z0-9_]+$/.test(cleanUsername)) {
        setMessage(
          "Username can only contain letters, numbers, and underscores."
        );
        return;
      }
    }

    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          setMessage("Login failed: " + error.message);
          return;
        }

        router.replace("/");
      } else {
        const cleanUsername = username
          .trim()
          .toLowerCase()
          .replace(/^@/, "");

        const { data: existingProfile, error: usernameCheckError } =
          await supabase
            .from("profiles")
            .select("id")
            .eq("username", cleanUsername)
            .maybeSingle();

        if (usernameCheckError) {
          setMessage(
            "Could not check username: " + usernameCheckError.message
          );
          return;
        }

        if (existingProfile) {
          setMessage(
            "That username is already taken. Please choose another."
          );
          return;
        }

        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
        });

        if (error) {
          setMessage("Sign up failed: " + error.message);
          return;
        }

        if (!data.user) {
          setMessage("Account could not be created. Please try again.");
          return;
        }

        const { error: profileError } = await supabase
          .from("profiles")
          .insert({
            id: data.user.id,
            full_name: fullName.trim(),
            username: cleanUsername,
          });

        if (profileError) {
          setMessage(
            "Account created, but profile setup failed: " +
              profileError.message
          );
          return;
        }

        if (data.session) {
          router.replace("/");
        } else {
          setMessage(
            "Account created! Check your email to confirm your account."
          );

          setIsLogin(true);
          setFullName("");
          setUsername("");
          setPassword("");
        }
      }
    } catch (error) {
      console.log(error);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setMessage("");
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
          skipBrowserRedirect: true,
        },
      });

      if (error) {
        setMessage("Google login failed: " + error.message);
        return;
      }

      if (!data?.url) {
        setMessage("Google login failed: No login URL was returned.");
        return;
      }

      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        redirectTo
      );

      if (result.type !== "success" || !result.url) {
        return;
      }

      const callbackUrl = new URL(result.url);
      const code = callbackUrl.searchParams.get("code");

      if (!code) {
        setMessage("Google login failed: No code was returned.");
        return;
      }

      const { error: sessionError } =
        await supabase.auth.exchangeCodeForSession(code);

      if (sessionError) {
        setMessage("Google login failed: " + sessionError.message);
        return;
      }

      router.replace("/");
    } catch (error) {
      console.log(error);
      setMessage("Google login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGuestLogin() {
    if (loading) return;

    setMessage("Connecting as Guest...");
    setLoading(true);

    try {
      const { data, error } =
        await supabase.auth.signInAnonymously();

      if (error) {
        setMessage("Guest login failed: " + error.message);
        return;
      }

      if (!data.session) {
        setMessage(
          "Guest login failed: Supabase did not create a session."
        );
        return;
      }

      setMessage("Guest login successful! Opening StudyAI...");

      setTimeout(() => {
        router.replace("/");
      }, 500);
    } catch (error) {
      console.log("GUEST EXCEPTION:", error);

      setMessage(
        "Guest login error: " +
          (error instanceof Error
            ? error.message
            : String(error))
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          {/* LOGO */}
          <View style={styles.logoOuter}>
            <View style={styles.logoInner}>
              <Text style={styles.logo}>📚</Text>
            </View>
          </View>

          <Text style={styles.title}>StudyAI</Text>

          <View style={styles.badge}>
            <View style={styles.badgeDot} />
            <Text style={styles.badgeText}>
              AI-POWERED LEARNING
            </Text>
          </View>

          <Text style={styles.subtitle}>
            {isLogin
              ? "Welcome back!"
              : "Create your StudyAI account"}
          </Text>

          <Text style={styles.description}>
            {isLogin
              ? "Sign in to continue your learning journey."
              : "Create your account and start learning smarter."}
          </Text>

          {/* LOGIN / SIGN UP TABS */}
          <View style={styles.tabs}>
            <TouchableOpacity
              style={[
                styles.tab,
                isLogin && styles.activeTab,
              ]}
              onPress={() => {
                setIsLogin(true);
                setMessage("");
              }}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.tabText,
                  isLogin && styles.activeTabText,
                ]}
              >
                Log In
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tab,
                !isLogin && styles.activeTab,
              ]}
              onPress={() => {
                setIsLogin(false);
                setMessage("");
              }}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.tabText,
                  !isLogin && styles.activeTabText,
                ]}
              >
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>

          {/* SIGN UP FIELDS */}
          {!isLogin && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor="#64748B"
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
                editable={!loading}
              />

              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="#64748B"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
            </>
          )}

          {/* EMAIL */}
          <TextInput
            style={styles.input}
            placeholder="Email address"
            placeholderTextColor="#64748B"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            editable={!loading}
          />

          {/* PASSWORD */}
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#64748B"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            editable={!loading}
          />

          {/* EMAIL BUTTON */}
          <TouchableOpacity
            style={[
              styles.primaryButton,
              loading && styles.disabledButton,
            ]}
            onPress={handleEmailAuth}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Text style={styles.primaryButtonText}>
                  {isLogin ? "Log In" : "Create Account"}
                </Text>

                <Text style={styles.arrow}>→</Text>
              </>
            )}
          </TouchableOpacity>

          {/* DIVIDER */}
          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.divider} />
          </View>

          {/* GOOGLE */}
          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGoogleLogin}
            disabled={loading}
            activeOpacity={0.85}
          >
            <View style={styles.googleIcon}>
              <Text style={styles.googleG}>G</Text>
            </View>

            <Text style={styles.googleText}>
              Continue with Google
            </Text>
          </TouchableOpacity>

          {/* GUEST */}
          <TouchableOpacity
            style={styles.guestButton}
            onPress={handleGuestLogin}
            disabled={loading}
            activeOpacity={0.85}
          >
            <Text style={styles.guestIcon}>👤</Text>

            <Text style={styles.guestText}>
              Continue as Guest
            </Text>
          </TouchableOpacity>

          {/* MESSAGE */}
          {message !== "" && (
            <View style={styles.messageBox}>
              <Text style={styles.messageText}>
                {message}
              </Text>
            </View>
          )}

          {/* SWITCH */}
          <TouchableOpacity
            onPress={() => {
              setIsLogin(!isLogin);
              setMessage("");
            }}
            disabled={loading}
            style={styles.switchButton}
          >
            <Text style={styles.switchText}>
              {isLogin
                ? "Don't have an account? "
                : "Already have an account? "}

              <Text style={styles.switchBold}>
                {isLogin ? "Sign Up" : "Log In"}
              </Text>
            </Text>
          </TouchableOpacity>

          {/* BACK */}
          <TouchableOpacity
            onPress={() => router.replace("/welcome")}
            disabled={loading}
            style={styles.backButton}
          >
            <Text style={styles.backText}>
              ← Back to Welcome
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050B18",
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  glowTop: {
    position: "absolute",
    width: 360,
    height: 360,
    borderRadius: 180,
    backgroundColor: "#2563EB",
    opacity: 0.13,
    top: -170,
    right: -100,
  },

  glowBottom: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "#38BDF8",
    opacity: 0.06,
    bottom: -150,
    left: -120,
  },

  card: {
    width: "100%",
    maxWidth: 520,
    backgroundColor: "#0B1426",
    borderRadius: 28,
    padding: 28,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1E293B",
  },

  logoOuter: {
    width: 100,
    height: 100,
    borderRadius: 28,
    backgroundColor: "#0F1E38",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2563EB",
    marginBottom: 14,
  },

  logoInner: {
    width: 78,
    height: 78,
    borderRadius: 22,
    backgroundColor: "#142542",
    justifyContent: "center",
    alignItems: "center",
  },

  logo: {
    fontSize: 43,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 38,
    fontWeight: "800",
    letterSpacing: 0.5,
  },

  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0F1E38",
    borderWidth: 1,
    borderColor: "#1D4ED8",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 10,
  },

  badgeDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#22C55E",
    marginRight: 7,
  },

  badgeText: {
    color: "#60A5FA",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.9,
  },

  subtitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 18,
  },

  description: {
    color: "#64748B",
    fontSize: 14,
    textAlign: "center",
    marginTop: 7,
    marginBottom: 22,
  },

  tabs: {
    width: "100%",
    flexDirection: "row",
    backgroundColor: "#07101F",
    borderRadius: 14,
    padding: 4,
    marginBottom: 18,
  },

  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 11,
    alignItems: "center",
  },

  activeTab: {
    backgroundColor: "#2563EB",
  },

  tabText: {
    color: "#64748B",
    fontSize: 15,
    fontWeight: "700",
  },

  activeTabText: {
    color: "#FFFFFF",
  },

  input: {
    width: "100%",
    backgroundColor: "#07101F",
    color: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#1E293B",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 15,
    fontSize: 15,
    marginBottom: 12,
  },

  primaryButton: {
    width: "100%",
    minHeight: 56,
    backgroundColor: "#2563EB",
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
  },

  disabledButton: {
    opacity: 0.7,
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
  },

  arrow: {
    color: "#FFFFFF",
    fontSize: 23,
    marginLeft: 12,
  },

  dividerRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 19,
  },

  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#1E293B",
  },

  dividerText: {
    color: "#475569",
    fontSize: 11,
    fontWeight: "700",
    marginHorizontal: 12,
  },

  googleButton: {
    width: "100%",
    minHeight: 54,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  googleIcon: {
    width: 27,
    height: 27,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 9,
  },

  googleG: {
    color: "#4285F4",
    fontSize: 20,
    fontWeight: "800",
  },

  googleText: {
    color: "#111827",
    fontSize: 15,
    fontWeight: "800",
  },

  guestButton: {
    width: "100%",
    minHeight: 54,
    backgroundColor: "#111F35",
    borderWidth: 1,
    borderColor: "#263A59",
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 11,
  },

  guestIcon: {
    fontSize: 18,
    marginRight: 8,
  },

  guestText: {
    color: "#E2E8F0",
    fontSize: 15,
    fontWeight: "700",
  },

  messageBox: {
    width: "100%",
    backgroundColor: "#07101F",
    borderWidth: 1,
    borderColor: "#2563EB",
    borderRadius: 13,
    padding: 12,
    marginTop: 14,
  },

  messageText: {
    color: "#CBD5E1",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 19,
  },

  switchButton: {
    marginTop: 20,
  },

  switchText: {
    color: "#64748B",
    fontSize: 14,
    textAlign: "center",
  },

  switchBold: {
    color: "#38BDF8",
    fontWeight: "800",
  },

  backButton: {
    marginTop: 19,
  },

  backText: {
    color: "#64748B",
    fontSize: 13,
    fontWeight: "600",
  },
});