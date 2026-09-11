import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "./supabase";

export type ProgressType =
  | "note"
  | "quiz"
  | "flashcard"
  | "homework";

export type Progress = {
  quizCount: number;
  notesCount: number;
  flashcardCount: number;
  homeworkCount: number;
  activityCount: number;
};

const emptyProgress: Progress = {
  quizCount: 0,
  notesCount: 0,
  flashcardCount: 0,
  homeworkCount: 0,
  activityCount: 0,
};

function key(userId: string) {
  return `studyai_progress_${userId}`;
}

export async function addProgress(type: ProgressType) {
  try {
    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // If there is no user, use a guest progress key
    const userId = user?.id ?? "guest";

    // ALWAYS save locally first
    const storageKey = key(userId);

    const saved = await AsyncStorage.getItem(storageKey);

    const progress: Progress = saved
      ? JSON.parse(saved)
      : { ...emptyProgress };

    if (type === "quiz") {
      progress.quizCount += 1;
    }

    if (type === "note") {
      progress.notesCount += 1;
    }

    if (type === "flashcard") {
      progress.flashcardCount += 1;
    }

    if (type === "homework") {
      progress.homeworkCount += 1;
    }

    progress.activityCount += 1;

    await AsyncStorage.setItem(
      storageKey,
      JSON.stringify(progress)
    );

    console.log("✅ LOCAL PROGRESS SAVED:", type);

    // Also save to Supabase when a user exists
    if (user) {
      const { error } = await supabase
        .from("study_activity")
        .insert({
          user_id: user.id,
          activity_type: type,
        });

      if (error) {
        console.log(
          "⚠️ Supabase progress error:",
          error.message
        );
      } else {
        console.log("✅ SUPABASE PROGRESS SAVED:", type);
      }
    }
  } catch (error) {
    console.log("❌ Progress save error:", error);
  }
}

export async function getProgress(): Promise<Progress> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const userId = user?.id ?? "guest";

    // Read local progress
    const saved = await AsyncStorage.getItem(
      key(userId)
    );

    const localProgress: Progress = saved
      ? JSON.parse(saved)
      : { ...emptyProgress };

    // Try Supabase too
    if (user) {
      const { data, error } = await supabase
        .from("study_activity")
        .select("activity_type")
        .eq("user_id", user.id);

      if (!error && data && data.length > 0) {
        const progress: Progress = {
          quizCount: 0,
          notesCount: 0,
          flashcardCount: 0,
          homeworkCount: 0,
          activityCount: 0,
        };

        for (const activity of data) {
          progress.activityCount += 1;

          if (activity.activity_type === "quiz") {
            progress.quizCount += 1;
          }

          if (activity.activity_type === "note") {
            progress.notesCount += 1;
          }

          if (activity.activity_type === "flashcard") {
            progress.flashcardCount += 1;
          }

          if (activity.activity_type === "homework") {
            progress.homeworkCount += 1;
          }
        }

        return progress;
      }
    }

    return localProgress;
  } catch (error) {
    console.log("❌ Progress loading error:", error);
    return emptyProgress;
  }
}