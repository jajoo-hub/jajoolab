import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

// Serve static assets and files
app.use(express.static(__dirname, { extensions: ['html'] }));

// Route handler for multi-page static site paths
app.get('*', (req, res) => {
  const cleanPath = req.path.replace(/^\/+|\/+$/g, '');
  const candidateIndex = path.join(__dirname, cleanPath, 'index.html');
  const candidateHtml = path.join(__dirname, `${cleanPath}.html`);

  if (cleanPath && fs.existsSync(candidateIndex) && fs.statSync(candidateIndex).isFile()) {
    return res.sendFile(candidateIndex);
  }

  if (cleanPath && fs.existsSync(candidateHtml) && fs.statSync(candidateHtml).isFile()) {
    return res.sendFile(candidateHtml);
  }

  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, HOST, () => {
  console.log(`JajooLab server listening on http://${HOST}:${PORT}`);
});
