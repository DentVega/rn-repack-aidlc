# Audit Trail

> Append-only log maintained by the AI-DLC agents. Records the user's **raw
> requests**, the decisions taken, and anything **skipped or deferred** — so
> "why did we do X?" always has a traceable answer. Never rewrite or delete
> entries; append new ones. Complements (does not replace) `activeContext.md`
> (current focus) and ADRs (architectural rationale).

Entry format:

```
## <date> — <phase/bolt>
- **Raw request:** <the user's input, verbatim or faithfully condensed>
- **Decision:** <what was decided and by whom (user checkpoint vs agent)>
- **Skipped/deferred:** <anything intentionally not done, and why>
```

---

<!-- entries below, newest last -->
