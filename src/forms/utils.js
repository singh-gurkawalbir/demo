import jsonPatch, { deepClone } from 'fast-json-patch';
import { get } from 'lodash';

export const searchMetaForFieldByFindFunc = (meta, findFieldFunction) => {
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

export const defaultPatchSetConverter = values =>
  Object.keys(values).map(key => ({
    op: 'replace',
    path: key,
    value: values[key],
  }));

const byId = (f, id) => (f.id ? f.id === id : f.fieldId === id);
const fieldSearchQueryObj = (meta, id, queryRes, offset) => {
  if (!meta || !meta.layout || !meta.fieldMap) return null;

  const { layout, fieldMap } = meta;
  const { fields, containers } = layout;

  if (fields && fields.length > 0) {
    const foundFieldIndex = fields.findIndex(f => byId(fieldMap[f], id));

    if (foundFieldIndex !== -1) {
      let res = queryRes;

      res += `/fields/${foundFieldIndex + offset}`;

      return res;
    }
  }

  return (
    containers &&
    containers
      .map((container, index) =>
        fieldSearchQueryObj(
          {
            fieldMap,
            layout: container,
          },
          id,
          `${queryRes}/containers/${index}`,
          offset
        )
      )
      .reduce((acc, curr) => {
        let res = acc;

        if (!res) res = curr;

        return res;
      }, null)
  );
};

export const getPatchPathForCustomForms = (meta, id, offset = 0) => {
  const baseCustomFormPath = '/customForm/form/layout';
  const res = fieldSearchQueryObj(meta, id, baseCustomFormPath, offset);

  if (!res || res === baseCustomFormPath) return null;

  return res;
};

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

export const isExpansionPanelErrored = (meta, fieldStates) => {
  const invalidFields = fieldStates.filter(
    field => !field.isValid || field.isDiscretelyInvalid
  );
  const { layout, fieldMap } = meta;

  return invalidFields.some(
    ({ id }) => !!getFieldByIdFromLayout(layout, fieldMap, id)
  );
};

export const isAnyExpansionPanelFieldVisible = (meta, fieldStates) => {
  const visibleFields = fieldStates.filter(field => field.visible);
  const { layout, fieldMap } = meta;

  return visibleFields.some(
    ({ id }) => !!getFieldByIdFromLayout(layout, fieldMap, id)
  );
};

export const getFieldByName = ({ fieldMeta, name }) => {
  const res = searchMetaForFieldByFindFunc(fieldMeta, f => f.name === name);

  return res && res.field;
};

export const getFieldByNameFromLayout = (layout, fieldMap, name) => {
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

        // default values of all fields are '' so when undefined value is being sent it indicates that we would like delete those properties
        if (patch.value === undefined && !skipRemovePatches) {
          const modifiedPath = patch.path
            .substring(1, patch.path.length)
            .replace(/\//g, '.');

          // consider it as a remove patch
          if (get(resource, modifiedPath))
            removePatches.push({ path: patch.path, op: 'remove' });
        } else if (
          !field ||
          field.defaultValue !== patch.value ||
          (field.defaultValue === patch.value && field.defaultValue !== '')
        ) {
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

  const missingPatchSet = getMissingPatchSet(
    valuePatches.map(p => p.path),
    resource
  );
  const newSet = [...removePatches, ...missingPatchSet, ...valuePatches];
  const error = jsonPatch.validate(newSet, resource);

  if (error) {
    // TODO: resolve why the validate performs a more strict check than
    // applying a patch... or possibly we are applying the patch to a
    // different object which is why its not failing when applying patches.

    // eslint-disable-next-line
    console.log(error, newSet, resource);
    // throw new Error('Something wrong with the patchSet operations ', error);
  }

  return newSet;
};

// #BEGIN_REGION Integration App form utils
const convertFieldsToFieldReferneceObj = (acc, curr) => {
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

const refGeneration = field => {
  const { fieldId, id, formId } = field;

  if (fieldId) return fieldId;
  else if (id) return id;
  else if (formId) return formId;
  throw new Error('cant generate reference');
};

const getFieldConfig = (field = {}, resource) => {
  const newField = { ...field };

  if (!newField.type || newField.type === 'input') {
    newField.type = 'text';
  } else if (newField.type === 'expression') {
    newField.type = 'iaexpression';
    newField.flowId = resource._id;
  } else if (newField.type === 'radio') {
    newField.type = 'radiogroup';
  } else if (newField.type === 'file') {
    newField.type = 'uploadfile';
  } else if (newField.type === 'select' && newField.supportsRefresh) {
    newField.type = 'integrationapprefreshableselect';
  } else if (newField.type === 'multiselect' && newField.supportsRefresh) {
    newField.type = 'integrationapprefreshableselect';
    newField.multiselect = true;
  } else if (newField.type === 'referencedFieldsDialog') {
    newField.type = 'salesforcereferencedfieldsia';
    newField.resource = resource;
  } else if (newField.type === 'relatedListsDialog') {
    newField.type = 'salesforcerelatedlistia';
    newField.resource = resource;
  }

  if (newField.disabled) {
    newField.defaultDisabled = true;
  }

  return newField;
};

function extractRules(fields, currFieldName, value) {
  return fields.map(field => {
    const { name, hidden, required } = field;
    let rule = { ref: name };

    if (!hidden) {
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

export const translateDependencyProps = fieldMap => {
  const fieldMapCopy = deepClone(fieldMap);

  Object.keys(fieldMap).forEach(key => {
    const { dependencies, type } = fieldMap[key];
    const rules = [];

    if (dependencies) {
      Object.keys(dependencies).forEach(value => {
        const dependencyFields = dependencies[value].fields;

        if (type === 'checkbox')
          rules.push(
            ...(extractRules(dependencyFields, key, value === 'enabled') || [])
          );
        else rules.push(...(extractRules(dependencyFields, key, value) || []));
      });

      delete fieldMapCopy[key].dependencies;
    }

    rules.forEach(rule => {
      const { ref, visibleRule, requiredRule } = rule;

      // im doing this check to prevent pushing rules to non existent refs
      // this can happen when fields are hidden and removed from the meta
      // So the rules generated from the dependencies are not needed then
      if (fieldMapCopy[ref]) {
        if (visibleRule) {
          fieldMapCopy[ref].visibleWhenAll = pushRuleToMeta(
            fieldMapCopy[ref].visibleWhenAll,
            visibleRule
          );
        } else if (requiredRule) {
          fieldMapCopy[ref].validWhenAll = pushRuleToMeta(
            fieldMapCopy[ref].validWhenAll,
            requiredRule
          );
        }
      }
    });
  });

  return fieldMapCopy;
};

const translateFieldProps = (fields = [], _integrationId, resource) =>
  fields
    .map(field => {
      // TODO: generate correct name path
      const { name, options, default: defaultValue, tooltip } = field;
      // name is the unique identifier....verify with Ashok

      return {
        ...getFieldConfig(field, resource),
        defaultValue,
        name: `/${name}`,
        _integrationId,
        id: name,
        helpText: tooltip,
        options: [
          {
            items:
              (options &&
                options.map(option => ({
                  label: option && option[1],
                  value: option && option[0],
                }))) ||
              [],
          },
        ],
      };
    })
    .filter(f => !f.hidden);
const generateFieldsAndSections = (acc, field) => {
  const ref = refGeneration(field);

  if (!acc.containers) {
    acc.containers = [];
  }

  if (field && field.properties && field.properties.sectionName) {
    const { sectionName } = field.properties;
    const matchingContainer = acc.containers.find(
      container =>
        container &&
        container.containers &&
        container.containers[0] &&
        container.containers[0].label === sectionName
    );

    if (matchingContainer) {
      matchingContainer.containers[0].fields.push(ref);
    } else {
      acc.containers.push({
        type: 'collapse',
        containers: [
          {
            collapsed: true,
            label: sectionName,
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
  options = {}
) => {
  const finalData = {};
  const { resource } = options;

  if (!meta || (!meta.fields && !meta.sections)) return null;
  const { fields, sections } = meta;

  if (fields) {
    const addedFieldIdFields = translateFieldProps(
      fields,
      integrationId,
      resource
    );

    finalData.fieldMap = addedFieldIdFields.reduce(
      convertFieldsToFieldReferneceObj,
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
        resource
      ).reduce(convertFieldsToFieldReferneceObj, finalData.fieldMap || {});
    });

    // check for title
    if (!finalData.layout) {
      finalData.layout = {};
    }

    finalData.layout.type = 'tabIA';
    finalData.layout.containers = sections.map(section => ({
      collapsed: section.collapsed || true,
      label: section.title,
      ...translateFieldProps(section.fields, integrationId, resource).reduce(
        generateFieldsAndSections,
        {}
      ),
    }));
  }

  if (finalData.fieldMap)
    finalData.fieldMap = translateDependencyProps(finalData.fieldMap);

  // Wrap everything in a adavancedSettings container
  if (!skipContainerWrap) {
    finalData.layout = {
      type: 'collapse',
      containers: [{ ...finalData.layout, label: 'Advanced Settings' }],
    };
  }

  if (!sections) finalData.actions = [{ id: 'saveintegrationsettings' }];
  else finalData.actions = [];

  return finalData;
};

export const getDomain = () =>
  window.document.location.hostname.replace('www.', '');

export const isProduction = () =>
  ['integrator.io', 'eu.integrator.io'].includes(getDomain());

// #END_REGION Integration App from utils

export default {
  getFieldById,
  defaultPatchSetConverter,
  isProduction,
};
