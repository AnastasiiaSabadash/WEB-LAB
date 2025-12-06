const selectors = {
  stateJson: "#state",
  removeBtn: ".removeBtn",
  editBtn: ".editBtn",
  formulaLink: ".formula-link",
  emptyState: ".settings-empty-state",
  formulaTemplate: ".formulaTemplateElem",
  formulaList: ".formula-list",
  formulasWrapper: ".formulas-wrapper",
  save: ".save",
  discard: ".discard",
  titleInput: ".settingTitleInput",
};

const initialState = document.querySelector(selectors.stateJson).textContent;
const state = JSON.parse(initialState);

const getUrlParams = (url = window.location.href) => {
  const params = new URL(url).searchParams;
  return params.get("id");
};

const id = parseInt(getUrlParams());

const setting = state.settings.find((setting) => setting.id === id);

const inputTitle = document.querySelector(selectors.titleInput);
const saveBtn = document.querySelector(selectors.save);
const discardBtn = document.querySelector(selectors.discard);

let currentSettings = { title: setting.title };
let savedSettings = { ...currentSettings };
inputTitle.value = setting.title;
currentSettings.title = inputTitle.value;

inputTitle.addEventListener("input", () => {
  const isEditing = inputTitle.value !== savedSettings.title; // перевірка чи було змінено заголовок налаштувань
  if (isEditing) {
    saveBtn.removeAttribute("disabled");
    saveBtn.classList.add("btn-link");
    saveBtn.classList.remove("disabled");
    discardBtn.removeAttribute("disabled");
    discardBtn.classList.add("btn");
    discardBtn.classList.remove("disabled");
  }
});

saveBtn.addEventListener("click", () => {
  currentSettings.title = inputTitle.value;
  savedSettings.title = currentSettings.title;
  setting.title = savedSettings.title;
  saveBtn.setAttribute("disabled", true);
  saveBtn.classList.remove("btn-link");
  saveBtn.classList.add("disabled");
  discardBtn.setAttribute("disabled", true);
  discardBtn.classList.remove("btn");
  discardBtn.classList.add("disabled");
});

discardBtn.addEventListener("click", () => {
  currentSettings.title = savedSettings.title;
  inputTitle.value = currentSettings.title;
  saveBtn.setAttribute("disabled", true);
  saveBtn.classList.remove("btn-link");
  saveBtn.classList.add("disabled");
  discardBtn.setAttribute("disabled", true);
  discardBtn.classList.remove("btn");
  discardBtn.classList.add("disabled");
});

const toggleEmptyState = () => {
  const emptyStateElem = document.querySelector(selectors.emptyState);
  const formulaElem = document.querySelector(selectors.formulasWrapper);

  if (!setting.formulas.length) {
    formulaElem.classList.add("hidden");
    emptyStateElem.classList.remove("hidden");
  } else {
    emptyStateElem.classList.add("hidden");
    formulaElem.classList.remove("hidden");
  }
};

const removeFormula = (id) => {
  setting.formulas = setting.formulas.filter(
    (formula) => formula.id.toString() !== id.toString()
  );

  const formulaElem = document.getElementById(id);
  if (formulaElem) formulaElem.remove(); // видалення формули з DOM
  toggleEmptyState();
};

const renderFormulaElem = (formula) => {
  const formulaTemplateElem = document.querySelector(selectors.formulaTemplate);
  const formulaTemplateElemCopy = formulaTemplateElem.cloneNode(true);
  formulaTemplateElemCopy.classList.remove("hidden");

  formulaTemplateElemCopy.id = formula.id;

  const formulaElemLink = formulaTemplateElemCopy.querySelector(
    selectors.formulaLink
  );

  const formulaUrl = `/formula.html?id=${formula.id}`;

  formulaElemLink.href = formulaUrl;
  formulaElemLink.innerText = formula.title;

  const editBtn = formulaTemplateElemCopy.querySelector(selectors.editBtn);
  editBtn.href = formulaUrl;

  const removeBtn = formulaTemplateElemCopy.querySelector(selectors.removeBtn);

  removeBtn.addEventListener("click", () => {
    removeFormula(formula.id);
  });

  toggleEmptyState();

  const formulaListElem = document.querySelector(selectors.formulaList);
  formulaListElem.appendChild(formulaTemplateElemCopy);
};

setting.formulas.forEach((formula) => {
  renderFormulaElem(formula);
});