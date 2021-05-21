export default function (id, dataPublic) {
  if (!dataPublic) return false;
  const sensitiveData = ['token', 'password'];
  const envCheck = (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'staging');

  if (dataPublic && envCheck && sensitiveData.includes(id)) {
    throw Error('Sensitive information may be logged in logrocket');
  } else if (sensitiveData.includes(id)) return false;

  return !!dataPublic;
}
