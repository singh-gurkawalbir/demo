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

function versionOptions({ resourceData = { versions: [] }, operation, resources, resourceType }) {
  if (!resourceData.id.includes('+')) {
    return resourceData.versions?.map(version => ({
      label: version.version,
      value: version._id || version.version,
    }))
    .sort(stringCompare('label'));
  }

  const operations = operation.split('+');
  const endpoints = resourceType === 'imports' ? resourceData.operations : resourceData.endpoints;
  const resourceIds = endpoints.filter(e => operations.includes(e.id))?.map(ep => ep._httpConnectorResourceIds)?.flat(1);

  const filteredResources = resources.filter(res => resourceIds.includes(res.id));
  const versionIds = filteredResources.map(fRes => fRes._versionIds)?.flat(1);

  return resourceData.versions?.filter(v => versionIds.includes(v._id))?.map(version => ({
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
  const returnOptions = resourceData.operations.filter(op => !op.hidden).map(operation => ({
    label: operation.name,
    value: importOperationKey(operation),
  }));
  const ignoreExisting = resourceData.operations.find(operation => operation.ignoreExisting);
  const ignoreMissing = resourceData.operations.find(operation => operation.ignoreMissing);

  if (ignoreExisting && ignoreMissing) {
    returnOptions.push({
      label: 'Composite: create new records & update existing records',
      value: 'create-update-id',
    });
  }

  return returnOptions;
}
function importcreateEndpointOptions({ resourceData = { operations: [] } }) {
  const returnOptions = resourceData.operations.filter(operation => !operation.hidden && operation.ignoreExisting).map(operation => ({
    label: operation.name,
    value: importOperationKey(operation),
  }));

  return returnOptions;
}
function importupdateEndpointOptions({ resourceData = { operations: [] } }) {
  const returnOptions = resourceData.operations.filter(operation => !operation.hidden && operation.ignoreMissing).map(operation => ({
    label: operation.name,
    value: importOperationKey(operation),
  }));

  return returnOptions;
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

  if (!formContext.operation) {
    return [];
  }

  if (assistantFieldType === 'version') {
    return versionOptions({
      resourceData: selectedResource,
      operation: formContext.operation,
      resources: assistantData?.[resourceTypeSingular]?.resources,
      resourceType,
    });
  }
  if (formContext.operation === 'create-update-id' && resourceType === 'imports') {
    if (assistantFieldType === 'createEndpoint') {
      return importcreateEndpointOptions({
        resourceData: selectedResource,
      });
    }
    if (assistantFieldType === 'updateEndpoint') {
      return importupdateEndpointOptions({
        resourceData: selectedResource,
      });
    }
  }

  return [];
}

// parent obj will always be there
function semiAssistantOperationOptions(endpoints = [], /* istanbul ignore next */ parent = {key: []}) {
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
        value: parent ? [...parent.key, ep.key].join('.') : /* istanbul ignore next */ep.key,
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
