# n8n-nodes-latitude

[![npm version](https://img.shields.io/npm/v/n8n-nodes-latitude.svg)](https://www.npmjs.com/package/n8n-nodes-latitude)
[![npm downloads](https://img.shields.io/npm/dm/n8n-nodes-latitude.svg)](https://www.npmjs.com/package/n8n-nodes-latitude)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![n8n community](https://img.shields.io/badge/n8n-community%20node-ff6d5a)](https://n8n.io)

This is an n8n community node for [Latitude.so](https://latitude.so) - the AI prompt management platform. Execute AI prompts with automatic parameter detection directly from your n8n workflows.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

## Why Use This Node?

- **Centralized Prompt Management**: Manage your AI prompts in Latitude instead of hardcoding them in workflows
- **Hot Reload**: Change prompts on the fly without modifying your workflow
- **Dynamic Parameters**: Automatically detects `{{ variables }}` from your prompts - no JSON wrestling
- **AI Agent Compatible**: Works as a tool for n8n AI agents (`usableAsTool: true`)

## Installation

### Community Nodes (Recommended)

1. Go to **Settings** > **Community Nodes**
2. Select **Install**
3. Enter `n8n-nodes-latitude` and confirm

### Manual Installation

```bash
npm install n8n-nodes-latitude
```

## Credentials

You need a Latitude.so account with API access.

| Field | Description | Where to Find |
|-------|-------------|---------------|
| **API Key** | Your Latitude API key | Dashboard → Settings → API Keys (format: `lat_...`) |
| **Project ID** | Numeric project identifier | Dashboard → Project Settings |

## Operations

### Run Prompt

Execute an AI prompt from your Latitude project.

| Parameter | Description |
|-----------|-------------|
| **Prompt Path** | Select from dropdown - shows all prompts with their required parameters |
| **Parameters** | Dynamic fields that load based on selected prompt. Map values to `{{ variables }}` |
| **Simplify Output** | Return only essential data (text, usage, uuid) or full conversation history |

## Usage Examples

### Basic Workflow

```
Webhook → Latitude → Respond to Webhook
```

### Configuration

```javascript
// Latitude Node Settings
Prompt Path: "marketing/personalized-email"
Parameters:
  - customer_name: {{$json.name}}
  - product: {{$json.product}}
  - tone: "professional"
```

### Output (Simplified)

```json
{
  "text": "Dear John, thank you for your interest in...",
  "object": null,
  "usage": {
    "inputTokens": 150,
    "outputTokens": 200,
    "totalTokens": 350
  },
  "uuid": "conv_abc123"
}
```

### Output (Full)

```json
{
  "uuid": "conv_abc123",
  "conversation": [...],
  "response": {
    "text": "...",
    "usage": {...}
  }
}
```

## Features

- **Auto-loads prompts** from your Latitude project via dropdown
- **Dynamic parameters** - extracts `{{ variables }}` from selected prompt automatically
- **Simplified output** - toggle between clean response data or full conversation history
- **AI Agent support** - use as a tool in n8n AI workflows
- **Secure** - credentials encrypted, error messages sanitized
- **n8n expressions** - use `{{$json.field}}` in parameter values
- **Continue On Fail** - handle errors gracefully in workflows

## Compatibility

- **n8n version**: 1.0.0+
- **Node.js version**: 18.0.0+

## Resources

- [Latitude Documentation](https://docs.latitude.so)
- [Latitude API Reference](https://docs.latitude.so/guides/getting-started/api-access)
- [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/community-nodes/)

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Authentication failed | Verify API key format (`lat_...`) and Project ID in Latitude dashboard |
| Prompt not found | Refresh the dropdown or verify the prompt exists in your project |
| Parameters not loading | Check credentials are valid, test connectivity |
| Empty response | Ensure prompt is published and not in draft mode |

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

[MIT](LICENSE.md) - Yigit Konur (yigit35@gmail.com)

## Links

- [GitHub Repository](https://github.com/yigitkonur/n8n-nodes-latitude)
- [npm Package](https://www.npmjs.com/package/n8n-nodes-latitude)
- [Latitude.so](https://latitude.so)
- [n8n.io](https://n8n.io)
