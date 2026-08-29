import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
};

const NOTES_KEY = "studyai_notes";
const NOTES_COUNT_KEY = "studyai_notes_count";
const ACTIVITY_COUNT_KEY = "studyai_activity_count";

export default function NotesScreen() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  useEffect(() => {
    loadNotes();
  }, []);

  async function loadNotes() {
    try {
      const saved = await AsyncStorage.getItem(NOTES_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          setNotes(parsed);
        }
      }
    } catch (error) {
      console.log("Could not load notes:", error);
    }
  }

  async function increaseStudyActivity() {
    try {
      const savedNotesCount = await AsyncStorage.getItem(
        NOTES_COUNT_KEY
      );

      const savedActivityCount = await AsyncStorage.getItem(
        ACTIVITY_COUNT_KEY
      );

      const notesCount = Number(savedNotesCount || "0");
      const activityCount = Number(savedActivityCount || "0");

      await AsyncStorage.setItem(
        NOTES_COUNT_KEY,
        String(notesCount + 1)
      );

      await AsyncStorage.setItem(
        ACTIVITY_COUNT_KEY,
        String(activityCount + 1)
      );
    } catch (error) {
      console.log(
        "Could not update study activity:",
        error
      );
    }
  }

  async function saveNotes(
    updatedNotes: Note[],
    isNewNote: boolean
  ) {
    try {
      await AsyncStorage.setItem(
        NOTES_KEY,
        JSON.stringify(updatedNotes)
      );

      setNotes(updatedNotes);

      if (isNewNote) {
        await increaseStudyActivity();
      }
    } catch (error) {
      console.log("Could not save notes:", error);

      Alert.alert(
        "Error",
        "Could not save your note."
      );
    }
  }

  function openNewNote() {
    setEditingId(null);
    setTitle("");
    setContent("");
    setShowEditor(true);
  }

  function openNote(note: Note) {
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);
    setShowEditor(true);
  }

  async function saveNote() {
    if (!title.trim() && !content.trim()) {
      Alert.alert(
        "Empty Note",
        "Please enter a title or some content."
      );
      return;
    }

    const noteTitle =
      title.trim() || "Untitled Note";

    const noteContent = content.trim();

    if (editingId) {
      const updatedNotes = notes.map((note) =>
        note.id === editingId
          ? {
              ...note,
              title: noteTitle,
              content: noteContent,
            }
          : note
      );

      await saveNotes(updatedNotes, false);
    } else {
      const newNote: Note = {
        id: Date.now().toString(),
        title: noteTitle,
        content: noteContent,
        createdAt: new Date().toISOString(),
      };

      await saveNotes(
        [newNote, ...notes],
        true
      );
    }

    setTitle("");
    setContent("");
    setEditingId(null);
    setShowEditor(false);
  }

  async function deleteNote(id: string) {
    const remove = async () => {
      try {
        const updatedNotes = notes.filter(
          (note) => note.id !== id
        );

        await AsyncStorage.setItem(
          NOTES_KEY,
          JSON.stringify(updatedNotes)
        );

        setNotes(updatedNotes);

        if (editingId === id) {
          setEditingId(null);
          setTitle("");
          setContent("");
          setShowEditor(false);
        }
      } catch (error) {
        console.log("Delete note error:", error);

        Alert.alert(
          "Error",
          "Could not delete the note."
        );
      }
    };

    if (Platform.OS === "web") {
      const confirmed = window.confirm(
        "Delete this note?"
      );

      if (confirmed) {
        await remove();
      }

      return;
    }

    Alert.alert(
      "Delete Note",
      "Are you sure you want to delete this note?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: remove,
        },
      ]
    );
  }

  function closeEditor() {
    setTitle("");
    setContent("");
    setEditingId(null);
    setShowEditor(false);
  }

  function formatDate(dateString: string) {
    try {
      return new Date(
        dateString
      ).toLocaleDateString();
    } catch {
      return "";
    }
  }

  if (showEditor) {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
      >
        <View style={styles.editorHeader}>
          <TouchableOpacity
            onPress={closeEditor}
            style={styles.backButton}
          >
            <Text style={styles.backText}>
              ← Back
            </Text>
          </TouchableOpacity>

          <Text style={styles.editorTitle}>
            {editingId
              ? "Edit Note"
              : "New Note"}
          </Text>

          <TouchableOpacity
            onPress={saveNote}
            style={styles.saveButton}
          >
            <Text style={styles.saveButtonText}>
              Save
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.editor}>
          <TextInput
            style={styles.titleInput}
            placeholder="Note title"
            placeholderTextColor="#64748B"
            value={title}
            onChangeText={setTitle}
            maxLength={100}
          />

          <TextInput
            style={styles.contentInput}
            placeholder="Start writing your notes..."
            placeholderTextColor="#64748B"
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
          />

          {editingId && (
            <TouchableOpacity
              style={styles.deleteEditorButton}
              onPress={() =>
                deleteNote(editingId)
              }
            >
              <Text style={styles.deleteEditorText}>
                🗑️ Delete Note
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>
            📝 Study Notes
          </Text>

          <Text style={styles.subtitle}>
            Keep your important ideas in one place.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={openNewNote}
        >
          <Text style={styles.addButtonText}>
            +
          </Text>
        </TouchableOpacity>
      </View>

      {notes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>
            📚
          </Text>

          <Text style={styles.emptyTitle}>
            No notes yet
          </Text>

          <Text style={styles.emptyText}>
            Create your first study note and
            start building your knowledge library.
          </Text>

          <TouchableOpacity
            style={styles.createButton}
            onPress={openNewNote}
          >
            <Text style={styles.createButtonText}>
              📝 Create First Note
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.noteCard}
              activeOpacity={0.8}
              onPress={() => openNote(item)}
            >
              <View style={styles.noteHeader}>
                <Text
                  style={styles.noteTitle}
                  numberOfLines={1}
                >
                  {item.title}
                </Text>

                <TouchableOpacity
                  onPress={() =>
                    deleteNote(item.id)
                  }
                  style={styles.deleteButton}
                >
                  <Text style={styles.deleteText}>
                    🗑️
                  </Text>
                </TouchableOpacity>
              </View>

              <Text
                style={styles.noteContent}
                numberOfLines={4}
              >
                {item.content ||
                  "No content yet."}
              </Text>

              <Text style={styles.noteDate}>
                {formatDate(item.createdAt)}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#07111F",
  },

  header: {
    padding: 20,
    paddingTop: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    color: "#38BDF8",
    fontSize: 30,
    fontWeight: "bold",
  },

  subtitle: {
    color: "#64748B",
    fontSize: 14,
    marginTop: 5,
    maxWidth: 280,
  },

  addButton: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
  },

  addButtonText: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
    lineHeight: 34,
  },

  listContent: {
    padding: 20,
    paddingTop: 5,
    paddingBottom: 40,
  },

  noteCard: {
    backgroundColor: "#111F32",
    borderRadius: 18,
    padding: 18,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#1D334C",
  },

  noteHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  noteTitle: {
    color: "white",
    fontSize: 19,
    fontWeight: "bold",
    flex: 1,
    marginRight: 10,
  },

  noteContent: {
    color: "#CBD5E1",
    fontSize: 15,
    lineHeight: 23,
    marginTop: 12,
  },

  noteDate: {
    color: "#64748B",
    fontSize: 12,
    marginTop: 12,
  },

  deleteButton: {
    padding: 6,
  },

  deleteText: {
    fontSize: 18,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },

  emptyEmoji: {
    fontSize: 70,
    marginBottom: 15,
  },

  emptyTitle: {
    color: "white",
    fontSize: 25,
    fontWeight: "bold",
  },

  emptyText: {
    color: "#94A3B8",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginTop: 10,
    maxWidth: 350,
  },

  createButton: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 22,
    paddingVertical: 15,
    borderRadius: 14,
    marginTop: 25,
  },

  createButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  editorHeader: {
    height: 75,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#172B44",
  },

  backButton: {
    padding: 8,
  },

  backText: {
    color: "#38BDF8",
    fontSize: 16,
    fontWeight: "bold",
  },

  editorTitle: {
    color: "white",
    fontSize: 19,
    fontWeight: "bold",
  },

  saveButton: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 17,
    paddingVertical: 9,
    borderRadius: 10,
  },

  saveButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
  },

  editor: {
    flex: 1,
    padding: 20,
  },

  titleInput: {
    backgroundColor: "#111F32",
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#1D334C",
    marginBottom: 15,
  },

  contentInput: {
    flex: 1,
    backgroundColor: "#111F32",
    color: "white",
    fontSize: 17,
    lineHeight: 26,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#1D334C",
  },

  deleteEditorButton: {
    backgroundColor: "#3B1620",
    padding: 15,
    borderRadius: 13,
    alignItems: "center",
    marginTop: 15,
  },

  deleteEditorText: {
    color: "#FCA5A5",
    fontWeight: "bold",
    fontSize: 15,
  },
});