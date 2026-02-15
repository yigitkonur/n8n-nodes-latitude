<h1 align="center">🚀 n8n-nodes-latitude 🚀</h1>
<h3 align="center">Stop hardcoding AI prompts. Start shipping smarter workflows.</h3>

<p align="center">
  <strong>
    <em>The ultimate n8n integration for Latitude.so — the AI prompt management platform. Execute prompts, continue conversations, and log everything with zero JSON wrestling.</em>
  </strong>
</p>

<p align="center">
  <!-- Package Info -->
  <a href="https://www.npmjs.com/package/n8n-nodes-latitude"><img alt="npm" src="https://img.shields.io/npm/v/n8n-nodes-latitude.svg?style=flat-square&color=4D87E6"></a>
  <a href="#"><img alt="node" src="https://img.shields.io/badge/node-18+-4D87E6.svg?style=flat-square"></a>
  &nbsp;&nbsp;•&nbsp;&nbsp;
  <!-- Features -->
  <a href="https://opensource.org/licenses/MIT"><img alt="license" src="https://img.shields.io/badge/License-MIT-F9A825.svg?style=flat-square"></a>
  <a href="https://n8n.io"><img alt="n8n" src="https://img.shields.io/badge/n8n-community%20node-ff6d5a.svg?style=flat-square"></a>
</p>

<p align="center">
  <img alt="zero config" src="https://img.shields.io/badge/⚙️_zero_config-works_out_of_the_box-2ED573.svg?style=for-the-badge">
  <img alt="ai agent ready" src="https://img.shields.io/badge/🤖_ai_agent_ready-use_as_tool-2ED573.svg?style=for-the-badge">
</p>

<div align="center">

### 🧭 Quick Navigation

