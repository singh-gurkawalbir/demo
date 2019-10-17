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

export function isSimpleImportFlow(state, flow) {
  const _exportId =
    flow.pageGenerators && flow.pageGenerators.length
      ? flow.pageGenerators.at(0)._exportId
      : flow._exportId;
  const exp = resource(state, 'exports', _exportId);

  return exp && exp.type === 'simple';
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
  });

  return flows;
}
