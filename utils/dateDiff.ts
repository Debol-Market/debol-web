export function timeStampToRelativeTime(timestamp: number): string {
  const currentTimestamp: number = Date.now(); // Get current timestamp in milliseconds

  const timeDifference: number = currentTimestamp - timestamp;

  if (timeDifference < 60000) {
    return 'Just now';
  } else if (timeDifference < 3600000) {
    const minutes = Math.floor(timeDifference / 60000);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (timeDifference < 86400000) {
    const hours = Math.floor(timeDifference / 3600000);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (timeDifference < 2592000000) {
    const days = Math.floor(timeDifference / 86400000);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (timeDifference < 31536000000) {
    const months = Math.floor(timeDifference / 2592000000);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  } else {
    const years = Math.floor(timeDifference / 31536000000);
    return `${years} year${years > 1 ? 's' : ''} ago`;
  }
}
