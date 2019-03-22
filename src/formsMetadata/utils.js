export const defaultValueInitializer = values => {
  const results = {};
  const recurse = (values, path) => {
    if (Array.isArray(values) || typeof values !== 'object') {
      results[path] = values;

      return;
    }

    Object.keys(values).forEach(key => recurse(values[key], `${path}/${key}`));
  };

  recurse(values, '');

  return results;
};

export const defaultInitializer = ({ resource, fieldMeta }) => ({
  formValues: defaultValueInitializer(resource),
  fieldMeta,
});

export const defaultPatchSetConverter = values =>
  Object.keys(values).map(key => ({
    op: 'replace',
    path: key,
    value: values[key],
  }));

export const getFieldById = ({ meta, id }) => {
  let field;

  if (meta.fields) {
    field = meta.fields.find(f => f.id === id);

    if (field) return field;
  }

  if (meta.fieldSets && meta.fieldSets.length > 0) {
    meta.fieldSets.some(set => {
      field = set.fields.find(f => f.id === id);

      // break out of 'some' iterations as soon as any callback finds a field.
      return !!field;
    });
  }

  return field;
};

export const getFieldByName = ({ fieldMeta, name }) => {
  let field;

  if (fieldMeta.fields) {
    field = fieldMeta.fields.find(f => f.name === name);

    if (field) return field;
  }

  if (fieldMeta.fieldSets && fieldMeta.fieldSets.length > 0) {
    fieldMeta.fieldSets.some(set => {
      field = set.fields.find(f => f.name === name);

      // break out of 'some' iterations as soon as any callback finds a field.
      return !!field;
    });
  }

  return field;
};

export const sanitizePatchSet = ({ patchSet, fieldMeta }) => {
  if (!fieldMeta || !patchSet) return patchSet;

  return patchSet.reduce((sanitizedSet, patch) => {
    const field = getFieldByName({ name: patch.path, fieldMeta });

    if (patch.op === 'replace' && field.defaultValue !== patch.value) {
      sanitizedSet.push(patch);
    }

    return sanitizedSet;
  }, []);
};

export const replaceField = ({ meta, field }) => {
  if (meta.fields) {
    for (let i = 0; i < meta.fields.length; i += 1) {
      if (meta.fields[i].id === field.id) {
        // we WANT to modify the meta since the calling function should
        // already be dealing with a copy.
        meta.fields[i] = field; // eslint-disable-line

        // break as soon as replacement occurres.
        return meta;
      }
    }
  }

  if (meta.fieldSets && meta.fieldSets.length > 0) {
    for (let i = 0; i < meta.fieldSets.length; i += 1) {
      const set = meta.fieldSets[i];

      for (let j = 0; j < set.fields.length; j += 1) {
        if (set.fields[j].id === field.id) {
          set.fields[j] = field;

          return meta;
        }
      }
    }
  }

  return meta;
};

export default {
  getFieldById,
  replaceField,
  defaultInitializer,
  defaultValueInitializer,
  defaultPatchSetConverter,
};
