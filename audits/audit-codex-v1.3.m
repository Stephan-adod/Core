🧭 Core Audit Codex v1.3 (Stephan Style)

Ziel
Transparente, AI-gestützte Bestandsaufnahme des Core-Systems: Struktur, Prozesse, Inhalte, Automations-Layer und Lernfähigkeit – read-only, evidence-based, reproducible.

Leitprinzipien
Klarheit │ Datensparsamkeit │ Verantwortlichkeit │ Review-Kultur │ Lernfähigkeit

Frequenz

Light Audit: monatlich (Quick Check)

Full Audit: quartalsweise (Tiefenanalyse)

Modus
Read-Only │ Keine Auto-Fixes │ Belege verpflichtend │ Einheitliches Scoring (0–3)

🔢 Audit-Dimensionen (v1.3)

Datenhygiene & Ordnung

Governance & Löschkonzept (Retention)

Datensparsamkeit (Data Minimization)

Aktualität & Verantwortlichkeit (Ownership & Reviews)

Transparenz & Observability (KPIs, Dashboard)

Inhaltliche Kohärenz & Governance-Kompatibilität (v2.9)

Systemische Lernfähigkeit & Impact (AI-Feedback-Loops)

Actions-Governance (Workflows & Scripts) – NEU

Scoring: 0 = nicht vorhanden · 1 = rudimentär · 2 = weitgehend mit Lücken · 3 = Best Practice

🧩 Bewertungsraster pro Dimension
1) Datenhygiene & Ordnung

Struktur & Naming-Konsistenz (0–3)

Versionierung/Redundanzen (0–3)

Metadaten/README pro Ordner (0–3)

Auffindbarkeit (Index/Semantic Search) (0–3)

2) Governance & Löschkonzept

Retention-Policy dokumentiert (0–3)

Technische Umsetzung/Archivierung (0–3)

Auditierbarkeit (Wer/Was/Wann) (0–3)

Ausnahmeprozesse dokumentiert (0–3)

3) Datensparsamkeit

Aufnahmekriterien (Definition of Ready for Core) (0–3)

Lifecycle-Status (active/deprecated/archived) (0–3)

Sensitivitäts-Klassifizierung/PII (0–3)

Duplikatsreduktion/Anhänge (0–3)

4) Aktualität & Verantwortlichkeit

owner: je Artefakt (0–3)

review_due: definiert (0–3)

Stale-Detection aktiv (0–3)

Aktualitätsquote (0–3)

5) Transparenz & Observability

Health-Dashboard vorhanden (0–3)

KPI-Tracking + Trends (0–3)

Roadmap/Changelog (0–3)

6) Inhaltliche Kohärenz & Governance-Kompatibilität

Terminologie & Governance-Sprache konsistent (0–3)

Policy-Alignment (Review-Kultur, Lifecycle, Retention) (0–3)

Governance-Kapitel im Dokument (0–3)

AI-Indexierbarkeit (klare Überschriften, Frontmatter) (0–3)

7) Systemische Lernfähigkeit & Impact

Feedback-Intelligenz (Audit/Users/Prozesse) (0–3)

Governance-Learning (Lessons → Policies/Changelog) (0–3)

Impact-Metriken (Ordnung ↑, Redundanz ↓, Review-Quote ↑) (0–3)

AI-Co-Evolution (AI als Review-Partner) (0–3)

8) Actions-Governance (Workflows & Scripts)

Inventar & Ordnung: konsistente Struktur/Namen (/actions/core|experimental|archived oder .github/workflows) (0–3)

Metadaten: YAML-Header pro Workflow/Skript mit name, owner, status: active|experimental|archived, review_due (0–3)

Aktualität & Nutzung: letzte Ausführung/Nutzung dokumentiert; inaktive >180 Tage → Archiv-Kandidat (0–3)

Bedienbarkeit: eine Master-Action zum manuellen Audit-Start (unter „got actions“) + klare Readme; keine Trigger-Flut (0–3)

Empfohlene YAML-Header für Workflows/Skripte

name: core_audit
owner: core-ai
status: active        # active | experimental | archived
review_due: 2025-12-01
description: "Manuell startbarer Core-Audit (read-only) basierend auf Codex v1.3."


Strukturvorschlag

/actions/
 ├─ core/          # produktiv
 ├─ experimental/  # prototypen (monitoren)
 └─ archived/      # ruhend/abgelöst

