const DAYLIGHT_STORAGE_KEY = 'leader-day-button-clicks';

function restoreClickCount() {
  try {
    const storedValue = localStorage.getItem(DAYLIGHT_STORAGE_KEY);
    return storedValue ? Number.parseInt(storedValue, 10) : 0;
  } catch (error) {
    console.warn('Local storage unavailable; proceeding without persistence.', error);
    return 0;
  }
}

function persistClickCount(count) {
  try {
    localStorage.setItem(DAYLIGHT_STORAGE_KEY, String(count));
  } catch (error) {
    console.warn('Could not persist click count.', error);
  }
}

function updateClickMessage(container, count) {
  if (!container) return;
  const message = count === 1
    ? 'You tapped into the sunrise vibe once.'
    : `You have sparked ${count} bursts of daylight.`;
  container.textContent = message;
}

function setupButtons() {
  const buttons = document.querySelectorAll('[data-button-kind]');
  if (!buttons.length) return;

  let clickCount = restoreClickCount();
  const liveRegion = document.createElement('p');
  liveRegion.className = 'daylight-click-status';
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.style.marginTop = '0.75rem';
  liveRegion.style.fontWeight = '600';
  liveRegion.style.color = '#d35400';

  const firstCard = buttons[0]?.closest('.daylight-card');
  if (firstCard) {
    firstCard.append(liveRegion);
    updateClickMessage(liveRegion, clickCount);
  }

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      clickCount += 1;
      updateClickMessage(liveRegion, clickCount);
      persistClickCount(clickCount);
      button.classList.add('sunrise-button-active');
      setTimeout(() => button.classList.remove('sunrise-button-active'), 400);
    });
  });
}

function setupDialog() {
  const dialog = document.querySelector('dialog');
  const openers = document.querySelectorAll('[data-open-dialog="true"]');
  if (!dialog || !openers.length) return;

  openers.forEach((button) => {
    button.addEventListener('click', () => {
      if (typeof dialog.showModal === 'function') {
        dialog.showModal();
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupButtons();
  setupDialog();
});
