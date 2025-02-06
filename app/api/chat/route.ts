import { NextResponse } from "next/server";

// Using a more accessible model
const HUGGING_FACE_API =
  "https://api-inference.huggingface.co/models/google/flan-t5-small";

// Simple delay function for retries
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  maxRetries = 3
) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      console.log(`Attempt ${i + 1}: Sending request to Hugging Face API`);
      console.log("Using headers:", JSON.stringify(options.headers, null, 2));

      const response = await fetch(url, options);
      console.log(`Response status: ${response.status}`);

      if (response.status === 429) {
        const waitTime = Math.pow(2, i) * 1000;
        console.log(
          `Rate limited, waiting ${waitTime}ms before retry ${i + 1}`
        );
        await delay(waitTime);
        continue;
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error Response:`, errorText);
        console.error("Response headers:", response.headers);
        throw new Error(
          `API request failed with status ${response.status}: ${errorText}`
        );
      }

      return response;
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error);
      if (i === maxRetries - 1) throw error;
      await delay(1000);
    }
  }
  throw new Error("Max retries reached");
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

    const userMessage = messages[messages.length - 1].content;
    console.log("API Route: Processing user message:", userMessage);

    const response = await fetchWithRetry(HUGGING_FACE_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiToken}`,
      },
      body: JSON.stringify({
        inputs: userMessage,
        parameters: {
          max_length: 100,
          temperature: 0.7,
        },
      }),
    });

    const result = await response.json();
    console.log("API Route: Raw API response:", result);

    // Handle different response formats
    let generatedText = "";
    if (Array.isArray(result) && result[0]?.generated_text) {
      generatedText = result[0].generated_text;
    } else if (Array.isArray(result) && typeof result[0] === "string") {
      generatedText = result[0];
    } else if (typeof result === "string") {
      generatedText = result;
    } else {
      console.error("API Route: Unexpected response format:", result);
      throw new Error("Unexpected response format from API");
    }

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
