export const defaultValueInitializer = values => {
  const results = {};
  const recurse = (values, path) => {
    if (typeof values !== 'object') {
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

export default {
  defaultInitializer,
  defaultValueInitializer,
  defaultPatchSetConverter,
};
