import { OpenAIRequest } from "@/utils/OpenAI";

async function generateTitle(content: string): Promise<string> {
  const titlePrompt = `Summarize the following question or statement in exactly three words, maintaining the original language:\n\n"${content}"`;

  const payload: OpenAIRequest = {
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: titlePrompt }],
    max_tokens: 10,
    temperature: 0.7,
  };

  try {
    const response = await fetch('/api/completion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.content.trim();
  } catch (error) {
    console.error("Error generating title:", error);
    return "";
  }
}