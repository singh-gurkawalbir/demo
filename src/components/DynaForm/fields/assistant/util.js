import { isArray, isObject } from 'lodash';
// eslint-disable-next-line camelcase
import { html_beautify } from 'js-beautify';
import { deepClone } from 'fast-json-patch';
import { stringCompare } from '../../../../utils/sort';

export function versionOptions({ assistantData }) {
  return assistantData.versions.map(vesrion => ({
    label: vesrion.version,
    value: vesrion.version,
  }));
}

export function resourceOptions({ versionData = { resources: [] } }) {
  return versionData.resources
    .map(resource => ({
      label: resource.name,
      value: resource.id,
    }))
    .sort(stringCompare('label'));
}

export function exportOperationOptions({ resourceData = { endpoints: [] } }) {
  return resourceData.endpoints.map(operation => ({
    label: operation.name,
    value: operation.id || operation.url,
  }));
}

export function importOperationKey(operation) {
  if (operation.id) {
    return operation.id;
  }

  if (isArray(operation.url)) {
    return [operation.method.join(':'), operation.url.join(':')].join(':');
  }

  return [operation.method, operation.url].join(':');
}

export function importOperationOptions({ resourceData = { operations: [] } }) {
  return resourceData.operations.map(operation => ({
    label: operation.name,
    value: importOperationKey(operation),
  }));
}

export function versionData({ versions = [], versionId }) {
  let version = versions.find(v => v.version === versionId);

  if (!version && versions.length === 1) {
    [version] = versions;
  }

  return version;
}

export function resourceData({ resources = [], resourceId }) {
  return resources.find(r => r.id === resourceId);
}

export function selectOptions({
  assistantFieldType,
  assistantData = { export: {}, import: {} },
  formContext,
  resourceType,
}) {
  const resourceTypeSingular = resourceType === 'imports' ? 'import' : 'export';

  if (assistantFieldType === 'version') {
    return versionOptions({
      assistantData: assistantData[resourceTypeSingular],
    });
  }

  const selectedVersion = versionData({
    versions: assistantData[resourceTypeSingular].versions,
    versionId: formContext.version,
  });

  if (!selectedVersion) {
    return [];
  }

  if (assistantFieldType === 'resource') {
    return resourceOptions({
      versionData: selectedVersion,
    });
  }
  if (assistantFieldType === 'operation') {
    if (resourceType === 'imports') {
      return importOperationOptions({
        resourceData: resourceData({
          resources: selectedVersion.resources,
          resourceId: formContext.resource,
        }),
      });
    }

    return exportOperationOptions({
      resourceData: resourceData({
        resources: selectedVersion.resources,
        resourceId: formContext.resource,
      }),
    });
  }

  return [];
}

export function semiAssistantOperationOptions(endpoints = [], parent = {key: []}) {
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

export function deepObjectExtend(target, source) {
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
      toReturn.http.body = html_beautify(toReturn.http.body, { indent_size: 2});
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
