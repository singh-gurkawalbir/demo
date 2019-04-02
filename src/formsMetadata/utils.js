export const defaultPatchSetConverter = values =>
  Object.keys(values).map(key => ({
    op: 'replace',
    path: key,
    value: values[key],
  }));

export const getFieldPosition = ({ meta, id }) => {
  const pos = {};
  let index;

  if (meta.fields) {
    index = meta.fields.findIndex(f => f.id === id);

    if (index >= 0) {
      pos.index = index;

      return pos;
    }
  }

  if (meta.fieldSets && meta.fieldSets.length > 0) {
    meta.fieldSets.some((set, i) => {
      index = set.fields.findIndex(f => f.id === id);

      // break out of 'some' iterations as soon as any callback finds a field.
      if (index >= 0) {
        pos.index = index;
        pos.fieldSetIndex = i;

        return true;
      }

      return false;
    });
  }

  return pos;
};

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
  defaultPatchSetConverter,
};
