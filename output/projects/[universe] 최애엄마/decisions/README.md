# Decision Log
Each decision is a JSON file: DEC-001.json, DEC-002.json, etc.

Format:
```json
{
  "id": "DEC-001",
  "date": "2026-04-07",
  "what": "What changed",
  "why": "Why it changed",
  "who": "Who decided (user / engine name)",
  "affects": ["list of affected files/episodes"],
  "status": "applied | pending | reverted"
}
```
