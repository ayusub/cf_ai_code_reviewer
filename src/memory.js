export class CodeReviewMemory {
  constructor(state, env) {
    this.state = state;
    this.history = [];
  }

  async fetch(request) {
    const url = new URL(request.url);

    // Initialize history from storage
    if (this.history.length === 0) {
      const stored = await this.state.storage.get('history');
      this.history = stored || [];
    }

    // Get history
    if (url.pathname === '/history') {
      return new Response(JSON.stringify(this.history), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Store new review
    if (url.pathname === '/store' && request.method === 'POST') {
      const review = await request.json();
      
      // Add to history
      this.history.push(review);
      
      // Keep only last 50 reviews
      if (this.history.length > 50) {
        this.history = this.history.slice(-50);
      }
      
      // Persist to storage
      await this.state.storage.put('history', this.history);
      
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response('Not Found', { status: 404 });
  }
}
