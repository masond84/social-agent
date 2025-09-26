import { Client } from '@notionhq/client';
import { NOTION_CONFIG } from '../config/notion.js';
import dotenv from 'dotenv';

dotenv.config();

export class NotionService {
  constructor() {
    this.notion = new Client({
      auth: process.env.NOTION_TOKEN
    });
    this.databaseId = process.env.NOTION_DATABASE_ID;
  }

  async createBrief(briefData) {
    try {
      const response = await this.notion.pages.create({
        parent: { database_id: this.databaseId },
        properties: {
            [NOTION_CONFIG.PROPERTIES.title]: {
              title: [{ text: { content: briefData.topic } }]
            },
            [NOTION_CONFIG.PROPERTIES.pillar]: {
              select: { name: briefData.pillar || 'Behind-the-Scenes' }
            },
            [NOTION_CONFIG.PROPERTIES.platforms]: {
              multi_select: Array.isArray(briefData.platform) 
                ? briefData.platform.map(p => ({ name: p }))
                : [{ name: briefData.platform || 'LinkedIn' }]
            },
            [NOTION_CONFIG.PROPERTIES.postType]: {
              multi_select: Array.isArray(briefData.postType)
                ? briefData.postType.map(p => ({ name: p }))
                : [{ name: briefData.postType || 'Article/Blog' }]
            }
          },
        children: [
          {
            object: 'block',
            type: 'heading_2',
            heading_2: {
              rich_text: [{ type: 'text', text: { content: 'Generated Content Brief' } }]
            }
          },
          {
            object: 'block',
            type: 'paragraph',
            paragraph: {
              rich_text: [{ type: 'text', text: { content: 'Content will be generated and added here...' } }]
            }
          }
        ]
      });

      return {
        success: true,
        pageId: response.id,
        url: response.url
      };
    } catch (error) {
      console.error('Notion creation error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async updateBriefContent(pageId, content) {
    try {
      console.log('🔍 Updating page content for pageId:', pageId);
      
      // Split content into chunks for better formatting
      const contentLines = content.split('\n');
      const blocks = [];
      
      // Add a heading for the generated content
      blocks.push({
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{ type: 'text', text: { content: 'Generated Content Brief' } }]
        }
      });
      
      // Process each line of content
      for (const line of contentLines) {
        if (line.trim() === '') {
          // Add empty paragraph for spacing
          blocks.push({
            object: 'block',
            type: 'paragraph',
            paragraph: {
              rich_text: [{ type: 'text', text: { content: '' } }]
            }
          });
        } else if (line.startsWith('###')) {
          // Handle headings
          blocks.push({
            object: 'block',
            type: 'heading_3',
            heading_3: {
              rich_text: [{ type: 'text', text: { content: line.replace('###', '').trim() } }]
            }
          });
        } else if (line.startsWith('####')) {
          // Handle subheadings
          blocks.push({
            object: 'block',
            type: 'heading_3',
            heading_3: {
              rich_text: [{ type: 'text', text: { content: line.replace('####', '').trim() } }]
            }
          });
        } else if (line.startsWith('-') || line.startsWith('*')) {
          // Handle bullet points
          blocks.push({
            object: 'block',
            type: 'bulleted_list_item',
            bulleted_list_item: {
              rich_text: [{ type: 'text', text: { content: line.replace(/^[-*]\s*/, '').trim() } }]
            }
          });
        } else if (line.match(/^\d+\./)) {
          // Handle numbered lists
          blocks.push({
            object: 'block',
            type: 'numbered_list_item',
            numbered_list_item: {
              rich_text: [{ type: 'text', text: { content: line.replace(/^\d+\.\s*/, '').trim() } }]
            }
          });
        } else {
          // Regular paragraph
          blocks.push({
            object: 'block',
            type: 'paragraph',
            paragraph: {
              rich_text: [{ type: 'text', text: { content: line.trim() } }]
            }
          });
        }
      }
      
      // Split blocks into chunks of 100 (Notion's limit)
      const chunkSize = 100;
      const blockChunks = [];
      for (let i = 0; i < blocks.length; i += chunkSize) {
        blockChunks.push(blocks.slice(i, i + chunkSize));
      }
      
      console.log(` Splitting ${blocks.length} blocks into ${blockChunks.length} chunks`);
      
      // Add blocks in chunks
      for (let i = 0; i < blockChunks.length; i++) {
        console.log(` Adding chunk ${i + 1}/${blockChunks.length} (${blockChunks[i].length} blocks)`);
        
        await this.notion.blocks.children.append({
          block_id: pageId,
          children: blockChunks[i]
        });
        
        // Add a small delay between chunks to avoid rate limiting
        if (i < blockChunks.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
      
      // Also update the property with a summary (first 500 chars)
      const summary = content.length > 500 
        ? content.substring(0, 497) + '...' 
        : content;
      
      await this.notion.pages.update({
        page_id: pageId,
        properties: {
          [NOTION_CONFIG.PROPERTIES.generatedContent]: {
            rich_text: [{ text: { content: summary } }]
          }
        }
      });
      
      console.log('✅ Full content added to page body in chunks, summary in property');
      return { success: true };
      
    } catch (error) {
      console.error('Notion update error:', error);
      return { success: false, error: error.message };
    }
  }

  async getPendingBriefs() {
    try {
      const response = await this.notion.databases.query({
        database_id: this.databaseId,
        filter: {
          property: NOTION_CONFIG.PROPERTIES.status,
          select: {
            equals: NOTION_CONFIG.STATUS.PENDING
          }
        }
      });

      return {
        success: true,
        pages: response.results
      };
    } catch (error) {
      console.error('Notion query error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}