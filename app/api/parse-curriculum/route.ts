import OpenAI from "openai"

function splitIntoSessions(content: string): string[] {
  // Try to identify session boundaries
  const sessionPatterns = [/Session\s+\d+\s*[-–—]\s*/gi, /\n\s*\d+\.\s+[A-Z]/g, /Chapter\s+\d+/gi]

  const chunks: string[] = []
  let bestSplit: string[] = []

  for (const pattern of sessionPatterns) {
    const matches = Array.from(content.matchAll(pattern))
    if (matches.length > 1) {
      // Found session boundaries
      const indices = matches.map((m) => m.index!)
      bestSplit = []
      for (let i = 0; i < indices.length; i++) {
        const start = indices[i]
        const end = i < indices.length - 1 ? indices[i + 1] : content.length
        bestSplit.push(content.slice(start, end))
      }
      break
    }
  }

  // If no clear sessions found, split by size (100KB chunks)
  if (bestSplit.length === 0) {
    const chunkSize = 100000
    for (let i = 0; i < content.length; i += chunkSize) {
      bestSplit.push(content.slice(i, i + chunkSize))
    }
  }

  return bestSplit
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { content, fileContent, userMessage, currentJson } = body

    const actualContent = content || fileContent

    console.log("[v0] API received request, content length:", actualContent?.length || 0)

    if (!process.env.OPENAI_API_KEY) {
      console.error("[v0] Missing OPENAI_API_KEY environment variable")
      return new Response(
        JSON.stringify({
          success: false,
          error: "OpenAI API key not configured. Please add OPENAI_API_KEY to environment variables.",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      )
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    let prompt = ""

    if (actualContent && !currentJson) {
      if (actualContent.length > 500000) {
        console.log("[v0] Content too large, processing in chunks...")

        const chunks = splitIntoSessions(actualContent)
        console.log(`[v0] Split into ${chunks.length} chunks`)

        const allSessions: any[] = []
        let programTitle = "Extracted Program"
        let publisher = "Unknown"

        // Process first chunk to get metadata
        try {
          const metadataPrompt = `Extract ONLY the program title, publisher name, and total number of sessions from this content. Return as JSON:
{
  "title": "program title",
  "publisher": "publisher or author name",
  "totalSessions": number
}

Content:
${chunks[0].slice(0, 5000)}

Return ONLY valid JSON.`

          const metadataResponse = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: metadataPrompt }],
            max_tokens: 500,
          })

          const metadata = JSON.parse(metadataResponse.choices[0].message.content || "{}")
          programTitle = metadata.title || programTitle
          publisher = metadata.publisher || publisher

          console.log(`[v0] Extracted metadata: ${programTitle} by ${publisher}`)
        } catch (error) {
          console.error("[v0] Failed to extract metadata:", error)
        }

        // Process each chunk for sessions
        for (let i = 0; i < Math.min(chunks.length, 5); i++) {
          try {
            console.log(`[v0] Processing chunk ${i + 1}/${chunks.length}`)

            const chunkPrompt = `Extract sessions, activities, and homework from this curriculum content. Return as JSON array:
[
  {
    "number": 1,
    "title": "Session Title",
    "objectives": ["objective"],
    "duration": "60-90 minutes",
    "sections": [
      {
        "title": "Section Title",
        "duration": "10 minutes",
        "facilitatorContent": "Full content",
        "participantContent": "Simplified content",
        "activities": [],
        "discussionPrompts": []
      }
    ],
    "homework": {
      "title": "Homework",
      "instructions": "Instructions",
      "questions": []
    }
  }
]

Content:
${chunks[i]}

Return ONLY valid JSON array.`

            const chunkResponse = await openai.chat.completions.create({
              model: "gpt-4o",
              messages: [{ role: "user", content: chunkPrompt }],
              max_tokens: 4000,
            })

            let responseText = chunkResponse.choices[0].message.content || "[]"
            if (responseText.includes("```")) {
              responseText = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "")
            }

            const sessions = JSON.parse(responseText)
            if (Array.isArray(sessions)) {
              allSessions.push(...sessions)
            }
          } catch (error) {
            console.error(`[v0] Error processing chunk ${i}:`, error)
          }
        }

        const finalCurriculum = {
          title: programTitle,
          publisher: publisher,
          totalSessions: allSessions.length,
          requiresLicense: publisher !== "Unknown" && publisher !== "Facilitator Created",
          category: "Treatment Program",
          description: `${allSessions.length}-session treatment program`,
          sessions: allSessions,
        }

        console.log(`[v0] Successfully processed ${allSessions.length} sessions`)
        return new Response(
          JSON.stringify({
            success: true,
            curriculum: finalCurriculum,
            rawJson: JSON.stringify(finalCurriculum, null, 2),
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          },
        )
      }

      prompt = `You are a curriculum parser. Convert this workbook content into a structured JSON curriculum format.

The JSON should have this structure:
{
  "title": "Program Name",
  "publisher": "Publisher Name or Facilitator Name",
  "totalSessions": number,
  "requiresLicense": boolean,
  "category": "Category name",
  "description": "Brief description",
  "sessions": [
    {
      "number": 1,
      "title": "Session Title",
      "objectives": ["objective1", "objective2"],
      "duration": "60-90 minutes",
      "sections": [
        {
          "title": "Section Title",
          "duration": "10 minutes",
          "facilitatorContent": "Full content for facilitator view",
          "participantContent": "Simplified content for participant view",
          "activities": ["activity1", "activity2"],
          "discussionPrompts": ["prompt1", "prompt2"]
        }
      ],
      "homework": {
        "title": "Homework Title",
        "instructions": "What participants need to do",
        "questions": ["question1", "question2"]
      }
    }
  ]
}

Parse the following workbook content and extract all sessions, sections, activities, and homework:

${actualContent}

Return ONLY valid JSON, no explanations.`
    } else if (currentJson && userMessage) {
      // Fix existing JSON based on user feedback
      prompt = `You are a curriculum editor. The user has this curriculum JSON:

${currentJson}

The user wants you to make this change: "${userMessage}"

Return the CORRECTED JSON with the requested changes. Return ONLY valid JSON, no explanations.`
    } else {
      console.error("[v0] Invalid request - missing content or currentJson+userMessage")
      return new Response(
        JSON.stringify({
          success: false,
          error: "Invalid request parameters",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      )
    }

    try {
      console.log("[v0] Calling OpenAI API...")
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 8000,
      })

      const text = completion.choices[0].message.content || ""
      console.log("[v0] Received response from OpenAI, length:", text.length)

      let jsonText = text.trim()
      if (jsonText.startsWith("```json")) {
        jsonText = jsonText.replace(/```json\n?/g, "").replace(/```\n?/g, "")
      } else if (jsonText.startsWith("```")) {
        jsonText = jsonText.replace(/```\n?/g, "")
      }

      try {
        const parsed = JSON.parse(jsonText)
        console.log("[v0] Successfully parsed JSON, sessions:", parsed.sessions?.length)
        return new Response(JSON.stringify({ success: true, curriculum: parsed, rawJson: jsonText }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        })
      } catch (error) {
        console.error("[v0] Failed to parse JSON:", error)
        return new Response(
          JSON.stringify({
            success: false,
            error: "Failed to parse AI response",
            rawResponse: jsonText,
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          },
        )
      }
    } catch (error: any) {
      console.error("[v0] OpenAI API error:", error)
      return new Response(
        JSON.stringify({
          success: false,
          error: error.message || "Internal server error",
          details: error.toString(),
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      )
    }
  } catch (error: any) {
    console.error("[v0] API error:", error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Internal server error",
        details: error.toString(),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
