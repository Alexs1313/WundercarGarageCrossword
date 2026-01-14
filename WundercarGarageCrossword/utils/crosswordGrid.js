export function buildGrid(level) {
  const cells = new Map();
  const starts = new Map();

  const putCell = (r, c, ch) => {
    const key = `${r}:${c}`;
    if (!cells.has(key)) {
      cells.set(key, { row: r, col: c, solution: ch, value: '' });
    } else {
      const existing = cells.get(key);
      if (existing.solution !== ch) {
        throw new Error(
          `Grid conflict at ${key}: ${existing.solution} vs ${ch}`,
        );
      }
    }
  };

  for (const w of level.words) {
    const letters = w.answer.toUpperCase().split('');
    for (let i = 0; i < letters.length; i++) {
      const r = w.dir === 'down' ? w.row + i : w.row;
      const c = w.dir === 'across' ? w.col + i : w.col;
      putCell(r, c, letters[i]);
    }
    const startKey = `${w.row}:${w.col}`;
    if (!starts.has(startKey)) starts.set(startKey, []);
    starts.get(startKey).push(w.number);
  }

  // borders cubes
  const all = [...cells.values()];
  const minRow = Math.min(...all.map(x => x.row));
  const maxRow = Math.max(...all.map(x => x.row));
  const minCol = Math.min(...all.map(x => x.col));
  const maxCol = Math.max(...all.map(x => x.col));

  const rows = maxRow - minRow + 1;
  const cols = maxCol - minCol + 1;

  // empty matrix
  const matrix = Array.from({ length: rows }, (_, rr) =>
    Array.from({ length: cols }, (_, cc) => {
      const r = rr + minRow;
      const c = cc + minCol;
      const key = `${r}:${c}`;
      const cell = cells.get(key);
      if (!cell) return null;

      const numbers = starts.get(key) || [];
      return { ...cell, numbers };
    }),
  );

  return { matrix, bounds: { minRow, minCol, rows, cols } };
}

export function isSolved(matrix) {
  for (const row of matrix) {
    for (const cell of row) {
      if (!cell) continue;
      if (!cell.value || cell.value.toUpperCase() !== cell.solution)
        return false;
    }
  }
  return true;
}

export function cloneMatrixWithSet(matrix, rr, cc, value) {
  return matrix.map((row, r) =>
    row.map((cell, c) => {
      if (!cell) return null;
      if (r === rr && c === cc) return { ...cell, value };
      return cell;
    }),
  );
}

export function getWordPath(level, bounds, wordNumber) {
  const w = level.words.find(x => x.number === wordNumber);
  if (!w) return [];

  const letters = w.answer.toUpperCase().split('');
  const path = [];
  for (let i = 0; i < letters.length; i++) {
    const r = w.dir === 'down' ? w.row + i : w.row;
    const c = w.dir === 'across' ? w.col + i : w.col;

    const rr = r - bounds.minRow;
    const cc = c - bounds.minCol;
    path.push([rr, cc]);
  }
  return path;
}

// find active word ->
export function resolveActiveWord(
  level,
  bounds,
  rr,
  cc,
  preferredDir = 'across',
) {
  const globalR = rr + bounds.minRow;
  const globalC = cc + bounds.minCol;

  const startsHere = level.words.filter(
    w => w.row === globalR && w.col === globalC,
  );
  if (startsHere.length) {
    const pick = startsHere.find(w => w.dir === preferredDir) || startsHere[0];
    return pick.number;
  }

  const includes = level.words.filter(w => {
    const len = w.answer.length;
    if (w.dir === 'across') {
      return globalR === w.row && globalC >= w.col && globalC < w.col + len;
    }
    return globalC === w.col && globalR >= w.row && globalR < w.row + len;
  });

  if (!includes.length) return null;
  const pick = includes.find(w => w.dir === preferredDir) || includes[0];
  return pick.number;
}
