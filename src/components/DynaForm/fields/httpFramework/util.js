import { isArray, isObject } from 'lodash';
import format from 'xml-formatter';
import { deepClone } from 'fast-json-patch';
import { stringCompare } from '../../../../utils/sort';

function resourceOptions({ assistantData }) {
  return assistantData?.resources?.filter(res => !res.hidden)?.map(resource => ({
    label: resource.name,
    value: resource.id,
  }));
}

function versionOptions({ resourceData = { resources: [] } }) {
  return resourceData.versions?.map(version => ({
    label: version.version,
    value: version._id || version.version,
  }))
    .sort(stringCompare('label'));
}

function exportOperationOptions({ resourceData = { endpoints: [] } }) {
  return resourceData.endpoints?.filter(ep => !ep.hidden)?.map(operation => ({
    label: operation.name,
    value: operation.id || operation.url,
  }));
}

function importOperationKey(operation) {
  if (operation.id) {
    return operation.id;
  }

  if (isArray(operation.url)) {
    return [operation.method.join(':'), operation.url.join(':')].join(':');
  }

  return [operation.method, operation.url].join(':');
}

function importOperationOptions({ resourceData = { operations: [] } }) {
  return resourceData.operations.filter(op => !op.hidden).map(operation => ({
    label: operation.name,
    value: importOperationKey(operation),
  }));
}

// function versionData({ versions = [], versionId }) {
//   let version = versions.find(v => v._id === versionId);

//   if (!version && versions.length === 1) {
//     [version] = versions;
//   }

//   return version;
// }

function resourceData({ resources = [], resourceId }) {
  return resources.find(r => r.id === resourceId);
}

export function selectOptions({
  assistantFieldType,
  assistantData = { export: {}, import: {} },
  formContext,
  resourceType,
}) {
  const resourceTypeSingular = resourceType === 'imports' ? 'import' : 'export';

  if (assistantFieldType === 'version' && assistantData?.[resourceTypeSingular]?.versions?.length === 1) {
    const versions = assistantData?.[resourceTypeSingular]?.versions?.filter(v => !v.hidden);

    return versions?.map(version => ({
      label: version.version,
      value: version._id || version.version,
    }))
      .sort(stringCompare('label'));
  }
  if (assistantFieldType === 'resource') {
    return resourceOptions({
      assistantData: assistantData?.[resourceTypeSingular],
    });
  }

  const selectedResource = resourceData({
    resources: assistantData?.[resourceTypeSingular]?.resources,
    resourceId: formContext.resource,
  });

  if (!selectedResource) {
    return [];
  }

  if (assistantFieldType === 'version') {
    return versionOptions({
      resourceData: selectedResource,
    });
  }
  if (assistantFieldType === 'operation') {
    if (resourceType === 'imports') {
      return importOperationOptions({
        resourceData: selectedResource,
      });
    }

    return exportOperationOptions({
      resourceData: selectedResource,
    });
  }

  return [];
}

function semiAssistantOperationOptions(endpoints = [], parent = {key: []}) {
  let options = [];
  let endpointName;

  endpoints.forEach(ep => {
    if (ep.folder) {
      options = options.concat(semiAssistantOperationOptions(ep.children, {title: parent && parent.title ? `${parent.title} : ${ep.title}` : ep.title, key: [...parent.key, ep.key]}));
    } else {
      endpointName = ep.name;
      if (!endpointName) {
        endpointName = parent && parent.title ? `${parent.title} : ${ep.title}` : ep.title;
      }
      options.push({
        label: endpointName,
        value: parent ? [...parent.key, ep.key].join('.') : ep.key,
      });
    }
  });

  return options;
}

export function semiAssistantExportOperationOptions(assistantData) {
  let options = [];

  assistantData?.export?.endpoints?.forEach(ep => {
    options = options.concat(semiAssistantOperationOptions(ep.children, {key: [ep.key]}));
  });

  return [{
    items: options,
  }];
}

function deepObjectExtend(target, source) {
  Object.keys(source).forEach(prop => {
    if (Object.keys(target).includes(prop) && isObject(target[prop])) {
      deepObjectExtend(target[prop], source[prop]);
    } else {
      // eslint-disable-next-line no-param-reassign
      target[prop] = source[prop];
    }
  });

  return target;
}

export function semiAssistantExportConfig(assistantData, operationId) {
  const keys = operationId.split('.');
  let toReturn = {};
  let node = deepClone(assistantData.export);

  toReturn = deepObjectExtend(toReturn, node.config);

  keys.forEach(key => {
    if (node.endpoints) {
      node = node.endpoints.find(ep => ep.key === key);
    } else if (node.children) {
      node = node.children.find(ep => ep.key === key);
    }
    toReturn = deepObjectExtend(toReturn, node.config || {});
  });

  if (toReturn?.http?.body) {
    try {
      toReturn.http.body = format(toReturn.http.body);
    } catch (ex) {
      // ex
    }
  }

  if (toReturn?.doesNotSupportPaging) {
    delete toReturn.http.paging;
  }

  if (!toReturn.type) {
    toReturn.type = 'all';
  }

  delete toReturn.ui;

  return toReturn;
}