[**⚡ Get Started**](#-get-started-in-60-seconds) •
[**✨ Key Features**](#-feature-breakdown-the-secret-sauce) •
[**🎮 Operations**](#-operations-reference) •
[**⚙️ Configuration**](#️-credentials-setup) •
[**🆚 Why This Slaps**](#-why-this-slaps-hardcoded-prompts)

</div>

---

**n8n-nodes-latitude** is the prompt manager your n8n workflows wish they had. Stop embedding AI prompts directly in your automation and praying they still work next week. This node connects directly to [Latitude.so](https://latitude.so), letting you manage prompts centrally, hot-reload changes, and execute with auto-detected parameters — all without touching your workflow.

<div align="center">
<table>
<tr>
<td align="center">
<h3>🎯</h3>
<b>Dynamic Parameters</b><br/>
<sub>Auto-detects {{ variables }}</sub>
</td>
<td align="center">
<h3>💬</h3>
<b>Conversation Memory</b><br/>
<sub>Continue multi-turn chats</sub>
</td>
<td align="center">
<h3>🤖</h3>
<b>AI Agent Ready</b><br/>
<sub>Use as tool in AI workflows</sub>
</td>
<td align="center">
<h3>📊</h3>
<b>Full Observability</b><br/>
<sub>Logs, costs, token tracking</sub>
</td>
</tr>
</table>
</div>

How it slaps:
- **You:** Drag Latitude node into n8n workflow
- **Node:** Fetches prompts, shows parameters, handles auth
- **You:** Map your data → Execute
- **Latitude:** Returns response with usage stats, costs, and conversation UUID
- **Result:** Ship production AI features. Zero prompt maintenance headaches.

---

## 💥 Why This Slaps Hardcoded Prompts

Embedding prompts in workflows is a vibe-killer. `n8n-nodes-latitude` makes hardcoding look ancient.

<table align="center">
<tr>
<td align="center"><b>❌ The Old Way (Pain)</b></td>
<td align="center"><b>✅ The Latitude Way (Glory)</b></td>
</tr>
<tr>
<td>
<ol>
  <li>Hardcode prompt in n8n HTTP node.</li>
  <li>Manually build JSON payload.</li>
  <li>Change prompt → Redeploy workflow.</li>
  <li>No version history. No rollback.</li>
  <li>Debug blind with no observability.</li>
</ol>
</td>
<td>
<ol>
  <li>Select prompt from dropdown.</li>
  <li>Parameters auto-populate.</li>
  <li>Change prompt in Latitude → Live instantly.</li>
  <li>Version control + cost tracking.</li>
  <li>Full conversation logs in dashboard. ☕</li>
</ol>
</td>
</tr>
</table>

We're not just calling an API. We're giving you **centralized prompt management** with dynamic parameter extraction, conversation continuity, and automatic SDK integration that handles all the complexity.

---

## 🚀 Get Started in 60 Seconds

### Community Nodes (Recommended)

The fastest way to get started. No terminal required.

1. Go to **Settings** → **Community Nodes**
2. Click **Install**
3. Enter `n8n-nodes-latitude`
4. Confirm installation

That's it. The node appears in your node palette.

### Manual Installation

For self-hosted n8n or custom setups:

```bash
# Navigate to your n8n installation
cd ~/.n8n/nodes

# Install the package
pnpm add n8n-nodes-latitude

# Restart n8n
```

> **✨ Zero Config:** After installation, add your Latitude credentials and start building. The node handles SDK initialization, auth, and API versioning automatically.

---

## ✨ Feature Breakdown: The Secret Sauce

<div align="center">

| Feature | What It Does | Why You Care |
| :---: | :--- | :--- |
| **🎯 Auto Parameter Detection**<br/>No JSON wrestling | Extracts `{{ variables }}` from prompt content automatically | Select prompt → Parameters appear. Done. |
| **💬 Conversation Continuity**<br/>Multi-turn chats | Continue conversations using UUID from previous runs | Build chatbots and agents with memory |
| **🤖 AI Agent Support**<br/>`usableAsTool: true` | Works as a tool in n8n AI workflows | Plug into AI Agent node directly |
| **📊 Token & Cost Tracking**<br/>Full observability | Returns `usage`, `cost`, and `toolCalls` from each run | Know exactly what you're spending |
| **🏠 Self-Hosted Support**<br/>Custom gateway URL | Point to your own Latitude instance | Enterprise-ready, air-gapped deployments |
| **📝 External Logging**<br/>Create log entries | Log conversations from external AI calls to Latitude | Unified analytics across all AI touchpoints |
| **⚡ Hot Reload**<br/>No redeploy needed | Change prompts in Latitude, live instantly in n8n | Iterate on prompts without workflow changes |
| **🔒 Secure by Default**<br/>Credentials encrypted | API keys never exposed, errors sanitized | Production-ready security |

</div>

---

## 🎮 Operations Reference

<div align="center">
<table>
<tr>
<td align="center">
<h3>▶️</h3>
<b><code>Run Prompt</code></b><br/>
<sub>Execute AI prompts</sub>
</td>
<td align="center">
<h3>💬</h3>
<b><code>Chat</code></b><br/>
<sub>Continue conversations</sub>
</td>
<td align="center">
<h3>📝</h3>
<b><code>Create Log</code></b><br/>
<sub>Log external AI calls</sub>
</td>
</tr>
</table>
</div>

### `Run Prompt` ▶️

Execute an AI prompt from your Latitude project with automatic parameter detection.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `Prompt Path` | Dropdown | Yes | Select from your Latitude prompts — shows required parameters |
| `Parameters` | Key-Value | No | Map values to `{{ variables }}`. Supports n8n expressions |
| `Simplify Output` | Boolean | No | Return clean data or full conversation history |
| `Custom Identifier` | String | No | Tag runs for filtering in Latitude dashboard |
| `Version UUID` | String | No | Use specific version instead of live |

**Example Configuration:**
```javascript
Prompt Path: "marketing/personalized-email"
Parameters:
  - customer_name: {{ $json.name }}
  - product: {{ $json.product }}
  - tone: "professional"
```

**Simplified Output:**
```json
{
  "uuid": "conv_abc123-def456",
  "text": "Dear John, thank you for your interest in...",
  "usage": {
    "promptTokens": 150,
    "completionTokens": 200,
    "totalTokens": 350
  },
  "cost": 0.0035
}
```

---

### `Chat` 💬

Continue a conversation using the UUID from a previous prompt run.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `Conversation UUID` | String | Yes | UUID from a previous `Run Prompt` response |
| `Messages` | Collection | Yes | New messages to add to the conversation |
| `Simplify Output` | Boolean | No | Return clean data or full conversation history |

**Example — Building a Chatbot:**
```javascript
// First node: Run Prompt (initial)
// Returns: { uuid: "conv_abc123", text: "How can I help?" }

// Second node: Chat (continue)
Conversation UUID: {{ $('Latitude').item.json.uuid }}
Messages:
  - Role: user
    Content: "What's the weather like?"
```

---

### `Create Log` 📝

Log conversations from external AI calls (OpenAI, Anthropic, etc.) to your Latitude project for unified analytics.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `Prompt Path` | Dropdown | Yes | The prompt to associate this log with |
| `Messages` | Collection | Yes | The conversation messages to log |
| `Response` | String | No | The AI-generated response text |

**Use Case:** You're calling OpenAI directly but want all your AI usage visible in Latitude's dashboard:
```javascript
Prompt Path: "support/ticket-classifier"
Messages:
  - Role: user
    Content: {{ $json.ticket_body }}
Response: {{ $json.openai_response }}
```

---

## ⚙️ Credentials Setup

You need a Latitude.so account with API access.

<div align="center">

| Field | Description | Where to Find |
|:-----:|:------------|:--------------|
| **API Key** | Your Latitude API key | Dashboard → Settings → API Keys (format: `lat_...`) |
| **Project ID** | Numeric project identifier | Dashboard → Project Settings or URL |
| **Gateway URL** | *Optional* — Custom gateway for self-hosted | Your instance URL (e.g., `https://latitude.yourcompany.com`) |

</div>

### Setting Up Credentials

1. Go to **Credentials** in n8n
2. Click **New Credential**
3. Search for **Latitude API**
4. Fill in your API Key and Project ID
5. *(Optional)* Add Gateway URL for self-hosted instances
6. Click **Save** — Credentials are automatically validated

> **🔒 Security Note:** Your API key is encrypted at rest and never exposed in logs or error messages.

---

## 🔥 Workflow Examples

### Basic: Webhook → AI Response

```
Webhook → Latitude (Run Prompt) → Respond to Webhook
```

Perfect for: Slack bots, API endpoints, form processing.

### Advanced: Multi-Turn Chatbot

```
Webhook → Latitude (Run) → Set UUID → Loop → Latitude (Chat) → Respond
```

Perfect for: Customer support bots, interactive assistants.

### Hybrid: External AI + Latitude Logging

```
Webhook → OpenAI → Latitude (Create Log) → Respond
```

Perfect for: Using other providers but want Latitude's analytics.

### AI Agent Integration

```
AI Agent → Latitude Tool → Agent Output
```

Perfect for: ReAct agents, function calling, tool use.

---

## 🔧 Compatibility

<div align="center">

| Requirement | Version |
|:-----------:|:-------:|
| **n8n** | 1.0.0+ |
| **Node.js** | 18.0.0+ |
| **Latitude SDK** | 5.2.2+ |

</div>

---

## 🔥 Common Issues & Quick Fixes

<details>
<summary><b>Expand for troubleshooting tips</b></summary>

| Problem | Solution |
| :--- | :--- |
| **Authentication failed** | Verify API key format (`lat_...`) and Project ID in Latitude dashboard. Keys are project-specific. |
| **Prompt not found** | Refresh the dropdown. Verify the prompt exists and is published (not draft). |
| **Parameters not loading** | Check credentials are valid. Run credential test. Ensure prompt has `{{ variables }}`. |
| **Empty response** | Prompt might be in draft mode. Check Latitude dashboard for prompt status. |
| **Chat fails** | Verify `conversationUuid` is from a recent run. UUIDs may expire based on project settings. |
| **Self-hosted connection issues** | Ensure Gateway URL includes protocol (`https://`). Check firewall rules. |
| **Rate limiting** | Latitude has usage limits. Check your plan in the dashboard. |

</details>

---

## 🛠️ Development

Want to contribute or customize?

```bash
# Clone the repo
git clone https://github.com/yigitkonur/n8n-nodes-latitude.git
cd n8n-nodes-latitude

# Install dependencies
pnpm install
# Development mode (watch for changes)
pnpm dev

# Build for production
pnpm build

# Lint and format
pnpm lint:fix
pnpm format
```

### Project Structure

```
├── credentials/          # Latitude API credential definition
├── nodes/Latitude/
│   ├── actions/          # Operation implementations
│   │   ├── runPrompt.operation.ts
│   │   ├── chat.operation.ts
│   │   └── createLog.operation.ts
│   ├── methods/          # Dynamic dropdown loaders
│   ├── shared/           # Types, utils, transport
│   └── Latitude.node.ts  # Main node definition
└── icons/                # Light/dark mode icons
```

---

## 📚 Resources

- **[Latitude Documentation](https://docs.latitude.so)** — Full platform docs
- **[Latitude API Reference](https://docs.latitude.so/guides/api/api-access)** — API details
- **[n8n Community Nodes](https://docs.n8n.io/integrations/community-nodes/)** — How community nodes work
- **[Changelog](CHANGELOG.md)** — Version history and updates

---

## 🤝 Contributing

Contributions are welcome! This is how we make it better together.

1. **Fork** the repository
2. **Create** your feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

---

<div align="center">

**Built with 🔥 because hardcoding AI prompts in workflows is a soul-crushing waste of time.**

MIT © [Yiğit Konur](https://github.com/yigitkonur)

[GitHub](https://github.com/yigitkonur/n8n-nodes-latitude) •
[npm](https://www.npmjs.com/package/n8n-nodes-latitude) •
[Latitude.so](https://latitude.so) •
[n8n.io](https://n8n.io)

</div>
