const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

let storageCache = {};
let isInitialized = false;

export const initBackendStorage = async () => {
  if (isInitialized) return storageCache;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3000);

  try {
    const response = await fetch(`${API_BASE_URL}/items`, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (response.ok) {
      const items = await response.json();
      items.forEach(item => {
        storageCache[item.key] = item.value;
      });
      console.log('✅ Initialized backendStorage cache successfully:', Object.keys(storageCache));
    } else {
      console.error('❌ Failed to fetch items from backend API. Status:', response.status);
    }
  } catch (error) {
    clearTimeout(timeoutId);
    console.error('❌ Error initializing backendStorage cache:', error);
  }
  isInitialized = true;
  return storageCache;
};

export const backendStorage = {
  getItem: (key) => {
    const val = storageCache[key];
    if (val === undefined || val === null) return null;
    return typeof val === 'string' ? val : JSON.stringify(val);
  },

  setItem: (key, value) => {
    let parsedValue = value;
    try {
      if (typeof value === 'string') {
        parsedValue = JSON.parse(value);
      }
    } catch (e) {
      // Not a JSON string, store as plain string
    }

    storageCache[key] = parsedValue;

    // Async POST/PUT to backend
    fetch(`${API_BASE_URL}/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ key, value: parsedValue })
    })
    .then(async res => {
      if (!res.ok) {
        console.error(`❌ Failed to set item ${key} on backend. Status:`, res.status);
      }
    })
    .catch(err => {
      console.error(`❌ Error setting item ${key} on backend:`, err);
    });
  },

  removeItem: (key) => {
    delete storageCache[key];

    // Async DELETE to backend
    fetch(`${API_BASE_URL}/items/key/${key}`, {
      method: 'DELETE'
    })
    .then(res => {
      if (!res.ok) {
        console.error(`❌ Failed to delete item ${key} from backend. Status:`, res.status);
      }
    })
    .catch(err => {
      console.error(`❌ Error deleting item ${key} from backend:`, err);
    });
  },

  clear: () => {
    storageCache = {};
    fetch(`${API_BASE_URL}/items`)
      .then(res => res.json())
      .then(items => {
        items.forEach(item => {
          fetch(`${API_BASE_URL}/items/${item._id}`, { method: 'DELETE' });
        });
      })
      .catch(err => console.error('❌ Error clearing items on backend:', err));
  }
};

export default backendStorage;
