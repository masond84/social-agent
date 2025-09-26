import OpenAI from 'openai';
import { SYSTEM_PROMPT, makeUserPrompt } from '../config/prompts.js';
import dotenv from 'dotenv';

dotenv.config();

export class AIService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async generateBrief(input) {
    try {
      const userPrompt = makeUserPrompt(input);
      
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 4000
      });

      return {
        success: true,
        content: response.choices[0].message.content,
        usage: response.usage
      };
    } catch (error) {
      console.error('AI generation error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}
