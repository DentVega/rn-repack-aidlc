---
description: Evolve the AI-DLC artifacts after discovering a new requirement, omitted requirement, architectural change, or documentation inconsistency during Construction.
argument-hint: "[description of the change] [source of truth, optional]"
---

# AI-DLC Change

Delegate to the `aidlc-master` agent to evaluate this change: $ARGUMENTS

A change has been detected during Construction. Pause the current Bolt and evaluate the requested change before continuing implementation.

## Objective

Maintain traceability between the implementation, the Memory Bank and the Specs by evolving the project artifacts in a controlled manner.

## Inputs

The user may optionally provide:

- A description of the change.
- A source of truth (existing application, documentation, APIs, etc.).

If a **Source of Truth** is provided:

- Compare the current Specs against it.
- Determine whether the change represents:
  - an omitted requirement;
  - an outdated Specification;
  - a documentation inconsistency.

If **no Source of Truth** is provided:

Treat the request as a proposal for a new requirement or architectural evolution.

## Process

1. Analyze the requested change.

2. Classify it as one of:

- Omitted Requirement
- New Requirement
- Documentation Inconsistency
- Architectural Change
- Technical Decision Update

3. Determine the impact.

Only modify artifacts that are actually affected.

Possible artifacts include:

- Requirements
- Design
- Tasks
- Memory Bank
- ADRs
- Tech Stack
- Standards
- Bolt definitions

Do NOT modify artifacts unnecessarily.

4. If the change impacts previously generated Bolts:

- identify which Bolts are affected;
- describe why;
- indicate whether they must be regenerated or only reread.

5. Do NOT implement code.

6. Do NOT continue Construction.

7. Produce a summary including:

- Classification
- Affected artifacts
- Files modified
- Affected Bolts
- Recommended next action

Wait for user approval before resuming Construction.