📎 Evidence-Format (verpflichtend)
PFAD: /core/policies/retention.md
BEFUND: Keine Aufbewahrungsfristen pro Kategorie.
EMPFEHLUNG: 6/12/24 Monate gem. Sensitivität + Archiv-Workflow definieren.
KRITERIUM: Governance – Retention-Policy
SCORE: 1

PFAD: .github/workflows/core_audit.yml
BEFUND: Kein owner/review_due im Header.
EMPFEHLUNG: YAML-Header ergänzen (owner, status, review_due).
KRITERIUM: Actions-Governance – Metadaten
SCORE: 0

🧾 Output-Spezifikation
1) Executive Summary (≤120 Wörter)

Gesamteinschätzung, Top-3 Risiken, Top-3 Maßnahmen

2) Scorecard (Markdown)
Dimension	Score (0–3)	Kommentar	Risiko	Priorität
Datenhygiene				
Governance				
Datensparsamkeit				
Aktualität				
Transparenz				
Kohärenz				
Lernfähigkeit				
Actions-Governance				
3) Evidence-Liste

Format: PFAD | Befund | Relevanz (Kriterium) | Empfehlung | Risiko

4) Maßnahmenboard (ICE)
Maßnahme	Impact	Confidence	Ease	ICE	Aufwand (S/M/L)	Typ
Retention Policy v1.0 definieren	8	7	6	336	M	Structural
Owner/Review-Frontmatter rollenweit	7	8	8	448	S	Quick Win
Master-Action „core_audit“ einführen	7	8	7	392	S	Actions
Actions >180 Tage in /archived/	6	8	7	336	S	Hygiene
5) Lösch-/Archiv-Kandidaten
Pfad	Grund	Risiko	Vorschlag	Review-Owner
/actions/experimental/*	inaktiv > 180 Tage	Low	Archivieren	@ownerX
6) Owner-Gaps & Stale-Hotspots

Ordner/Topics ohne owner:

Dateien >X Monate unverändert

Workflows ohne review_due

🔁 Governance- & Review-Loop
Phase	Zweck	Output	Verantwortlich	Intervall
Audit (read-only)	Zustand erfassen	audit_report.md	AI + Owner	monatlich/Quartal
Review & Priorisierung	Entscheidungen treffen	maßnahmenboard.md	Core-Leitung	+1 Woche
Umsetzung	Quick Wins & Fixes	Commits/Docs	Owner	laufend
Monitoring	Wirkung messen	Dashboard/KPIs	AI-Bot	automatisch

Learning-Pflicht: Jede Review beendet mit „Lessons Learned“ (3 Zeilen). Änderungen fließen in Policies/Glossar (Changelog).

🧠 Prompt-Block (für AI-Auditor)

ROLE: Neutraler Auditor, STRICT READ-ONLY.
MISSION: Erzeuge Executive Summary, Scorecard, Evidence, Maßnahmen gemäß Codex v1.3.
INPUTS: Repo-Struktur (tree -L 3), Dateiliste mit Timestamps, .github/workflows/ & /actions/, Policies/Readmes, CODEOWNERS.
CONSTRAINTS: Nichts ändern; jede Bewertung mit Belegen (Pfad/Commit).
SCORING: 0–3 je Kriterium; Dimension = Mittelwert.
ACTIONS-CHECK:

Inventarisiere Workflows/Skripte + Headerfelder

Prüfe „Master-Action“ für manuellen Audit-Start (unter „got actions“)

Markiere veraltete ≥180 Tage → Archiv-Vorschlag
OUTPUT: Executive Summary (≤120 Wörter) → Scorecard → Evidence → Maßnahmenboard → Archiv-Kandidaten → Owner-Gaps.

🧱 Repo-Einbettung (Empfohlen)
/core/audits/
 ├─ 2025_Q4/
 │   ├─ audit_report.md
 │   ├─ scorecard.csv
 │   ├─ evidence.md
 │   └─ massnahmenboard.md
 └─ audit-codex-v1.3.md
.github/workflows/core_audit.yml   # Master-Action (manuell startbar)
/actions/{core|experimental|archived}/...

✅ Kurzfazit

v1.3 integriert Inhalt + Automation (Actions) + Lernen in einem Codex.

Audit bleibt read-only, macht aber die Actions-Landschaft steuerbar (Inventar, Metadaten, Archivlauf).

Passt nahtlos zu v2.9 (Harmonisierung) und ist v3.0-ready (Automatisierung/Dashboard).
