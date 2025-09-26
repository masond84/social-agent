export default function handler(req, res) {
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Privacy Policy - Deft Point Brief Generator</title>
    </head>
    <body>
        <h1>Privacy Policy</h1>
        <p>This service generates content briefs and stores them in Notion. We do not store personal data beyond what is necessary for the service to function.</p>
        <p>Generated content is stored in your Notion workspace and is subject to Notion's privacy policy.</p>
        <p>Last updated: ${new Date().toISOString().split('T')[0]}</p>
    </body>
    </html>
  `);
}
