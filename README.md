# GCP Professional Data Engineer — Product Quiz

[Open the quiz](https://bajor.github.io/gcp-de-products-quiz/)

## Project draft / implementation prompt for coding agents

Build the **simplest possible static quiz website** that helps an experienced data engineer prepare for the **Google Cloud Professional Data Engineer** certification specifically by learning **which Google Cloud product/service is used for what** and by distinguishing products that are easy to confuse on the exam.

The current official Professional Data Engineer exam guide is v4.2. Treat the official certification page and exam guide as the primary source of truth:

- https://cloud.google.com/learn/certification/data-engineer
- https://services.google.com/fh/files/misc/professional_data_engineer_exam_guide_english.pdf

The website is not intended to teach data engineering fundamentals. It is a **high-volume product-recognition drill**.

---

## 1. Primary goal

After repeatedly using the page, the user should quickly recognize:

1. a Google Cloud product name and its defining purpose;
2. a product description/use case and the correct product name;
3. the important boundary between similar products;
4. the product that best matches common Professional Data Engineer exam wording.

Optimize for **fast repetition and discrimination between similar services**, not long explanations.

---

## 2. Hard scope: only two question formats

Every question must have **exactly 3 answer choices** and exactly 1 correct answer.

### Type A — product -> description

Show a product/service name, then three possible descriptions.

Example:

> **Cloud Composer**

- A managed Apache Airflow service for workflow orchestration. ✅
- A serverless execution engine for short API workflows.
- A SQL transformation framework for BigQuery.

### Type B — description -> product

Show a concise product description/use case, then three product names.

Example:

> Managed service for change data capture from operational databases into targets such as BigQuery and Cloud Storage.

- Datastream ✅
- Storage Transfer Service
- BigQuery Data Transfer Service

Do **not** add other question formats in the initial implementation.

---

## 3. Product knowledge philosophy

Questions must not be trivia such as launch dates, old branding, obscure limits, UI locations, or CLI flags.

Questions should test:

- primary purpose;
- data model;
- batch vs streaming;
- serverless vs cluster-based;
- storage vs compute vs orchestration vs governance;
- managed open-source technology;
- source/sink patterns;
- CDC vs periodic transfer vs bulk migration;
- analytics vs OLTP;
- relational vs key-value/document/wide-column/cache;
- global consistency / scaling characteristics where product-defining;
- data warehouse vs data lake vs lakehouse/governance;
- transformation vs orchestration;
- BI acceleration vs query execution capacity;
- security/governance responsibility;
- monitoring/operations;
- product-selection cues likely to appear in exam scenarios.

The correct answer should usually depend on a **defining differentiator**, not generic wording that applies to multiple products.

---

## 4. Product coverage

The quiz should heavily cover the services explicitly named in the current Professional Data Engineer exam guide, plus a controlled set of adjacent products/features that are important for distinguishing the correct answer.

### Priority P0 — must know extremely well

Generate the largest number of questions for these.

#### BigQuery ecosystem

- BigQuery
- BigQuery Storage Write API
- BigQuery Data Transfer Service
- BigQuery ML / BigQuery ML
- BigQuery BI Engine
- BigQuery materialized views
- BigQuery external tables
- BigQuery federated queries
- BigQuery sharing / Analytics Hub
- BigQuery Editions
- BigQuery reservations
- BigQuery slots / capacity management
- BigQuery scheduled queries
- BigQuery row-level security
- BigQuery column-level security / policy tags
- BigQuery dynamic data masking
- BigQuery search indexes
- BigQuery vector search / embeddings where relevant to current exam scope

Questions about BigQuery features should still obey the same two quiz formats. Treat important BigQuery features as selectable "products/features" when necessary.

#### Streaming and processing

- Dataflow
- Apache Beam
- Pub/Sub
- Dataproc
- Serverless for Apache Spark / Serverless Spark
- Apache Spark on Dataproc
- Hadoop ecosystem on Dataproc
- Cloud Data Fusion
- Dataform

#### Storage and databases

- Cloud Storage
- BigLake
- Bigtable
- Spanner
- Cloud SQL
- AlloyDB
- Firestore
- Memorystore for Redis / Memorystore
- Redis Cluster where relevant to failover/replication wording

#### Orchestration and automation

- Cloud Composer
- Workflows
- Dataform workflow execution / scheduling
- BigQuery scheduled queries

#### Data migration and ingestion

- Datastream
- Database Migration Service
- BigQuery Data Transfer Service
- Storage Transfer Service
- Transfer Appliance

#### Governance

- Dataplex
- Dataplex Catalog
- Analytics Hub

### Priority P1 — important supporting products/features

Generate substantial but fewer questions than P0.

#### Security and privacy

- Identity and Access Management (IAM)
- Organization Policy Service / organization policies
- Cloud KMS
- Customer-managed encryption keys (CMEK)
- Sensitive Data Protection / Cloud Data Loss Prevention (Cloud DLP)
- Secret Manager

Focus on data-engineering use cases, not generic security certification trivia.

#### Operations

- Cloud Monitoring
- Cloud Logging
- BigQuery administrative/resource monitoring capabilities

#### Networking relevant to moving/accessing data

- VPC
- Cloud VPN
- Cloud Interconnect
- Private Google Access
- Private Service Connect

Only include these when the question is clearly relevant to data connectivity, private access, migration, or managed data services. Do not turn this into a network engineer quiz.

#### AI/ML adjacent to current PDE scope

- BigQuery ML
- Vertex AI only where needed to distinguish it from BigQuery ML or data preparation for ML
- embeddings
- vector search
- retrieval-augmented generation (RAG)

The current exam guide explicitly includes preparing unstructured data for embeddings/RAG, but the site should stay focused on product selection rather than generic LLM theory.

### Priority P2 — use mainly as distractors or comparison material

These may appear when they create a useful distinction, but should not dominate the quiz.

- Looker / Looker Studio
- Cloud Run
- Cloud Functions
- Compute Engine
- GKE

Example: Workflows should not be confused with Cloud Functions/Cloud Run execution, but there is no reason to generate dozens of generic Cloud Run questions.

---

## 5. Important comparison sets

The question bank must deliberately train these boundaries.

### Processing

- Dataflow vs Dataproc
- Dataflow vs Serverless Spark
- Dataflow vs Cloud Data Fusion
- Dataproc persistent cluster vs job/serverless Spark
- Apache Beam vs Dataflow
- Spark vs Beam concepts only insofar as they identify the appropriate GCP service

### Transformation/orchestration

- Dataform vs Cloud Composer
- Dataform vs Workflows
- Cloud Composer vs Workflows
- Cloud Composer vs BigQuery scheduled queries
- Dataform vs BigQuery scheduled queries

Key distinctions:

- **Dataform**: SQL transformation/dependency workflow for analytics in BigQuery.
- **Cloud Composer**: managed Apache Airflow; broad data/workflow orchestration using DAGs.
- **Workflows**: serverless orchestration of services/APIs; not a data transformation engine and not Airflow.
- **Scheduled queries**: simple recurring BigQuery SQL; avoid a heavier orchestrator when unnecessary.

### Ingestion/migration

- Datastream vs Database Migration Service
- Datastream vs BigQuery Data Transfer Service
- Datastream vs Storage Transfer Service
- Storage Transfer Service vs Transfer Appliance
- Database Migration Service vs Transfer Appliance
- Pub/Sub vs Datastream
- Pub/Sub vs BigQuery Storage Write API

Key distinctions:

- **Datastream**: serverless CDC/change streams from operational sources.
- **Database Migration Service**: database migration to supported Google Cloud databases, with migration workflow concerns.
- **BigQuery Data Transfer Service**: scheduled/managed transfers into BigQuery from supported data sources.
- **Storage Transfer Service**: large-scale object/file data movement into/between storage systems.
- **Transfer Appliance**: physical/offline bulk transfer when network transfer is impractical.
- **Pub/Sub**: asynchronous messaging/event ingestion.
- **Storage Write API**: application/streaming writes directly into BigQuery.

### Storage/database selection

Train this set aggressively:

- BigQuery
- Bigtable
- Spanner
- Cloud SQL
- AlloyDB
- Firestore
- Memorystore
- Cloud Storage

Questions should force recognition of:

- analytical warehouse vs operational database;
- relational vs document vs wide-column/key-value vs cache;
- global/distributed relational semantics;
- low-latency massive key-based workloads;
- object storage;
- PostgreSQL-compatible high-performance relational database;
- managed conventional relational database;
- in-memory cache;
- serverless document database.

### Lake/lakehouse/governance

- Cloud Storage vs BigLake
- BigLake vs BigQuery external tables
- Dataplex vs BigLake
- Dataplex Catalog vs Analytics Hub
- Analytics Hub vs direct BigQuery dataset access/sharing

### BigQuery performance/cost

- partitioning vs clustering
- on-demand query pricing vs capacity/slots
- Editions vs reservations
- BI Engine vs materialized views
- materialized views vs normal views
- external table vs native BigQuery table

These can be represented as "feature -> description" and "description -> feature" questions.

### Security/governance

- IAM vs row-level security
- IAM vs column-level security
- column-level security/policy tags vs dynamic data masking
- CMEK / Cloud KMS vs Secret Manager
- Sensitive Data Protection / Cloud DLP vs IAM
- Dataplex Catalog vs IAM
- organization policy vs project-level IAM

---

## 6. Question-bank size

The site should contain **at least 350 high-quality questions** at first release.

Preferred target: **450–600** if quality remains high.

Do not reach the number by trivial rewording.

A product should have multiple questions only when they test different defining properties or different confusions.

Suggested rough weighting:

- BigQuery ecosystem: 25%
- ingestion + streaming + processing: 25%
- databases/storage: 20%
- orchestration/transformation: 10%
- migration: 8%
- governance/security: 7%
- operations/networking/AI-adjacent: 5%

The weighting is intentionally product-focused and does not need to exactly mirror exam section percentages.

---

## 7. Quality requirements for every question

Each question object should include:

- unique id;
- type: `product_to_description` or `description_to_product`;
- prompt;
- exactly 3 answers;
- correct answer index/id;
- short explanation;
- product/topic tags;
- priority: P0/P1/P2;
- optional confusion-set tag.

The explanation should be short, ideally **1–3 sentences**.

It must explain:

1. why the correct choice is correct;
2. the decisive distinction from the most tempting distractor.

Example:

> **Datastream** is the CDC service. Database Migration Service is designed around moving databases to supported Google Cloud database targets, while Datastream continuously exposes source changes for downstream pipelines.

---

## 8. Distractor rules

Distractors are critical.

Bad distractors:

- obviously unrelated products;
- invented product names;
- answers from different categories with no plausible confusion;
- wording that accidentally makes two choices correct.

Good distractors come from the same confusion set.

Examples:

- Dataflow / Dataproc / Cloud Data Fusion
- Composer / Workflows / Dataform
- Datastream / DMS / BigQuery DTS
- Bigtable / Spanner / Firestore
- BigQuery / Bigtable / Cloud SQL
- BigLake / Dataplex / Cloud Storage
- BI Engine / materialized views / reservations

For P0 products, deliberately generate many questions where the two wrong choices are the **two most plausible alternatives**.

---

## 9. Source and correctness policy

The question bank must be generated from **current official Google Cloud documentation first**.

Source priority:

1. current Professional Data Engineer exam guide;
2. current Google Cloud product documentation;
3. Google Cloud architecture documentation;
4. official Google Cloud product pages.

Do not trust old certification blog posts or old exam dumps for product behavior.

Do not include leaked or reconstructed real certification questions.

Avoid hard numeric limits unless they are both:

- important to product selection; and
- verified against current official docs.

Product names change. Prefer current names, and add old names only when they are still likely to appear in study materials, e.g. "Sensitive Data Protection (formerly Cloud DLP)" where useful.

---

## 10. Site implementation: intentionally minimal

Build this as a **plain static GitHub Pages site**.

Preferred implementation:

```
index.html
style.css
questions.js
app.js
README.md
```

No framework.

Do not use:

- React;
- Vue;
- Svelte;
- Next.js;
- npm;
- bundlers;
- backend;
- database;
- authentication;
- analytics;
- external UI libraries.

The page must run by opening `index.html` and be deployable directly by GitHub Pages.

Use only vanilla HTML, CSS, and JavaScript.

---

## 11. UI

Keep the interface extremely simple.

Main screen:

```
GCP Data Engineer Product Quiz

Question 41 / 500
Score: 34 / 40

[ question ]

[ answer A ]
[ answer B ]
[ answer C ]

[ short explanation after answering ]

[ Next ]
```

Requirements:

- desktop and mobile usable;
- keyboard shortcuts: 1 / 2 / 3 for answers, Enter for next;
- answers visually indicate correct/incorrect after selection;
- do not allow changing an answer after selection;
- shuffle questions on page load;
- shuffle answer order;
- avoid repeating a question until the current deck is exhausted;
- no timer by default.

Optional but still simple:

- filter: All / P0 only;
- filter by domain;
- "Wrong answers only" review mode.

Do not add dashboards, charts, animations, accounts, achievements, streaks, or gamification in v1.

---

## 12. Local persistence

Use `localStorage` only.

Store:

- total attempts;
- correct count;
- per-question wrong/correct history if simple;
- set of questions answered incorrectly for review mode.

Provide a small **Reset progress** button.

No cloud state.

---

## 13. Question-bank maintainability

Keep the questions as data, separate from UI logic.

Preferred shape:

```js
{
  id: "datastream-001",
  type: "description_to_product",
  prompt: "Serverless change data capture from operational databases for downstream analytics pipelines.",
  answers: ["Datastream", "Database Migration Service", "Storage Transfer Service"],
  correct: 0,
  explanation: "Datastream is the CDC service. DMS focuses on database migration, while Storage Transfer Service moves object/file data.",
  tags: ["ingestion", "cdc", "datastream"],
  priority: "P0",
  confusionSet: "migration-ingestion"
}
```

Add a lightweight validation function that fails loudly in the browser console if:

- ids are duplicated;
- a question does not have exactly 3 answers;
- correct index is invalid;
- an answer is duplicated;
- required fields are missing.

If practical, also create a tiny validation script, but do not introduce a build system merely for validation.

---

## 14. Generation workflow for agents

Implement in phases.

### Phase 1 — research and taxonomy

Before writing the quiz UI:

1. read the current Professional Data Engineer exam guide;
2. verify current names and purposes of all P0 products;
3. create a product taxonomy;
4. create confusion sets;
5. identify obsolete/deprecated names that should not be used as primary answers.

### Phase 2 — question generation

Generate questions in batches by domain.

For every batch:

1. verify facts against official docs;
2. prefer differentiating properties;
3. check there is exactly one correct answer;
4. avoid duplicate semantics;
5. use plausible distractors;
6. keep prompt/answers compact.

Do not bulk-generate 500 questions blindly and assume they are correct.

### Phase 3 — static UI

Implement the minimal static page.

### Phase 4 — QA

Programmatically validate the whole question bank.

Check:

- count >= 350;
- every question has exactly 3 unique choices;
- unique ids;
- answer index valid;
- no identical prompts;
- priority present;
- all P0 products have meaningful coverage;
- confusion sets have questions in both directions where useful.

Then manually inspect a sample from each product family.

### Phase 5 — GitHub Pages

Configure the repository so the static site can be hosted from the `main` branch using GitHub Pages.

Keep deployment as simple as possible. Do not add GitHub Actions unless GitHub Pages configuration actually requires it.

---

## 15. Minimum P0 coverage checklist

The first complete version should not be accepted until these are represented well:

- [ ] BigQuery
- [ ] BigQuery Storage Write API
- [ ] BigQuery Data Transfer Service
- [ ] BigQuery ML
- [ ] BI Engine
- [ ] materialized views
- [ ] external/federated access
- [ ] Editions / reservations / slots
- [ ] BigQuery sharing / Analytics Hub
- [ ] Dataflow
- [ ] Apache Beam
- [ ] Pub/Sub
- [ ] Dataproc
- [ ] Serverless for Apache Spark
- [ ] Cloud Data Fusion
- [ ] Dataform
- [ ] Cloud Composer
- [ ] Workflows
- [ ] Cloud Storage
- [ ] BigLake
- [ ] Bigtable
- [ ] Spanner
- [ ] Cloud SQL
- [ ] AlloyDB
- [ ] Firestore
- [ ] Memorystore / Redis
- [ ] Datastream
- [ ] Database Migration Service
- [ ] Storage Transfer Service
- [ ] Transfer Appliance
- [ ] Dataplex
- [ ] Dataplex Catalog
- [ ] IAM
- [ ] Cloud KMS / CMEK
- [ ] Sensitive Data Protection / Cloud DLP
- [ ] Cloud Monitoring
- [ ] Cloud Logging

---

## 16. Explicit non-goals

Do not build:

- a full mock Professional Data Engineer exam;
- generic architecture scenario questions;
- long lessons;
- flashcard essays;
- coding exercises;
- SQL exercises;
- data engineering theory quizzes;
- login/user system;
- backend/API;
- AI question generation at runtime;
- live calls to Google APIs.

This project is deliberately narrower:

> **See product -> know what it does. See requirement -> know which product fits. Know why similar products are different.**

---

## 17. Definition of done

The project is done when:

1. GitHub Pages serves a fast static page.
2. There are at least 350 non-trivial questions.
3. Every question has exactly 3 choices.
4. Both required question directions are well represented.
5. P0 products have strong coverage.
6. Distractors come mainly from meaningful confusion sets.
7. Questions are based on current official documentation.
8. The app works with no backend and no build step.
9. Progress/review works through localStorage.
10. A user can spend 10–20 minutes drilling product recognition without needing any other UI or setup.

When making implementation decisions, choose the **simpler** option unless added complexity clearly improves product-recognition learning.
