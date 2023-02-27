import { IUserProfile } from "../types/types";

export function getRelativeTimeString(date: number, lang = navigator.language) {
  const deltaSeconds = Math.round((date - Date.now()) / 1000);
  if (Math.abs(deltaSeconds) > 3600 * 24 * 3) {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } else {
    const cutoffs = [60, 3600, 3600 * 24, 3600 * 24 * 7];
    const units: Intl.RelativeTimeFormatUnit[] = [
      'second',
      'minute',
      'hour',
      'day',
    ];
    const unitIndex = cutoffs.findIndex(
      (cutoff) => cutoff > Math.abs(deltaSeconds)
    );
    const divisor = unitIndex ? cutoffs[unitIndex - 1] : 1;
    const rtf = new Intl.RelativeTimeFormat('en', {});
    return rtf.format(Math.floor(deltaSeconds / divisor), units[unitIndex]);
  }
}

export function shuffle(array: IUserProfile[]) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}