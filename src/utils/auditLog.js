export default function showViewDiffLink(oldValue, newValue) {
  if (
    (oldValue &&
      typeof oldValue === 'object' &&
      JSON.stringify(oldValue).length > 10) ||
    (newValue &&
      typeof newValue === 'object' &&
      JSON.stringify(newValue).length > 10)
  ) {
    return true;
  } else if (
    (oldValue && typeof oldValue === 'string' && oldValue.length > 300) ||
    (newValue && typeof newValue === 'string' && newValue.length > 300)
  ) {
    return true;
  }

  return false;
}
