/**
 * Strips a Python-style inline comment from a line, ignoring # inside strings.
 * Uses i++ to skip escaped characters robustly.
 */
function stripLineComment(line) {
  let inStr = false, q = '';
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inStr) {
      if (c === '\\') { i++; continue; } // skip escaped char
      if (c === q) inStr = false;
    } else if (c === "'" || c === '"') {
      inStr = true; q = c;
    } else if (c === '#') {
      return line.slice(0, i);
    }
  }
  return line;
}

/**
 * Converts a Python literal expression to a JSON string, character by character.
 * Correctly handles:
 *   - Single-quoted strings with embedded double quotes (escapes them for JSON)
 *   - Python string line continuations (backslash + newline → skipped)
 *   - Standard escape sequences (\n, \t, \\, \', \")
 *   - Python unicode prefix u'...' / u"..."
 *   - True / False / None keywords
 */
function pythonToJson(s) {
  let result = '';
  let i = 0;

  while (i < s.length) {
    let c = s[i];

    // Skip Python unicode string prefix u'...' or u"..."
    if (c === 'u' && i + 1 < s.length && (s[i + 1] === "'" || s[i + 1] === '"')) {
      i++;
      c = s[i];
    }

    if (c === "'" || c === '"') {
      const quote = c;
      result += '"'; // open JSON string with double quote
      i++;
      while (i < s.length && s[i] !== quote) {
        const sc = s[i];
        if (sc === '"') {
          result += '\\"'; // escape embedded double quotes for JSON
        } else if (sc === '\\') {
          const next = i + 1 < s.length ? s[i + 1] : '';
          if (next === '\n') { i += 2; continue; }       // Python line continuation → skip
          else if (next === 'n')  { result += '\\n';  i += 2; continue; }
          else if (next === 't')  { result += '\\t';  i += 2; continue; }
          else if (next === 'r')  { result += '\\r';  i += 2; continue; }
          else if (next === '\\') { result += '\\\\'; i += 2; continue; }
          else if (next === "'")  { result += "'";    i += 2; continue; } // \' → '
          else if (next === '"')  { result += '\\"';  i += 2; continue; }
          else { result += '\\\\'; } // other backslashes: keep escaped
        } else if (sc === '\n') {
          result += '\\n'; // literal newline inside string
        } else if (sc === '\r') {
          result += '\\r';
        } else {
          result += sc;
        }
        i++;
      }
      result += '"'; // close JSON string
      i++;           // skip closing quote
      continue;
    }

    // Python keyword / identifier tokens
    if (/[A-Za-z_]/.test(c)) {
      const token = s.slice(i).match(/^[A-Za-z_]\w*/)[0];
      if (token === 'True')  { result += 'true';  i += 4; continue; }
      if (token === 'False') { result += 'false'; i += 5; continue; }
      if (token === 'None')  { result += 'null';  i += 4; continue; }
      result += token;
      i += token.length;
      continue;
    }

    result += c;
    i++;
  }

  return result;
}

/**
 * Converts a Python literal string to a JS value.
 */
function parsePythonLiteral(s) {
  if (s === 'True') return true;
  if (s === 'False') return false;
  if (s === 'None') return null;
  if (/^-?\d+$/.test(s)) return parseInt(s, 10);
  if (/^-?\d*\.\d+$/.test(s)) return parseFloat(s);
  if ((s[0] === "'" && s[s.length - 1] === "'") ||
      (s[0] === '"' && s[s.length - 1] === '"')) {
    return s.slice(1, -1);
  }
  try {
    const jsonStr = pythonToJson(s)
      // Python allows trailing commas in dicts/lists, JSON does not
      .replace(/,(\s*[}\]])/g, '$1');
    return JSON.parse(jsonStr);
  } catch {
    return s;
  }
}

/**
 * Creates a stateful bracket-depth scanner.
 * State (inStr, quote char) is preserved across feed() calls so that
 * Python string continuations spanning multiple lines are handled correctly —
 * brackets inside continued strings are not counted toward depth.
 */
function makeDepthScanner() {
  let depth = 0;
  let inStr = false;
  let q = '';

  return {
    feed(s) {
      for (let i = 0; i < s.length; i++) {
        const c = s[i];
        if (inStr) {
          if (c === '\\') { i++; continue; } // skip escaped char
          if (c === q) inStr = false;
        } else if (c === "'" || c === '"') {
          inStr = true; q = c;
        } else if ('{[('.includes(c)) depth++;
        else if ('}])'.includes(c)) depth--;
      }
      return depth;
    },
    get depth() { return depth; }
  };
}

/**
 * Parses a CherryPy/Python ConfigParser od.config file into a plain JS object.
 * Handles multi-line dict/list values, Python literals, sections, and comments.
 */
export function parseOdConfig(text) {
  const config = {};
  // Strip comments first (string-aware, so #FFFFFF inside dicts is preserved)
  const lines = text.split('\n').map(stripLineComment);

  let section = null;
  let key = null;
  let value = '';
  let scanner = null; // non-null while accumulating a multi-line value

  const commit = () => {
    if (key === null) return;
    const target = section ? (config[section] ??= {}) : config;
    target[key] = parsePythonLiteral(value.trim());
    key = null;
    value = '';
    scanner = null;
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (scanner === null) {
      if (!trimmed) continue;

      // [section] header
      const secMatch = trimmed.match(/^\[(.+)\]$/);
      if (secMatch) { commit(); section = secMatch[1]; continue; }

      // key: value  or  key = value
      const kvMatch = trimmed.match(/^([a-zA-Z_][\w.]*)\s*[:=]\s*([\s\S]*)/);
      if (kvMatch) {
        commit();
        key = kvMatch[1];
        value = kvMatch[2];
        scanner = makeDepthScanner();
        scanner.feed(value);
        if (scanner.depth === 0) commit();
        continue;
      }
    } else {
      // Continuation of a multi-line value (dict, list, …)
      value += '\n' + line;
      scanner.feed(line);
      if (scanner.depth <= 0) commit();
    }
  }
  commit();
  return config;
}