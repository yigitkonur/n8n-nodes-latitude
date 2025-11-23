# n8n-nodes-latitude

[![npm](https://img.shields.io/npm/v/n8n-nodes-latitude)](https://www.npmjs.com/package/n8n-nodes-latitude)

An n8n community node for executing AI prompts from [Latitude.so](https://latitude.so) with automatic parameter detection.

**Why this matters**: Manage your AI prompts centrally in Latitude instead of hardcoding them in workflows. Change prompts on the fly without touching your workflow - just update in Latitude and the node picks it up. Dynamic parameter fields save you from wrestling with JSON - add params as they're defined in your prompt.

[n8n](https://n8n.io/) | [Latitude Docs](https://docs.latitude.so) | [GitHub](https://github.com/yigitkonur/n8n-nodes-latitude)  

## Installation

In n8n: **Settings** > **Community Nodes** > Install `n8n-nodes-latitude`

Or: `npm install n8n-nodes-latitude`

## Quick Start

1. Add Latitude node to workflow
2. Configure credentials (API Key + Project ID from Latitude dashboard)
3. Select prompt from dropdown
4. Add parameters (auto-loaded from prompt)
5. Execute

## Features

- **Auto-loads prompts** from your Latitude project
- **Dynamic parameters** - extracts `{{ variables }}` automatically
- **Type-safe** with full TypeScript support
- **Secure** - encrypted credentials, sanitized logs
- **n8n expressions** - use `{{$json.field}}` in values

## Credentials

Get from [Latitude Dashboard](https://latitude.so):
- **API Key**: Settings > API Keys (format: `lat_...`)
- **Project ID**: Project Settings (numeric, e.g., `12345`)

## Usage Example

**Workflow**: Webhook → Latitude → Gmail

```javascript
// Latitude Node Config
Prompt: "marketing/personalized-email"
Parameters:
  - customer_name: {{$json.name}}
  - product: {{$json.product}}
  - tone: "professional"

// Output
{
  "promptPath": "marketing/personalized-email",
  "parameters": {...},
  "result": { "text": "Hi John, ...", "usage": {...} }
}
```

## Fields

**Prompt Path**: Dropdown of available prompts (shows required parameters)  
**Parameters**: Dynamic fields - Name (dropdown from prompt) + Value (string/expression)

## Tips

- Use expressions: `{{$json.field}}`
- Enable "Continue On Fail" for non-critical flows
- Test prompts in Latitude before production use

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Authentication failed | Verify API key & Project ID in Latitude dashboard |
| Prompt not found | Refresh dropdown or check prompt exists |
| Parameters not loading | Test credentials, check network connectivity |

## Links

- [Latitude Docs](https://docs.latitude.so)
- [n8n Docs](https://docs.n8n.io)
- [GitHub](https://github.com/yigitkonur/n8n-nodes-latitude)
- [npm](https://www.npmjs.com/package/n8n-nodes-latitude)

## Changelog

**0.3.1** - Dynamic parameter fields, simplified single operation, security hardening  
**0.2.2** - Fixed `{{ variable }}` extraction  
**0.1.0** - Initial release

## License

MIT - Yigit Konur (yigit35@gmail.com)
