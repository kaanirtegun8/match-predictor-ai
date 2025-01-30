import { i18n } from 'i18next';

export function getMatchDateLabel(date: Date, language: string): string {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const isToday = date.toDateString() === now.toDateString();
  const isTomorrow = date.toDateString() === tomorrow.toDateString();
  const isWithinWeek = date.getTime() - now.getTime() < 7 * 24 * 60 * 60 * 1000;
  
  const locale = language === 'tr' ? 'tr-TR' : 'en-GB';
  
  if (isToday) {
    return date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
  }
  if (isTomorrow) {
    return language === 'tr' ? 'Yarın' : 'Tomorrow';
  }
  if (isWithinWeek) {
    return date.toLocaleDateString(locale, { weekday: 'long' });
  }
  return date.toLocaleDateString(locale, { day: 'numeric', month: 'short' });
}

const dateUtils = {
  getMatchDateLabel,
};

export default dateUtils; 