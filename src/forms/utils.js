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
  /*  
  console.log('check sanitize patch set ', patchSet, fieldMeta);

  const valuePathsFromForm = patchSet.map(patch => patch.path);
  const removeRemainingValuesFromResource = Object.values(fieldMeta.fieldMap)
 .filter(ref => !valuePathsFromForm.includes(ref.name))
 .map(ref => ({path: ref.path, op: 'remove' }));
     
    */
  let removeFieldOps = [];

  if (fieldMeta && (fieldMeta.fields || fieldMeta.fieldSets)) {
    const valuePathsFromForm =
      (patchSet && patchSet.map(patch => patch.path)) || [];

    if (fieldMeta.fields) {
      const removeFields =
        fieldMeta &&
        fieldMeta.fields &&
        fieldMeta.fields
          .filter(ref => !valuePathsFromForm.includes(ref.name))
          .map(ref => ({ path: ref.name, op: 'remove' }));

      removeFieldOps = [...removeFields];
    }

    if (fieldMeta.fieldSets) {
      const removeFieldSetFields =
        fieldMeta &&
        fieldMeta.fieldSets &&
        fieldMeta.fieldSets
          .map(fieldSet => fieldSet.fields)
          .flat()
          .filter(ref => !valuePathsFromForm.includes(ref.name))
          .map(ref => ({ path: ref.name, op: 'remove' }));

      removeFieldOps = [...removeFieldSetFields];
    }
  }

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
  const newSet = [...removeFieldOps, ...missingPatchSet, ...sanitizedSet];
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
