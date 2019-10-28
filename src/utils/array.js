export default {
  removeItem: (arr, test) => {
    const index = arr.findIndex(test);

    // insert if not found, replace if found...
    if (index === -1) return arr;

    return [...arr.slice(0, index), ...arr.slice(index + 1)];
  },
  getDuplicateValues: (arr, key) => {
    const duplicates = arr
      .map(e => e[key])
      .map((e, i, final) => final.indexOf(e) !== i && i)
      .filter(obj => arr[obj])
      .map(e => arr[e][key]);

    if (duplicates.length) return duplicates;

    return null;
  },
};
