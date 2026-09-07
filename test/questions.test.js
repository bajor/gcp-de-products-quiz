const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

function loadQuestions() {
  const sandbox = { globalThis: {} };
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(path.join(__dirname, "..", "questions.js"), "utf8"), sandbox);
  return sandbox.globalThis.GCP_DE_QUESTIONS;
}

const questions = loadQuestions();

test("every active question has four answers", () => {
  questions.forEach((question) => {
    assert.equal(question.answers.length, 4, question.id);
  });
});

test("every active answer is a string", () => {
  questions.forEach((question) => {
    question.answers.forEach((answer) => {
      assert.equal(typeof answer, "string", question.id);
    });
  });
});

test("every active answer is non-blank", () => {
  questions.forEach((question) => {
    question.answers.forEach((answer) => {
      assert.notEqual(answer.trim(), "", question.id);
    });
  });
});

test("every active answer excludes placeholder text", () => {
  questions.forEach((question) => {
    question.answers.forEach((answer) => {
      assert.notEqual(answer.trim().toLowerCase(), "lorem ipsum", question.id);
    });
  });
});

test("every active question has unique answers", () => {
  questions.forEach((question) => {
    const normalizedAnswers = question.answers.map((answer) => answer.trim().toLowerCase());
    assert.equal(new Set(normalizedAnswers).size, 4, question.id);
  });
});
