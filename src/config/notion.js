export const NOTION_CONFIG = {
  // Database properties mapping - updated to match your existing database
  PROPERTIES: {
    title: 'Topic/Keyword',        // Your existing column name
    topic: 'Topic/Keyword',        // Same as title for your database
    pillar: 'Pillar',             // Your existing column
    platforms: 'Platform',        // Your existing column (singular)
    postType: 'Post Type',        // Your existing column
    status: 'Status',             
    generatedContent: 'Generated Content', 
    createdAt: 'Created At',      
    updatedAt: 'Updated At',      
    priority: 'Priority'          
  },
  
  // Status options
  STATUS: {
    PENDING: 'Pending',
    IN_PROGRESS: 'In Progress',
    COMPLETED: 'Completed',
    PUBLISHED: 'Published'
  },
  
  // Priority levels
  PRIORITY: {
    LOW: 'Low',
    MEDIUM: 'Medium',
    HIGH: 'High',
    URGENT: 'Urgent'
  }
};