import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function Layout() {
  return (
    <>
      <StatusBar style="light" />

      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          contentStyle: {
            backgroundColor: "#0F172A",
          },
        }}
      >
        <Stack.Screen name="welcome" />
        <Stack.Screen name="index" />
        <Stack.Screen name="ai" />
        <Stack.Screen name="scan" />
        <Stack.Screen name="notes" />
        <Stack.Screen name="quiz" />
        <Stack.Screen name="flashcards" />
        <Stack.Screen name="calculator" />
        <Stack.Screen name="explore" />
        <Stack.Screen name="settings" />
      </Stack>
    </>
  );
}