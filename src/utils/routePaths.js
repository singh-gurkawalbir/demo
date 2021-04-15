export default function getRoutePath(path = '') {
  let pagePath = path;

  if (typeof pagePath !== 'string') {
    pagePath = '';
  }

  pagePath = pagePath.trim();

  if (!pagePath.startsWith('/')) {
    pagePath = `/${pagePath}`;
  }

  return pagePath;
}

export const getValidRelativePath = path => {
  let pathToReturn = path;

  if (typeof pathToReturn === 'string') {
    // remove dot and whitespace from path
    pathToReturn = pathToReturn.replace(/\.|\s/g, '');
  }

  return pathToReturn;
};
