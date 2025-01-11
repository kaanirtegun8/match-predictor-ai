export function getMatchDateLabel(date: Date): string {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const isToday = date.toDateString() === now.toDateString();
  const isTomorrow = date.toDateString() === tomorrow.toDateString();
  const isWithinWeek = date.getTime() - now.getTime() < 7 * 24 * 60 * 60 * 1000;
  
  if (isToday) {
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  }
  if (isTomorrow) {
    return 'Tomorrow';
  }
  if (isWithinWeek) {
    return date.toLocaleDateString('en-GB', { weekday: 'long' });
  }
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

const dateUtils = {
  getMatchDateLabel,
};

export default dateUtils; 