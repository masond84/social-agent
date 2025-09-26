import { WorkflowService } from './services/workflowService.js';
import dotenv from 'dotenv';

dotenv.config();

async function testWorkflow() {
  console.log('🧪 Testing workflow components...');
  
  const workflow = new WorkflowService();
  
  // Test with a simple topic
  const testInput = {
    topic: 'Make Money With ChatGPT',
    pillar: 'Proof & Projects',
    platform: ['Lemon8', 'Threads', 'X/Twitter'],
    postType: ['Carousel'],
    priority: 'Medium'
  };
  
  console.log('📝 Test input:', testInput);
  
  try {
    const result = await workflow.processSingleBrief(testInput);
    
    if (result.success) {
      console.log('✅ Test passed!');
      console.log('🔗 Notion URL:', result.notionUrl);
    } else {
      console.error('❌ Test failed:', result.error);
    }
  } catch (error) {
    console.error('💥 Test error:', error);
  }
}

testWorkflow();
