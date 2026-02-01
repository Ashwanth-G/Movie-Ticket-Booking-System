# Documentation

## Contents

- **ARCHITECTURE.md** – System architecture, backend/frontend layout, auth, seat locking, DevOps.
- **DATABASE-DESIGN.md** – MongoDB collections, schemas, indexes, and relationships.
- **FLOW.md** – User and system flows (auth, booking, seat lock, admin).

## Diagrams

- **architecture-diagram.mmd** – Mermaid source for high-level architecture. Export to `architecture-diagram.png` via [Mermaid Live](https://mermaid.live) or `mmdc` CLI.
- **flow-diagram.mmd** – Mermaid source for user booking flow. Export to `flow-diagram.png` the same way.

To generate PNGs:

```bash
# If you have @mermaid-js/mermaid-cli installed
npx mmdc -i docs/architecture-diagram.mmd -o docs/architecture-diagram.png
npx mmdc -i docs/flow-diagram.mmd -o docs/flow-diagram.png
```

Or paste the contents of each `.mmd` file into https://mermaid.live and export as PNG.
