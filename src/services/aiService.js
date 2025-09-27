import OpenAI from 'openai';
import { makeUserPrompt } from '../config/prompts.js';
import { getAgencyConfig } from '../config/agencyConfig.js';
import dotenv from 'dotenv';

dotenv.config();

export class AIService {
  constructor(agencyId = 'default') {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    this.agencyConfig = getAgencyConfig(agencyId);
  }

  async generateBrief(input, agencyId = 'default') {
    try {
      const agencyConfig = getAgencyConfig(agencyId);
      const userPrompt = makeUserPrompt(input, agencyConfig);
      
      const systemPrompt = `
You are ${agencyConfig.name}'s social media research assistant.

Agency positioning:
- ${agencyConfig.positioning}
- ${agencyConfig.tone}
- Show behind-the-scenes process, frameworks, and client examples${agencyConfig.caseStudies.length > 0 ? ` (${agencyConfig.caseStudies.join('/')} when relevant)` : ''}
- Goal: Build trust, educate, and attract leads

Output rules:
- Write clean, Notion-friendly markdown with H3/H4 headers.
- Avoid raw URLs except when asked for placeholders; prefer plain text titles.
- Be concise but complete; no fluff.

When given {topic, pillar, platform, postType}, produce:

### 1. Topic Definition
- Unique angle for ${agencyConfig.name}
- Target audience & tone of voice

### 2. Research Brief
- Weekly top similar post trends (summary)
- 1–2 similar top-shared examples (titles + why they worked)
- Top 3 competing ranking posts (titles only)
- Top 3 SEO keywords (+ 2 variants)
- 3 questions this content must answer
- Related general topics
- Insights from Wikipedia / Quora / Reddit (summarize common advice & pitfalls)

### 3. Platform Drafts
- LinkedIn post (authority/educational)
- Twitter/X thread (6–8 tweets, step format)
- Threads/IG carousel (slide-by-slide outline)

### 4. Publishing Plan
- Best platform(s) & ideal word counts
- Suggested posting days/times

### 5. Refinement Notes
- How to track engagement
- Repurposing ideas (blog, email, video)

End with a short **CTA** that fits ${agencyConfig.name}.
      `;
      
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
