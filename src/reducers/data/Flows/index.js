import * as fromData from '../../data';
import { resource } from '../../index';

export function isRealtimeFlow(state, flow) {
  const _exportId =
    flow.pageGenerators && flow.pageGenerators.length
      ? flow.pageGenerators.at(0)._exportId
      : flow._exportId;
  const exp = resource(state, 'exports', _exportId);

  return (
    (exp &&
      ((exp.type && ['distributed', 'webhook'].indexOf(exp.type) > -1) ||
        exp.adaptorType === 'AS2Export')) ||
    false
  );
}

export function hasBatchExport(state, flow) {
  let toReturn = false;

  if (flow._exportId) {
    return !flow.isRealtime;
  }

  if (flow.pageGenerators.length) {
    flow.pageGenerators.forEach(pg => {
      const exportId = pg._exportId;
      const exp = resource(state, 'exports', exportId);
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

export function isSimpleImportFlow(state, flow) {
  const _exportId =
    flow.pageGenerators && flow.pageGenerators.length
      ? flow.pageGenerators.at(0)._exportId
      : flow._exportId;
  const exp = resource(state, 'exports', _exportId);

  return exp && exp.type === 'simple';
}

export function isRunnable(state, flow) {
  let toReturn = true;

  if (flow.isOrchestratedFlow) {
    toReturn =
      toReturn &&
      !!(flow.pageGenerators && flow.pageGenerators.length) &&
      !!(flow.pageProcessors && flow.pageProcessors.length);
  }

  if (flow.pageGenerators && flow.pageGenerators.length) {
    flow.pageGenerators.forEach(pg => {
      toReturn = toReturn && !!pg._exportId;
    });
  }

  if (flow.pageProcessors && flow.pageProcessors.length) {
    flow.pageProcessors.forEach(pp => {
      toReturn = toReturn && (!!pp._exportId || !!pp._importId);
    });
  }

  return toReturn && !flow.disabled && hasBatchExport(state, flow);
}

export function getAllFlows(state, options) {
  const flows = fromData.resourceList(state.data, options).resources;

  flows.forEach((f, i) => {
    if (isRealtimeFlow(state, f)) {
      flows[i].isRealtime = true;
    }

    if (isSimpleImportFlow(state, f)) {
      flows[i].isSimpleImport = true;
    }

    if (isRunnable(state, f)) {
      flows[i].isRunnable = true;
    }
  });

  return flows;
}
