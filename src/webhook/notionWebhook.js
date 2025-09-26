import express from 'express';
import { WorkflowService } from '../services/workflowService.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

export class NotionWebhook {
  constructor() {
    this.workflow = new WorkflowService();
  }

  setupRoutes() {
    // Notion webhook endpoint
    app.post('/webhook/notion', async (req, res) => {
      try {
        console.log('📥 Received Notion webhook');
        
        // Process the webhook payload
        const { type, page_id, database_id } = req.body;
        
        if (type === 'page.created' || type === 'page.updated') {
          console.log(`🔄 Processing ${type} for page: ${page_id}`);
          
          // Add a small delay to ensure Notion has processed the update
          setTimeout(async () => {
            try {
              const result = await this.workflow.processPendingBriefs();
              
              if (result.success) {
                console.log(`✅ Webhook processed ${result.processed} briefs`);
              } else {
                console.error('❌ Webhook processing failed:', result.error);
              }
            } catch (error) {
              console.error('💥 Webhook processing error:', error);
            }
          }, 2000);
        }
        
        res.status(200).send('OK');
      } catch (error) {
        console.error('�� Webhook error:', error);
        res.status(500).send('Error processing webhook');
      }
    });

    // Health check endpoint
    app.get('/health', (req, res) => {
      res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
    });

    return app;
  }

  start(port = 3000) {
    const app = this.setupRoutes();
    
    app.listen(port, () => {
      console.log(`🚀 Notion webhook server running on port ${port}`);
      console.log(`📡 Webhook URL: http://localhost:${port}/webhook/notion`);
      console.log(`💚 Health check: http://localhost:${port}/health`);
    });
  }
}

// Start webhook server if running as main module
if (import.meta.url === `file://${process.argv[1]}`) {
  const webhook = new NotionWebhook();
  webhook.start();
}
```

```

