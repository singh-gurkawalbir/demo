export default {
  hashCode: s => {
    let hash = 0;
    let i;
    let chr;
    let str = s;

    if (typeof s === 'object') str = JSON.stringify(s);

    if (!str || str.length === 0) return hash;

    for (i = 0; i < str.length; i += 1) {
      chr = str.charCodeAt(i);
      /* eslint-disable no-bitwise */
      hash = (hash << 5) - hash + chr;
      hash |= 0; // Convert to 32bit integer
      /* eslint */
    }

    return hash;
  },
};
