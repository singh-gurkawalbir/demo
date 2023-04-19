import jsonPatch, { deepClone } from 'fast-json-patch';
import { get, sortBy } from 'lodash';
import { C_LOCKED_FIELDS } from '../../../constants';
import { isDeleted, isRemoved } from '../../../utils/form';

const searchMetaForFieldByFindFunc = (meta, findFieldFunction) => {
  if (!meta) return null;

  const { fieldMap } = meta;

  if (!fieldMap) return null;
  const foundFieldRefKey = Object.keys(fieldMap)
    .filter(key => findFieldFunction(fieldMap[key]))
    .map(key => ({
      fieldReference: key,
      field: fieldMap[key],
    }));

  if (foundFieldRefKey && foundFieldRefKey[0]) return foundFieldRefKey[0];

  return null;
};
export const fieldsWithRemoveDelete = fields => {
  const fieldsNew = {};

  Object.keys(fields).forEach(key => {
    const field = fields[key];

    fieldsNew[key] = {...field, isRemove: isRemoved(field, fields), deleteWhen: isDeleted(field, fields)};
  });

  return fieldsNew;
};

export const valuesToDelete = (values, fields) => {
  const newValues = {...values};

  Object.keys(fields).forEach(key => {
    (fields[key].delete || fields[key].deleteWhen) ? delete newValues[`/${(key.replaceAll('.', '/'))}`] : '';
  });

  return newValues;
};
export const valuesToRemove = (values, fields) => {
  const newValues = {...values};

  Object.keys(values).forEach(key => {
    const valkey = key.slice(1);
    const valueKeys = valkey.replaceAll('/', '.');

    // eslint-disable-next-line no-self-assign
    (valueKeys in fields && (fields[valueKeys].remove || fields[valueKeys].isRemove)) ? newValues[key] = undefined : newValues[key] = newValues[key];
  });

  return newValues;
};
export const defaultPatchSetConverter = values =>
  Object.keys(values).map(key => ({
    op: 'replace',
    path: key,
    value: values[key],
  }));

const byId = (f, id) => (f.id ? f.id === id : f.fieldId === id);

const fieldsStateToArray = fields => Object.values(fields);

export const getFieldWithReferenceById = ({ meta, id }) =>
  searchMetaForFieldByFindFunc(meta, f => byId(f, id));

export const getFieldById = ({ meta, id }) => {
  const res = searchMetaForFieldByFindFunc(meta, f => byId(f, id));

  return res && res.field;
};

export const getFieldByIdFromLayout = (layout, fieldMap, id) => {
  if (!layout) return null;
  const { fields, containers } = layout;

  // check fields

  if (fields && fields.find(field => field === id)) {
    return getFieldById({ meta: { fieldMap }, id });
  }

  return (
    containers &&
    containers
      .map(container => getFieldByIdFromLayout(container, fieldMap, id))
      .reduce((acc, curr) => {
        // get first matching field
        // eslint-disable-next-line no-param-reassign
        if (curr && !acc) acc = curr;

        return acc;
      }, null)
  );
};

export const getInvalidFields = (fieldStates, shouldShowPurelyInvalid) => fieldsStateToArray(fieldStates).filter(
  field => shouldShowPurelyInvalid ? !field.isValid : !field.isValid || field.isDiscretelyInvalid
);

export const isExpansionPanelErrored = (meta, fieldStates, shouldShowPurelyInvalid) => {
  const invalidFields = getInvalidFields(fieldStates, shouldShowPurelyInvalid);
  const { layout, fieldMap } = meta;

  return invalidFields.some(
    ({ id }) => !!getFieldByIdFromLayout(layout, fieldMap, id)
  );
};

export const isExpansionPanelRequired = (meta, fieldStates) => {
  const requiredFields = fieldsStateToArray(fieldStates).filter(field => field.required && field.visible);
  const { layout, fieldMap } = meta;

  return requiredFields.some(
    ({ id }) => !!getFieldByIdFromLayout(layout, fieldMap, id)
  );
};

