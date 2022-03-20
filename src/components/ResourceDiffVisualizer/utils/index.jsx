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
  return conflicts.reduce((result, conflict) => {
    const [ourConflict, theirConflict] = conflict;
    const {ours, theirs} = result;

    return {
      ours: [...ours, ourConflict],
      theirs: [...theirs, theirConflict],
    };
  }, { ours: [], theirs: []});
}
