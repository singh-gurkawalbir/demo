export function isRealtimeExport(exp) {
  return (
    (exp &&
      ((exp.type && ['distributed', 'webhook'].indexOf(exp.type) > -1) ||
        exp.adaptorType === 'AS2Export')) ||
    false
  );
}

export function hasBatchExport(exports, simpleExp, flow) {
  let toReturn = false;

  if (flow && flow._exportId) {
    return !isRealtimeExport(simpleExp);
  }

  if (flow && flow.pageGenerators && flow.pageGenerators.length) {
    flow.pageGenerators.forEach(pg => {
      const exportId = pg._exportId;
      const exp = exports.find(exp => exp._id === exportId);
      const isRealtime =
        (exp &&
          ((exp.type && ['distributed', 'webhook'].indexOf(exp.type) > -1) ||
            exp.adaptorType === 'AS2Export')) ||
        false;

      toReturn = toReturn || !isRealtime;
    });
  }

  return toReturn;
}

export function isSimpleImportFlow(exp) {
  return exp && exp.type === 'simple';
}

export function isRunnable(exports, exp, flow) {
  return !(flow && flow.disabled) && hasBatchExport(exports, exp, flow);
}
