export interface AccentColor {
  name: string
  light: {
    primary: string
    primaryForeground: string
    ring: string
  }
  dark: {
    primary: string
    primaryForeground: string
    ring: string
  }
}

export interface BackgroundColor {
  name: string
  light: {
    background: string
    card: string
  }
  dark: {
    background: string
    card: string
  }
}

export const backgroundColors: Record<string, BackgroundColor> = {
  default: {
    name: "Default",
    light: {
      background: "0 0% 100%",
      card: "0 0% 100%",
    },
    dark: {
      background: "222.2 84% 4.9%",
      card: "222.2 84% 4.9%",
    },
  },
  midnight: {
    name: "Midnight",
    light: {
      background: "220 30% 96%",
      card: "220 30% 94%",
    },
    dark: {
      background: "220 30% 2%",
      card: "220 30% 3%",
    },
  },
  charcoal: {
    name: "Charcoal",
    light: {
      background: "0 0% 97%",
      card: "0 0% 95%",
    },
    dark: {
      background: "0 0% 6%",
      card: "0 0% 8%",
    },
  },
  sunset: {
    name: "Sunset",
    light: {
      background: "15 100% 97%",
      card: "15 100% 95%",
    },
    dark: {
      background: "15 50% 8%",
      card: "15 50% 10%",
    },
  },
  ocean: {
    name: "Ocean",
    light: {
      background: "200 100% 97%",
      card: "200 100% 95%",
    },
    dark: {
      background: "200 50% 8%",
      card: "200 50% 10%",
    },
  },
  forest: {
    name: "Forest",
    light: {
      background: "120 60% 97%",
      card: "120 60% 95%",
    },
    dark: {
      background: "120 40% 8%",
      card: "120 40% 10%",
    },
  },
}

export const accentColors: Record<string, AccentColor> = {
  slate: {
    name: "Slate",
    light: {
      primary: "oklch(0.205 0 0)",
      primaryForeground: "oklch(0.985 0 0)",
      ring: "oklch(0.708 0 0)",
    },
    dark: {
      primary: "oklch(0.985 0 0)",
      primaryForeground: "oklch(0.205 0 0)",
      ring: "oklch(0.439 0 0)",
    },
  },
  blue: {
    name: "Blue",
    light: {
      primary: "oklch(0.5 0.233 264.052)",
      primaryForeground: "oklch(0.985 0 0)",
      ring: "oklch(0.5 0.233 264.052)",
    },
    dark: {
      primary: "oklch(0.7 0.191 264.052)",
      primaryForeground: "oklch(0.145 0 0)",
      ring: "oklch(0.7 0.191 264.052)",
    },
  },
  green: {
    name: "Green",
    light: {
      primary: "oklch(0.5 0.207 142.495)",
      primaryForeground: "oklch(0.985 0 0)",
      ring: "oklch(0.5 0.207 142.495)",
    },
    dark: {
      primary: "oklch(0.7 0.176 142.495)",
      primaryForeground: "oklch(0.145 0 0)",
      ring: "oklch(0.7 0.176 142.495)",
    },
  },
  purple: {
    name: "Purple",
    light: {
      primary: "oklch(0.5 0.233 303.9)",
      primaryForeground: "oklch(0.985 0 0)",
      ring: "oklch(0.5 0.233 303.9)",
    },
    dark: {
      primary: "oklch(0.7 0.191 303.9)",
      primaryForeground: "oklch(0.145 0 0)",
      ring: "oklch(0.7 0.191 303.9)",
    },
  },
  orange: {
    name: "Orange",
    light: {
      primary: "oklch(0.5 0.207 70.08)",
      primaryForeground: "oklch(0.985 0 0)",
      ring: "oklch(0.5 0.207 70.08)",
    },
    dark: {
      primary: "oklch(0.7 0.176 70.08)",
      primaryForeground: "oklch(0.145 0 0)",
      ring: "oklch(0.7 0.176 70.08)",
    },
  },
  red: {
    name: "Red",
    light: {
      primary: "oklch(0.5 0.233 27.325)",
      primaryForeground: "oklch(0.985 0 0)",
      ring: "oklch(0.5 0.233 27.325)",
    },
    dark: {
      primary: "oklch(0.7 0.191 27.325)",
      primaryForeground: "oklch(0.145 0 0)",
      ring: "oklch(0.7 0.191 27.325)",
    },
  },
  teal: {
    name: "Teal",
    light: {
      primary: "oklch(0.5 0.207 180)",
      primaryForeground: "oklch(0.985 0 0)",
      ring: "oklch(0.5 0.207 180)",
    },
    dark: {
      primary: "oklch(0.7 0.176 180)",
      primaryForeground: "oklch(0.145 0 0)",
      ring: "oklch(0.7 0.176 180)",
    },
  },
  pink: {
    name: "Pink",
    light: {
      primary: "oklch(0.5 0.233 350)",
      primaryForeground: "oklch(0.985 0 0)",
      ring: "oklch(0.5 0.233 350)",
    },
    dark: {
      primary: "oklch(0.7 0.191 350)",
      primaryForeground: "oklch(0.145 0 0)",
      ring: "oklch(0.7 0.191 350)",
    },
  },
}
