n8n community node for [Latitude](https://latitude.so). run versioned LLM prompts, continue multi-turn conversations, and push external logs back into Latitude — all from n8n workflows.

```bash
# in n8n: settings > community nodes
n8n-nodes-latitude
```

[![npm](https://img.shields.io/npm/v/n8n-nodes-latitude.svg?style=flat-square)](https://www.npmjs.com/package/n8n-nodes-latitude)
[![n8n](https://img.shields.io/badge/n8n-community_node-93450a.svg?style=flat-square)](https://docs.n8n.io/integrations/community-nodes/)
[![license](https://img.shields.io/badge/license-MIT-grey.svg?style=flat-square)](https://opensource.org/licenses/MIT)

---

## what it does

three operations, all working per-item across your n8n workflow:

- **run prompt** — execute a Latitude prompt by path, with dynamic parameters extracted from `{{ variable }}` placeholders. supports version pinning and custom identifiers
- **chat** — continue a multi-turn conversation using the `conversationUuid` from a previous run
- **create log** — push externally-generated conversations into Latitude for observability

also works as an **AI agent tool** — drop it into n8n's agent node and let the LLM call Latitude prompts dynamically.

## install

### n8n cloud or self-hosted UI

settings > community nodes > install `n8n-nodes-latitude`

### manual (self-hosted)

```bash
cd /path/to/n8n
npm install n8n-nodes-latitude
# restart n8n
```

## credentials

create Latitude API credentials in n8n with:

| field | required | where to find it |
|:---|:---|:---|
| `apiKey` | yes | Latitude dashboard > settings > API keys (starts with `lat_`) |
| `projectId` | yes | project URL: `app.latitude.so/projects/{id}` |
| `gatewayUrl` | no | only for self-hosted Latitude instances. leave empty for cloud |

## usage

### run a prompt

select a prompt from the dropdown (fetched live from your Latitude project). parameters are auto-detected from `{{ placeholder }}` syntax in the prompt content and presented as a dynamic dropdown.

options:
- **custom identifier** — tag the run for filtering in Latitude dashboard
- **version UUID** — pin to a specific prompt version instead of `live`

### chat (continue conversation)

pass the `conversationUuid` from a previous run result, plus one or more messages with `role` (user / assistant / system) and `content`.

### create log

select a prompt path, provide the conversation messages, and optionally include the AI response text. useful for logging conversations that happened outside Latitude.

### simplified output

enabled by default. strips the full conversation history and returns:

```json
{
  "uuid": "conversation-uuid",
  "text": "model response",
  "usage": { "promptTokens": 150, "completionTokens": 42, "totalTokens": 192 },
  "cost": 0.0023,
  "toolCalls": [{ "id": "...", "name": "...", "arguments": {} }]
}
```

disable `simplify` to get the raw SDK response including full conversation array.

## error handling

- per-item error isolation — if `continueOnFail` is enabled in n8n, failed items return `{ error, errorCode, status }` instead of halting the workflow
- API keys are automatically redacted from error messages before they reach n8n logs

## development

```bash
pnpm install
pnpm build          # tsc + gulp (copies icons to dist/)
pnpm lint           # eslint
pnpm format         # prettier
```

output goes to `dist/`. only `dist/` is published to npm.

## project structure

```
credentials/
  LatitudeApi.credentials.ts    — API key, project ID, gateway URL
nodes/Latitude/
  Latitude.node.ts              — main node class
  actions/
    runPrompt.operation.ts      — run operation
    chat.operation.ts           — chat operation
    createLog.operation.ts      — log operation
  methods/
    loadOptions.ts              — dynamic dropdowns (prompts, parameters)
  shared/
    descriptions.ts             — n8n UI field definitions
    transport.ts                — SDK client factory
    utils.ts                    — parameter extraction, error sanitization
    types.ts                    — TypeScript types
```

## requirements

- n8n (cloud or self-hosted)
- node >= 18
- Latitude account with API key

## license

MIT
