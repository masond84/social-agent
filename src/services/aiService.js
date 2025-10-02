import OpenAI from 'openai';
import { getSystemPrompt, makeUserPrompt } from '../config/companies/index.js';
import dotenv from 'dotenv';

dotenv.config();

export class AIService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async generateBrief(input, companyId = 'deftpoint') {
    try {
      // Get company-specific prompts
      const systemPrompt = getSystemPrompt(companyId);
      const userPrompt = makeUserPrompt(input, companyId);
      
      console.log(`🏢 Using config for: ${companyId}`);
      
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: systemPrompt },
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
