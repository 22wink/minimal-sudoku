export type Language = "en" | "zh"

export const translations = {
  en: {
    // Game Header
    sudoku: "Sudoku",
    beginner: "Beginner",
    easy: "Easy",
    hard: "Hard",
    impossible: "Impossible",
    autoSolve: "Auto solve puzzle",
    newGame: "Generate new puzzle",
    toggleTheme: "Toggle dark/light mode",
    settings: "Open settings",
    
    // Game Controls
    notes: "Notes",
    toggleNotesMode: "Toggle between number and notes mode",
    clear: "Clear",
    clearCell: "Clear selected cell",
    undo: "Undo",
    undoMove: "Undo last move",
    redo: "Redo",
    redoMove: "Redo last undone move",
    hint: "Hint",
    getHint: "Get a hint for the next move",
    
    // Settings Dialog
    settingsTitle: "Settings",
    settingsDescription: "Customize your Sudoku experience with themes and display options.",
    themeMode: "Theme Mode",
    light: "Light",
    dark: "Dark",
    system: "System",
    background: "Background",
    accentColor: "Accent Color",
    preview: "Preview",
    primaryButton: "Primary Button",
    secondary: "Secondary",
    done: "Done",
    language: "Language",
    english: "English",
    chinese: "中文",
    
    // Confirm Dialog
    confirm: "Confirm",
    cancel: "Cancel",
    autoSolveTitle: "Auto Solve Puzzle",
    autoSolveDescription: "Are you sure you want to automatically solve this puzzle? This action cannot be undone.",
    solve: "Solve",
    
    // Hint Dialog
    hintTitle: "Hint",
    justShowMe: "Just Show Me",
    applyHint: "Apply Hint",
    row: "Row",
    column: "Column",
    
    // Hint Techniques
    nakedSingle: "Naked Single",
    nakedSingleExplanation: (value: number) => `Only ${value} can go in this cell`,
    hiddenSingle: "Hidden Single",
    hiddenSingleRow: (num: number, row: number) => `${num} can only go in this position in row ${row + 1}`,
    hiddenSingleColumn: (num: number, col: number) => `${num} can only go in this position in column ${col + 1}`,
    hiddenSingleBox: (num: number) => `${num} can only go in this position in the 3×3 box`,
  },
  zh: {
    // Game Header
    sudoku: "数独",
    beginner: "初级",
    easy: "简单",
    hard: "困难",
    impossible: "极难",
    autoSolve: "自动解题",
    newGame: "生成新谜题",
    toggleTheme: "切换深色/浅色模式",
    settings: "打开设置",
    
    // Game Controls
    notes: "笔记",
    toggleNotesMode: "切换数字和笔记模式",
    clear: "清除",
    clearCell: "清除选中的单元格",
    undo: "撤销",
    undoMove: "撤销上一步",
    redo: "重做",
    redoMove: "重做上一步撤销",
    hint: "提示",
    getHint: "获取下一步提示",
    
    // Settings Dialog
    settingsTitle: "设置",
    settingsDescription: "自定义您的数独体验，包括主题和显示选项。",
    themeMode: "主题模式",
    light: "浅色",
    dark: "深色",
    system: "跟随系统",
    background: "背景",
    accentColor: "强调色",
    preview: "预览",
    primaryButton: "主要按钮",
    secondary: "次要",
    done: "完成",
    language: "语言",
    english: "English",
    chinese: "中文",
    
    // Confirm Dialog
    confirm: "确认",
    cancel: "取消",
    autoSolveTitle: "自动解题",
    autoSolveDescription: "您确定要自动解答这个数独谜题吗？此操作无法撤销。",
    solve: "解答",
    
    // Hint Dialog
    hintTitle: "提示",
    justShowMe: "仅显示",
    applyHint: "应用提示",
    row: "行",
    column: "列",
    
    // Hint Techniques
    nakedSingle: "唯一候选数",
    nakedSingleExplanation: (value: number) => `此单元格只能填入 ${value}`,
    hiddenSingle: "隐式唯一候选数",
    hiddenSingleRow: (num: number, row: number) => `数字 ${num} 在第 ${row + 1} 行只能放在这个位置`,
    hiddenSingleColumn: (num: number, col: number) => `数字 ${num} 在第 ${col + 1} 列只能放在这个位置`,
    hiddenSingleBox: (num: number) => `数字 ${num} 在这个 3×3 宫格中只能放在这个位置`,
  },
} as const

export type TranslationKey = keyof typeof translations.en

