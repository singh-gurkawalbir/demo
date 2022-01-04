import { IGNORE_SENSITIVE_FIELDS_CHECK, SENSITIVE_DATA } from './constants';

export default function (id, isLoggable) {
  if (!id || !isLoggable) return false;
  if (IGNORE_SENSITIVE_FIELDS_CHECK.includes(id)) {
    return true;
  }
  const isSensitive = SENSITIVE_DATA.some(value => id.toLowerCase().includes(value));

  const envCheck = (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'staging');

  if (envCheck && isSensitive) {
    throw Error(`Sensitive information may be logged in logrocket ${id}`);
  }

  return true;
}
