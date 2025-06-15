import { Md5 } from "ts-md5";

export const getAcronym = (str: string): string => {
  return str
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase();
}

export const getCapitalizedString = (str: string): string => {
  return str.split("_").join(" ").split(" ").map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`).join(" ");
}

export const getDuration = (duration: number): string => {
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;

  if (hours === 1) {
    return `${hours} Hour ${minutes} Mins`;
  } else if (hours > 1) {
    return `${hours} Hours ${minutes} Mins`;
  } else {
    return `${minutes} Mins`;
  }
}

export const getTimeDifference = (time: number | string): string => {
  const pastTime = new Date(time);
  const presentTime = new Date();
  const timeDifference = presentTime.getTime() - pastTime.getTime();
  const monthsDifference = Math.floor(
    (presentTime.getFullYear() - pastTime.getFullYear()) * 12 +
    (presentTime.getMonth() - pastTime.getMonth())
  );
  const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));
  const minutesDifference = Math.floor(timeDifference / (1000 * 60));

  if (monthsDifference >= 1) return `${monthsDifference} Month${monthsDifference > 1 ? 's' : ''} Ago`;
  if (daysDifference >= 1) return `${daysDifference} Day${daysDifference > 1 ? 's' : ''} Ago`;
  if (hoursDifference >= 1) return `${hoursDifference} Hour${hoursDifference > 1 ? 's' : ''} Ago`;
  if (minutesDifference >= 1) return `${minutesDifference} Minute${minutesDifference > 1 ? 's' : ''} Ago`;
  return 'Just Now';
}

const stringToRGB = (string: string): [number, number, number] => {
  const hash = Md5.hashStr(string);
  const r = parseInt(hash.slice(0, 2), 16);
  const g = parseInt(hash.slice(2, 4), 16);
  const b = parseInt(hash.slice(4, 6), 16);
  return [r, g, b];
}

const darkenColor = (r: number, g: number, b: number, factor: number = 0.5) => {
  r = Math.floor(r * factor);
  g = Math.floor(g * factor);
  b = Math.floor(b * factor);

  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));

  return [r, g, b];
}

export const stringToDarkHex = (str: string): string => {
  const [r, g, b] = stringToRGB(str);
  const [darkR, darkG, darkB] = darkenColor(r, g, b, 0.5);
  return (
    '#' + ((1 << 24) | (darkR << 16) | (darkG << 8) | darkB).toString(16).slice(1).toUpperCase()
  );
}