export const fieldIDsExceptClockedFields = (meta, resourceType) => {
  if (!meta) return null;
  const { fieldMap } = meta;

  // if fieldMap is not provided just return metadata untranslated
  // They DynaForm will probably return null in this case
  if (!fieldMap) { return null; }

  return Object.keys(fieldMap).reduce((acc, curr) => {
    if (
      C_LOCKED_FIELDS[resourceType] &&
      !C_LOCKED_FIELDS[resourceType].includes(fieldMap[curr].id)
    ) {
      acc.push(fieldMap[curr].id);
    }

    return acc;
  }, []);
};

export const getFieldByName = ({ fieldMeta, name }) => {
  const res = searchMetaForFieldByFindFunc(fieldMeta, f => f.name === name);

  return res && res.field;
};

export const isFormTouched = fields => fields?.some(field => field.touched);

export const isAnyFieldTouchedForMeta = ({ layout, fieldMap }, fields) =>
  fieldsStateToArray(fields)
    .filter(field => field.touched)
    .some(({ id }) => !!getFieldByIdFromLayout(layout, fieldMap, id));

export const isAnyFieldVisibleForMeta = ({ layout, fieldMap }, fields) =>
  fieldsStateToArray(fields)
    .filter(field => field.visible)
    .some(({ id }) => !!getFieldByIdFromLayout(layout, fieldMap, id));

export const fieldsTouchedForMeta = ({ layout, fieldMap }, fields) =>
  fields.filter(({ id }) => !!getFieldByIdFromLayout(layout, fieldMap, id));

const getFieldByNameFromLayout = (layout, fieldMap, name) => {
  if (!layout) return null;
  const { fields, containers } = layout;

  if (
    fields &&
    fields.map(fieldId => fieldMap[fieldId]).some(field => field.name === name)
  ) {
    return getFieldByName({ fieldMeta: { fieldMap }, name });
  }

  return (
    containers &&
    containers
      .map(container => getFieldByNameFromLayout(container, fieldMap, name))
      .reduce((acc, curr) => {
        // get first matching field
        // eslint-disable-next-line no-param-reassign
        if (curr && !acc) acc = curr;

        return acc;
      }, null)
  );
};

export const getAllFormValuesAssociatedToMeta = (values, meta = {}) => {
  const { layout, fieldMap } = meta;

  return Object.keys(values)
    .filter(valueKey => !!getFieldByNameFromLayout(layout, fieldMap, valueKey))
    .reduce((acc, curr) => {
      acc[curr] = values[curr];

      return acc;
    }, {});
};

export const getMetadatasForIndividualTabs = (meta = {}) => {
  const { layout, fieldMap, actions } = meta;

  const {containers} = layout;

  if (!layout || !fieldMap || !containers) {
    return null;
  }

  return containers.map(container => {
    const containerSpecificFieldMap = Object.keys(fieldMap)
      .filter(key => !!getFieldByIdFromLayout(container, fieldMap, key))
      .reduce((acc, curr) => {
        acc[curr] = fieldMap[curr];

        return acc;
      }, {});

    return {
      key: container.label,
      fieldMeta: {
        fieldMap: containerSpecificFieldMap,
        layout: container,
        actions,
      },
    };
  });
};
export const getMissingPatchSet = (paths, resource) => {
  const missing = [];
  const addMissing = missingPath => {
    if (!missing.find(path => path === missingPath)) {
      missing.push(missingPath);
    }
  };

  paths.forEach(p => {
    const segments = p.split('/');

    // console.log(segments);
    // only deep paths have reference errors.
    // length >2 because first is empty root node.
    if (segments.length > 1) {
      let r = resource;
      let path = '';

      for (let i = 1; i <= segments.length - 1; i += 1) {
        const segment = segments[i];

        path = `${path}/${segment}`;
        const missingSegments = segments.slice(i + 1, segments.length);

        if (
          r === undefined ||
          r[segment] === undefined ||
          (typeof r[segment] !== 'object' && missingSegments.length !== 0)
        ) {
          addMissing(path);

          let missingPath = `${path}/${missingSegments[0]}`;

          for (let j = 1; j <= missingSegments.length; j += 1) {
            addMissing(missingPath);
            missingPath = `${missingPath}/${missingSegments[j]}`;
          }

          break;
        }

        r = r[segment];
      }
    }
  });
  // console.log(missing.sort());

  return missing.sort().map(p => ({ path: p, op: 'add', value: {} }));
};

