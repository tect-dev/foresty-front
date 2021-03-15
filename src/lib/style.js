export const fontWeight = {
  thin: 100,
  semibold: 500,
  bold: 700,
  heavybold: 900,
};

export const fontSize = {
  xsmall: "12px",
  small: "14px",
  medium: "16px",
  large: "20px",
  xlarge: "24px",
  xxlarge: "36px",
};

export const mediaQuery = (maxWidth) => `
  @media (max-width: ${maxWidth}px)
`;

export const mediaSize = {
  xxlarge: mediaQuery(1920),
  xlarge: mediaQuery(1440),
  large: mediaQuery(1200),
  medium: mediaQuery(1024),
  small: mediaQuery(768),
  xsmall: mediaQuery(650),
  xxsmall: mediaQuery(375),
  custom: mediaQuery,
};

export const boxShadow = {
  default: "0 4px 16px 0 rgba(0, 0, 0, 0.04)",
};

export const hoverAction = {
  transform: "translateY(-4px)",
  "box-shadow": "0 12px 20px 0 rgba(0, 0, 0, 0.08)",
};

export const colorPalette = {
  /* violet */
  violet0: "#f3f0ff",
  violet1: "#e5dbff",
  violet2: "#d0bfff",
  violet3: "#b197fc",
  violet4: "#9775fa",
  violet5: "#845ef7",
  violet6: "#7950f2",
  violet7: "#7048e8",
  violet8: "#6741d9",
  violet9: "#5f3dc4",

  // Indigo
  indigo0: "#edf2ff",
  indigo1: "#dbe4ff",
  indigo2: "#bac8ff",
  indigo3: "#91a7ff",
  indigo4: "#748ffc",
  indigo5: "#5c7cfa",
  indigo6: "#4c6ef5",
  indigo7: "#4263eb",
  indigo8: "#3b5bdb",
  indigo9: "#364fc7",
  // Blue
  blue0: "#e7f5ff",
  blue1: "#d0ebff",
  blue2: "#a5d8ff",
  blue3: "#74c0fc",
  blue4: "#4dabf7",
  blue5: "#339af0",
  blue6: "#228be6",
  blue7: "#1c7ed6",
  blue8: "#1971c2",
  blue9: "#1864ab",
  /* cyan */
  cyan0: "#e3fafc",
  cyan1: "#c5f6fa",
  cyan2: "#99e9f2",
  cyan3: "#66d9e8",
  cyan4: "#3bc9db",
  cyan5: "#22b8cf",
  cyan6: "#15aabf",
  cyan7: "#1098ad",
  cyan8: "#0c8599",
  cyan9: "#0b7285",

  /* green */
  green0: "#ebfbee",
  green1: "#d3f9d8",
  green2: "#b2f2bb",
  green3: "#8ce99a",
  green4: "#69db7c",
  green5: "#51cf66",
  green6: "#40c057",
  green7: "#37b24d",
  green8: "#2f9e44",
  green9: "#2b8a3e",
  /* lime */
  lime0: "#f4fce3",
  lime1: "#e9fac8",
  lime2: "#d8f5a2",
  lime3: "#c0eb75",
  lime4: "#a9e34b",
  lime5: "#94d82d",
  lime6: "#82c91e",
  lime7: "#74b816",
  lime8: "#66a80f",
  lime9: "#5c940d",
  /* teal */
  teal0: "#F3FFFB",
  teal1: "#C3FAE8",
  teal2: "#96F2D7",
  teal3: "#63E6BE",
  teal4: "#38D9A9",
  teal5: "#20C997",
  teal6: "#12B886",
  teal7: "#0CA678",
  teal8: "#099268",
  teal9: "#087F5B",
  /* gray */
  gray0: "#F8F9FA",
  gray1: "#F1F3F5",
  gray2: "#E9ECEF",
  gray3: "#DEE2E6",
  gray4: "#CED4DA",
  gray5: "#ADB5BD",
  gray6: "#868E96",
  gray7: "#495057",
  gray8: "#343A40",
  gray9: "#212529",
  /* yellow */
  yellow0: "#fff9db",
  yellow1: "#fff3bf",
  yellow2: "#ffec99",
  yellow3: "#ffe066",
  yellow4: "#ffd43b",
  yellow5: "#fcc419",
  yellow6: "#fab005",
  yellow7: "#f59f00",
  yellow8: "#f08c00",
  yellow9: "#e67700",
  /* red */
  red0: "#fff5f5",
  red1: "#ffe3e3",
  red2: "#ffc9c9",
  red3: "#ffa8a8",
  red4: "#ff8787",
  red5: "#ff6b6b",
  red6: "#fa5252",
  red7: "#f03e3e",
  red8: "#e03131",
  red9: "#c92a2a",

  mainGreen: "#69bc69",
};
