export default {
  removeItem: (arr, test) => {
    const index = arr.findIndex(test);

    // insert if not found, replace if found...
    if (index === -1) return arr;

    return [...arr.slice(0, index), ...arr.slice(index + 1)];
  },
};
