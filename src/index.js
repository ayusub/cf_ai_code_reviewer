export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Serve frontend
    if (url.pathname === '/' || url.pathname === '/index.html') {
      return new Response(HTML, {
        headers: { 'Content-Type': 'text/html' },
      });
    }

    // API endpoint for code review
    if (url.pathname === '/api/review' && request.method === 'POST') {
      try {
        const { code, language, userId } = await request.json();

        if (!code) {
          return new Response(JSON.stringify({ error: 'Code is required' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        // Get or create Durable Object for this user
        const id = env.CODE_REVIEW_MEMORY.idFromName(userId || 'default');
        const stub = env.CODE_REVIEW_MEMORY.get(id);

        // Get past review patterns
        const history = await stub.fetch('http://internal/history').then(r => r.json());

        // Build prompt with context
        const prompt = buildReviewPrompt(code, language, history);

        // Call Workers AI
        const aiResponse = await env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
          messages: [
            { role: 'system', content: 'You are an expert code reviewer. Provide constructive, specific feedback on code quality, potential bugs, performance issues, and best practices.' },
            { role: 'user', content: prompt }
          ],
          max_tokens: 1024,
        });

        const review = aiResponse.response;

        // Store this review in memory
        await stub.fetch('http://internal/store', {
          method: 'POST',
          body: JSON.stringify({ code, language, review, timestamp: Date.now() }),
        });

        return new Response(JSON.stringify({ review, history: history.length }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // Get review history
    if (url.pathname === '/api/history' && request.method === 'GET') {
      const userId = url.searchParams.get('userId') || 'default';
      const id = env.CODE_REVIEW_MEMORY.idFromName(userId);
      const stub = env.CODE_REVIEW_MEMORY.get(id);
      
      const history = await stub.fetch('http://internal/history').then(r => r.json());
      
      return new Response(JSON.stringify(history), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response('Not Found', { status: 404 });
  },
};

function buildReviewPrompt(code, language, history) {
  let prompt = `Review this ${language || 'code'} snippet:\n\n\`\`\`${language || ''}\n${code}\n\`\`\`\n\n`;
  
  if (history.length > 0) {
    const recentPatterns = history.slice(-3).map(h => h.review.substring(0, 100));
    prompt += `\nBased on past reviews, focus on patterns you've identified before: ${recentPatterns.join('; ')}\n\n`;
  }
  
  prompt += 'Provide:\n1. Overall assessment\n2. Specific issues or bugs\n3. Suggestions for improvement\n4. Security concerns (if any)\n5. Performance considerations';
  
  return prompt;
}

// Embedded HTML frontend
const HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI Code Reviewer</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 20px;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      overflow: hidden;
    }
    header {
      background: #1a1a2e;
      color: white;
      padding: 30px;
      text-align: center;
    }
    h1 { font-size: 2em; margin-bottom: 10px; }
    .subtitle { opacity: 0.8; }
    .main-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      padding: 30px;
    }
    .panel {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 20px;
    }
    .panel h2 {
      color: #1a1a2e;
      margin-bottom: 15px;
      font-size: 1.3em;
    }
    textarea {
      width: 100%;
      min-height: 300px;
      padding: 15px;
      border: 2px solid #e0e0e0;
      border-radius: 6px;
      font-family: 'Courier New', monospace;
      font-size: 14px;
      resize: vertical;
    }
    textarea:focus {
      outline: none;
      border-color: #667eea;
    }
    select {
      width: 100%;
      padding: 10px;
      margin: 10px 0;
      border: 2px solid #e0e0e0;
      border-radius: 6px;
      font-size: 14px;
    }
    button {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 12px 30px;
      border-radius: 6px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      width: 100%;
      margin-top: 10px;
      transition: transform 0.2s;
    }
    button:hover {
      transform: translateY(-2px);
    }
    button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .review-output {
      background: white;
      padding: 20px;
      border-radius: 6px;
      min-height: 300px;
      white-space: pre-wrap;
      font-size: 14px;
      line-height: 1.6;
      border: 2px solid #e0e0e0;
    }
    .loading {
      text-align: center;
      color: #667eea;
      font-style: italic;
    }
    .stats {
      background: #e8f4f8;
      padding: 10px;
      border-radius: 6px;
      margin-bottom: 15px;
      font-size: 14px;
      color: #555;
    }
    .history {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 2px solid #e0e0e0;
    }
    .history-item {
      background: white;
      padding: 10px;
      margin: 10px 0;
      border-radius: 4px;
      border-left: 4px solid #667eea;
      font-size: 12px;
    }
    @media (max-width: 768px) {
      .main-content {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>AI Code Reviewer</h1>
      <p class="subtitle">Powered by Cloudflare Workers AI • Remembers Your Patterns</p>
    </header>
    
    <div class="main-content">
      <div class="panel">
        <h2>Code Input</h2>
        <div class="stats">
          <span id="reviewCount">Reviews completed: 0</span>
        </div>
        <select id="language">
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="go">Go</option>
          <option value="rust">Rust</option>
          <option value="cpp">C++</option>
          <option value="typescript">TypeScript</option>
          <option value="">Other</option>
        </select>
        <textarea id="codeInput" placeholder="Paste your code here..."></textarea>
        <button id="reviewBtn" onclick="reviewCode()">Analyze Code</button>
        <button onclick="loadHistory()" style="background: #6c757d; margin-top: 5px;">View History</button>
      </div>
      
      <div class="panel">
        <h2>Review Results</h2>
        <div id="reviewOutput" class="review-output">
          Your AI-powered code review will appear here...
        </div>
      </div>
    </div>
  </div>

  <script>
    let userId = localStorage.getItem('userId') || 'user_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('userId', userId);
    let reviewCount = 0;

    async function reviewCode() {
      const code = document.getElementById('codeInput').value.trim();
      const language = document.getElementById('language').value;
      const output = document.getElementById('reviewOutput');
      const btn = document.getElementById('reviewBtn');

      if (!code) {
        output.textContent = 'Please enter some code to review.';
        return;
      }

      btn.disabled = true;
      output.innerHTML = '<div class="loading">Analyzing your code...</div>';

      try {
        const response = await fetch('/api/review', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, language, userId })
        });

        const data = await response.json();

        if (data.error) {
          output.textContent = 'Error: ' + data.error;
        } else {
          output.textContent = data.review;
          reviewCount = data.history + 1;
          document.getElementById('reviewCount').textContent = 'Reviews completed: ' + reviewCount;
        }
      } catch (error) {
        output.textContent = 'Error: ' + error.message;
      } finally {
        btn.disabled = false;
      }
    }

    async function loadHistory() {
      const output = document.getElementById('reviewOutput');
      output.innerHTML = '<div class="loading">📚 Loading review history...</div>';

      try {
        const response = await fetch('/api/history?userId=' + userId);
        const history = await response.json();

        if (history.length === 0) {
          output.innerHTML = '<div>No review history yet. Submit your first code review!</div>';
          return;
        }

        let html = '<div class="history"><h3>Recent Reviews (' + history.length + ')</h3>';
        history.slice(-5).reverse().forEach((item, i) => {
          const date = new Date(item.timestamp).toLocaleString();
          html += '<div class="history-item"><strong>' + (item.language || 'Code') + '</strong> - ' + date + '<br>' +
                  item.review.substring(0, 150) + '...</div>';
        });
        html += '</div>';
        output.innerHTML = html;
      } catch (error) {
        output.textContent = 'Error loading history: ' + error.message;
      }
    }

    // Allow Enter to submit (Ctrl+Enter)
    document.getElementById('codeInput').addEventListener('keydown', function(e) {
      if (e.ctrlKey && e.key === 'Enter') {
        reviewCode();
      }
    });
  </script>
</body>
</html>
`;

// Export Durable Object
export { CodeReviewMemory } from './memory.js';