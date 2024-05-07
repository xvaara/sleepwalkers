export async function getPracticesData(): Promise<object> {
  return fetch('https://jsw.nimenhuuto.com/calendar/csv').then(res => res.text()).then((data) => {
    const doc = parseCSV(data)
      .slice(1)
      .map(i => ({
        title: i[0],
        date: new Date(`${i[1]}T${i[2]}+03:00`),
        location: i[3],
        url: i[4].split('\n')[0].trim(),
        description: i[4].replace(/\</g, '&lt;').replace(/\>/g, '&gt;').split('\n').slice(1).join('<br>'),
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime())
    return doc
  })
}

function parseCSV(str: string): string[][] {
  const arr: string[][] = []
  let quote = false // 'true' means we're inside a quoted field

  // Iterate over each character, keep track of current row and column (of the returned array)
  for (let row = 0, col = 0, c = 0; c < str.length; c++) {
    const cc = str[c]; const nc = str[c + 1] // Current character, next character
    arr[row] = arr[row] || [] // Create a new row if necessary
    arr[row][col] = arr[row][col] || '' // Create a new column (start with empty string) if necessary

    // If the current character is a quotation mark, and we're inside a
    // quoted field, and the next character is also a quotation mark,
    // add a quotation mark to the current column and skip the next character
    if (cc === '"' && quote && nc === '"') { arr[row][col] += cc; ++c; continue }

    // If it's just one quotation mark, begin/end quoted field
    if (cc === '"') { quote = !quote; continue }

    // If it's a comma and we're not in a quoted field, move on to the next column
    if (cc === ',' && !quote) { ++col; continue }

    // If it's a newline (CRLF) and we're not in a quoted field, skip the next character
    // and move on to the next row and move to column 0 of that new row
    if (cc === '\r' && nc === '\n' && !quote) { ++row; col = 0; ++c; continue }

    // If it's a newline (LF or CR) and we're not in a quoted field,
    // move on to the next row and move to column 0 of that new row
    if (cc === '\n' && !quote) { ++row; col = 0; continue }
    if (cc === '\r' && !quote) { ++row; col = 0; continue }

    // Otherwise, append the current character to the current column
    arr[row][col] += cc
  }
  return arr
}
