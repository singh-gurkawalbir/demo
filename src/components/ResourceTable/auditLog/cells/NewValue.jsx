import { hasLongLength } from '../utils';

export default function NewValue({ oldValue = '', newValue = '' }) {
  if (hasLongLength(oldValue, newValue)) {
    // if values are long, the <OldValue> cell will render
    // a dedicated "show diff" link.
    return null;
  }

  return typeof newValue === 'string'
    ? newValue
    : JSON.stringify(newValue);
}

