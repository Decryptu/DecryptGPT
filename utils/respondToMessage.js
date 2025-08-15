// utils/respondToMessage.js
import { MODEL_CONFIG, MAX_RETRIES, MODEL_SURNAMES } from "../config.js";
import splitMessage from "./splitMessage.js";
import handleApiErrors from "./handleApiErrors.js";
import { MessageFlags } from "discord.js";

async function respondToMessage(message, client, input) {
  const typingInterval = setInterval(() => message.channel.sendTyping(), 5000);

  try {
    await message.channel.sendTyping();
    
    const modelConfig = MODEL_CONFIG[client.currentModel];
    const modelName = MODEL_SURNAMES[client.currentModel];
    let attempts = 0;
    let result;

    console.log(`[MODEL] Using ${modelName} for ${message.author.username}`);

    while (attempts < MAX_RETRIES) {
      try {
        const requestPayload = {
          model: modelConfig.model,
          input: input,
          max_output_tokens: modelConfig.maxOutputTokens,
        };

        // Add reasoning if needed
        if (modelConfig.reasoning) {
          requestPayload.reasoning = modelConfig.reasoning;
          console.log(`[REASONING] Enabled with effort: ${modelConfig.reasoning.effort}`);
        }

        // Add web search if available
        if (modelConfig.hasWebSearch) {
          requestPayload.tools = [{ type: "web_search_preview" }];
          requestPayload.tool_choice = "auto";
        }

        result = await client.openai.responses.create(requestPayload);
        break;
      } catch (error) {
        attempts++;
        console.error(`[API ERROR] Attempt ${attempts}/${MAX_RETRIES}:`, error.message);
        if (attempts === MAX_RETRIES) throw error;
        
        const delay = Math.min(1000 * 2 ** attempts, 10000);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    // Process response and extract content
    let messageContent = "";
    let hasWebSearch = false;
    let webSearchQueries = [];
    let annotations = [];
    let outputItemCount = 0;

    if (result.output) {
      console.log(`[DEBUG] Response has ${result.output.length} output items`);
      
      for (const item of result.output) {
        outputItemCount++;
        console.log(`[DEBUG] Output item ${outputItemCount}: type=${item.type}, status=${item.status || 'N/A'}`);
        
        // Check for web search calls
        if (item.type === "web_search_call") {
          hasWebSearch = true;
          // Check if queries exist in the item
          if (item.queries && item.queries.length > 0) {
            webSearchQueries = item.queries;
            console.log(`[WEB SEARCH] Active with queries:`, webSearchQueries);
          } else {
            console.log(`[WEB SEARCH] Detected but no queries executed`);
          }
        }
        
        // Extract message content - handle both completed and in_progress
        if (item.type === "message") {
          if (item.content && Array.isArray(item.content)) {
            for (const content of item.content) {
              if (content.type === "output_text" && content.text) {
                messageContent += content.text;
                console.log(`[DEBUG] Extracted ${content.text.length} characters from output_text`);
                
                // Store annotations if present
                if (content.annotations) {
                  annotations = content.annotations;
                }
              }
            }
          }
        }
      }
    }

    // Log actual web search usage
    if (hasWebSearch && webSearchQueries.length > 0) {
      console.log(`[TOOLS] Web search executed - ${webSearchQueries.length} queries`);
    } else if (hasWebSearch) {
      console.log(`[TOOLS] Web search was considered but not executed`);
    }

    // Add source citations if web search was actually used
    if (annotations && annotations.length > 0) {
      const urlCitations = annotations.filter(a => a.type === "url_citation");
      if (urlCitations.length > 0) {
        console.log(`[WEB SOURCES] Found ${urlCitations.length} sources`);
        
        // Create a set to avoid duplicates
        const sources = new Map();
        for (const citation of urlCitations) {
          if (!sources.has(citation.url)) {
            sources.set(citation.url, citation.title || "Source");
          }
        }
        
        // Append sources to message
        if (sources.size > 0) {
          messageContent += "\n\n**Sources:**\n";
          let index = 1;
          for (const [url, title] of sources) {
            messageContent += `${index}. [${title}](${url})\n`;
            index++;
          }
        }
      }
    }

    // Check if we actually got content
    if (!messageContent || messageContent.trim() === "") {
      console.error("[RESPONSE] Empty response received - checking raw result");
      console.log("[DEBUG] Raw result output:", JSON.stringify(result.output, null, 2).substring(0, 1000));
      messageContent = "Désolé, je n'ai pas pu générer de réponse complète. Veuillez réessayer.";
    } else {
      console.log(`[RESPONSE] Total content length: ${messageContent.length} characters`);
    }

    // Send response in chunks if needed
    const messageParts = splitMessage(messageContent, 2000);
    console.log(`[RESPONSE] Sending ${messageParts.length} part(s) to ${message.author.username}`);
    
    for (let i = 0; i < messageParts.length; i++) {
      const messageOptions = { 
        content: messageParts[i],
        allowedMentions: { repliedUser: false }
      };
      
      // Suppress embeds for web search results to avoid preview spam
      if (hasWebSearch && annotations.length > 0) {
        messageOptions.flags = MessageFlags.SuppressEmbeds;
      }
      
      await message.channel.send(messageOptions);
    }

    // Log token usage with more details
    if (result.usage) {
      const usage = result.usage;
      console.log(`[TOKENS] Total: ${usage.total_tokens} (Input: ${usage.input_tokens}, Output: ${usage.output_tokens}${usage.output_tokens_details?.reasoning_tokens ? `, Reasoning: ${usage.output_tokens_details.reasoning_tokens}` : ''})`);
      
      // Warning for high token usage
      if (usage.input_tokens > 20000) {
        console.warn(`[WARNING] High input token usage: ${usage.input_tokens} tokens`);
      }
      if (usage.total_tokens > 50000) {
        console.warn(`[WARNING] High total token usage: ${usage.total_tokens} tokens`);
      }
    }
  } catch (error) {
    console.error("[RESPONSE ERROR]", error);
    await handleApiErrors(message, error);
  } finally {
    clearInterval(typingInterval);
  }
}

export default respondToMessage;