// project-nvidia/index.js - Nebius x NVIDIA AI Ingestion Loop
import { processMatrix } from '../core-engine/engine.js';

export default {
  async fetch(request, env, ctx) {
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: "METHOD_NOT_ALLOWED" }), { status: 405 });
    }
    try {
      const body = await request.json();
      
      // 1. Validate the stream payload via our Agnostic Core Engine
      const validatedPayload = processMatrix(body);

      // 2. Format request payload explicitly matching NVIDIA open-model orchestration layers
      const nvidiaMatrixRequest = {
        model: "nvidia/llama-3.1-nemotron-70b-instruct",
        messages: [
          { role: "system", content: "Execute zero-retention core preference routing evaluations." },
          { role: "user", content: `Evaluate target: ${validatedPayload.route}` }
        ],
        temperature: 0.1
      };

      // 3. Forward the sanitized stream directly to the Nebius Distributed Compute Cloud
      const nebiusComputeResponse = await fetch("https://nebius.ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${env.NEBIUS_API_KEY}` // Protected background token binding
        },
        body: JSON.stringify(nvidiaMatrixRequest)
      });

      const completionResult = await nebiusComputeResponse.json();

      return new Response(JSON.stringify({
        provider: "NEBIUS_NVIDIA_EDGE",
        state: "COMPUTE_SUCCESS",
        analysis: completionResult
      }), { status: 200, headers: { "Content-Type": "application/json" } });

    } catch (e) {
      return new Response(JSON.stringify({ error: "NVIDIA_COMPUTE_FAULT", details: e.message }), { status: 500 });
    }
  }
};
