import {GoogleGenAI} from '@google/genai';
import { taskPrompt, userStoryPrompt } from './prompts';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});

export async function generateTasks(prompt: string) {
    const response = await ai.models.generateContent({
        model: 'gemini-flash-latest',
        contents: prompt,
        config:{
            systemInstruction: taskPrompt,
        }
    });
    return response.text;
}

export async function generateUserStories(prompt:string) {
    const response = await ai.models.generateContent({
        model: 'gemini-flash-latest',
        contents: prompt,
        config:{
            systemInstruction: userStoryPrompt,
        }
    });
    return response.text;
}


