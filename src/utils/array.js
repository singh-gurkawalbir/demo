export default {
  removeItem: (arr, test) => {
    const index = arr.findIndex(test);

    // insert if not found, replace if found...
    if (index === -1) return arr;

    return [...arr.slice(0, index), ...arr.slice(index + 1)];
  },
  /**
   * getDuplicateValues takes 'array of object' and 'key' as input and returns
   * all duplicate key values in it
   * Example: key = 'b', arr = [
   *              {"a":1, "b":1},
   *              {"a":2, "b":2},
   *              {"a":3, "b":4},
   *              {"a":4, "b":4},
   *              {"a":5, "b":2}
   *            ]
   * getDuplicateValues returns [2,4]
   */
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
