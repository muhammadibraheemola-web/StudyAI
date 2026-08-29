import AsyncStorage from "@react-native-async-storage/async-storage";

const CHAT_KEY = "studyai_chat_history";

export async function saveMessages(messages: any[]) {
  try {
    await AsyncStorage.setItem(CHAT_KEY, JSON.stringify(messages));
  } catch (e) {
    console.log(e);
  }
}

export async function loadMessages() {
  try {
    const data = await AsyncStorage.getItem(CHAT_KEY);

    if (data) {
      return JSON.parse(data);
    }

    return [];
  } catch (e) {
    console.log(e);
    return [];
  }
}

export async function clearMessages() {
  try {
    await AsyncStorage.removeItem(CHAT_KEY);
  } catch (e) {
    console.log(e);
  }
}