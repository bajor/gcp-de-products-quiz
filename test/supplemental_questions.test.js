const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

function loadQuestions() {
  const sandbox = { globalThis: {} };
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(path.join(__dirname, "..", "questions.js"), "utf8"), sandbox);
  vm.runInContext(fs.readFileSync(path.join(__dirname, "..", "supplemental_questions.js"), "utf8"), sandbox);
  return sandbox.globalThis.GCP_DE_SUPPLEMENTAL_QUESTIONS;
}

const questions = loadQuestions();
const expectedTopics = new Set([
  "authorized-view",
  "reservations",
  "scheduled-query",
  "query-priority",
  "hll",
  "iceberg",
  "bigtable",
  "firestore",
  "cloud-sql",
  "cmek",
  "snapshots",
  "pubsub",
  "pseudonymization",
  "iam",
  "document-ai"
]);

test("simulator gap bank contains two questions per failed topic", () => {
  assert.equal(questions.length, 30);
  const covered = new Set();
  questions.forEach((question) => {
    question.tags.forEach((tag) => {
      if (expectedTopics.has(tag)) covered.add(tag);
    });
  });
  assert.deepEqual([...covered].sort(), [...expectedTopics].sort());
});

test("supplemental questions are valid four-answer P0 questions", () => {
  const ids = new Set();
  questions.forEach((question) => {
    assert.match(question.id, /^simulator-gap-/);
    assert.equal(ids.has(question.id), false, question.id);
    ids.add(question.id);
    assert.ok(["description_to_product", "product_to_description"].includes(question.type), question.id);
    assert.equal(question.answers.length, 4, question.id);
    assert.equal(new Set(question.answers.map((answer) => answer.trim().toLowerCase())).size, 4, question.id);
    assert.ok(question.answers.every((answer) => typeof answer === "string" && answer.trim()), question.id);
    assert.ok(Number.isInteger(question.correct) && question.correct >= 0 && question.correct < 4, question.id);
    assert.ok(Array.isArray(question.tags) && question.tags.length > 0, question.id);
    assert.equal(question.priority, "P0", question.id);
  });
});
