import express from 'express';
import { WorkflowService } from '../src/services/workflowService.js';
import { listCompanies, getCompanyConfig } from '../src/config/companies/index.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

export class NotionWebhook {
  constructor() {
    this.workflow = new WorkflowService();
  }

  setupRoutes() {
    // GPT Actions endpoint for generating briefs
    app.post('/api/gpt/generate-brief', async (req, res) => {
      try {
        console.log('🤖 GPT Action: Generate Brief Request');
        console.log('📝 Request body:', req.body);
        
        const { topic, pillar, platform, postType, priority, companyId } = req.body;
        
        // Validate required fields
        if (!topic) {
          return res.status(400).json({
            success: false,
            error: 'Topic is required'
          });
        }
        
        // Use companyId from request or default to 'deftpoint'
        const finalCompanyId = companyId || 'deftpoint';
        
        // Validate companyId exists
        const companyConfig = getCompanyConfig(finalCompanyId);
        console.log(`🏢 Using company config: ${companyConfig.name} (${finalCompanyId})`);
        
        // Use company defaults if not provided
        const input = {
          topic,
          pillar: pillar || companyConfig.content.defaultPillar,
          platform: Array.isArray(platform) ? platform : (platform ? platform.split(',') : companyConfig.content.defaultPlatforms),
          postType: Array.isArray(postType) ? postType : (postType ? postType.split(',') : companyConfig.content.defaultPostTypes),
          priority: priority || companyConfig.content.defaultPriority
        };
        
        console.log(' Processing brief for:', input.topic);
        
        const result = await this.workflow.processSingleBrief(input, finalCompanyId);
        
        if (result.success) {
          console.log('✅ GPT Action: Brief generated successfully');
          res.json({
            success: true,
            notionUrl: result.notionUrl,
            pageId: result.pageId,
            companyId: finalCompanyId,
            message: `Brief for "${topic}" has been generated and added to Notion. You can view it here: ${result.notionUrl}`
          });
        } else {
          console.error('❌ GPT Action: Brief generation failed:', result.error);
          res.status(500).json({
            success: false,
            error: result.error
          });
        }
      } catch (error) {
        console.error('💥 GPT Action error:', error);
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // GPT Actions endpoint for listing recent briefs
    app.get('/api/gpt/recent-briefs', async (req, res) => {
      try {
        console.log('🤖 GPT Action: List Recent Briefs Request');
        
        res.json({
          success: true,
          message: 'Recent briefs functionality coming soon',
          briefs: []
        });
      } catch (error) {
        console.error('💥 GPT Action error:', error);
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // New endpoint: List available companies
    app.get('/api/gpt/companies', async (req, res) => {
      try {
        console.log('🤖 GPT Action: List Companies Request');
        
        const companies = listCompanies();
        const configs = companies.map(id => {
          const config = getCompanyConfig(id);
          return {
            id: config.id,
            name: config.name,
            branding: {
              companyName: config.branding.companyName,
              tagline: config.branding.tagline,
              tone: config.branding.tone
            },
            defaults: config.content
          };
        });
        
        res.json({
          success: true,
          companies: configs,
          message: `Found ${companies.length} available company configurations`
        });
      } catch (error) {
        console.error('💥 GPT Action error:', error);
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Health check endpoint
    app.get('/health', (req, res) => {
      res.status(200).json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        version: '2.0.0-multi-tenant',
        endpoints: {
          generateBrief: '/api/gpt/generate-brief',
          recentBriefs: '/api/gpt/recent-briefs',
          companies: '/api/gpt/companies'
        },
        features: {
          multiTenant: true,
          defaultCompany: 'deftpoint'
        }
      });
    });

    return app;
  }
}

// Vercel serverless function handler
export default async function handler(req, res) {
  const webhook = new NotionWebhook();
  const app = webhook.setupRoutes();
  
  // Handle the request
  app(req, res);
}
