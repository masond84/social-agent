import { WorkflowService } from './services/workflowService.js';
import minimist from 'minimist';
import dotenv from 'dotenv';

dotenv.config();

const args = minimist(process.argv.slice(2));

async function main() {
  const workflow = new WorkflowService();

  try {
    if (args.topic) {
      // Single brief generation
      console.log('🎯 Generating single brief for topic:', args.topic);
      
      const input = {
        topic: args.topic,
        pillar: args.pillar || 'Behind-the-Scenes',
        platform: args.platform ? args.platform.split(',') : ['LinkedIn', 'Threads', 'X'],
        postType: args.postType ? args.postType.split(',') : ['Article/Blog', 'Carousel'],
        priority: args.priority || 'Medium'
      };

      const result = await workflow.processSingleBrief(input);
      
      if (result.success) {
        console.log('\n✅ Brief generated successfully!');
        console.log('🔗 Notion URL:', result.notionUrl);
      } else {
        console.error('\n❌ Brief generation failed:', result.error);
        process.exit(1);
      }
    } else if (args.auto) {
      // Process pending briefs automatically
      console.log('🤖 Auto-processing pending briefs...');
      
      const result = await workflow.processPendingBriefs();
      
      if (result.success) {
        console.log(`\n✅ Processed ${result.processed} briefs successfully!`);
      } else {
        console.error('\n❌ Auto-processing failed:', result.error);
        process.exit(1);
      }
    } else {
      // Interactive mode
      console.log('🎨 Interactive Brief Generator');
      console.log('================================');
      
      const input = {
        topic: args.topic || await prompt('Enter topic: '),
        pillar: args.pillar || await prompt('Enter pillar (default: Behind-the-Scenes): ') || 'Behind-the-Scenes',
        platform: args.platform ? args.platform.split(',') : ['LinkedIn', 'Threads', 'X'],
        postType: args.postType ? args.postType.split(',') : ['Article/Blog', 'Carousel'],
        priority: args.priority || 'Medium'
      };

      const result = await workflow.processSingleBrief(input);
      
      if (result.success) {
        console.log('\n✅ Brief generated successfully!');
        console.log('🔗 Notion URL:', result.notionUrl);
      } else {
        console.error('\n❌ Brief generation failed:', result.error);
        process.exit(1);
      }
    }
  } catch (error) {
    console.error('💥 Unexpected error:', error);
    process.exit(1);
  }
}

// Simple prompt function for interactive mode
function prompt(question) {
  return new Promise((resolve) => {
    process.stdout.write(question);
    process.stdin.once('data', (data) => {
      resolve(data.toString().trim());
    });
  });
}

main();