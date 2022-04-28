const getConstructedPath = (path, basePath) => {
  if (!basePath) {
    return path[0] + path.slice(1).join('/');
  }

  return `${basePath}/${path.join('/')}`;
};

function constructConflictObj(conflict, basePath) {
  const { path, op, ops, value } = conflict;

  if (!path || (!op && !ops)) return;
  const targetPath = getConstructedPath(path, basePath);

  if (op) {
    return { path: targetPath, op, value };
  }

  // ops exist if the conflict path is a nested path
  // - So drill down the nested conflict and construct path while drilling down
  // at the leaf node level, we get the op and value for the conflict
  const [nestedConflict] = ops;

  return constructConflictObj(nestedConflict, targetPath);
}

export function _serializeConflicts(conflicts) {
  return (conflicts || []).reduce((serializedConflicts, conflict) =>
    [...serializedConflicts, constructConflictObj(conflict)], []);
}

export function fetchConflictsOnBothBases(conflicts) {
  if (!conflicts) {
    return [];
  }
  const conflictsInfo = conflicts.reduce((result, conflict) => {
    const [currentConflict, remoteConflict] = conflict;
    const {current, remote} = result;

    return {
      current: [...current, currentConflict],
      remote: [...remote, remoteConflict],
    };
  }, { current: [], remote: []});

  const serializedConflicts = {
    current: _serializeConflicts(conflictsInfo.current),
    remote: _serializeConflicts(conflictsInfo.remote),
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
