// source : https://jsfiddle.net/unLSJ/
export function prettyPrintJson(obj) {
    const jsonLine = /^( *)("[\w]+": )?("[^"]*"|[\w.+-]*)?([,[{])?$/gm;
  
    const replacer = function (match, pIndent, pKey, pVal, pEnd) {
      let r = pIndent || '';
      if (pKey)
        r += '<span class="json-key">' + pKey.replace(/[": ]/g, '') + '</span>: ';
      if (pVal)
        r += (pVal[0] === '"' 
                ? '<span class="json-string">' 
                : '<span class="json-value">'
             ) + pVal + '</span>';
      return r + (pEnd || '');
    };
  
    return JSON.stringify(obj, null, 3)
      .replace(/&/g, '&amp;')
      .replace(/\\"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(jsonLine, replacer);
}  