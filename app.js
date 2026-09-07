(function () {
  "use strict";

  const STORAGE_KEY = "gcpPdeProductQuizProgress.v1";
  const REQUIRED_COUNT = 350;
  const PROMPT_PREFIX = "A data platform team must choose an architecture component whose trade-offs fit this requirement: ";
  const state = {
    questions: [],
    deck: [],
    index: 0,
    current: null,
    selected: false,
    sessionAttempts: 0,
    sessionCorrect: 0,
    progress: loadProgress()
  };

  const elements = {
    priorityFilter: document.getElementById("priority-filter"),
    domainFilter: document.getElementById("domain-filter"),
    wrongOnly: document.getElementById("wrong-only"),
    questionCount: document.getElementById("question-count"),
    score: document.getElementById("score"),
    emptyState: document.getElementById("empty-state"),
    quizPanel: document.getElementById("quiz-panel"),
    questionType: document.getElementById("question-type"),
    prompt: document.getElementById("prompt"),
    answers: document.getElementById("answers"),
    explanation: document.getElementById("explanation"),
    nextButton: document.getElementById("next-button"),
    resetButton: document.getElementById("reset-button"),
    bankStatus: document.getElementById("bank-status")
  };

  init();

  function init() {
    state.questions = window.GCP_DE_QUESTIONS || [];
    if (!validateQuestions(state.questions)) {
      elements.bankStatus.textContent = "Question bank validation failed. See the browser console for details.";
      return;
    }
    populateDomainFilter(state.questions);
    bindEvents();
    rebuildDeck();
    elements.bankStatus.textContent = `${state.questions.length} questions loaded. Progress is stored in this browser only.`;
  }

  function bindEvents() {
    elements.priorityFilter.addEventListener("change", rebuildDeck);
    elements.domainFilter.addEventListener("change", rebuildDeck);
    elements.wrongOnly.addEventListener("change", rebuildDeck);
    elements.nextButton.addEventListener("click", showNextQuestion);
    elements.resetButton.addEventListener("click", resetProgress);
    document.addEventListener("keydown", handleKeydown);
  }

  function loadProgress() {
    const fallback = { totalAttempts: 0, correctCount: 0, history: {}, wrongIds: [] };
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? { ...fallback, ...JSON.parse(stored) } : fallback;
    } catch (error) {
      console.warn("Could not read quiz progress. Starting with empty progress.", error);
      return fallback;
    }
  }

  function saveProgress() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.progress));
  }

  function resetProgress() {
    if (!confirm("Reset all stored quiz progress?")) {
      return;
    }

    state.progress = { totalAttempts: 0, correctCount: 0, history: {}, wrongIds: [] };
    state.sessionAttempts = 0;
    state.sessionCorrect = 0;
    saveProgress();
    rebuildDeck();
  }

  function populateDomainFilter(questions) {
    const domains = new Set();
    questions.forEach((question) => {
      const domain = question.tags && question.tags[0];
      if (domain) {
        domains.add(domain);
      }
    });

    [...domains].sort().forEach((domain) => {
      const option = document.createElement("option");
      option.value = domain;
      option.textContent = labelize(domain);
      elements.domainFilter.append(option);
    });
  }

  function rebuildDeck() {
    const priority = elements.priorityFilter.value;
    const domain = elements.domainFilter.value;
    const wrongIds = new Set(state.progress.wrongIds);

    state.deck = state.questions.filter((question) => {
      if (priority !== "all" && question.priority !== priority) {
        return false;
      }
      if (domain !== "all" && (!question.tags || question.tags[0] !== domain)) {
        return false;
      }
      if (elements.wrongOnly.checked && !wrongIds.has(question.id)) {
        return false;
      }
      return true;
    });

    shuffle(state.deck);
    state.index = 0;
    renderDeckState();
  }

  function renderDeckState() {
    if (state.deck.length === 0) {
      state.current = null;
      elements.quizPanel.hidden = true;
      elements.emptyState.hidden = false;
      elements.questionCount.textContent = "Question 0 / 0";
      updateScore();
      return;
    }

    elements.quizPanel.hidden = false;
    elements.emptyState.hidden = true;
    showQuestion(state.deck[state.index]);
  }

  function showQuestion(question) {
    state.current = prepareQuestion(question);
    state.selected = false;
    elements.questionCount.textContent = `Question ${state.index + 1} / ${state.deck.length}`;
    elements.questionType.textContent = question.type === "product_to_description" ? "Product to description" : "Description to product";
    elements.prompt.textContent = question.prompt.startsWith(PROMPT_PREFIX)
      ? question.prompt.slice(PROMPT_PREFIX.length)
      : question.prompt;
    elements.explanation.hidden = true;
    elements.explanation.textContent = question.explanation;
    elements.nextButton.disabled = true;
    elements.answers.replaceChildren();

    state.current.answers.forEach((answer, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "answer-button";
      button.dataset.index = String(index);
      button.innerHTML = `<span class="answer-key">${index + 1}</span>${escapeHtml(answer.text)}`;
      button.addEventListener("click", () => chooseAnswer(index));
      elements.answers.append(button);
    });

    updateScore();
  }

  function prepareQuestion(question) {
    const answers = question.answers.map((text, index) => ({ text, correct: index === question.correct }));
    shuffle(answers);
    return { ...question, answers, correct: answers.findIndex((answer) => answer.correct) };
  }

  function chooseAnswer(index) {
    if (!state.current || state.selected) {
      return;
    }

    state.selected = true;
    const correct = index === state.current.correct;
    state.sessionAttempts += 1;
    if (correct) {
      state.sessionCorrect += 1;
    }
    recordProgress(state.current.id, correct);

    [...elements.answers.children].forEach((button, buttonIndex) => {
      button.disabled = true;
      if (buttonIndex === state.current.correct) {
        button.classList.add("correct");
      } else if (buttonIndex === index) {
        button.classList.add("incorrect");
      }
    });

    elements.explanation.hidden = false;
    elements.nextButton.disabled = false;
    elements.nextButton.focus();
    updateScore();
  }

  function recordProgress(questionId, correct) {
    const previous = state.progress.history[questionId] || { attempts: 0, correct: 0, wrong: 0 };
    previous.attempts += 1;
    state.progress.totalAttempts += 1;

    if (correct) {
      previous.correct += 1;
      state.progress.correctCount += 1;
      state.progress.wrongIds = state.progress.wrongIds.filter((id) => id !== questionId);
    } else {
      previous.wrong += 1;
      if (!state.progress.wrongIds.includes(questionId)) {
        state.progress.wrongIds.push(questionId);
      }
    }

    state.progress.history[questionId] = previous;
    saveProgress();
  }

  function showNextQuestion() {
    if (!state.current || !state.selected) {
      return;
    }

    state.index += 1;
    if (state.index >= state.deck.length) {
      shuffle(state.deck);
      state.index = 0;
    }
    showQuestion(state.deck[state.index]);
  }

  function handleKeydown(event) {
    if (event.target.matches("input, select, textarea, button")) {
      return;
    }

    if (["1", "2", "3", "4"].includes(event.key)) {
      chooseAnswer(Number(event.key) - 1);
    }

    if (event.key === "Enter" && !elements.nextButton.disabled) {
      showNextQuestion();
    }
  }

  function updateScore() {
    elements.score.textContent = `Score: ${state.sessionCorrect} / ${state.sessionAttempts}`;
  }

  function validateQuestions(questions) {
    const errors = [];
    const ids = new Set();
    const prompts = new Set();
    const required = ["id", "type", "prompt", "answers", "correct", "explanation", "tags", "priority"];
    const allowedTypes = new Set(["product_to_description", "description_to_product"]);

    if (questions.length < REQUIRED_COUNT) {
      errors.push(`Question bank has ${questions.length} questions; expected at least ${REQUIRED_COUNT}.`);
    }

    questions.forEach((question, index) => {
      required.forEach((field) => {
        if (!(field in question)) {
          errors.push(`${question.id || `Question ${index + 1}`} is missing required field: ${field}.`);
        }
      });

      if (ids.has(question.id)) {
        errors.push(`Duplicate question id: ${question.id}.`);
      }
      ids.add(question.id);

      if (prompts.has(question.prompt)) {
        errors.push(`Duplicate prompt: ${question.prompt}.`);
      }
      prompts.add(question.prompt);

      if (!allowedTypes.has(question.type)) {
        errors.push(`${question.id} has invalid type: ${question.type}.`);
      }

      if (!Array.isArray(question.answers) || question.answers.length !== 4) {
        errors.push(`${question.id} must have exactly 4 answers.`);
      } else {
        const hasInvalidAnswer = question.answers.some((answer) => (
          typeof answer !== "string"
          || answer.trim() === ""
          || answer.trim().toLowerCase() === "lorem ipsum"
        ));
        if (hasInvalidAnswer) {
          errors.push(`${question.id} has an empty or placeholder answer.`);
        } else if (new Set(question.answers.map((answer) => answer.trim().toLowerCase())).size !== 4) {
          errors.push(`${question.id} has duplicate answers.`);
        }
      }

      if (!Number.isInteger(question.correct) || question.correct < 0 || question.correct > 3) {
        errors.push(`${question.id} has invalid correct answer index: ${question.correct}.`);
      }

      if (!Array.isArray(question.tags) || question.tags.length === 0) {
        errors.push(`${question.id} must have at least one tag.`);
      }
    });

    if (errors.length > 0) {
      console.error("Question bank validation failed:", errors);
    } else {
      console.info(`Question bank validation passed: ${questions.length} questions.`);
    }

    return errors.length === 0;
  }

  function shuffle(items) {
    for (let index = items.length - 1; index > 0; index -= 1) {
      const target = Math.floor(Math.random() * (index + 1));
      [items[index], items[target]] = [items[target], items[index]];
    }
    return items;
  }

  function labelize(value) {
    return value.split("-").map((part) => part[0].toUpperCase() + part.slice(1)).join(" ");
  }

  function escapeHtml(value) {
    return value.replace(/[&<>"]/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;"
    })[character]);
  }
})();
