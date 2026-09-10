(function () {
  "use strict";

  const questions = [
    {
      id: "simulator-gap-authorized-view-001",
      type: "description_to_product",
      prompt: "Auditors need an always-current EU-only aggregate from a sensitive BigQuery dataset, but they must not receive direct access to the source dataset or individual rows. No data copy is wanted. What should you use?",
      answers: ["An authorized BigQuery logical view", "Row-level security on the source table plus source-table access", "Column-level security on the source table plus source-table access", "A scheduled query that copies aggregates to another table"],
      correct: 0,
      explanation: "An authorized view lets principals query the view while the view, not the principals, is authorized to read the source data. Its SQL can enforce filtering and aggregation without copying the data.",
      tags: ["bigquery", "security", "authorized-view"], priority: "P0", confusionSet: "simulator-security-access"
    },
    {
      id: "simulator-gap-authorized-view-002",
      type: "description_to_product",
      prompt: "Which design best separates consumers of an authorized BigQuery view from its sensitive source data?",
      answers: ["Store the authorized view in a separate dataset in the same location, authorize it on the source dataset, and grant consumers access only to the view dataset", "Store the view in the source dataset and grant consumers BigQuery Data Viewer on that source dataset", "Grant consumers source-table access and rely on the view as a convention", "Materialize the source table into another region and grant consumers access there"],
      correct: 0,
      explanation: "Google recommends placing an authorized view in a different dataset from the source; the source and view datasets must be in the same location. Consumers need access to the view, not to the source dataset.",
      tags: ["bigquery", "security", "authorized-view"], priority: "P0", confusionSet: "simulator-security-access"
    },
    {
      id: "simulator-gap-reservations-001",
      type: "description_to_product",
      prompt: "A BigQuery reservation needs 200 slots always available and must autoscale to no more than 800 slots total. Which configuration matches the requirement?",
      answers: ["Baseline slots = 200; maximum reservation size = 800", "Baseline slots = 200; maximum reservation size = 1000", "Baseline slots = 800; maximum reservation size = 1000", "Baseline slots = 0; maximum reservation size = 600"],
      correct: 0,
      explanation: "The maximum reservation size is the total autoscaled reservation size. Available autoscaling capacity is max reservation size minus baseline, so 800 - 200 = 600 autoscaling slots.",
      tags: ["bigquery", "reservations", "slots"], priority: "P0", confusionSet: "simulator-bigquery-capacity"
    },
    {
      id: "simulator-gap-reservations-002",
      type: "description_to_product",
      prompt: "Two BigQuery workloads require separate capacity pools so that one workload cannot consume the other's idle slots. What is the relevant reservation design?",
      answers: ["Use separate reservations and set ignore_idle_slots = true where borrowing must be prevented", "Put both workloads in one reservation and separate them with job labels", "Use one reservation and set query priority to BATCH for both workloads", "Use BI Engine reservations to isolate SQL slot capacity"],
      correct: 0,
      explanation: "Separate reservations create distinct capacity pools. By default a reservation can use eligible idle slots from other reservations; ignore_idle_slots=true prevents that reservation from borrowing idle slots.",
      tags: ["bigquery", "reservations", "slots"], priority: "P0", confusionSet: "simulator-bigquery-capacity"
    },
    {
      id: "simulator-gap-scheduled-query-001",
      type: "description_to_product",
      prompt: "A daily BigQuery MERGE is scheduled for 02:15 UTC. If the run starts late, it must still process the business date associated with the intended schedule. Which value should drive the date?",
      answers: ["The scheduled-query parameter @run_date or @run_time", "CURRENT_DATE() evaluated when the SQL actually starts", "The Cloud Composer task wall-clock start time", "The timestamp when the first row is read"],
      correct: 0,
      explanation: "For scheduled queries, @run_time represents the intended execution time and @run_date represents the logical calendar date. Wall-clock functions can select the wrong business date after a delayed run.",
      tags: ["bigquery", "scheduling", "scheduled-query"], priority: "P0", confusionSet: "simulator-bigquery-scheduling"
    },
    {
      id: "simulator-gap-scheduled-query-002",
      type: "description_to_product",
      prompt: "A single dependency-free BigQuery SQL statement must run once per day with the least operational overhead. Which scheduler is the best fit?",
      answers: ["BigQuery scheduled queries", "Cloud Composer", "A permanently running Cloud Run service with a sleep loop", "A Dataflow streaming pipeline"],
      correct: 0,
      explanation: "BigQuery scheduled queries are the managed low-overhead choice for recurring BigQuery SQL with no external workflow dependencies. Composer is justified when DAG-style orchestration is actually needed.",
      tags: ["bigquery", "scheduling", "scheduled-query"], priority: "P0", confusionSet: "simulator-bigquery-scheduling"
    },
    {
      id: "simulator-gap-query-priority-001",
      type: "description_to_product",
      prompt: "A BigQuery aggregation has no completion deadline and should wait when capacity is constrained so interactive analyst queries can start as soon as possible. Which query priority should you choose?",
      answers: ["BATCH", "INTERACTIVE", "CONTINUOUS", "A job label named low-priority"],
      correct: 0,
      explanation: "Batch queries have lower priority than interactive queries and are more likely to remain queued when project or reservation compute is fully used. After a batch query starts, it executes like an interactive query.",
      tags: ["bigquery", "query-priority", "batch"], priority: "P0", confusionSet: "simulator-bigquery-scheduling"
    },
    {
      id: "simulator-gap-query-priority-002",
      type: "product_to_description",
      prompt: "Which statement about BigQuery BATCH query priority is correct?",
      answers: ["It primarily changes admission priority: when capacity is busy, batch work is more likely to wait; after it starts, execution is the same as an interactive query", "It permanently limits the query to fewer slots than an interactive query", "It guarantees the query starts within a fixed number of minutes", "It makes the query use BI Engine instead of normal BigQuery slots"],
      correct: 0,
      explanation: "BATCH is an admission-priority choice, not a different SQL execution engine or fixed slot cap.",
      tags: ["bigquery", "query-priority", "batch"], priority: "P0", confusionSet: "simulator-bigquery-scheduling"
    },
    {
      id: "simulator-gap-hll-001",
      type: "description_to_product",
      prompt: "Raw viewer IDs are retained for only 30 days, but quarterly reports need approximate unique viewers across arbitrary date ranges. A viewer can appear on many days. What should daily rollups store?",
      answers: ["HLL_COUNT.INIT(viewer_id) sketches that can later be combined with HLL_COUNT.MERGE", "COUNT(DISTINCT viewer_id) per day and then sum the daily counts", "APPROX_COUNT_DISTINCT(viewer_id) per day and then average the estimates", "The maximum viewer_id observed each day"],
      correct: 0,
      explanation: "HLL_COUNT.INIT produces mergeable HLL++ sketch state. Merging the sketches approximates the cardinality of the union across overlapping days without retaining raw identifiers.",
      tags: ["bigquery", "approximation", "hll"], priority: "P0", confusionSet: "simulator-bigquery-aggregation"
    },
    {
      id: "simulator-gap-hll-002",
      type: "product_to_description",
      prompt: "What is the important difference between BigQuery APPROX_COUNT_DISTINCT and the HLL_COUNT functions for pre-aggregated rollups?",
      answers: ["APPROX_COUNT_DISTINCT returns a scalar estimate, while HLL_COUNT.INIT can persist mergeable sketch state for later aggregation", "APPROX_COUNT_DISTINCT is exact, while HLL_COUNT is approximate", "HLL_COUNT works only on strings, while APPROX_COUNT_DISTINCT works on all scalar types", "HLL_COUNT cannot combine sketches from multiple groups"],
      correct: 0,
      explanation: "A scalar daily estimate is not enough to reconstruct the cardinality of a union. HLL++ sketches preserve mergeable probabilistic set state.",
      tags: ["bigquery", "approximation", "hll"], priority: "P0", confusionSet: "simulator-bigquery-aggregation"
    },
    {
      id: "simulator-gap-iceberg-001",
      type: "description_to_product",
      prompt: "BigQuery must be the authoritative writer using GoogleSQL DML and high-throughput Storage Write API ingestion. Data must stay in a customer-owned Cloud Storage bucket in Apache Iceberg format, and Spark must read the same physical copy. What should you create?",
      answers: ["An Apache Iceberg managed table in BigQuery", "An Apache Iceberg external table registered in BigQuery", "A standard native BigQuery table with periodic Parquet exports", "A plain Cloud Storage external table over Parquet files"],
      correct: 0,
      explanation: "BigQuery-managed Iceberg tables store open-format data in customer-owned Cloud Storage while supporting BigQuery DML, Storage Write API ingestion, managed optimization, and Iceberg metadata for external readers such as Spark.",
      tags: ["bigquery", "iceberg", "lakehouse"], priority: "P0", confusionSet: "simulator-lakehouse"
    },
    {
      id: "simulator-gap-iceberg-002",
      type: "product_to_description",
      prompt: "Which distinction is correct for an Apache Iceberg managed table owned by BigQuery?",
      answers: ["BigQuery manages mutations and table maintenance; open-source engines can read the Iceberg snapshot, but direct open-source writes to the BigQuery-managed table are not supported", "Spark and BigQuery are unrestricted concurrent writers to the same BigQuery-managed Iceberg table", "The table uses only BigQuery proprietary storage and exports Iceberg files on demand", "BigQuery can query it but cannot run INSERT, UPDATE, DELETE, or MERGE"],
      correct: 0,
      explanation: "BigQuery-managed Iceberg tables support BigQuery writes and open-format reads. For this table type, open-source engine writes are not supported; BigQuery remains the manager of mutations and metadata.",
      tags: ["bigquery", "iceberg", "lakehouse"], priority: "P0", confusionSet: "simulator-lakehouse"
    },
    {
      id: "simulator-gap-bigtable-key-001",
      type: "description_to_product",
      prompt: "A Bigtable table receives one telemetry event per second from each of 50,000 devices. The application reads the newest 15 minutes for one device, newest first. Which row-key pattern best fits?",
      answers: ["device_id#reversed_timestamp", "timestamp#device_id", "hash(device_id#timestamp) as the entire key", "device_id as one row with every event appended as another cell forever"],
      correct: 0,
      explanation: "Bigtable sorts row keys lexicographically. A high-cardinality device prefix distributes writes and keeps one device's rows contiguous; a reversed timestamp places the newest rows first within that prefix.",
      tags: ["storage", "bigtable", "row-key"], priority: "P0", confusionSet: "simulator-bigtable-schema"
    },
    {
      id: "simulator-gap-bigtable-key-002",
      type: "product_to_description",
      prompt: "Why is an increasing timestamp a poor prefix for a high-write-rate Bigtable row key?",
      answers: ["Sequential writes concentrate in a narrow key range and can hotspot a tablet", "Timestamps cannot be encoded in Bigtable row keys", "Bigtable sorts rows randomly, so timestamps provide no ordering", "A timestamp prefix forces every query to become a full table scan"],
      correct: 0,
      explanation: "Bigtable rows are lexicographically ordered. Monotonically increasing prefixes direct new writes to the same end of the key space, creating a hotspot.",
      tags: ["storage", "bigtable", "row-key"], priority: "P0", confusionSet: "simulator-bigtable-schema"
    },
    {
      id: "simulator-gap-firestore-001",
      type: "description_to_product",
      prompt: "A Firestore operation reads a document balance and updates it based on the value read. Another client might update the same document concurrently. Which atomic mechanism should you use?",
      answers: ["A Firestore transaction", "A batched write with no reads", "A collection group query followed by independent writes", "A BigQuery multi-statement transaction"],
      correct: 0,
      explanation: "Firestore transactions support read-modify-write logic. If a document read by the transaction changes concurrently, Firestore retries the transaction.",
      tags: ["storage", "firestore", "transactions"], priority: "P0", confusionSet: "simulator-firestore"
    },
    {
      id: "simulator-gap-firestore-002",
      type: "product_to_description",
      prompt: "When should you prefer a Firestore batched write over a transaction?",
      answers: ["When several writes must commit atomically but the write decisions do not depend on values read inside the operation", "When the new values depend on current document values that may change concurrently", "When you need Firestore to rerun read logic after a conflict", "When you need a relational transaction spanning Firestore and Cloud SQL"],
      correct: 0,
      explanation: "A batched write is an atomic set of writes without transaction read semantics. Use a transaction when the writes depend on current values read from Firestore.",
      tags: ["storage", "firestore", "transactions"], priority: "P0", confusionSet: "simulator-firestore"
    },
    {
      id: "simulator-gap-cloudsql-ha-001",
      type: "description_to_product",
      prompt: "A Cloud SQL for MySQL instance must survive a zonal outage with managed in-region failover, no loss of committed writes, and roughly a minute of reconnection time. Read scaling is unnecessary. What should you configure?",
      answers: ["Regional high availability with a standby in another zone", "A standalone zonal instance plus point-in-time recovery", "An asynchronous read replica in another zone that operators promote manually", "Several read replicas in the same zone as the primary"],
      correct: 0,
      explanation: "Cloud SQL regional HA uses a primary and standby across zones with synchronous persistence and managed failover. Read replicas and PITR are different recovery mechanisms and do not provide the same automatic zero-committed-write-loss zonal failover.",
      tags: ["storage", "cloud-sql", "high-availability"], priority: "P0", confusionSet: "simulator-cloudsql-ha"
    },
    {
      id: "simulator-gap-cloudsql-ha-002",
      type: "product_to_description",
      prompt: "What should an application expect when a Cloud SQL regional HA failover occurs?",
      answers: ["Existing connections close; after failover the application reconnects using the same connection string or IP address", "The application must discover and permanently switch to the read replica's new endpoint", "All existing database connections remain open throughout failover", "The standby remains read-only and cannot become the primary automatically"],
      correct: 0,
      explanation: "Cloud SQL HA failover closes existing connections, but the standby takes over behind the shared endpoint. Google documents roughly 60 seconds of unavailability as a typical expectation, depending on environment.",
      tags: ["storage", "cloud-sql", "high-availability"], priority: "P0", confusionSet: "simulator-cloudsql-ha"
    },
    {
      id: "simulator-gap-dataflow-cmek-001",
      type: "description_to_product",
      prompt: "A Dataflow job runs in us-central1 and must use a customer-managed encryption key for Dataflow-managed pipeline state. Which key location is valid?",
      answers: ["A regional Cloud KMS key in us-central1", "A global Cloud KMS key", "A multi-region US Cloud KMS key", "A regional Cloud KMS key in europe-west1"],
      correct: 0,
      explanation: "For Dataflow CMEK, the Cloud KMS key and Dataflow job must be in the same region. Global and multi-region keys are not supported for Dataflow pipelines.",
      tags: ["processing", "dataflow", "cmek"], priority: "P0", confusionSet: "simulator-dataflow-security"
    },
    {
      id: "simulator-gap-dataflow-cmek-002",
      type: "description_to_product",
      prompt: "A Dataflow job uses a CMEK for pipeline state and its temporary/staging objects in Cloud Storage. Granting the submitting engineer access to the key is not sufficient. What else is required?",
      answers: ["Grant the required KMS Encrypter/Decrypter access to the service identities that perform Dataflow/Compute operations, and configure the Cloud Storage bucket default CMEK with its service agent authorized", "Only grant BigQuery Data Editor to the submitting engineer", "Put the key in Secret Manager and pass its plaintext value to workers", "Use a global key so every Google Cloud service can decrypt it automatically"],
      correct: 0,
      explanation: "Services use service identities to perform encryption operations. Dataflow CMEK needs the relevant Dataflow/Compute identities to use the key, while CMEK-protected Cloud Storage objects use the bucket's default key and Cloud Storage service agent.",
      tags: ["processing", "dataflow", "cmek"], priority: "P0", confusionSet: "simulator-dataflow-security"
    },
    {
      id: "simulator-gap-dataflow-snapshot-001",
      type: "description_to_product",
      prompt: "A stateful Pub/Sub-to-Dataflow streaming job needs a compatible replacement version that resumes both pipeline state and the previous Pub/Sub source position. What snapshot should you create?",
      answers: ["A Dataflow snapshot with data sources", "A Dataflow snapshot without data sources", "Only a Pub/Sub topic snapshot with no Dataflow snapshot", "No snapshot; cancel and start from the topic again"],
      correct: 0,
      explanation: "A Dataflow snapshot with data sources captures the streaming job state and Pub/Sub source snapshots. A replacement created from it automatically seeks to the Pub/Sub snapshots.",
      tags: ["processing", "dataflow", "snapshots"], priority: "P0", confusionSet: "simulator-dataflow-recovery"
    },
    {
      id: "simulator-gap-dataflow-snapshot-002",
      type: "product_to_description",
      prompt: "Which constraint applies when creating a new Dataflow job from a Dataflow snapshot?",
      answers: ["The new job must run in the same region as the snapshot; jobs created from snapshots use Streaming Engine", "The new job must run in a different region for resilience", "The snapshot removes update compatibility checks", "The replacement must use different Pub/Sub topics from the source job"],
      correct: 0,
      explanation: "Jobs created from snapshots must run in the snapshot's region, use Streaming Engine, and remain subject to update compatibility checks. If source snapshots are included, the same Pub/Sub topics must be specified.",
      tags: ["processing", "dataflow", "snapshots"], priority: "P0", confusionSet: "simulator-dataflow-recovery"
    },
    {
      id: "simulator-gap-pubsub-import-001",
      type: "description_to_product",
      prompt: "Pub/Sub must continuously ingest an existing Confluent Cloud Kafka topic without operating a separate connector. Which Pub/Sub construct represents Confluent Cloud as the source?",
      answers: ["A Confluent Cloud import topic", "A Pub/Sub export subscription", "A normal pull subscription pointed at the Kafka bootstrap server", "A BigQuery subscription"],
      correct: 0,
      explanation: "An import topic ingests from an external streaming source into Pub/Sub. Export subscriptions move Pub/Sub messages outward to supported destinations, so they represent the opposite direction.",
      tags: ["ingestion", "pubsub", "import-topic"], priority: "P0", confusionSet: "simulator-pubsub-import"
    },
    {
      id: "simulator-gap-pubsub-import-002",
      type: "description_to_product",
      prompt: "A Confluent Cloud topic already contains backlog. Pub/Sub ingestion must start without a gap in which imported messages arrive before any subscription exists. What setup order should you use?",
      answers: ["Create a standard Pub/Sub topic and subscription first, then convert/configure the topic as a Confluent Cloud import topic", "Create the import topic first, wait for ACTIVE, and only then create a subscription", "Create an export subscription first and point it at Confluent Cloud", "Create only the import topic because Pub/Sub retains messages even when no subscription exists"],
      correct: 0,
      explanation: "Google documents creating the topic and subscription before enabling import ingestion to avoid the short topic-with-no-subscription window. Confluent import supports federated identity and reads the Kafka topic from the earliest offset.",
      tags: ["ingestion", "pubsub", "import-topic"], priority: "P0", confusionSet: "simulator-pubsub-import"
    },
    {
      id: "simulator-gap-aes-siv-001",
      type: "description_to_product",
      prompt: "Patient identifiers must be pseudonymized so equal identifiers produce equal tokens across daily runs, analysts can join on the token, and an authorized process can later re-identify a patient. Preserving the original length and character set is not required. Which Sensitive Data Protection transform is the best fit?",
      answers: ["CryptoDeterministicConfig using AES-SIV with a stable key and consistent context", "CryptoHashConfig using HMAC-SHA-256", "CryptoReplaceFfxFpeConfig with a new key every day", "A transient AES-SIV key generated separately for every API request"],
      correct: 0,
      explanation: "AES-SIV deterministic encryption is reversible and preserves referential integrity when the same key and context are reused. HMAC hashing is one-way; FPE is mainly for strict format preservation; transient keys do not preserve cross-request identity.",
      tags: ["security", "sensitive-data-protection", "pseudonymization"], priority: "P0", confusionSet: "simulator-pseudonymization"
    },
    {
      id: "simulator-gap-aes-siv-002",
      type: "product_to_description",
      prompt: "Which Sensitive Data Protection pseudonymization distinction is correct?",
      answers: ["AES-SIV and FPE-FFX are reversible; HMAC-SHA-256 hashing is not. FPE-FFX is chosen when preserving input length and character set is required", "HMAC-SHA-256 is reversible while AES-SIV is one-way", "AES-SIV always preserves the original length and alphabet", "A transient cryptographic key is appropriate when tokens must remain stable across independent daily runs"],
      correct: 0,
      explanation: "Deterministic AES-SIV and FPE support re-identification with the original key. HMAC hashing does not. FPE's special purpose is format preservation; AES-SIV is generally preferred when that constraint is absent.",
      tags: ["security", "sensitive-data-protection", "pseudonymization"], priority: "P0", confusionSet: "simulator-pseudonymization"
    },
    {
      id: "simulator-gap-iam-isolation-001",
      type: "description_to_product",
      prompt: "Developers must administer development pipelines but have only read access to production data. Production changes must come through an approved deployment pipeline, and audit attribution must be separated by environment. Which hierarchy and identity design is best?",
      answers: ["Separate dev and prod folders/projects, apply environment-specific IAM, and use dedicated least-privilege deployment service accounts", "Put dev and prod in one project, grant developers Editor, and use one shared pipeline service account", "Use separate projects but one Owner-level service account for both environments", "Grant developers Editor at the organization root and rely on project naming conventions"],
      correct: 0,
      explanation: "Folders/projects create meaningful trust and policy boundaries. Environment-specific IAM plus separate least-privilege service accounts reduces blast radius and makes audit attribution clearer.",
      tags: ["governance", "iam", "resource-hierarchy"], priority: "P0", confusionSet: "simulator-iam-boundaries"
    },
    {
      id: "simulator-gap-iam-isolation-002",
      type: "product_to_description",
      prompt: "Why does granting the Editor role to a developer group at the Google Cloud organization root defeat dev/prod isolation?",
      answers: ["Allow policies are inherited downward, so the broad organization-level grant becomes effective on descendant folders, projects, and supported resources", "Project IAM always overrides and removes permissions inherited from the organization", "Organization-level IAM applies only to billing and not to project resources", "Folders do not participate in IAM inheritance"],
      correct: 0,
      explanation: "Google Cloud allow policies are additive and inherited down the resource hierarchy. A broad parent-level grant therefore propagates into production unless constrained by a different mechanism such as deny policies.",
      tags: ["governance", "iam", "resource-hierarchy"], priority: "P0", confusionSet: "simulator-iam-boundaries"
    },
    {
      id: "simulator-gap-document-ai-001",
      type: "description_to_product",
      prompt: "A nightly set of PDF invoices in Cloud Storage must produce structured invoice fields such as invoice number, supplier, due date, total amount, and line-item quantities and unit prices. No custom schema or model training is wanted. Which processor should you choose?",
      answers: ["Document AI Invoice Parser", "Document AI Enterprise Document OCR", "Cloud Vision DOCUMENT_TEXT_DETECTION", "A custom Document AI extractor trained from labeled invoices"],
      correct: 0,
      explanation: "Invoice Parser is a pretrained Document AI processor that performs OCR plus invoice-specific entity extraction, including header and line-item fields.",
      tags: ["ai", "document-ai", "invoice-parser"], priority: "P0", confusionSet: "simulator-document-ai"
    },
    {
      id: "simulator-gap-document-ai-002",
      type: "description_to_product",
      prompt: "Many invoice PDFs in Cloud Storage must be processed in one asynchronous operation, with Document AI results written back to Cloud Storage as JSON. Which processing method fits?",
      answers: ["Document AI batchProcess", "Document AI process called synchronously once for each document", "Cloud Vision synchronous annotateImage", "A BigQuery scheduled query over the PDF bytes"],
      correct: 0,
      explanation: "Document AI batchProcess is the long-running asynchronous method for processing many documents; its output is written to Cloud Storage in Document JSON format.",
      tags: ["ai", "document-ai", "batch-processing"], priority: "P0", confusionSet: "simulator-document-ai"
    }
  ];

  if (!Array.isArray(globalThis.GCP_DE_QUESTIONS)) {
    throw new Error("questions.js must be loaded before supplemental_questions.js");
  }

  globalThis.GCP_DE_QUESTIONS.push(...questions);
  globalThis.GCP_DE_SUPPLEMENTAL_QUESTIONS = questions;
})();
