const selectors = {
    stateJson: '#state',
    emptyState: '.empty-state',
    settingsTable: '.settings-table',
    createSettingButton: '#create-setting-btn', 
    emptyAddButton: '#empty-add-btn', 
    settingsList: '.settings-list',
    settingTemplate: '#setting-line-template',
    settingLine: '.setting-line',
    settingLink: '.setting-link',
    settingStatusBadge: '.setting-status-badge',
    settingRemoveButton: '.delete-button', 
}

// Start here
const initialState = document.querySelector(selectors.stateJson).textContent;

// Initial state is a JSON string, so we need to parse it to get the actual object.
const state = JSON.parse(initialState);

/**
 * Creates new setting object, adds it to the state, renders it to the DOM.
 */
function createSettingHandler(e) {
    if (e) e.preventDefault();
    
    // 1. Generate ID
    const maxId = state.settings.length > 0 
        ? Math.max(...state.settings.map(s => s.id)) 
        : 0;
    const newId = maxId + 1;
    
    const newTitle = "Content"; 

    const newSetting = {
        id: newId,
        title: newTitle,
        status: "draft", 
        formulas: []
    };

    // 2. Add to state
    state.settings.push(newSetting);

    // 3. Render new element
    renderSettingElement(newSetting);

    // 4. Update empty state
    toggleEmptyState();
}

/**
 * Removes the setting from the state and the DOM.
 * * @param {Object} settingLineElement - The setting line element to remove.
 */
function removeSettingHandler(settingLineElement) {
    // Get the element ID as a number for correct comparison with the state.
    const settingIdToRemove = parseInt(settingLineElement.id, 10);
    
    // Remove the setting from the DOM.
    settingLineElement.remove();
    
    // Remove the setting from the state.
    const settingIndexToRemove = state.settings.findIndex( 
        (setting) => setting.id === settingIdToRemove
    );
    
    if (settingIndexToRemove !== -1) {
        state.settings.splice(settingIndexToRemove, 1);
    }
    
    toggleEmptyState();
}

/**
 * Function initialization.
 *
 * Creates line settings elements based on the state by copying the template element, change its content and append it to the settings list element.
 *
 * @param {Object} setting - The setting object to render.
 */
function renderSettingElement(setting) {
  // 1. Find the setting template element.
  const settingTemplateElement = document.querySelector(selectors.settingTemplate);

  // 2. Clone the template content
  const settingTemplateElementCopy = settingTemplateElement.content.firstElementChild.cloneNode(true);

  // 3. Change the content of the cloned setting template element.
  settingTemplateElementCopy.id = setting.id; // Set the id of the setting element to the setting id.

  const settingLinkElement = settingTemplateElementCopy.querySelector(selectors.settingLink);
  
  const settingUrl = `/setting.html?id=${setting.id}`; // We will need the id parameter to get settings data from the state on the settings edit page.
  
  settingLinkElement.href = settingUrl; // Set the href attribute of the setting link element to the setting url.
  settingLinkElement.innerText = setting.title; // Set the inner text of the setting link element to the setting title.

  const settingStatusBadgeElement = settingTemplateElementCopy.querySelector(selectors.settingStatusBadge);
  settingStatusBadgeElement.innerText = setting.status; // Set the inner text of the setting status badge element to the setting status.

  // Clean the class before adding
  settingStatusBadgeElement.classList.remove('active', 'draft'); 
  
  // Toggle the active class based on the setting status.
  if (setting.status === 'active') {
    settingStatusBadgeElement.classList.add('active');
  } else {
    // If not 'active', add 'draft'
    settingStatusBadgeElement.classList.add('draft');
  }

  const settingRemoveButtonElement = settingTemplateElementCopy.querySelector(selectors.settingRemoveButton);
  // Add an event listener to the remove button element to remove the setting from the state and the DOM.
  settingRemoveButtonElement.addEventListener('click', () => {
    removeSettingHandler(settingTemplateElementCopy);
  });

  settingTemplateElementCopy.classList.remove('hidden');

  // 4. Append the cloned setting template element to the settings list element.
  const settingsListElement = document.querySelector(selectors.settingsList);
  settingsListElement.appendChild(settingTemplateElementCopy);
}

/**
 * Toggles the empty state based on the state settings length.
 */
function toggleEmptyState() {
  const emptyStateElement = document.querySelector(selectors.emptyState);
  const settingsTable = document.querySelector(selectors.settingsTable);

  if (state.settings.length === 0) {
    emptyStateElement.classList.remove('hidden');
    settingsTable.classList.add('hidden');
  } else {
    emptyStateElement.classList.add('hidden');
    settingsTable.classList.remove('hidden');
  }
}

const createSettingButton = document.querySelector(selectors.createSettingButton);
if (createSettingButton) {
    createSettingButton.addEventListener('click', createSettingHandler);
}

const emptyAddButton = document.querySelector(selectors.emptyAddButton);
if (emptyAddButton) {
    emptyAddButton.addEventListener('click', createSettingHandler);
}

state.settings.forEach(setting => {
  // Call the function to render the settings elements.
  renderSettingElement(setting);
});

// initialization Empty/Table
toggleEmptyState();