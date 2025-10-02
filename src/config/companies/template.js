export const TEMPLATE_CONFIG = {
  id: 'template',
  name: 'Generic Company Template',
  
  branding: {
    companyName: 'Your Company Name',
    tagline: 'Your company tagline',
    positioning: [
      'Your unique value proposition',
      'Your expertise areas',
      'Your approach or methodology'
    ],
    goals: 'Your content goals (build trust, generate leads, etc.)',
    examples: [], // Add your portfolio/client examples
    tone: 'professional' // Options: professional, casual, educational, authoritative
  },
  
  content: {
    defaultPillar: 'Educational',
    defaultPlatforms: ['LinkedIn', 'Twitter', 'Instagram'],
    defaultPostTypes: ['Article/Blog', 'Carousel'],
    defaultPriority: 'Medium'
  },
  
  prompts: {
    systemPrompt: `You are a social media research assistant.

Output rules:
- Write clean, Notion-friendly markdown with H3/H4 headers.
- Avoid raw URLs except when asked for placeholders; prefer plain text titles.
- Be concise but complete; no fluff.

When given {topic, pillar, platform, postType}, produce:

### 1. Topic Definition
- Unique angle for the brand
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
- LinkedIn post (professional)
- Twitter/X thread (6–8 tweets, step format)
- Threads/IG carousel (slide-by-slide outline)

### 4. Publishing Plan
- Best platform(s) & ideal word counts
- Suggested posting days/times

### 5. Refinement Notes
- How to track engagement
- Repurposing ideas (blog, email, video)

End with a short **CTA** that fits the brand.`,
    
    userPromptTemplate: ({ topic, pillar, platform, postType }) => `
Topic: ${topic}
Primary Pillar: ${pillar}
Primary Platforms: ${Array.isArray(platform) ? platform.join(", ") : platform}
Post Type: ${Array.isArray(postType) ? postType.join(", ") : postType}

IMPORTANT:
- Keep drafts ready to copy/paste.
- Use brand voice consistently.`
  }
};

