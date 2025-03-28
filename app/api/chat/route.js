import { NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";

const systemPrompt = `
You are a fitness trainer helping people find exercises that will help them work out, that takes in user questions and answers them.
For every user question, the top ten relevant exercises for the user's query are returned.
Use them to answer the question if needed.
`;

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

async function queryWithRetry(index, queryParams, retries = 0) {
  try {
    const results = await index.query(queryParams);
    return results;
  } catch (error) {
    if (retries < MAX_RETRIES) {
      console.log(
        `Query failed. Retrying in ${RETRY_DELAY}ms... (Attempt ${
          retries + 1
        }/${MAX_RETRIES})`
      );
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      return queryWithRetry(index, queryParams, retries + 1);
    } else {
      console.error("Max retries reached. Query failed:", error);
      throw error;
    }
  }
}

// Takes user query, combines it with a vector search in Pinecone, and makes the query to OpenAI
// Provides context-aware responses
export async function POST(req) {
  const data = await req.json();

  const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
  });
  const index = pc.index("exerciserag").namespace("ns1");
  const openai = new OpenAI();

  // create embedding for the user's question
  const text = data[data.length - 1].content;
  const embedding = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
    encoding_format: "float",
  });

  try {
    const results = await queryWithRetry(index, {
      topK: 10,
      includeMetadata: true,
      vector: embedding.data[0].embedding,
    });

    // Process the Pinecone results into a readable string
    let jsonArr = [];
    let resultString = "";
    results.matches.forEach((match) => {
      const meta = match.metadata;
      let instructions = "";
      meta.instructions.forEach((step) => {
        instructions += step + ' ';
      })
      jsonArr.push({
        exerciseName: meta.exerciseName,
        bodyPart: meta.bodyPart,
        target: meta.target,
        instructions: meta.instructions
      });
      resultString += `
        Returned Results:
        Exercise name: ${meta.exerciseName}
        Main body part: ${meta.bodyPart}
        Targeted muscle: ${meta.target}
        Instructions: ${meta.instructions}
        \n`;
    });

    // Combine user's question with Pinecone results
    const lastMessage = data[data.length - 1];
    const lastMessageContent = lastMessage.content + resultString;
    const lastDataWithoutLastMessage = data.slice(0, data.length - 1);

    // Create chat completion request to OpenAI with the systemPrompt and the combined user query
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        ...lastDataWithoutLastMessage,
        { role: "user", content: lastMessageContent },
      ],
      model: "gpt-3.5-turbo",
      stream: true,
    });

    // Create a ReadableStream to handle the streaming response
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          const jsonText = encoder.encode(JSON.stringify({ data: jsonArr }));
          controller.enqueue(jsonText);
          controller.enqueue(" ")

          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              const text = encoder.encode(content);
              controller.enqueue(text);
            }
          }
        } catch (err) {
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    return new NextResponse(stream);
  } catch (error) {
    // Handle the error after all retries have failed
    console.error("Query failed after all retries:", error);
    return new NextResponse(500);
  }
}