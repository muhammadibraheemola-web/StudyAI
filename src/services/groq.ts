const BACKEND_URL =
  process.env.EXPO_PUBLIC_BACKEND_URL ||
  "http://localhost:5000";

export async function askGroq(prompt: string) {
  try {
    const response = await fetch(`${BACKEND_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return data.error || "Server Error";
    }

    return data.reply || "No response from StudyAI.";
  } catch (error: any) {
    console.error("askGroq error:", error);

    return (
      error?.message ||
      "Unable to connect to StudyAI backend."
    );
  }
}

export async function askHomework(imageUri: string) {
  try {
    const formData = new FormData();

    const blob = await fetch(imageUri).then(
      (response) => response.blob()
    );

    formData.append(
      "image",
      blob,
      "homework.jpg"
    );

    const response = await fetch(
      `${BACKEND_URL}/homework`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return data.error || "Server Error";
    }

    return data.reply || "No answer received.";
  } catch (error: any) {
    console.error("askHomework error:", error);

    return (
      error?.message ||
      "Unable to connect to Homework Scanner."
    );
  }
}