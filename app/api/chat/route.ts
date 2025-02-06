import { NextResponse } from "next/server";

// Using a reliable and efficient model
const HUGGING_FACE_API =
  "https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// Format messages for the Zephyr model
async function formatMessage(messages: ChatMessage[]): Promise<string> {
  const formattedMessages = messages.map((msg) => {
    if (msg.role === "user") {
      return `<|user|>\n${msg.content}\n<|assistant|>\n`;
    } else {
      return `${msg.content}\n`;
    }
  });
  return formattedMessages.join("");
}

// Simple delay function for retries with longer waits
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  maxRetries = 5
) {
  let lastError = null;
  for (let i = 0; i < maxRetries; i++) {
    try {
      console.log(`Attempt ${i + 1}: Sending request to Hugging Face API`);

      const response = await fetch(url, options);
      console.log(`Response status: ${response.status}`);

      if (response.status === 503) {
        // Service unavailable - wait longer
        const waitTime = Math.pow(2, i + 1) * 2000; // Longer wait times
        console.log(
          `Service unavailable, waiting ${waitTime}ms before retry ${i + 1}`
        );
        await delay(waitTime);
        continue;
      }

      if (response.status === 429) {
        const waitTime = Math.pow(2, i) * 1500;
        console.log(
          `Rate limited, waiting ${waitTime}ms before retry ${i + 1}`
        );
        await delay(waitTime);
        continue;
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error Response:`, errorText);
        throw new Error(
          `API request failed with status ${response.status}: ${errorText}`
        );
      }

      return response;
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error);
      lastError = error;
      if (i === maxRetries - 1) break;
      // Increased delay between retries
      await delay(2000 * (i + 1));
    }
  }
  throw lastError || new Error("Max retries reached");
}

export async function POST(req: Request) {
  console.log("API Route: Starting request processing");

  const apiToken = process.env.HUGGING_FACE_API_TOKEN;
  console.log("API Token format check:", {
    exists: !!apiToken,
    startsWithHf: apiToken?.startsWith("hf_"),
    length: apiToken?.length,
  });

  if (!apiToken) {
    console.error("API Route: Missing API token");
    return NextResponse.json(
      { error: "Hugging Face API token is not configured" },
      { status: 500 }
    );
  }

  if (!apiToken.startsWith("hf_")) {
    console.error("API Route: Invalid API token format");
    return NextResponse.json(
      {
        error:
          "Invalid Hugging Face API token format. Token should start with 'hf_'",
      },
      { status: 500 }
    );
  }

  try {
    const { messages } = await req.json();
    console.log("API Route: Received messages:", messages);

    if (!messages || !Array.isArray(messages)) {
      console.error("API Route: Invalid message format");
      return NextResponse.json(
        { error: "Invalid messages format" },
        { status: 400 }
      );
    }

    const formattedMessages = await formatMessage(messages);
    console.log("API Route: Processing formatted message:", formattedMessages);

    const response = await fetchWithRetry(HUGGING_FACE_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiToken}`,
      },
      body: JSON.stringify({
        inputs: formattedMessages,
        parameters: {
          max_new_tokens: 512,
          temperature: 0.7,
          top_p: 0.95,
          do_sample: true,
          return_full_text: false,
        },
      }),
    });

    const result = await response.json();
    console.log("API Route: Raw API response:", result);

    // Handle different response formats
    let generatedText = "";
    if (Array.isArray(result) && result[0]?.generated_text) {
      generatedText = result[0].generated_text.trim();
    } else if (Array.isArray(result) && typeof result[0] === "string") {
      generatedText = result[0].trim();
    } else if (typeof result === "string") {
      generatedText = result.trim();
    } else {
      console.error("API Route: Unexpected response format:", result);
      throw new Error("Unexpected response format from API");
    }

    // Clean up the response
    generatedText = generatedText
      .replace(/<\|user\|>|<\|assistant\|>/g, "")
      .trim();

    console.log("API Route: Generated response:", generatedText);

    return NextResponse.json({
      message: {
        role: "assistant",
        content: generatedText,
      },
      status: 200,
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    console.error("API Route: Error details:", {
      message: errorMessage,
      error: error,
    });

    let userMessage = "Something went wrong. Please try again.";
    if (error instanceof Error) {
      if (error.message.includes("429")) {
        userMessage =
          "The chat service is temporarily busy. Please try again in a few seconds.";
      } else if (error.message.includes("401")) {
        userMessage =
          "Authentication failed. Please check your Hugging Face account and generate a new API token.";
      } else if (error.message.includes("503")) {
        userMessage =
          "The chat service is currently initializing. Please try again in a few moments.";
      } else if (error.message.includes("response format")) {
        userMessage =
          "The chat service returned an unexpected response. Please try again.";
      }
    }

    return NextResponse.json(
      {
        error: userMessage,
        technicalError: errorMessage,
        status: 500,
      },
      { status: 500 }
    );
  }
}
