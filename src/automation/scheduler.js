import cron from 'cron';
import { WorkflowService } from '../services/workflowService.js';
import dotenv from 'dotenv';

dotenv.config();

export class BriefScheduler {
  constructor() {
    this.workflow = new WorkflowService();
    this.jobs = [];
  }

  start() {
    console.log('⏰ Starting automated brief scheduler...');
    
    // Check for pending briefs every 30 minutes
    const pendingJob = new cron.CronJob('*/30 * * * *', async () => {
      console.log('\n🔄 Auto-checking for pending briefs...');
      
      try {
        const result = await this.workflow.processPendingBriefs();
        
        if (result.success && result.processed > 0) {
          console.log(`✅ Auto-processed ${result.processed} briefs`);
        } else if (result.success) {
          console.log('✅ No pending briefs to process');
        } else {
          console.error('❌ Auto-processing failed:', result.error);
        }
      } catch (error) {
        console.error('💥 Auto-processing error:', error);
      }
    });

    pendingJob.start();
    this.jobs.push(pendingJob);
    
    console.log('✅ Scheduler started - checking every 30 minutes');
  }

  stop() {
    this.jobs.forEach(job => job.stop());
    console.log('⏹️ Scheduler stopped');
  }
}

// Start scheduler if running as main module
if (import.meta.url === `file://${process.argv[1]}`) {
  const scheduler = new BriefScheduler();
  scheduler.start();
  
  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down scheduler...');
    scheduler.stop();
    process.exit(0);
  });
}
```

```

