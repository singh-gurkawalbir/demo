export default {
  validateJsonString: s => {
    try {
      JSON.parse(s);

      return null;
    } catch (e) {
      return e.message;
    }
  },
  objectToPatchSet: values =>
    Object.keys(values).map(key => ({
      op: 'replace',
      path: `/${key}`,
      value: values[key],
    })),
  objectForPatchSet: values =>
    Object.keys(values).reduce(
      (result, key) => ({ ...result, [`/${key}`]: values[key] }),
      {}
    ),
};
