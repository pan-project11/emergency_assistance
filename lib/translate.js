const CACHE_KEY_PREFIX = 'translations_'

function getCache(langCode) {
  if (typeof window === 'undefined') return {}
  const raw = localStorage.getItem(CACHE_KEY_PREFIX + langCode)
  return raw ? JSON.parse(raw) : {}
}

function setCache(langCode, cache) {
  if (typeof window === 'undefined') return
  localStorage.setItem(CACHE_KEY_PREFIX + langCode, JSON.stringify(cache))
}

async function translateText(text, targetLang) {
  try {
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`
    )
    const data = await res.json()
    return data?.responseData?.translatedText || text
  } catch (err) {
    console.error('Translation failed:', err)
    return text
  }
}

// Translates an entire strings object at once, using cache where possible.
// Returns a new object with the same keys, translated values.
export async function translateStrings(baseStrings, targetLang) {
  if (targetLang === 'en') return baseStrings

  const cache = getCache(targetLang)
  const result = {}
  const toFetch = []

  for (const key of Object.keys(baseStrings)) {
    if (cache[key]) {
      result[key] = cache[key]
    } else {
      toFetch.push(key)
    }
  }

  // Fetch missing ones with a small delay between calls to stay within free API limits
  for (const key of toFetch) {
    const translated = await translateText(baseStrings[key], targetLang)
    result[key] = translated
    cache[key] = translated
    await new Promise(r => setTimeout(r, 150))
  }

  setCache(targetLang, cache)
  return result
}
