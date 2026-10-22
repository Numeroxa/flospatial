# Aptesta Development Handover

## Purpose of this document

This document defines the durable product, educational, technical and development rules for Aptesta.

It is intended to remain in the authoritative GitHub repository and should be reviewed before implementing future Aptesta changes.

It is not a release brief or changelog. Individual development versions will continue to have their own approved implementation briefs.

Where an implementation brief conflicts with a durable rule in this document, do not silently override the rule. Identify the conflict and seek clarification from the product owner before proceeding.

---

# 1. Product

**Product:** Aptesta

**Repository:** `Numeroxa/flospatial`

**Authoritative production branch:** `main`

**Authoritative baseline when this document was created:** Aptesta v0.44.18

**Baseline commit:** `988fe69e1c5ebc86bd2556ee967c4d7fe57a694a`

Aptesta is an aptitude-test preparation platform initially focused on Australian and New Zealand recruitment environments, including fire, police, aviation, defence and trades, with potential later expansion to other markets.

Aptesta is not intended merely to provide banks of practice questions.

Its central purpose is to **teach candidates how to reason through aptitude-test problems and progressively develop independent performance**.

---

# 2. Core Product Promise

Aptesta should help a learner:

**understand → practise with guidance → perform independently → identify the next best step → improve**

The principal learning progression is:

**Learn → Guided Practice → Independent Practice → Check/Assessment**

Aptesta should provide:

* clear teaching;
* high-quality diagrams and presentation;
* realistic aptitude-test reasoning;
* progressive reduction in assistance;
* useful feedback;
* evidence-based recommendations;
* visible improvement; and
* one clear next step rather than excessive choice.

The desired progression is:

**accuracy first → efficiency second → pressure last**

Do not introduce artificial time pressure before the learner has demonstrated appropriate understanding and accuracy.

---

# 3. Core Domains

The established core Aptesta domains are:

* Mechanical Reasoning
* Numerical Reasoning
* Abstract & Logical Reasoning
* Verbal Reasoning

Spatial reasoning may be added or expanded where external evidence demonstrates that it is relevant to the target assessment or employer.

Do not expand into additional domains merely to increase content volume.

---

# 4. Scope Discipline

Aptesta deliberately follows a tightly scoped product strategy.

Prioritise:

* better teaching;
* better questions;
* clearer diagrams;
* realistic difficulty;
* sensible progression;
* useful recommendations; and
* measurable improvement.

Avoid unnecessary expansion into:

* a universal learning platform;
* excessive gamification;
* unnecessary social features;
* large numbers of weak practice questions;
* elaborate analytics without a clear learner benefit;
* employer-specific simulations before the underlying capability is ready; or
* features that add complexity without materially improving aptitude-test preparation.

Quality is more important than feature count.

---

# 5. Audit Before Code

For substantive educational changes, the default process is:

**Audit → Discuss → Decide → Approve scope → Implement → Verify → Device-test**

Do not begin coding merely because an area appears capable of improvement.

First determine:

* what is currently present;
* what is already good;
* what is weak;
* whether the weakness is educational, fidelity-related, visual, technical or navigational;
* whether a change is actually required; and
* the smallest appropriate scope of that change.

Where possible, classify existing questions or components as:

* Retain
* Minor revision
* Major revision
* Replace
* Add companion item

Avoid rewriting good material simply because a new version is being created.

---

# 6. Difficulty Philosophy

Aptesta difficulty should arise primarily from **reasoning**, not obscurity.

The preferred progression is:

**Foundation → Standard → Challenging → Test-pressure**

Legitimate increases in difficulty include:

* additional reasoning steps;
* combining familiar principles;
* requiring the learner to discover the relevant rule;
* unfamiliar but fair presentation;
* distinguishing relevant from irrelevant information;
* plausible distractors representing genuine reasoning errors;
* transfer of a learned principle into a new context; and
* eventually, appropriate time pressure.

Do not create artificial difficulty through:

