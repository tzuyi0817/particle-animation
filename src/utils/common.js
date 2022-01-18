export function randomInt(min, max) {
  return Math.random() * (max - min) + min | 0;
}

export function randomWords() {
  const random = randomInt(0, defaultList.length);
  const targets = defaultList[random];

  return typeof targets === "string" ? targets.split(",") : targets;
}

function getImage(name) {
  const image = new Image(360, 640);
  image.src = `/images/girl/${name}.jpg`;
  return image;
}

export const colorList = [
  "#FFC0CB",
  "#00FFFF",
  "#CC0033",
  "#FFCC00",
  "#FF9900",
  "#33FF00",
  "#FF69B4",
  "#4169E1",
  "#7FFFAA",
  "#90EE90",
  "#FFD700",
  "#FFA500",
  "#FF4500",
  "#CC3300",
  "#FF6633",
  "#990033",
];

export const defaultList = [
  "???,Vue,React,Angular",
  "🐅,🥂,🥟,🍬,🤓,📺,🕛,🦠,🛌,🥼,🦸🏻,🏆,🧨,🎇,🙏,🧧,🥰",
  [getImage(1), getImage(3), getImage(4), getImage(5), getImage(6)],
];