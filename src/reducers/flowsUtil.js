export function isRealtimeFlow(exp) {
  return (
    (exp &&
      ((exp.type && ['distributed', 'webhook'].indexOf(exp.type) > -1) ||
        exp.adaptorType === 'AS2Export')) ||
    false
  );
}

export function hasBatchExport(exports, simpleExp, flow) {
  let toReturn = false;

  if (flow._exportId) {
    return !isRealtimeFlow(simpleExp);
  }

  if (flow.pageGenerators.length) {
    flow.pageGenerators.forEach(pg => {
      const exportId = pg._exportId;
      const exp =
        exports.filter(exp => exp._id === exportId) &&
        exports.filter(exp => exp._id === exportId)[0];
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
