# Deft Point Social Media Brief Generator

An automated workflow for generating comprehensive social media briefs and uploading them to Notion.

## Features

- 🤖 AI-powered content generation (OpenAI or Ollama)
- 📋 Automatic Notion database integration
- ⏰ Scheduled processing of pending briefs
-  Webhook support for real-time automation
-  Flexible input options (CLI, webhook, scheduled)

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys and Notion credentials
   ```

3. **Set up Notion database:**
   - Create a new database in Notion
   - Add the following properties:
     - Title (Title)
     - Topic (Text)
     - Pillar (Select: Behind-the-Scenes, Educational, Case Study, etc.)
     - Platforms (Multi-select: LinkedIn, Twitter, Instagram, etc.)
     - Post Type (Multi-select: Article/Blog, Carousel, Thread, etc.)
     - Status (Select: Pending, In Progress, Completed, Published)
     - Priority (Select: Low, Medium, High, Urgent)
     - Generated Content (Text)
     - Created At (Date)
     - Updated At (Date)

## Usage

### 1. Single Brief Generation
```bash
# Interactive mode
npm run gen:one

# With specific topic
npm run gen:one -- --topic "MVP Development"

# With full options
npm run gen:one -- --topic "App Development" --pillar "Behind-the-Scenes" --platform "LinkedIn,Twitter" --postType "Article,Carousel"
```

### 2. Process All Pending Briefs
```bash
npm run gen:all
```

### 3. Automated Scheduling
```bash
# Start the scheduler (checks every 30 minutes)
node src/automation/scheduler.js
```

### 4. Webhook Server
```bash
# Start webhook server for real-time automation
node src/webhook/notionWebhook.js
```

## Automation Workflows

### Option 1: Manual + Scheduled
- Add rows to Notion database manually
- Scheduler processes pending briefs every 30 minutes
- Perfect for batch processing

### Option 2: Real-time Webhook
- Set up Notion webhook to trigger on new rows
- Instant processing when new briefs are added
- Best for immediate results

### Option 3: Hybrid Approach
- Use webhook for urgent briefs
- Use scheduler for batch processing
- Maximum flexibility

## Notion Webhook Setup

1. Go to your Notion integration settings
2. Add webhook URL: `https://your-domain.com/webhook/notion`
3. Subscribe to "Page created" and "Page updated" events
4. Test with a new database entry

## Scaling Tips

- **Batch Processing**: Process multiple briefs in sequence to avoid rate limits
- **Error Handling**: Failed briefs are logged and can be retried
- **Monitoring**: Use the health check endpoint for uptime monitoring
- **Caching**: Consider caching AI responses for similar topics

## Troubleshooting

- Check API keys and Notion permissions
- Verify database property names match configuration
- Monitor console logs for detailed error messages
- Test with simple topics first
