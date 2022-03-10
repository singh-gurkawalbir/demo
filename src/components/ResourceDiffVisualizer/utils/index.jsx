const getConstructedPath = (path, basePath) => {
  if (!basePath) {
    return path[0] + path.slice(1).join('/');
  }

  return basePath + path.join('/');
};

export function serializeConflicts(conflicts, basePath = '') {
  const serializedConflicts = [];

  // eslint-disable-next-line array-callback-return
  conflicts.map(conflict => {
    const { path, op, ops, value } = conflict;

    if (!path || (!op && !ops)) return;
    const targetPath = getConstructedPath(path, basePath);

    if (op) {
      serializedConflicts.push({ path: targetPath, op, value });
    }
    if (ops) {
      serializedConflicts.concat(serializeConflicts(ops, targetPath));
    }
  });

  return serializedConflicts;
}