export const sanitizePatchSet = ({
  patchSet,
  fieldMeta = {},
  resource,
  skipRemovePatches = false,
}) => {
  if (!patchSet) return patchSet;
  const sanitizedSet = patchSet.reduce(
    (s, patch) => {
      const { removePatches, valuePatches } = s;

      if (patch.op === 'replace') {
        const field = getFieldByName({ name: patch.path, fieldMeta });

        const modifiedPath = patch.path
          .substring(1, patch.path.length)
          .replace(/\//g, '.');
        const fieldValueOnResource = get(resource, modifiedPath);

        // default values of all fields are '' so when undefined value is being sent it indicates that we would like delete those properties
        if (patch.value === undefined && !skipRemovePatches) {
          // consider it as a remove patch
          if (fieldValueOnResource) removePatches.push({ path: patch.path, op: 'remove' });
        } else if (
          !field ||
          field.defaultValue !== patch.value ||
          (field.defaultValue === patch.value && field.defaultValue !== '')
        ) {
          valuePatches.push(patch);
        } else if (fieldValueOnResource && patch.value === '') {
          // if the field on resource has value but patch.value is an empty string, the value on the resource should be patched
          valuePatches.push(patch);
        }
      }

      return s;
    },
    { removePatches: [], valuePatches: [] }
  );
  const { removePatches, valuePatches } = sanitizedSet;

  if ((removePatches === 0 && valuePatches === 0) || !resource) {
    return [...removePatches, ...valuePatches];
  }

  let resourceAfterRemovePatches;

  if (removePatches?.length) {
    resourceAfterRemovePatches = jsonPatch.applyPatch(deepClone(resource), removePatches).newDocument;
  } else {
    resourceAfterRemovePatches = resource;
  }

  // we should generate missing patches against a resource with its remove patches applied to it
  const missingPatchSet = getMissingPatchSet(
    valuePatches.map(p => p.path),
    resourceAfterRemovePatches
  );
  // Though we are adding the missing patches, in some scenarios the path is getting replaced later
  // and it's resulting in referring to the undefined path. Sorting the missing and valuePatchSet by path
  // and operation will resolve this issue.
  const newSet = [...removePatches, ...sortBy([...missingPatchSet, ...valuePatches], ['path', 'op'])];
  const error = jsonPatch.validate(newSet, resource);

  if (error) {
    // TODO: resolve why the validate performs a more strict check than
    // applying a patch... or possibly we are applying the patch to a
    // different object which is why its not failing when applying patches.

    // eslint-disable-next-line
    // console.log(error, newSet, resource);
    // throw new Error('Something wrong with the patchSet operations ', error);
  }

  return newSet;
};

// #BEGIN_REGION Integration App form utils
export const convertFieldsToFieldReferenceObj = (acc, curr) => {
  if (!curr.fieldId && !curr.id && !curr.formId) {
    throw new Error('No fieldId , id or formId', curr);
  }

  if (acc && curr.fieldId) acc[curr.fieldId] = curr;
  else if (acc && curr.id) acc[curr.id] = curr;
  else if (acc && curr.formId) acc[curr.formId] = curr;
  // else throw new Error('could not find any of the props');

  // !curr.formId
  return acc;
};

export const refGeneration = field => {
  const { fieldId, id, formId } = field;

  if (fieldId) return fieldId;
  if (id) return id;
  if (formId) return formId;
  throw new Error('cant generate reference');
};

export const getFieldConfig = (field = {}, resource = {}, isSuiteScript) => {
  const newField = { ...field };

  if (newField.value === undefined) {
    newField.value = (newField.type === 'multiselect') ? [] : null;
  }
  if (!newField.type || newField.type === 'input') {
    if (!newField.type && newField?.supportsRefresh) {
      // specific to suitescript
      newField.type = 'refreshabletext';
    } else {
      newField.type = 'text';
    }
  } else if (newField.type === 'expression') {
    newField.type = 'iaexpression';
    newField.flowId = resource._id;
  } else if (newField.type === 'radio') {
    newField.type = 'radiogroup';
  } else if (newField.type === 'file') {
    newField.type = 'uploadfile';
    newField.isIAField = true;
  } else if (newField.type === 'uploadfile') {
    newField.type = 'uploadfile';
    newField.isIAField = true;
  } else if (newField.type === 'matchingCriteria') {
    newField.type = 'matchingcriteria';
  } else if (newField.supportsRefresh && (newField.type === 'select' || newField.type === 'multiselect')) {
    if (newField.type === 'multiselect') { newField.multiselect = true; }
    if (isSuiteScript) newField.type = 'suitescriptsettings';
    else { newField.type = 'integrationapprefreshableselect'; }
  } else if (['select', 'multiselect'].includes(newField.type) && !newField.supportsRefresh) {
    newField.multiselect = newField.type === 'multiselect';
    newField.type = 'iaselect';
  } else if (newField.type === 'referencedFieldsDialog') {
    newField.type = 'salesforcereferencedfieldsia';
    newField.resource = resource;
  } else if (newField.type === 'relatedListsDialog') {
    newField.type = 'salesforcerelatedlistia';
    newField.resource = resource;
  } else if (newField.type === 'link') {
    newField.type = 'suitescripttable';
  } else if (newField.type === 'staticMapWidget') {
    newField.type = 'staticMap';
  } else if (newField.type === 'textarea') {
    newField.multiline = true;
    newField.rowsMax = 10;
  } else if (newField.type === 'checkbox' && newField.featureCheckConfig) {
    newField.type = 'featurecheck';
    newField.featureName = newField.featureCheckConfig.featureName;
  }

  if (newField.disabled) {
    newField.defaultDisabled = true;
  }
  if (newField.hidden) {
    newField.visible = false;
  }

  return newField;
};

function extractRules(fields, currFieldName, value) {
  return fields.map(field => {
    const { name, hidden, required, disabled} = field;
    let rule = { ref: name };

    if (Object.prototype.hasOwnProperty.call(field, 'hidden') && !hidden) {
      rule = {
        ...rule,
        visibleRule: { field: currFieldName, is: [value] },
      };
    }

    if (required) {
      rule = {
        ...rule,
        requiredRule: { field: currFieldName, is: [value] },
      };
    }

    if (disabled) {
      rule = {
        ...rule,
        disabledRule: { field: currFieldName, is: [value] },
      };
    }

    return rule;
  });
}

const pushRuleToMeta = (meta, rule) => {
  // eslint-disable-next-line no-param-reassign
  if (!meta) meta = [];
  const matchingFieldRuleIndex = meta.findIndex(
    ruleIter => ruleIter.field === rule.field
  );

  // if you find an existing field value push the value
  if (matchingFieldRuleIndex > -1) {
    meta[matchingFieldRuleIndex].is.push(...rule.is);
  } else {
    meta.push({ ...rule });
  }

  return meta;
};

export const adjustingFieldRules = fieldMapCopyRef => {
  const newValues = { ...fieldMapCopyRef };

  if (newValues?.visibleWhenAll?.length) {
    delete newValues.visible;
  }
  if (newValues?.requiredWhenAll?.length) {
    delete newValues.required;
  }
  if (newValues?.disabledWhenAll?.length) {
    delete newValues.defaultDisabled;
  }

  return newValues;
};

export const translateDependencyProps = fieldMap => {
  const fieldMapCopy = deepClone(fieldMap);

  Object.keys(fieldMap).forEach(key => {
    const { dependencies, type } = fieldMap[key];
    const rules = [];

    if (dependencies) {
      Object.keys(dependencies).forEach(value => {
        Object.keys(dependencies?.[value]).forEach(componentType => {
        // links are similar to fields property and these are dependencies defined for link components
          const dependencyFields = dependencies[value][componentType];

          // feature is a checkbox
          if (type === 'checkbox' || type === 'featurecheck') {
            rules.push(
              ...(extractRules(dependencyFields, key, value === 'enabled') || [])
            );
          } else rules.push(...(extractRules(dependencyFields, key, value) || []));
        });
      });

      delete fieldMapCopy[key].dependencies;
    }

    rules.forEach(rule => {
      const { ref, visibleRule, requiredRule, disabledRule } = rule;

      // im doing this check to prevent pushing rules to non existent refs
      // this can happen when fields are hidden and removed from the meta
      // So the rules generated from the dependencies are not needed then
      if (fieldMapCopy[ref]) {
        if (visibleRule) {
          fieldMapCopy[ref].visibleWhenAll = pushRuleToMeta(
            fieldMapCopy[ref].visibleWhenAll,
            visibleRule
          );
        }

        if (requiredRule) {
          fieldMapCopy[ref].requiredWhenAll = pushRuleToMeta(
            fieldMapCopy[ref].requiredWhenAll,
            requiredRule
          );
        }

        if (disabledRule) {
          fieldMapCopy[ref].disabledWhenAll = pushRuleToMeta(
            fieldMapCopy[ref].disabledWhenAll,
            disabledRule
          );
        }
      }
      fieldMapCopy[ref] = adjustingFieldRules(fieldMapCopy[ref]);
    });
  });

  return fieldMapCopy;
};

const translateFieldProps = (fields = [], _integrationId, resource, ssLinkedConnectionId, propsSpreadToFields) =>
  fields
    .map(field => {
      // TODO: generate correct name path
      const { name, options, default: defaultValue, tooltip } = field;
      // name is the unique identifier....verify with Ashok

      return {
        ...(propsSpreadToFields || {}),
        ...getFieldConfig(field, resource, !!ssLinkedConnectionId),
        defaultValue,
        name: `/${name}`,
        ssLinkedConnectionId,
        _integrationId,
        id: name,
        helpText: tooltip,
        options: [
          {
            items:
              (Array.isArray(options) &&
                options.map(option => ({
                  label: option && option[1],
                  value: option && option[0],
                }))) ||
              [],
          },
        ],
      };
    });
const generateFieldsAndSections = (acc, field) => {
  const ref = refGeneration(field);

  if (!acc.containers) {
    acc.containers = [];
  }

  if (
    (field && (field.properties && field.properties.sectionName)) ||
    field.title
  ) {
    let expansionPanelTitle;

    if (field.properties && field.properties.sectionName) ({ sectionName: expansionPanelTitle } = field.properties);
    else expansionPanelTitle = field.title;
    const matchingContainer = acc.containers.find(
      container =>
        container &&
        container.containers &&
        container.containers[0] &&
        container.containers[0].label === expansionPanelTitle
    );

    if (matchingContainer) {
      matchingContainer.containers[0].fields.push(ref);
    } else {
      acc.containers.push({
        type: 'collapse',
        containers: [
          {
            collapsed: true,
            label: expansionPanelTitle,
            fields: [ref],
          },
        ],
      });
    }
  } else {
    acc.containers.push({
      fields: [ref],
    });
  }

  return acc;
};

export const integrationSettingsToDynaFormMetadata = (
  meta,
  integrationId,
  skipContainerWrap,
  options = {},
  ssLinkedConnectionId,
) => {
  const finalData = {};
  const { resource, childId, isFlow = false, isSuiteScriptIntegrator, propsSpreadToFields = {}} = options;

  if (!meta || (!meta.fields && !meta.sections)) return null;
  const { fields, sections } = meta;

  if (fields) {
    const addedFieldIdFields = translateFieldProps(
      fields,
      integrationId,
      resource,
      ssLinkedConnectionId,
      {...propsSpreadToFields, childId}
    );

    finalData.fieldMap = addedFieldIdFields.reduce(
      convertFieldsToFieldReferenceObj,
      {}
    );
    finalData.layout = {};
    finalData.layout = addedFieldIdFields.reduce(generateFieldsAndSections, {});
  }

  if (sections) {
    sections.forEach(section => {
      finalData.fieldMap = translateFieldProps(
        section.fields,
        integrationId,
        resource,
        ssLinkedConnectionId,
        {...propsSpreadToFields, childId}
      ).reduce(convertFieldsToFieldReferenceObj, finalData.fieldMap || {});
    });

    // check for title
    if (!finalData.layout) {
      finalData.layout = {};
    }

    // type tab sends the entire form values
    // type tabIA sends per tab
    // for flow settings we send everything for advancedSettings we send per tab

    if (isSuiteScriptIntegrator) { finalData.layout.type = 'suitScriptTabIA'; } else { finalData.layout.type = isFlow ? 'tab' : 'tabIA'; }

    finalData.layout.containers = sections.map(section => ({
      collapsed: section.collapsed || true,
      label: section.title,
      ...translateFieldProps(section.fields, integrationId, resource, ssLinkedConnectionId, {...propsSpreadToFields, childId}).reduce(
        generateFieldsAndSections,
        {}
      ),
    }));
  }

  if (finalData.fieldMap) finalData.fieldMap = translateDependencyProps(finalData.fieldMap);

  // Wrap everything in a advancedSettings container
  if (!skipContainerWrap) {
    finalData.layout = {
      type: 'collapse',
      containers: [{ ...finalData.layout, label: 'Advanced' }],
    };
  }

  // for suitescript, there is no need of isFlow check. We just rely on the sections
  if (isSuiteScriptIntegrator) {
    if (!sections) { finalData.actions = [{ id: 'saveintegrationsettings' }]; } else finalData.actions = [];
  } else if (!sections || !isFlow) {
    finalData.actions = [{ id: 'saveintegrationsettings' }];
  } else finalData.actions = [];

  return finalData;
};

export const getDomain = () =>
  window.document.location.hostname.replace('www.', '');

export const isEuRegion = () => ['eu.integrator.io'].includes(getDomain());
export const isProduction = () =>
  ['integrator.io', 'eu.integrator.io'].includes(getDomain());
export const conditionalLookupOptionsforNetsuite = [
  {
    label: 'Creating a record',
    value: 'record_created',
  },
  {
    label: 'Updating a record',
    value: 'record_updated',
  },
  {
    label: 'Source record has a value',
    value: 'extract_not_empty',
  },
  {
    label: 'Look up finds a record',
    value: 'lookup_not_empty',
  },
  {
    label: 'Look up finds no records',
    value: 'lookup_empty',
  },
  {
    label:
      'Destination record being updated does NOT already have a value for this field',
    value: 'ignore_if_set',
  },
];
export const conditionalLookupOptionsforNetsuiteProduction = [
  {
    label: 'Creating a record',
    value: 'record_created',
  },
  {
    label: 'Updating a record',
    value: 'record_updated',
  },
  {
    label: 'Source record has a value',
    value: 'extract_not_empty',
  },
  {
    label:
      'Destination record being updated does NOT already have a value for this field',
    value: 'ignore_if_set',
  },
];
export const conditionalLookupOptionsforSalesforce = [
  {
    label: 'Source record has a value',
    value: 'extract_not_empty',
  },
  {
    label: 'Look up finds a record',
    value: 'lookup_not_empty',
  },
  {
    label: 'Look up finds no records',
    value: 'lookup_empty',
  },
];
export const conditionalLookupOptionsforSalesforceProduction = [
  {
    label: 'Source record has a value',
    value: 'extract_not_empty',
  },
];
export const conditionalLookupOptionsforRest = [
  {
    label: 'Creating a record',
    value: 'record_created',
  },
  {
    label: 'Updating a record',
    value: 'record_updated',
  },
  {
    label: 'Source record has a value',
    value: 'extract_not_empty',
  },
  {
    label: 'Look up finds a record',
    value: 'lookup_not_empty',
  },
  {
    label: 'Look up finds no records',
    value: 'lookup_empty',
  },
];
export const conditionalLookupOptionsforRestProduction = [
  {
    label: 'Creating a record',
    value: 'record_created',
  },
  {
    label: 'Updating a record',
    value: 'record_updated',
  },
  {
    label: 'Source record has a value',
    value: 'extract_not_empty',
  },
];
export const sourceOptions = {
  ftp: [
    {
      label: 'Transfer files out of source application',
      value: 'transferFiles',
    },
  ],
  googledrive: [
    {
      label: 'Transfer files out of source application',
      value: 'transferFiles',
    },
  ],
  box: [
    {
      label: 'Transfer files out of source application',
      value: 'transferFiles',
    },
  ],
  dropbox: [
    {
      label: 'Transfer files out of source application',
      value: 'transferFiles',
    },
  ],
  azurestorageaccount: [
    {
      label: 'Transfer files out of source application',
      value: 'transferFiles',
    },
  ],
  as2: [
    {
      label: 'Transfer files out of source application',
      value: 'transferFiles',
    },
  ],
  van: [
    {
      label: 'Transfer files out of source application',
      value: 'transferFiles',
    },
  ],
  s3: [
    {
      label: 'Transfer files out of source application',
      value: 'transferFiles',
    },
  ],
  webhook: [
    {
      label: 'Listen for real-time data from source application',
      value: 'webhook',
    },
  ],
  netsuite: [
    {
      label: 'Export records from source application',
      value: 'exportRecords',
    },
    {
      label: 'Listen for real-time data from source application',
      value: 'realtime',
    },
  ],
  salesforce: [
    {
      label: 'Export records from source application',
      value: 'exportRecords',
    },
    {
      label: 'Listen for real-time data from source application',
      value: 'realtime',
    },
  ],
  common: [
    {
      label: 'Export records from source application',
      value: 'exportRecords',
    },
  ],
};
export const destinationOptions = {
  ftp: [
    {
      label: 'Transfer files into destination application',
      value: 'transferFiles',
    },
    {
      label: 'Look up additional files (per record)',
      value: 'lookupFiles',
    },
  ],
  googledrive: [
    {
      label: 'Transfer files into destination application',
      value: 'transferFiles',
    },
    {
      label: 'Look up additional files (per record)',
      value: 'lookupFiles',
    },
  ],
  box: [
    {
      label: 'Transfer files into destination application',
      value: 'transferFiles',
    },
    {
      label: 'Look up additional files (per record)',
      value: 'lookupFiles',
    },
  ],
  dropbox: [
    {
      label: 'Transfer files into destination application',
      value: 'transferFiles',
    },
    {
      label: 'Look up additional files (per record)',
      value: 'lookupFiles',
    },
  ],
  azurestorageaccount: [
    {
      label: 'Transfer files into destination application',
      value: 'transferFiles',
    },
    {
      label: 'Look up additional files (per record)',
      value: 'lookupFiles',
    },
  ],
  s3: [
    {
      label: 'Transfer files into destination application',
      value: 'transferFiles',
    },
    {
      label: 'Look up additional files (per record)',
      value: 'lookupFiles',
    },
  ],
  http: [
    {
      label: 'Import records into destination application',
      value: 'importRecords',
    },
    {
      label: 'Transfer files into destination application',
      value: 'transferFiles',
    },
    {
      label: 'Look up additional records (per record)',
      value: 'lookupRecords',
    },
    {
      label: 'Look up additional files (per record)',
      value: 'lookupFiles',
    },
  ],
  rest: [
    {
      label: 'Import records into destination application',
      value: 'importRecords',
    },
    {
      label: 'Transfer files into destination application',
      value: 'transferFiles',
    },
    {
      label: 'Look up additional records (per record)',
      value: 'lookupRecords',
    },
    {
      label: 'Look up additional files (per record)',
      value: 'lookupFiles',
    },
  ],
  graph_ql: [
    {
      label: 'Import records into destination application',
      value: 'importRecords',
    },
    {
      label: 'Look up additional records (per record)',
      value: 'lookupRecords',
    },
    {
      label: 'Look up additional files (per record)',
      value: 'lookupFiles',
    },
  ],
  netsuite: [
    {
      label: 'Import records into destination application',
      value: 'importRecords',
    },
    {
      label: 'Transfer files into destination application',
      value: 'transferFiles',
    },
    {
      label: 'Look up additional records (per record)',
      value: 'lookupRecords',
    },
    {
      label: 'Look up additional files (per record)',
      value: 'lookupFiles',
    },
  ],
  salesforce: [
    {
      label: 'Import records into destination application',
      value: 'importRecords',
    },
    {
      label: 'Transfer files into destination application',
      value: 'transferFiles',
    },
    {
      label: 'Look up additional records (per record)',
      value: 'lookupRecords',
    },
    {
      label: 'Look up additional files (per record)',
      value: 'lookupFiles',
    },
  ],

  as2: [
    {
      label: 'Import records into destination application',
      value: 'importRecords',
    },
  ],
  van: [
    {
      label: 'Import records into destination application',
      value: 'importRecords',
    },
  ],
  common: [
    {
      label: 'Import records into destination application',
      value: 'importRecords',
    },
    {
      label: 'Look up additional records (per record)',
      value: 'lookupRecords',
    },
  ],
};

// #END_REGION Integration App from utils

export default {
  getFieldById,
  defaultPatchSetConverter,
  isProduction,
};
