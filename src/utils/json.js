export default {
  validateJsonString: s => {
    try {
      JSON.parse(s);

      return null;
    } catch (e) {
      return e.message;
    }
  },
};
