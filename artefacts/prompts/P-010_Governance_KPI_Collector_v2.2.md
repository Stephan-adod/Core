---
id: P-010
phase: v2.2
source: ["S-001","lesson_log.csv"]
category: ["Governance","Metrics"]
impact: High
tags: [kpi, governance, learning-velocity, integration-rate, coverage, reflection-depth]
created: 2025-10-19
author: Stephan
---

# P-010 · Governance KPI Collector (v2.2)

## Zweck
Erhebt aus Lessons & Synthesen messbare Kennzahlen zur Lern- und Governance-Reife und speichert sie als JSON- und Markdown-Report.

## Eingangsdaten
- artefacts/logs/lesson_log.csv
- artefacts/lessons/lesson_snippets/*.md
- artefacts/syntheses/*.md
- meta/system_version.json

## KPIs (v2.2)
- total_lessons
- lessons_per_week
- integration_rate
- category_coverage
- impact_mix
- avg_related_docs

## Output
- artefacts/reports/governance_kpis.json
- artefacts/reports/governance_kpis.md

## Ausführung
`node scripts/collect_kpis_v1.mjs`
