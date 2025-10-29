# AI Prompts Used

This file documents the AI assistance I used while building this project.

## Getting Started

**Initial prompt:**
"I am applying to Cloudflare, which asks for an optional assignment: building an AI-powered 
application on Cloudflare, read the job description:

[Job description provided]

Provide ideas for a straightforward application that I could complete given that I have limited time: 3 days with two jobs (30hrs a week total) and 2 classes (8 hours a week)."

**Setup help:**
"What commands do I run to set up Cloudflare Workers? Walk me through installing wrangler and deploying."

## Building the Worker

**Main worker code:**
"Create a Cloudflare Worker that serves an HTML frontend and has a /api/review endpoint. It should call Workers AI (Llama 3.3) to review code and use Durable Objects to store the review history."

**Durable Objects:**
"Help me create a Durable Object that stores an array of past code reviews (max 50) and persists them to storage."

## The AI System Prompt

This is what the app sends to Llama 3.3 when reviewing code:

```
System: You are an expert code reviewer. Provide constructive, specific feedback on code quality, potential bugs, performance issues, and best practices.

User: Review this [language] snippet:
[user's code]

Based on past reviews, focus on patterns you've identified before: [recent patterns if any]

Provide:
1. Overall assessment
2. Specific issues or bugs
3. Suggestions for improvement
4. Security concerns (if any)
5. Performance considerations
```

## Frontend

**UI prompt:**
"Create a simple HTML interface with a textarea for code input, language dropdown, submit button, and output area. Make it look clean with CSS Grid and gradients."

## Config & Deployment

**wrangler.toml:**
"Generate a wrangler.toml that sets up Workers AI binding and Durable Objects with migrations."

**Debugging:**
"I'm getting [error], how do I fix it?" (used multiple times for various deployment issues)

## Documentation

**README:**
"Help me write a README that explains what this does, how to run it locally, and how to deploy it."

---