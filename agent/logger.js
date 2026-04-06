/**
 * AI Logger
 * Centralized logging for all Gemini API calls to track usage and prevent quota exhaustion.
 */

const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, '../ai_usage.log');

function logAiCall(promptType, details = {}) {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] CALL_TYPE: ${promptType} | DETAILS: ${JSON.stringify(details)}\n`;
  
  console.log(`🤖 [AI CALL] ${promptType}`, details);
  
  try {
    fs.appendFileSync(LOG_FILE, logEntry);
  } catch (err) {
    console.error('Failed to write to AI log file:', err);
  }
}

module.exports = { logAiCall };
