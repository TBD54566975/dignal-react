export function universalTypeOf(value: unknown) {
  // Returns '[Object Type]' string.
  const typeString = Object.prototype.toString.call(value);
  // Returns ['Object', 'Type'] array or null.
  const match = typeString.match(/\s([a-zA-Z0-9]+)/);
  // Deconstructs the array and gets just the type from index 1.
  const [_, type] = match as RegExpMatchArray;

  return type;
}
