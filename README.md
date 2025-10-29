# cf_ai_code_reviewer

An AI-powered code review assistant built on Cloudflare's edge computing platform. This application analyzes code snippets, provides detailed feedback, and remembers past review patterns to give increasingly contextual suggestions.

## 🌟 Features

- **AI-Powered Analysis**: Uses Llama 3.3 (70B) via Cloudflare Workers AI for intelligent code review
- **Pattern Memory**: Remembers your past reviews using Durable Objects to provide contextual feedback
- **Multi-Language Support**: Supports JavaScript, Python, Java, Go, Rust, C++, TypeScript, and more
- **Real-time Processing**: Instant code analysis on Cloudflare's global edge network
- **Review History**: View and track all past code reviews
- **Clean UI**: Simple, responsive interface for easy code submission

## 🏗️ Architecture

### Components

1. **Cloudflare Worker** (`src/index.js`)
   - Handles HTTP requests and routing
   - Integrates with Workers AI for LLM inference
   - Serves the frontend UI
   - Coordinates between user input and memory storage

2. **Durable Object** (`src/memory.js`)
   - Stores review history per user
   - Maintains state across requests
   - Provides persistent memory for pattern recognition
   - Automatically manages storage limits (keeps last 50 reviews)

3. **Workers AI Integration**
   - Model: `@cf/meta/llama-3.3-70b-instruct-fp8-fast`
   - Provides code analysis and suggestions
   - Processes review requests in real-time

4. **Frontend** (embedded in `src/index.js`)
   - HTML/CSS/JavaScript single-page application
   - Clean, responsive design
   - Real-time feedback display
   - History viewer

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

## 🧠 How Memory Works

The application uses Cloudflare Durable Objects to remember your review patterns:

1. Each user gets a unique ID (stored in browser localStorage)
2. Every review is saved to the user's Durable Object
3. When analyzing new code, the AI references past reviews
4. This allows for increasingly contextual and personalized feedback
5. History is capped at 50 reviews to manage storage

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

## 📦 Project Structure

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

## 🔒 Security & Privacy

- User IDs are randomly generated and stored locally
- No authentication required (suitable for internship demo)
- Code is processed on Cloudflare's edge (not stored permanently)
- Review history is isolated per user
- CORS enabled for development flexibility

## 🚀 Deployment

The app is deployed on Cloudflare Workers:

1. Runs on Cloudflare's global edge network
2. <50ms latency for 95% of internet users
3. Automatic scaling and high availability
4. No servers to manage

## 🎯 Future Enhancements

Potential improvements for v2:
- GitHub integration for PR reviews
- Team collaboration features
- Custom review templates
- Code diff analysis
- Security vulnerability scanning
- Integration with CI/CD pipelines

## 📝 License

MIT

## 👤 Author

Ayusha Subedi
- GitHub: [@ayusub](https://github.com/ayusub)
- LinkedIn: [ayusha-s](https://www.linkedin.com/in/ayusha-s/)

## 🙏 Acknowledgments

- Built for Cloudflare Software Engineering Internship Application (Winter/Spring 2026)
- Powered by Cloudflare Workers AI (Llama 3.3)
- Uses Cloudflare Durable Objects for state management

---

**Note**: This project was created as part of the optional assignment for Cloudflare's internship application. It demonstrates the integration of Workers AI, Durable Objects, and Workers in a practical, real-world application.
