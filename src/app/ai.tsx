import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import ChatBubble from "../components/ChatBubble";
import Header from "../components/Header";
import MessageInput from "../components/MessageInput";
import TypingBubble from "../components/TypingBubble";
import { askGroq } from "../services/groq";

type Message = {
  text: string;
  sender: "user" | "ai";
};

const STORAGE_KEY = "studyai_chat";

const DEFAULT_MESSAGE: Message = {
  text: "Hello! I'm StudyAI. 👋\n\nAsk me anything about your studies!",
  sender: "ai",
};

export default function AI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState("");
  const [typing, setTyping] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);

  // Load saved chat
  useEffect(() => {
    loadMessages();
  }, []);

  // Save chat and scroll to bottom
  useEffect(() => {
    if (!loaded) return;

    saveMessages();

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({
        animated: true,
      });
    }, 100);
  }, [messages, typing, loaded]);

  async function loadMessages() {
    try {
      const saved = await AsyncStorage.getItem(
        STORAGE_KEY
      );

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        } else {
          setMessages([DEFAULT_MESSAGE]);
        }
      } else {
        setMessages([DEFAULT_MESSAGE]);
      }
    } catch (error) {
      console.log("Chat loading error:", error);
      setMessages([DEFAULT_MESSAGE]);
    } finally {
      setLoaded(true);
    }
  }

  async function saveMessages() {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(messages)
      );
    } catch (error) {
      console.log("Chat saving error:", error);
    }
  }

  async function doClearChat() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);

      setMessages([DEFAULT_MESSAGE]);
    } catch (error) {
      console.log("Clear chat error:", error);

      setMessages([DEFAULT_MESSAGE]);
    }
  }

  function clearChat() {
    if (Platform.OS === "web") {
      const confirmed = window.confirm(
        "Are you sure you want to clear the chat history?"
      );

      if (confirmed) {
        doClearChat();
      }

      return;
    }

    Alert.alert(
      "Clear Chat",
      "Are you sure you want to delete all chat history?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear",
          style: "destructive",
          onPress: doClearChat,
        },
      ]
    );
  }

  async function handleSend() {
    const currentQuestion = question.trim();

    if (!currentQuestion || typing) {
      return;
    }

    // Add user's message immediately
    const userMessage: Message = {
      text: currentQuestion,
      sender: "user",
    };

    setMessages((previous) => [
      ...previous,
      userMessage,
    ]);

    setQuestion("");
    setTyping(true);

    try {
      const reply = await askGroq(currentQuestion);

      const aiMessage: Message = {
        text:
          reply ||
          "Sorry, I couldn't generate a response.",
        sender: "ai",
      };

      setMessages((previous) => [
        ...previous,
        aiMessage,
      ]);
    } catch (error) {
      console.log("AI error:", error);

      setMessages((previous) => [
        ...previous,
        {
          text:
            "Sorry, I couldn't connect to StudyAI right now. Please check that your backend server is running.",
          sender: "ai",
        },
      ]);
    } finally {
      setTyping(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header onClear={clearChat} />

      <ScrollView
        ref={scrollViewRef}
        style={styles.chat}
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {messages.map((message, index) => (
          <ChatBubble
            key={`${index}-${message.sender}`}
            message={message.text}
            sender={message.sender}
          />
        ))}

        {typing && <TypingBubble />}
      </ScrollView>

      <View style={styles.inputArea}>
        <MessageInput
          value={question}
          onChangeText={setQuestion}
          onSend={handleSend}
        />

        <Text style={styles.disclaimer}>
          🤖 StudyAI can make mistakes. Check important information.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
  },

  chat: {
    flex: 1,
  },

  chatContent: {
    padding: 15,
    paddingBottom: 20,
  },

  inputArea: {
    backgroundColor: "#0F172A",
    paddingTop: 5,
  },

  disclaimer: {
    color: "#64748B",
    fontSize: 11,
    textAlign: "center",
    paddingHorizontal: 15,
    paddingBottom: 6,
  },
});