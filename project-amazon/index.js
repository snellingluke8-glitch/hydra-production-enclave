// project-amazon/index.js - Amazon Model Context Protocol (MCP) Server Gate
import { processMatrix } from '../core-engine/engine.js';

export default {
  async fetch(request, env, ctx) {
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: "METHOD_NOT_ALLOWED" }), { status: 405 });
    }
    try {
      const body = await request.json();
      const result = processMatrix(body);
      return new Response(JSON.stringify({
        protocol: "AMAZON_MCP_SECURE",
        payload: result
      }), { status: 200, headers: { "Content-Type": "application/json" } });
    } catch (e) {
      return new Response(JSON.stringify({ error: "MCP_EXECUTION_FAULT" }), { status: 500 });
    }
  }
};