* ambiguous diagrams;
* unnecessarily advanced mathematics;
* specialist engineering knowledge;
* obscure vocabulary unrelated to the target construct;
* trick wording;
* poor visual presentation; or
* arbitrary complexity.

The objective is authentic aptitude-test difficulty.

---

# 7. Guided vs Independent vs Assessment

These stages must remain meaningfully different.

### Guided Practice

Guided Practice may:

* identify the relevant principle;
* provide cues;
* suggest a method;
* break a problem into steps; or
* explicitly name a pattern or rule.

### Independent Practice

Independent Practice should increasingly require the learner to:

* identify the relevant principle;
* discover the rule;
* select the method;
* integrate information; and
* solve without instructional prompting.

### Check / Assessment

Assessment should require transfer.

Questions may use:

* unfamiliar presentation;
* multiple reasoning steps;
* plausible distractors;
* integrated information; and
* realistic assessment-style framing.

Assessment should not simply reproduce Guided Practice with the hints removed.

---

# 8. Question Quality

Every substantive Aptesta question should have a clear intended reasoning construct.

When reviewing or creating questions, consider:

**skill → archetype → intended difficulty → actual reasoning demand → authenticity → distractors → presentation → teaching value**

Distractors should preferably correspond to identifiable errors such as:

* reversed operation;
* incorrect denominator;
* omitted reasoning step;
* direction error;
* unit-conversion error;
* confusing percentage points with percentage change;
* applying only one of two simultaneous rules; or
* selecting something that could be true rather than must be true.

Avoid arbitrary distractors where possible.

---

# 9. Explanations

Explanations should teach transferable reasoning rather than merely state the correct answer.

Preferred structure:

**principle → application → answer → brief sense-check where useful**

Explanations should be concise enough to remain readable on a phone.

They should not become miniature textbook chapters.

---

# 10. External Fidelity Benchmarking

Whenever Aptesta adds a new employer, service, assessment provider or recruitment pathway, external fidelity benchmarking should occur before substantial service-specific content is developed.

Where legitimate evidence is available, benchmark against:

* official employer recruitment information;
* official assessment-provider specifications or samples;
* legitimate publicly available preparation material;
* credible competitor preparation material; and
* non-verbatim recent candidate experience.

Record:

* evidence strength;
* evidence gaps;
* likely relevant archetypes;
* expected difficulty;
* timing information where known; and
* uncertainty.

Do not use leaked, stolen, confidential or protected live assessment items.

Do not claim exact fidelity where the evidence does not support it.

Reassess fidelity when an employer or assessment provider changes its recruitment process.

---

# 11. Recommendations and Learner Pathway

Aptesta should generally provide **one evidence-based recommendation** rather than a menu of loosely ranked possibilities.

Recommendations should be understandable to the learner and based on observable performance where possible.

Use constructive language such as:

**“area to strengthen”**

rather than unnecessarily negative labels.

The learner should normally understand:

1. what Aptesta observed;
2. why the recommendation follows; and
3. what to do next.

---

# 12. Review Experience

After Independent Practice and relevant assessments, optional review should remain available.

Where applicable, review should support:

* incorrect answers only; and
* all explanations.

The review should clearly distinguish:

* the learner's answer;
* the correct answer; and
* the explanation.

Review should remain optional rather than obstructing normal progression.

---

# 13. Mechanical Diagram Standards

Mechanical diagrams are part of the reasoning task and must therefore be mechanically coherent and visually unambiguous.

General standards:

* apparatus should look physically plausible;
* functional connections should appear genuinely connected;
* labels must not overlap mechanical components;
* arrows should be unambiguous;
* diagrams should use as much useful screen area as practical;
* critical elements should remain readable on a phone;
* learners should not need to mentally repair the apparatus before answering.

Difficulty must come from the reasoning problem, not from defective artwork.

Previously validated mechanical diagrams should not be casually redrawn or restyled.

A validated diagram should be treated as frozen unless:

* a genuine defect is identified;
* device testing demonstrates a readability problem; or
* an approved implementation brief explicitly requires modification.

---

# 14. Mobile-First Quality

