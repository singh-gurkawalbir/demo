import fs from 'fs';
import {rest} from 'msw';

export const getAllDefaultEports = path => {
  const filesInCurrentDirectory = fs.readdirSync(path);

  const mappedHandlers = {};

  filesInCurrentDirectory.forEach(file => {
    if (file.includes('.js') && file !== 'index.js') {
      const fileURL = `${path}/${file}`;
      // eslint-disable-next-line
        const defaultExportOfFile = require(fileURL)?.default;

      mappedHandlers[file.replace('.js', '')] = defaultExportOfFile;
    }
  });

  return mappedHandlers;
};
export const buildPath = path => new URL(path, 'http://localhost:4000').toString();

export const API = (() => {
  const HANDLERS_DICTIONARY = {
    get: rest.get,
    put: rest.put,
    patch: rest.patch,
    post: rest.post,
    delete: rest.delete,
  };
  const handler = type => (path, resolver) => {
    const url = buildPath(path);
    const defaultResolver = (req, res, ctx) => res(ctx.json(resolver));
    const currentResolver = resolver && typeof resolver === 'function' ? resolver : defaultResolver;

    return HANDLERS_DICTIONARY[type](url, currentResolver);
  };

  return {
    get: handler('get'),
    put: handler('put'),
    post: handler('post'),
    delete: handler('delete'),
    patch: handler('patch'),
  };
})();
