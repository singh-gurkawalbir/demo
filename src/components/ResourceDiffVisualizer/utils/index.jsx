const getConstructedPath = (path, basePath) => {
  if (!basePath) {
    return path[0] + path.slice(1).join('/');
  }

  return `${basePath}/${path.join('/')}`;
};

export function serializeConflicts(conflicts, basePath = '') {
  return conflicts.reduce((serializedConflicts, conflict) => {
    const { path, op, ops, value } = conflict;

    if (!path || (!op && !ops)) return;
    const targetPath = getConstructedPath(path, basePath);

    if (op) {
      return [...serializedConflicts, { path: targetPath, op, value }];
    }

    // Incase of ops, drill down to fetch the complete nested path and construct the conflict
    return serializeConflicts(ops, targetPath);
  }, []);
}

export function fetchConflictsOnBothBases(conflicts = []) {
  const conflictsInfo = conflicts.reduce((result, conflict) => {
    const [currentConflict, remoteConflict] = conflict;
    const {current, remote} = result;

    return {
      current: [...current, currentConflict],
      remote: [...remote, remoteConflict],
    };
  }, { current: [], remote: []});

  const serializedConflicts = {
    current: serializeConflicts(conflictsInfo.current),
    remote: serializeConflicts(conflictsInfo.remote),
  };
  let i = 0;
  const list = [];

  while (i < conflicts.length) {
    list.push({
      current: serializedConflicts.current[i],
      remote: serializedConflicts.remote[i],
    });
    i += 1;
  }

  return list;
}
