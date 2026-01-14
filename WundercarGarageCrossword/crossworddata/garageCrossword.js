export const garageCrosswords = [
  // 🧩 NEW Level 1 (бывший Level 5)
  {
    id: 1,
    title: 'Level 1',
    moves: 22,
    words: [
      // 1) READY — вертикально, пересечение с ROAD по A (третяя буква READY)
      {
        number: 1,
        answer: 'READY',
        clue: 'Prepared to move forward',
        row: 0,
        col: 2,
        dir: 'down',
      },

      // 3) ROAD — горизонтально (ставим ПЕРВЫМ среди слов,
      // чтобы номер "3" показывался в стартовой клетке, где пересекается с RENEW)
      {
        number: 3,
        answer: 'ROAD',
        clue: 'Where the journey continues',
        row: 2,
        col: 0,
        dir: 'across',
      },

      // 2) RENEW — вертикально, стартует в той же клетке что ROAD (буква R совпадает)
      // пересекает LIFE по букве E
      {
        number: 2,
        answer: 'RENEW',
        clue: 'Make something feel new again',
        row: 2,
        col: 0,
        dir: 'down',
      },

      // 4) LIFE — горизонтально снизу, заканчивается в колонке RENEW (на E)
      {
        number: 4,
        answer: 'LIFE',
        clue: 'What every restored thing gets back',
        row: 5,
        col: -3,
        dir: 'across',
      },
    ],
  },
  // 🧩 Level 2 (без изменений)
  {
    id: 2,
    title: 'Level 2',
    moves: 28,
    words: [
      {
        number: 1,
        answer: 'WRENCH',
        clue: 'A tool used to tighten or loosen bolts',
        row: 0,
        col: 0,
        dir: 'across',
      },
      {
        number: 2,
        answer: 'ENGINE',
        clue: 'The heart of a vehicle',
        row: 0,
        col: 2,
        dir: 'down',
      },
      {
        number: 3,
        answer: 'FIX',
        clue: 'To make something work again',
        row: 3,
        col: 1,
        dir: 'across',
      },
      {
        number: 4,
        answer: 'METAL',
        clue: 'Strong material used in cars',
        row: 5,
        col: 1,
        dir: 'across',
      },
    ],
  },
  // 🧩 Level 3 (без изменений)
  {
    id: 3,
    title: 'Level 3',
    moves: 26,
    words: [
      // 1. RESTORE (вертикаль слева)
      {
        number: 1,
        answer: 'RESTORE',
        clue: 'Bring something back to good condition',
        row: 0,
        col: 1, // ← ВАЖНО
        dir: 'down',
      },

      // 2. REPAIR (горизонталь)
      {
        number: 2,
        answer: 'REPAIR',
        clue: 'Fix what is broken',
        row: 1,
        col: 0,
        dir: 'across',
      },

      // 3. CARE (вертикаль справа)
      {
        number: 3,
        answer: 'CARE',
        clue: 'Attention that keeps things working',
        row: 0,
        col: 3, // ← ВАЖНО
        dir: 'down',
      },
    ],
  },
  // 🧩 Level 4 (без изменений)
  {
    id: 4,
    title: 'Level 4',
    moves: 30,
    words: [
      {
        number: 1,
        answer: 'PATIENCE',
        clue: 'The ability to wait and stay calm',
        row: 0,
        col: 2,
        dir: 'down',
      },
      {
        number: 2,
        answer: 'HANDS',
        clue: 'Tools of every craftsman',
        row: 1,
        col: 1,
        dir: 'across',
      },
      {
        number: 3,
        answer: 'SKILL',
        clue: 'Ability gained through practice',
        row: 3,
        col: 0,
        dir: 'across',
      },
      {
        number: 4,
        answer: 'TIME',
        clue: 'Something you can’t rush',
        row: 7,
        col: -1, // ← ВАЖНО: чтобы E попала в (7,2)
        dir: 'across',
      },
    ],
  },
  // 🧩 NEW Level 5 (бывший Level 1)
  {
    id: 5,
    title: 'Level 5',
    moves: 30,
    words: [
      {
        number: 1,
        answer: 'WHEEL',
        clue: 'A round part that lets a car move',
        row: 0,
        col: 5,
        dir: 'down',
      },
      {
        number: 2,
        answer: 'GARAGE',
        clue: 'A place where vehicles are repaired',
        row: 2,
        col: 0,
        dir: 'across',
      },
      {
        number: 3,
        answer: 'BOLT',
        clue: 'A fastener used with a nut',
        row: 3,
        col: 2,
        dir: 'down',
      },
      {
        number: 4,
        answer: 'TOOLS',
        clue: 'Items used to fix things',
        row: 4,
        col: 0,
        dir: 'across',
      },
    ],
  },
];
