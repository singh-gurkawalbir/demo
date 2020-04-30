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

export function showScheduleIcon(exports, exp, flow) {
  if (isSimpleImportFlow(exp)) return false;

  return hasBatchExport(exports, exp, flow);
}

export function isRunnable(exports, exp, flow) {
  const isDataLoader = isSimpleImportFlow(exp);

  // invalid flows are not runnable.
  if (!flow) {
    return false;
  }

  // For disabled flows
  if (flow.disabled) {
    // All iA flows are not runnable if disabled
    // For DIY flows, dataloader flows can be runnable
    if (flow._connectorId || !isDataLoader) {
      return false;
    }
  }

  const flowHasExport =
    !!flow._exportId ||
    (flow.pageGenerators && flow.pageGenerators.some(pg => pg._exportId));

  // flows need at least one export to be runnable
  if (!flowHasExport) return false;

  const flowHasImport =
    !!flow._importId ||
    (flow.pageProcessors &&
      flow.pageProcessors.some(pg => pg._exportId || pg._importId));

  // flows need at least one import to be runnable
  if (!flowHasImport) return false;

  // as long as we have an imp and exp a data loader is runnable
  if (isDataLoader) return true;

  // flows need at least one export which is not real-time to be runnable.
  if (!hasBatchExport(exports, exp, flow)) {
    return false;
  }

  // finally, we must thus be runnable.
  return true;
}

export function getExportIdsFromFlow(flow) {
  const exportIds = [];

  if (!flow) {
    return exportIds;
  }

  if (flow._exportId) {
    exportIds.push(flow._exportId);
  }

  if (flow.pageGenerators && flow.pageGenerators.length > 0) {
    flow.pageGenerators.forEach(pg => {
      if (pg._exportId) {
        exportIds.push(pg._exportId);
      }
    });
  }

  if (flow.pageProcessors && flow.pageProcessors.length > 0) {
    flow.pageProcessors.forEach(pp => {
      if (pp._exportId) {
        exportIds.push(pp._exportId);
      }
    });
  }

  return exportIds;
}

export function getImportIdsFromFlow(flow) {
  const importIds = [];

  if (!flow) {
    return importIds;
  }

  if (flow._importId) {
    importIds.push(flow._importId);
  }

  if (flow.pageProcessors && flow.pageProcessors.length > 0) {
    flow.pageProcessors.forEach(pp => {
      if (pp._importId) {
        importIds.push(pp._importId);
      }
    });
  }

  return importIds;
}
