export function isRealtimeExport(exp) {
  if (!exp) return false;

  // AS2 Exports are real-time.
  if (exp.adaptorType === 'AS2Export') return true;

  // webhook and distributed are realtime.
  if (exp.type && ['distributed', 'webhook'].includes(exp.type)) {
    return true;
  }

  // all others are not realtime or unknown.
  return false;
}

export function hasBatchExport(exports, simpleExp, flow) {
  if (flow && flow._exportId) {
    return !isRealtimeExport(simpleExp);
  }

  if (flow && flow.pageGenerators && flow.pageGenerators.length) {
    return flow.pageGenerators.some(pg => {
      const exp = exports.find(exp => exp._id === pg._exportId);

      return !isRealtimeExport(exp);
    });
  }

  return false;
}

export function isSimpleImportFlow(exp) {
  return exp && exp.type === 'simple';
}

// TODO: what is the point of this function? it simply proxies
// to another function. Also our data-layer should never have
// symbols which refer to presentation components. If we want to
// keep this function, then it should be renamed accordingly...
// example rename: 'canSchedule'
export function showScheduleIcon(exports, exp, flow) {
  return hasBatchExport(exports, exp, flow);
}

export function isRunnable(exports, exp, flow) {
  // invalid or disabled flows are not runnable.
  if (!flow || flow.disabled) {
    return false;
  }

  const flowHasExport =
    flow.pageGenerators && flow.pageGenerators.some(pg => pg._exportId);

  // flows need at least one export to be runnable
  if (!flowHasExport) return false;

  const flowHasImport =
    flow.pageProcessors &&
    flow.pageProcessors.some(pg => pg._exportId || pg._importId);

  // flows need at least one import to be runnable
  if (!flowHasImport) return false;

  // flows need at least one export which is not real-time to be runnable.
  if (!hasBatchExport(exports, exp, flow)) {
    return false;
  }

  // finally, we must thus be runnable.
  return true;
}
