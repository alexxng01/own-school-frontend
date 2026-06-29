const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

let storageCache = {};
let isInitialized = false;

// Real browser localStorage, used as a synchronous fallback/mirror.
// The backend cache (storageCache) is populated asynchronously on app
// boot, so on a page refresh there is a short window — or, if the
// backend is slow/unreachable, a permanent gap — where storageCache is
// empty. Without this fallback, reading 'currentUser' during that gap
// returns null and the app treats the user as logged out, even though
// they never logged out. Browser localStorage is always available
// synchronously, so it's the safety net for session-critical keys.
const readLocal = (key) => {
  try {
    return window.localStorage.getItem(key);
  } catch (e) {
    return null;
  }
};

const writeLocal = (key, value) => {
  try {
    window.localStorage.setItem(
      key,
      typeof value === 'string' ? value : JSON.stringify(value)
    );
  } catch (e) {
    // localStorage may be unavailable (e.g. private mode) - ignore
  }
};

const removeLocal = (key) => {
  try {
    window.localStorage.removeItem(key);
  } catch (e) {
    // ignore
  }
};

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
    console.error('❌ Error initializing backendStorage cache (backend unreachable - falling back to local cache for this session):', error);
  }
  isInitialized = true;
  return storageCache;
};

export const backendStorage = {
  getItem: (key) => {
    const val = storageCache[key];
    if (val !== undefined && val !== null) {
      return typeof val === 'string' ? val : JSON.stringify(val);
    }
    // Backend cache missed (not yet loaded, or backend unreachable) -
    // fall back to the local mirror instead of returning null, which
    // is what was causing users to get logged out on refresh.
    return readLocal(key);
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
    writeLocal(key, value);

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
    removeLocal(key);

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
    try {
      window.localStorage.clear();
    } catch (e) {
      // ignore
    }
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