Aptesta must work well on mobile devices.

Particular attention should be paid to:

* text size;
* diagram size;
* touch targets;
* clipping;
* scrolling;
* sticky/floating controls;
* answer selection;
* explanation readability; and
* portrait-screen layout.

Do not accept a layout simply because it works on a desktop browser.

Where there is a conflict between decorative whitespace and useful readable scale on a phone, favour readable scale.

Device testing remains part of release validation.

---

# 15. Current Validated/Frozen Areas

At the v0.44.18 baseline:

### Mechanical Reasoning

The Mechanical pathway has undergone substantial audit and refinement.

The current:

* gears;
* pulleys;
* hydraulics;
* lever presentation;
* assessment structure; and
* revised pulley reasoning questions

should be regarded as validated/frozen unless a genuine defect is identified or an approved brief explicitly reopens them.

### Numerical Reasoning

Numerical Fundamentals, Guided Practice, strengthened Independent Practice and Numerical Check have been reviewed and validated.

Treat the Numerical pathway as frozen unless an identified defect or approved future audit reopens it.

### Abstract & Logical Reasoning

The pathway has been audited and refined.

Recent work strengthened Independent Practice by improving rule discovery, matrix reasoning, relational classification and analogy difficulty, and corrected the A-013 alternating-rotation item.

The v0.44.18 shortcut correction has been validated.

Treat the current pathway as the authoritative Abstract & Logical baseline unless future testing identifies a genuine issue.

### Verbal Reasoning

Verbal remains the next major pathway suitable for systematic audit.

Do not modify it merely because it is the next candidate.

Audit first and await an approved implementation brief.

---

# 16. Accounts and Progress

Aptesta follows a trust-first account philosophy.

Saving progress on the device should not require an account.

Cross-device account creation should remain optional.

The intended account proposition includes:

**“No email address required.”**

Do not introduce unnecessary:

* registration fields;
* marketing consent;
* email requirements; or
* personal-data collection.

Email should only be introduced when there is a genuine functional reason, such as optional account recovery or future paid-subscription requirements.

Do not modify Supabase authentication, schema, account behaviour or data structures as a side effect of unrelated work.

---

# 17. Supabase and Dependency Discipline

The v0.44.18 authoritative baseline includes an exact **Supabase 2.57.4** dependency pin required for reproducible builds.

Do not casually upgrade, loosen or alter this dependency.

More generally:

* avoid unrelated dependency upgrades;
* do not modify database schema without explicit approval;
* do not alter Secrets or production configuration without explicit need;
* preserve known-good build configuration; and
* treat infrastructure changes as separate scoped work.

---

# 18. Empirical Testing and Response Behaviour

Earlier empirical testing preserved immediate answer locking for consistency through the initial pilot tranche.

For future learner-facing calibration work, the preferred direction is that answers remain changeable until **Next/Submit**, with telemetry recorded where practical for:

* first-selection time;
* final-selection time; and
* answer-change count.

Stricter immediate-lock behaviour may later be appropriate for provider- or employer-specific simulations.

Do not implement this change incidentally. It requires its own approved scope.

---

# 19. Architecture

Keep the core learning platform separate from future employer/provider simulation layers.

Before substantial employer-specific simulation development, preserve the architectural distinction between:

* learner capability/content;
* Provider Profile; and
* Employer Profile.

Employer-specific timing, fidelity and simulation rules should not contaminate the underlying general learning content.

---

# 20. Source of Truth

The merged GitHub repository is the **single authoritative Aptesta production codebase**.

At the time this document was created:

**Version:** v0.44.18
**Branch:** `main`
**Commit:** `988fe69e1c5ebc86bd2556ee967c4d7fe57a694a`

Every new implementation task must begin from the current authoritative GitHub state.

Do not treat:

* old ZIP packages;
* previous local clones;
* conversation attachments;
* historical source files; or
* stale development copies

as authoritative production source.

Never use an older source version to make conclusions about the current implementation without explicitly identifying it as historical.

---

# 21. Classic / Work Development Model

Aptesta uses a hybrid development process.

