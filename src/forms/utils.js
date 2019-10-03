import jsonPatch from 'fast-json-patch';

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

export const isExpansionPanelErrored = (meta, fieldStates) => {
  const invalidFields = fieldStates.filter(
    field => !field.isValid || field.isDiscretelyInvalid
  );

  return invalidFields
    .map(field => {
      const { id } = field;

      return !!getFieldById({ meta, id });
    })
    .reduce((res, curr) => res || curr, false);
};

export const getFieldByName = ({ fieldMeta, name }) => {
  const res = searchMetaForFieldByFindFunc(fieldMeta, f => f.name === name);

  return res && res.field;
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

export const sanitizePatchSet = ({ patchSet, fieldMeta = {}, resource }) => {
  if (!patchSet) return patchSet;
  const sanitizedSet = patchSet.reduce((s, patch) => {
    if (patch.op === 'replace') {
      const field = getFieldByName({ name: patch.path, fieldMeta });

      if (!field || field.defaultValue !== patch.value) {
        s.push(patch);
      }
    }

    return s;
  }, []);

  if (sanitizedSet.length === 0 || !resource) {
    return sanitizedSet;
  }

  const missingPatchSet = getMissingPatchSet(
    sanitizedSet.map(p => p.path),
    resource
  );
  const newSet = [...missingPatchSet, ...sanitizedSet];
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

const convertFieldsToFieldReferneceObj = (acc, curr) => {
  if (!curr.fieldId && !curr.id && !curr.formId) {
    throw new Error('No fieldId , id or formId', curr);
  }

  if (curr.fieldId) acc[curr.fieldId] = curr;
  else if (curr.id) acc[curr.id] = curr;
  else if (curr.formId) acc[curr.formId] = curr;
  else throw new Error('could not find any of the props');

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

const addIdToFieldsAndRenameNameAttribute = fields =>
  fields.map(field => {
    // TODO: generate correct name path
    const { name, options, tooltip } = field;
    // name is the unique identifier....verify with Ashok

    return {
      ...field,
      name: `/${name}`,
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
  });

export const integrationSettingsToDynaFormMetadata = meta => {
  const finalData = {};
  const { fields, sections } = meta;

  if (fields) {
    const addedFieldIdFields = addIdToFieldsAndRenameNameAttribute(fields);

    finalData.fieldMap = addedFieldIdFields.reduce(
      convertFieldsToFieldReferneceObj,
      {}
    );
    finalData.layout = {};
    finalData.layout.fields = addedFieldIdFields.map(refGeneration);
  }

  if (sections) {
    sections.forEach(section => {
      addIdToFieldsAndRenameNameAttribute(section.fields).reduce(
        convertFieldsToFieldReferneceObj,
        finalData.fieldMap
      );
    });

    // check for title
    finalData.type = 'tab';
    finalData.layout.containers = sections.map(section => ({
      collapsed: section.collapsed || true,
      label: section.title,
      fields: addIdToFieldsAndRenameNameAttribute(section.fields).map(
        refGeneration
      ),
    }));
  }

  // Wrap everything in a adavancedSettings container
  finalData.layout = {
    type: 'collapse',
    containers: [{ ...finalData.layout, label: 'Advanced Settings' }],
  };
  finalData.actions = [{ id: 'save' }];

  return finalData;
};

export default {
  getFieldById,
  defaultPatchSetConverter,
};
