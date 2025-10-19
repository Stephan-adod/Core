---
title: AI-First System Bootstrap · v2.0 Light
phase: initialization
version: v2.0
status: active
updated: 2025-10-20
expiry_condition: core_docs_populated == true
merge_target: meta/AI_First_System_Architecture_v2.1.md
purpose: >
  Initializes the v2.0 repository after the v1.9 archival freeze.
  Provides a temporary behavioral frame for human ↔ AI interaction
  until the five Core-Docs are populated and governance resumes.
---

# 🧭 1️⃣ Purpose & Scope
This file defines the *startup behavior* of the v2.0 system.  
It loads minimal operational rules so that the system can act coherently  
before Architecture v2.1 and the Playbook take over.

**This is not a permanent Core-Doc.**
It expires automatically when all Core-Docs contain active content.

---

# 🤝 2️⃣ Human ↔ AI Interaction Rules

| Role | Responsibility | Output |
|------|----------------|---------|
| **Human** | Defines intent, validates prompts, merges consciously | Lessons & Direction |
| **AI** | Executes bounded Mini-Prompts, documents state | Artefacts & Reports |
| **System** | Holds structure, ensures traceability | Logs & Manifests |

**Boundaries**
- No automation beyond `sanity.yml` until `intent_state: confirmed`.  
- All changes must reference a Mini-Prompt (bounded intent).  
- The Human remains the single merge authority.  

---

# ⚙️ 3️⃣ Activation Sequence
1. **Archive v1.9** → complete & immutable  
2. **Bootstrap v2.0 Light** → load startup rules (this file)  
3. **Populate Core-Docs** → minimal but functional content  
4. **Prompt Inventory v2.0** → connect Mini-Prompts to governance functions  
5. **Deactivate Bootstrap** → move to `archive/v2.0_bootstrap/`  
6. **Architecture v2.1** → integrate rules permanently  

---

# 📅 4️⃣ Exit Logic
When:
- All five Core-Docs contain frontmatter + Purpose + Owner, **and**
- Roadmap `intent_state` = `confirmed`

→ then this file is archived automatically to  
`archive/v2.0_bootstrap/AI_First_System_Bootstrap_v2.0.md`.

> *Bootstrap out, Architecture takes over.*

---

# 🪞 5️⃣ Governance Note
This document exists to keep the system coherent during its quiet phase.  
It should never accumulate detail or grow new sections.  
If it exceeds 100 lines → it’s time to archive it.

---

# ✅ 6️⃣ Acknowledgement
Created 2025-10-20 by Stephan (adod) as temporary governance frame.  
Expires automatically on first Roadmap Confirmation.
---
# 🏁 Archived
Archived on 2025-10-19 after intent confirmation (P-008).
System entered operational phase (v2.1).
---
