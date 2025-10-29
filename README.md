# cf_ai_code_reviewer

An AI-powered code review assistant built on Cloudflare's edge computing platform. This application analyzes code snippets, provides detailed feedback, and remembers past review patterns to give increasingly contextual suggestions.

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Cloudflare account (free tier works!)

### Installation

1. **Clone the repository**
   ```bash
   git clone git@github.com:ayusub/cf_ai_code_review
   cd cf_ai_code_reviewer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Login to Cloudflare**
   ```bash
   npx wrangler login
   ```

4. **Run locally**
   ```bash
   npm run dev
   ```
   Open http://localhost:8787 in your browser

5. **Deploy to Cloudflare**
   ```bash
   npm run deploy
   ```

## 📖 Usage

### Using the Web Interface

1. Open the application in your browser
2. Select the programming language from the dropdown
3. Paste your code in the text area
4. Click "Analyze Code" to get AI-powered feedback
5. View your review history by clicking "View History"

### Example Code Review

```javascript
// Paste this code to test
function add(a, b) {
  return a + b;
}
console.log(add("5", "10"));
```

The AI will identify:
- Type coercion issues
- Missing input validation
- Suggestions for type checking
- Best practices

## 🛠️ Technical Details

### API Endpoints

- `GET /` - Serves the web interface
- `POST /api/review` - Submit code for review
  ```json
  {
    "code": "your code here",
    "language": "javascript",
    "userId": "user_abc123"
  }
  ```
- `GET /api/history?userId=user_abc123` - Retrieve review history

### Configuration

All configuration is in `wrangler.toml`:
- Workers AI binding
- Durable Object bindings
- Compatibility date

### AI Prompt Engineering

The system builds intelligent prompts that include:
- Code to review
- Programming language context
- Recent review patterns (last 3 reviews)
- Structured output format requirements

## Project Structure

```
cf_ai_code_reviewer/
├── src/
│   ├── index.js      # Main Worker with embedded frontend
│   └── memory.js     # Durable Object for review storage
├── wrangler.toml     # Cloudflare configuration
├── package.json      # Node.js dependencies
├── README.md         # This file
└── PROMPTS.md        # AI prompts used in development
```

## 👤 Author

Ayusha Subedi
- GitHub: [@ayusub](https://github.com/ayusub)
- LinkedIn: [ayusha-s](https://www.linkedin.com/in/ayusha-s/)

---

**Note**: This project was created as part of the optional assignment for Cloudflare's internship application. It demonstrates the integration of Workers AI, Durable Objects, and Workers in a practical, real-world application.
