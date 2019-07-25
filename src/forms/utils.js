import jsonPatch from 'fast-json-patch';

export const defaultPatchSetConverter = values =>
  Object.keys(values).map(key => ({
    op: 'replace',
    path: key,
    value: values[key],
  }));

const byId = (f, id) => (f.id ? f.id === id : f.fieldId === id);

export const getFieldPosition = ({ meta, id }) => {
  const pos = {};
  let index;

  if (meta.fields) {
    index = meta.fields.findIndex(f => byId(f, id));

    if (index >= 0) {
      pos.index = index;

      return pos;
    }
  }

  if (meta.fieldSets && meta.fieldSets.length > 0) {
    meta.fieldSets.some((set, i) => {
      index = set.fields.findIndex(f => byId(f, id));

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
    field = meta.fields.find(f => byId(f, id));

    if (field) return field;
  }

  if (meta.fieldSets && meta.fieldSets.length > 0) {
    meta.fieldSets.some(set => {
      field = set.fields.find(f => byId(f, id));

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

export const getMissingPatchSet = (paths, resource) => {
  const missing = [];
  const getStub = segments => {
    const o = {};
    let cur = o;

    segments.forEach(s => {
      cur[s] = {};
      cur = cur[s];
    });

    return o;
  };

  paths.forEach(p => {
    const segments = p.split('/');

    // console.log(segments);
    // only deep paths have reference errors.
    // length >2 because first is empty root node.
    if (segments.length > 1) {
      let value = {};
      let r = resource;
      let path = '';

      for (let i = 1; i <= segments.length - 1; i += 1) {
        const segment = segments[i];

        path = `${path}/${segment}`;

        if (
          r === undefined ||
          r[segment] === undefined ||
          (typeof r[segment] === 'string' && segments.length - i - 1 >= 1)
        ) {
          value = getStub(segments.slice(i + 1, segments.length));
          missing.push({ path, value, op: 'add' });

          break;
        }

        r = r[segment];
      }
    }
  });
  // console.log(missing);

  return missing;
};

export const sanitizePatchSet = ({ patchSet, fieldMeta = [], resource }) => {
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

export const replaceField = ({ meta, field }) => {
  if (meta.fields) {
    for (let i = 0; i < meta.fields.length; i += 1) {
      if (meta.fields[i].id === field.id) {
        // we WANT to modify the meta since the calling function should
        // already be dealing with a copy.
        meta.fields[i] = field; // eslint-disable-line

        // break as soon as replacement occurs.
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
