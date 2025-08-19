// Utility to pretty-print JSON objects as syntax-highlighted HTML.
// Inspired from: https://jsfiddle.net/unLSJ/
export function prettyPrintJson(obj) {
    // Regex to capture JSON lines and their parts
    // Groups:
    // - pIndent: indentation spaces
    // - pKey: JSON key (with quotes and colon)
    // - pVal: value (string, number, boolean, etc.)
    // - pEnd: punctuation at end ([, {, ,])
    const jsonLine = /^( *)("[\w]+": )?("[^"]*"|[\w.+-]*)?([,[{])?$/gm;
  
    // Replacer function to wrap matched groups in <span class="...">
    const replacer = function (match, pIndent, pKey, pVal, pEnd) {
      let r = pIndent || '';

      // JSON key (without quotes or spaces)
      if (pKey) {
        r += '<span class="json-key">' 
          + pKey.replace(/[": ]/g, '') 
          + '</span>: ';
      }

      // JSON value
      if (pVal) {
        r += (pVal[0] === '"' 
              ? '<span class="json-string">'   // render strings green-ish
              : '<span class="json-value">'   // render numbers, bools, etc. blue-ish
             ) + pVal + '</span>';
      }

      return r + (pEnd || '');
    };
  
    // 1. Use JSON.stringify with indentation
    // 2. Escape HTML special characters
    // 3. Run regex replacer to wrap keys/values into span tags
    return JSON.stringify(obj, null, 3)
      .replace(/&/g, '&amp;')
      .replace(/\\"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(jsonLine, replacer);
}
