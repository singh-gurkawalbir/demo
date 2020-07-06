export default function getRoutePath(path = '') {
  const prefix = '/pg';
  let pagePath = path;

  if (typeof pagePath !== 'string') {
    pagePath = '';
  }

  pagePath = pagePath.trim();

  if (!pagePath.startsWith('/')) {
    pagePath = `/${pagePath}`;
  }

  return `${prefix + pagePath}`;
}
