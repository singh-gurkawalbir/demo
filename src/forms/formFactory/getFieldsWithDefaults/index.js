import { get } from 'lodash';
import produce from 'immer';
import masterFieldHash from '../../fieldDefinitions';
import formMeta from '../../definitions';

const resolveAllFnsInFieldMeta = (field, resource) => Object.keys(field).reduce((acc, key) => {
  if (typeof field[key] === 'function') {
    acc[key] = field[key](resource);
  } else { acc[key] = field[key]; }

  return acc;
}, {});
const applyVisibilityRulesToSubForm = (f, resourceType) => {
  // subforms containers are not supported
  if (
    !formMeta[resourceType] ||
      !formMeta[resourceType].subForms ||
      !formMeta[resourceType].subForms[f.formId] ||
      !formMeta[resourceType].subForms[f.formId].fieldMap
  ) {
    throw new Error(`could not find fieldMap for given form id ${f.formId}`);
  }

  if (
    !formMeta[resourceType].subForms[f.formId].layout ||
      !formMeta[resourceType].subForms[f.formId].layout.fields
  ) {
    throw new Error(`could not find fields for given form id ${f.formId}`);
  }

  const fieldMapFromSubForm =
      formMeta[resourceType].subForms[f.formId].fieldMap;

  // there is no point supporting visibleWhen ....which is an 'OR' condition of visible rules..
  // if it is true here it doesn't matter with the subform rule here
  // we give the subform the maximum precedence in deciding its visibility
  // we support only visibleWhenAll rule
  if (f.visibleWhen || f.visible) {
    throw new Error(
      'Incorrect rule, cannot support a visibleWhen rule or visible defaultState rule'
    );
  }

  const transformedFieldMap = Object.keys(fieldMapFromSubForm)
    .map(key => {
      let field = fieldMapFromSubForm[key];
      const masterFields = masterFieldHash[resourceType]
        ? masterFieldHash[resourceType][field.fieldId]
        : {};

      field = { ...masterFields, ...field };

      const fieldCopy = produce(field, draft => {
        if (f.visibleWhenAll) {
          draft.visibleWhenAll = draft.visibleWhenAll || [];

          draft.visibleWhenAll.push(...f.visibleWhenAll);
        }
      });

      return { field: fieldCopy, key };
    })
    .reduce((acc, curr) => {
      const { field, key } = curr;

      acc[key] = field;

      return acc;
    }, {});
  const subformFields = formMeta[resourceType].subForms[f.formId].layout.fields;

  return { subformFieldMap: transformedFieldMap, subformFields };
};

const applyingMissedOutFieldMetaProperties = (
  incompleteField,
  resource,
  resourceType,
  ignoreFunctionTransformations
) => {
  let field = incompleteField;

  if (!ignoreFunctionTransformations) {
    field = resolveAllFnsInFieldMeta(field, resource);
  }

  if (!field.id) {
    field.id = field.fieldId;
  }

  if (!field.name) {
    if (field.id) field.name = `/${field.id.replace(/\./g, '/')}`;
  }

  if (!Object.keys(field).includes('defaultValue')) {
    field.defaultValue = get(resource, field.id, '');
  }

  if (!field.helpText && !field.helpKey) {
    let singularResourceType = resourceType;

    // Make resourceType singular
    if (resourceType.charAt(resourceType.length - 1) === 's') {
      singularResourceType = resourceType.substring(0, resourceType.length - 1);
    }

    field.helpKey = `${singularResourceType}.${field.id}`;
  }

  if (!field.id || !field.name) {
    throw new Error(
      `Id and name must be provided for a field ${JSON.stringify(
        incompleteField
      )}`
    );
  }

  return field;
};

const flattenedFieldMap = (
  fields,
  fieldMap,
  resourceType,
  resource,
  opts = {}
) => {
  const {
    ignoreFunctionTransformations,
    developerMode,
    flowId,
    resObjectRefs = {},
    resFields = [],
    integrationId,
  } = opts;

  fields &&
      fields.forEach(fieldReferenceName => {
        const f = fieldMap[fieldReferenceName];

        if (f && f.formId) {
          const {
            subformFields,
            subformFieldMap,
          } = applyVisibilityRulesToSubForm(f, resourceType);

          resFields.push(...subformFields);

          return flattenedFieldMap(
            subformFields,
            subformFieldMap,
            resourceType,
            resource,
            {
              ignoreFunctionTransformations,
              developerMode,
              flowId,
              integrationId,
              resObjectRefs,
            }
          );
        }

        console.log('masterFieldHash', masterFieldHash);
        console.log('resourceType', resourceType);
        console.log('f', f);

        const masterFields = masterFieldHash[resourceType]
          ? masterFieldHash[resourceType][f.fieldId]
          : {};
        const merged = {
          resourceId: resource._id,
          resourceType,
          flowId,
          integrationId,
          ...masterFields,
          ...f,
        };
        const value = applyingMissedOutFieldMetaProperties(
          merged,
          resource,
          resourceType,
          ignoreFunctionTransformations
        );

        if (developerMode || !merged.developerModeOnly) {
          resFields.push(fieldReferenceName);
          // eslint-disable-next-line no-param-reassign
          resObjectRefs[fieldReferenceName] = value;
        }
      });

  return {
    fieldMap: resObjectRefs,
    fields: resFields,
  };
};

const setDefaultsToLayout = (
  layout,
  fieldMap,
  resourceType,
  resource,
  opts = {}
) => {
  const { fields, containers, ...rest } = layout;

  if (!fields && !containers) return null;

  const {
    fields: transformedFields,
    fieldMap: transformedFieldRef,
  } = flattenedFieldMap(fields, fieldMap, resourceType, resource, opts);
  let transformedFieldRefs = transformedFieldRef;
  const transformedContainers =
      containers &&
      containers.map(container => {
        const {
          transformedLayout: transformedLayoutRes,
          transformedFieldMap: transfieldMap,
        } = setDefaultsToLayout(
          container,
          fieldMap,
          resourceType,
          resource,
          opts
        );
        const { fields, containers } = transformedLayoutRes;

        transformedFieldRefs = {
          ...transformedFieldRefs,
          ...transfieldMap,
        };

        return { ...container, fields, containers };
      });

  return {
    transformedLayout: {
      ...rest,
      ...(transformedFields && transformedFields.length > 0
        ? { fields: transformedFields }
        : {}),
      ...(transformedContainers && transformedContainers.length > 0
        ? { containers: transformedContainers }
        : {}),
    },
    transformedFieldMap: transformedFieldRefs,
  };
};

const getFieldsWithDefaults = (
  fieldMeta,
  resourceType,
  resource,
  opts = {}
) => {
  const { layout, fieldMap, actions } = fieldMeta;

  if (!layout || !fieldMap) {
    let str = !fieldMap ? 'fieldMap ' : '';

    str += !layout ? 'layout ' : '';

    throw new Error(`No ${str}in the metadata `);
  }

  const { transformedFieldMap, transformedLayout } = setDefaultsToLayout(
    layout,
    fieldMap,
    resourceType,
    resource,
    opts
  );

  return {
    layout: transformedLayout,
    fieldMap: transformedFieldMap,
    actions,
  };
};

export default getFieldsWithDefaults;