## ChatGPT Classic

Classic is primarily the **product-development, audit and decision environment**.

Typical responsibilities include:

* product strategy;
* educational design;
* pathway audits;
* question-quality review;
* external fidelity analysis;
* difficulty calibration;
* diagram critique;
* screenshot/device review;
* discussion of alternatives;
* defining scope;
* acceptance criteria; and
* preparing the approved implementation brief.

## ChatGPT Work

Work is primarily the **production implementation environment**.

Typical responsibilities include:

* reading the authoritative repository;
* implementing approved briefs;
* editing production code;
* building;
* testing;
* checking diffs;
* regression checking;
* managing branches/worktrees where appropriate;
* Git operations;
* preparing commits/pull requests;
* merging/pushing after approval; and
* confirming deployment.

Classic and Work should not independently maintain competing production codebases.

---

# 22. Implementation Briefs

Before substantive Work implementation, there should normally be an explicit approved brief containing:

* objective;
* approved changes;
* frozen areas;
* likely affected files/components;
* acceptance criteria;
* regression constraints; and
* proposed version number.

Work should inspect the current repository before implementation.

If the actual source conflicts materially with assumptions in the brief, stop and report the discrepancy rather than improvising a broad solution.

---

# 23. Scope Protection During Implementation

When implementing an approved brief:

**Change only what is necessary to satisfy the brief.**

Do not opportunistically:

* refactor unrelated code;
* redesign unrelated UI;
* rewrite validated questions;
* update dependencies;
* change authentication;
* alter navigation;
* change scoring;
* modify database structures; or
* add new features

unless they are required by the approved scope.

If an unrelated problem is discovered, report it separately.

Do not silently expand the release.

---

# 24. Git and Version Discipline

Use safe Git practices.

Where appropriate:

* begin from current `main`;
* use an isolated branch/worktree for substantive changes;
* keep diffs reviewable;
* build/test before merge;
* preserve rollback capability;
* use clear version-specific commit messages; and
* confirm deployment after merge.

Do not increment the production version merely because exploratory work has occurred.

A version should correspond to an identifiable approved change.

Do not begin the next version until the current version has been validated or the product owner explicitly authorises parallel work.

---

# 25. Regression Protection

A change in one Aptesta area should not inadvertently alter another.

Before completing implementation, consider whether the change could affect:

* other reasoning domains;
* scoring;
* pathway recommendations;
* Tester Tools;
* navigation;
* review screens;
* sticky/floating controls;
* account behaviour;
* local progress;
* Supabase;
* responsive/mobile layout; or
* production build/deployment.

Frozen areas should remain unchanged unless explicitly reopened.

---

# 26. Product Owner Approval

The product owner remains the final decision-maker regarding:

* scope;
* pedagogy;
* question quality;
* UX;
* release acceptance; and
* deployment of substantive changes.

Work should report uncertainty rather than silently make consequential product decisions.

A technically elegant solution is not automatically the correct Aptesta solution.

---

# 27. Standard Development Cycle

The preferred Aptesta development cycle is:

**1. Discuss/audit in Classic**

↓

**2. Product owner approves scope**

↓

**3. Classic produces implementation brief**

↓

**4. Work starts from authoritative GitHub source**

↓

**5. Work implements only approved scope**

↓

**6. Work builds/tests/checks diff and regressions**

↓

**7. Product owner reviews/approves**

↓

**8. Work commits/merges/pushes**

↓

**9. GitHub Actions deploys**

↓

**10. Product owner device-tests**

↓

**11. Results reviewed in Classic**

↓

**12. Area is frozen or next bounded change is defined**

This process should remain lightweight. Its purpose is to prevent regressions and scope drift, not to create unnecessary bureaucracy.

---

# 28. Guiding Principle

When uncertain, prefer the option that makes Aptesta:

**clearer, more educationally sound, more authentic, more reliable and simpler for the learner.**

Do not confuse more features with a better product.

The quality of Aptesta should come from the quality of its reasoning instruction, questions, progression and recommendations.
