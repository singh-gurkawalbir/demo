export function getFileReaderOptions(file, type) {
  if (!file || !type) return {};

  if (type === 'json') {
    return { expectedContentType: 'json' };
  }

  return {};
}

export function getOptions() {}
