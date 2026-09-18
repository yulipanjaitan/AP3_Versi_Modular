export const store = {
  currentUser: null,
  userAccounts: [],
  currentDoc: 'LPP',
  currentTLDoc: 'BAST_PEMILIK',
  selectedPaperSize: 'F4',
  databasePerkara: [],
  activeRecordIndex: -1,
  visiblePasswordIndex: -1,
  selectedViewPage: 'ALL',
  currentActivePageIdx: 0
};

export function getStore() {
  return store;
}

export function savePerkaraToStorage() {
  localStorage.setItem('databasePerkara', JSON.stringify(store.databasePerkara));
}

export function loadPerkaraFromStorage() {
  let saved = localStorage.getItem('databasePerkara');
  if (saved) {
    try {
      store.databasePerkara = JSON.parse(saved);
    } catch(e) {
      store.databasePerkara = [];
    }
  } else {
    store.databasePerkara = [];
  }
  return store.databasePerkara;
}
