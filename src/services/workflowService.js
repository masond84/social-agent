import { AIService } from './aiService.js';
import { NotionService } from './notionService.js';

export class WorkflowService {
  constructor() {
    this.aiService = new AIService();
    this.notionService = new NotionService();
  }

  async processSingleBrief(input) {
    console.log('🚀 Starting brief generation for:', input.topic);
    
    // Step 1: Create Notion page
    console.log('📝 Creating Notion page...');
    const notionResult = await this.notionService.createBrief(input);
    
    if (!notionResult.success) {
      console.error('❌ Failed to create Notion page:', notionResult.error);
      return { success: false, error: notionResult.error };
    }

    console.log('✅ Notion page created:', notionResult.url);
    console.log(' Notion result object:', JSON.stringify(notionResult, null, 2));

    // Step 2: Generate AI content
    console.log('🤖 Generating AI content...');
    const aiResult = await this.aiService.generateBrief(input);

    if (!aiResult.success) {
      console.error('❌ AI generation failed:', aiResult.error);
      return { success: false, error: aiResult.error };
    }

    console.log('✅ AI content generated');

    // Step 3: Update Notion with generated content
    console.log('📄 Updating Notion page with content...');
    console.log('🔍 PageId being passed:', notionResult.pageId);
    
    // Pass the pageId directly as a string
    const updateResult = await this.notionService.updateBriefContent(
      String(notionResult.pageId), 
      aiResult.content
    );

    if (!updateResult.success) {
      console.error('❌ Failed to update Notion page:', updateResult.error);
      return { success: false, error: updateResult.error };
    }

    console.log('🎉 Brief generation completed successfully!');
    console.log(' Notion URL:', notionResult.url);

    return {
      success: true,
      notionUrl: notionResult.url,
      pageId: notionResult.pageId,
      content: aiResult.content,
      usage: aiResult.usage
    };
  }

  async processPendingBriefs() {
    console.log('🔍 Checking for pending briefs...');
    
    const pendingResult = await this.notionService.getPendingBriefs();
    
    if (!pendingResult.success) {
      console.error('❌ Failed to fetch pending briefs:', pendingResult.error);
      return { success: false, error: pendingResult.error };
    }

    if (pendingResult.pages.length === 0) {
      console.log('✅ No pending briefs found');
      return { success: true, processed: 0 };
    }

    console.log(`📋 Found ${pendingResult.pages.length} pending briefs`);

    const results = [];
    for (const page of pendingResult.pages) {
      console.log(`\n Processing page: ${page.id}`);
      
      // Extract input data from Notion page properties
      const input = this.extractInputFromNotionPage(page);
      
      const result = await this.processSingleBrief(input);
      results.push({
        pageId: page.id,
        ...result
      });
    }

    return {
      success: true,
      processed: results.length,
      results
    };
  }

  extractInputFromNotionPage(page) {
    const properties = page.properties;
    
    return {
      topic: properties['Topic/Keyword']?.rich_text?.[0]?.text?.content || 'Unknown Topic',
      pillar: properties.Pillar?.select?.name || 'Behind-the-Scenes',
      platform: properties.Platform?.multi_select?.map(p => p.name) || ['LinkedIn'],
      postType: properties['Post Type']?.multi_select?.map(p => p.name) || ['Article/Blog'],
      priority: properties.Priority?.select?.name || 'Medium'
    };
  }
}         