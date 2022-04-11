import { hasLongLength } from '../utils';

export default function NewValue({ oldValue = '', newValue = '' }) {
  if (hasLongLength(oldValue, newValue)) {
    // if values are long, the <OldValue> cell will render
    // a dedicated "show diff" link.
    return null;
  }
  let displayValue = newValue;

  try {
    // stringify escapes special chars
    // but if newValue was already a string, then we need to remove extra double quotes
    displayValue = JSON.stringify(displayValue).replace(/^"|"$/g, '');
  } catch (e) {
    // do nothing
  }

  return displayValue;
}

