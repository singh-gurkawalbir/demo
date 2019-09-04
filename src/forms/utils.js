import jsonPatch from 'fast-json-patch';

export const searchFieldFromMetaBasedOnFindFunc = (meta, findFieldFunction) => {
  if (!meta || !meta.layout) return null;

  const { layout } = meta;
  const { fields, containers } = layout;

  if (fields && fields.length > 0) {
    const foundField = fields.find(findFieldFunction);

    if (foundField) return foundField;
  }

  if (containers && containers.length > 0) {
    // eslint-disable-next-line no-restricted-syntax
    for (const container of containers) {
      const { fieldSets } = container;

      // eslint-disable-next-line no-restricted-syntax
      for (const fieldSet of fieldSets) {
        return searchFieldFromMetaBasedOnFindFunc(
          {
            layout: { ...fieldSet },
          },
          findFieldFunction
        );
      }
    }
  }
};

export const defaultPatchSetConverter = values =>
  Object.keys(values).map(key => ({
    op: 'replace',
    path: key,
    value: values[key],
  }));

const byId = (f, id) => (f.id ? f.id === id : f.fieldId === id);
const fieldSearchQueryObj = (meta, id, queryRes, offset) => {
  if (!meta || !meta.layout) return null;

  const { layout } = meta;
  const { fields, containers } = layout;

  if (fields && fields.length > 0) {
    const foundFieldIndex = fields.findIndex(f => byId(f, id));

    if (foundFieldIndex !== -1) {
      let res = queryRes;

      res += `/fields/${foundFieldIndex + offset}`;

      return res;
    }
  }

  if (containers && containers.length > 0) {
    for (
      let containerIndex = 0;
      containerIndex < containers.length;
      containerIndex += 1
    ) {
      const { fieldSets } = containers[containerIndex];

      for (
        let fieldSetIndex = 0;
        fieldSetIndex < fieldSets.length;
        fieldSetIndex += 1
      ) {
        let res = queryRes;
        const fieldSet = fieldSets[fieldSetIndex];

        res += `/containers/${containerIndex}/fieldSets/${fieldSetIndex}`;

        return fieldSearchQueryObj(
          {
            layout: { ...fieldSet },
          },
          id,
          res,
          offset
        );
      }
    }
  }
};

export const getPatchPathForCustomForms = (meta, id, offset = 0) => {
  const customFormPath = '/customForm/form/layout';
  const res = fieldSearchQueryObj(meta, id, customFormPath, offset);

  return res;
};

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

export const getFieldById = ({ meta, id }) =>
  searchFieldFromMetaBasedOnFindFunc(meta, f => byId(f, id));

export const getFieldByName = ({ fieldMeta, name }) =>
  searchFieldFromMetaBasedOnFindFunc(fieldMeta, f => f.name === name);

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
