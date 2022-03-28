import fs from 'fs';
import {rest} from 'msw';

export const getAllDefaultExports = path => {
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
  const handler = type => (path, resolver, once = false) => {
    const url = buildPath(path);
    const defaultResolver = (req, res, ctx) => once ? res.once(ctx.status(200), ctx.json(resolver)) : res(ctx.json(resolver));
    const currentResolver = resolver && typeof resolver === 'function' ? resolver : defaultResolver;

    return HANDLERS_DICTIONARY[type](url, currentResolver);
  };

  return {
    getOnce: handler('get', true),
    putOnce: handler('put', true),
    postOnce: handler('post', true),
    deleteOnce: handler('delete', true),
    patchOnce: handler('patch', true),
    get: handler('get'),
    put: handler('put'),
    post: handler('post'),
    delete: handler('delete'),
    patch: handler('patch'),
  };
})();
