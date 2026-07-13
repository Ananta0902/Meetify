import Groq from "groq-sdk";

export const handleAIFeature = async (req, res) => {
  // 1. Destructured activeParticipants from the incoming request body
  const { mode, chatHistory, userPrompt, activeParticipants } = req.body;

  try {
    if (!process.env.GROQ_API_KEY) {
      console.error("❌ ERROR: GROQ_API_KEY is not defined in your .env file!");
      return res.status(500).json({ error: "Backend API key configuration missing." });
    }

    // Initialize the Groq SDK
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    
    // Updated to the current active production model string
    const TARGET_MODEL = "llama-3.3-70b-versatile"; 

    // 🥇 FEATURE 1: AI Meeting Summary
    if (mode === "summary") {
  const participantsList = activeParticipants || [];
  
  // FIXED LOGIC: If there are NO chat messages typed yet, intercept it immediately!
  if (!chatHistory || chatHistory.length === 0) {
    return res.json({ 
      result: "## Meeting Summary\n* No conversation or chat logs have been recorded in this session yet.\n\n## Action Items\n* None\n\n## Key Participants\n" + 
      (participantsList.length > 0 
        ? participantsList.map(p => `• ${p} (Present)`).join("\n") 
        : "• None")
    });
  }

      const formattedLogs = chatHistory && chatHistory.length > 0
        ? chatHistory.map((msg) => `${msg.username || 'Unknown'}: ${msg.text || msg.message}`).join("\n")
        : "No direct chat log entries recorded.";

      // 2. Generate a highly contextual prompt passing the active roster list
      const participantsString = participantsList.length > 0 ? participantsList.join(', ') : "None detected";
      
      const summarySystemInstruction = `
        You are an expert project manager and executive assistant. Analyze the meeting context and generate an organized summary. 
        
        CRITICAL MEETING METADATA:
        The following active participants are physically present inside the video room layout right now: [ ${participantsString} ].
        
        Format strictly using clean Markdown with these exact sections:
        ## Meeting Summary
        (Summarize what happened)
        
        ## Action Items
        (Bullet list of items)
        
        ## Key Participants
        (List EVERY person listed under CRITICAL MEETING METADATA. Highlight what they said based on the logs, or explicitly note that they were present in the session if no text log exists for them).
      `;

      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: summarySystemInstruction
          },
          {
            role: "user",
            content: `Transcript logs for evaluation:\n${formattedLogs}`
          }
        ],
        model: TARGET_MODEL,
      });

      return res.json({ result: chatCompletion.choices[0]?.message?.content || "" });
    }

    // 🥈 FEATURE 2: Side-Panel Assistant
    if (mode === "assistant") {
      if (!userPrompt) {
        return res.status(400).json({ error: "Prompt is required for assistant mode." });
      }

      const formattedLogs = chatHistory && chatHistory.length > 0
        ? chatHistory.map((msg) => `${msg.username || 'User'}: ${msg.text || msg.message}`).join("\n")
        : "No active meeting chat logs available yet.";

      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `You are an elite technical meeting assistant built into the 'Meetify' platform. Help the user answer their question cleanly, writing code blocks or explaining errors. Here are the active meeting chat logs for context:\n${formattedLogs}`
          },
          {
            role: "user",
            content: userPrompt
          }
        ],
        model: TARGET_MODEL,
      });

      return res.json({ result: chatCompletion.choices[0]?.message?.content || "" });
    }

    return res.status(400).json({ error: "Invalid mode specified." });

  } catch (error) {
    console.error("Groq API Error:", error);
    res.status(500).json({ error: "Failed to process AI request through fallback network." });
  }
};