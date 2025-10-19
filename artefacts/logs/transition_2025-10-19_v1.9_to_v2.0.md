---
title: Transition Log · v1.9 → v2.0 Skeleton
date: 2025-10-19
author: Stephan
scope: archive freeze · repo simplify · v2 sanity
links:
  archive_readme: archive/v1.9/README.md
---

## Motivation
- v1.9 abgesichert (Referenz), v2.0 auf Klarheit/Leichtigkeit getrimmt.

## Änderungen (High-Level)
- Archiv erstellt und verlinkt (P-001, P-002).
- Alt-CI stillgelegt, v2 sanity eingeführt (P-003, P-005).
- Repo auf Core-Docs reduziert (P-004, P-005).

## Risiken / Rollback
- Risiko: alte Validierer fehlen → bewusst.
- Rollback: Git-Revert des Simplification-PR (oder dieses PR).

## Akzeptanzkriterien
- Prompt Inventory gepflegt (Key + Impact).
- Transition-Log vorhanden & verlinkt.
- CI: `.github/workflows/sanity.yml` grün.
