import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

async function getTriageAnalysis(text) {
  const prompt = `
    You are an 'A.I.D.R.' (Automated Incident Data Responder) triage bot.
    Analyze the following user report and respond ONLY with a valid JSON object.
    Do not add any text before or after the JSON.

    Use these exact keys: "urgency_level", "incident_category", "location_extracted", "people_affected", "resources_needed", "summary".
    - urgency_level: (CRITICAL, HIGH, MEDIUM, LOW)
    - incident_category: (Fire, Flood, Medical, Trapped, Infrastructure, Other)
    - If info is missing, use "null".

    Report: "${text}"
  `;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const jsonText = response.text().replace(/```json|```/g, '').trim();
  return JSON.parse(jsonText);
}

async function getSortedFeed(reportsArray) {
  const prompt = `
    You are an 'A.I.D.R.' (Automated Incident Data Responder) triage bot.
    I will provide a JSON array of unstructured text reports.

    Your tasks are:
    1. Analyze EACH string.
    2. Create a new JSON array of objects. Each object must have "text", "urgency_level", and "summary".
    3. For 'urgency_level', use: CRITICAL, HIGH, MEDIUM, LOW, or IGNORE.
    4. **CRITICAL TASK:** Sort this entire array. 'CRITICAL' items must be first, followed by 'HIGH', 'MEDIUM', 'LOW', and 'IGNORE' items last.
    5. Respond ONLY with the final, sorted JSON array. Do not add any text before or after it.

    Input: ${JSON.stringify(reportsArray)}
  `;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const jsonText = response.text().replace(/```json|```/g, '').trim();
  return JSON.parse(jsonText);
}

export { getTriageAnalysis, getSortedFeed };