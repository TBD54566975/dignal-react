export function universalTypeOf(value: unknown) {
  // Returns '[Object Type]' string.
  const typeString = Object.prototype.toString.call(value);
  // Returns ['Object', 'Type'] array or null.
  const match = typeString.match(/\s([a-zA-Z0-9]+)/);
  // Deconstructs the array and gets just the type from index 1.
  const [type] = match as RegExpMatchArray;

  return type;
}

export async function resetIndexedDb() {
  const databases = await indexedDB.databases();
  for (const database of databases) {
    if (database.name) {
      indexedDB.deleteDatabase(database.name);
    }
  }
  location.reload();
}

export function convertTime(time: string) {
  const now = new Date();
  const inputTime = new Date(time);
  const timeDifference = now.getTime() - inputTime.getTime();
  const oneDay = 24 * 60 * 60 * 1000;
  const oneWeek = 7 * oneDay;

  if (timeDifference < oneDay && inputTime.getDate() === now.getDate()) {
    const formattedTime = `${inputTime.getHours()}:${String(
      inputTime.getMinutes(),
    ).padStart(2, '0')}`;
    const period = inputTime.getHours() >= 12 ? 'pm' : 'am';
    return `${formattedTime} ${period}`;
  } else if (timeDifference < 2 * oneDay) {
    return 'Yesterday';
  } else if (timeDifference < oneWeek) {
    const daysOfWeek = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    return daysOfWeek[inputTime.getDay()];
  } else {
    const formattedDate = `${inputTime.getFullYear()}-${String(
      inputTime.getMonth() + 1,
    ).padStart(2, '0')}-${String(inputTime.getDate()).padStart(2, '0')}`;
    return formattedDate;
  }
}

export function convertBlobToUrl(blob: Blob) {
  return blob && URL.createObjectURL(blob);
}

export function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
}
