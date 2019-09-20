import { isArray } from 'lodash';

export function versionOptions({ assistantData }) {
  return assistantData.versions.map(vesrion => ({
    label: vesrion.version,
    value: vesrion.version,
  }));
}

export function resourceOptions({ versionData = { resources: [] } }) {
  return versionData.resources.map(resource => ({
    label: resource.name,
    value: resource.id,
  }));
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
  options,
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
    versionId: options.version,
  });

  if (!selectedVersion) {
    return [];
  }

  if (assistantFieldType === 'resource') {
    return resourceOptions({
      versionData: selectedVersion,
    });
  } else if (assistantFieldType === 'operation') {
    if (resourceType === 'imports') {
      return importOperationOptions({
        resourceData: resourceData({
          resources: selectedVersion.resources,
          resourceId: options.resource,
        }),
      });
    }

    return exportOperationOptions({
      resourceData: resourceData({
        resources: selectedVersion.resources,
        resourceId: options.resource,
      }),
    });
  }

  return [];
}
