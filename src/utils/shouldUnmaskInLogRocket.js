import { SENSITIVE_DATA } from './constants';

export default function (id, dataPublic) {
  if (!id || !dataPublic) return false;

  const isSensitive = SENSITIVE_DATA.some(value => id.toLowerCase().includes(value));

  const envCheck = (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'staging');

  if (envCheck && isSensitive) {
    throw Error('Sensitive information may be logged in logrocket', id);
  } else if (isSensitive) return false;

  return true;
}
