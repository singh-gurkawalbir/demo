export const genSelectors = (selectors, subSelectors) => {
  const selectorNameSet = new Set();

  Object.keys(subSelectors).forEach(subName => {
    Object.keys(subSelectors[subName]).forEach(k => {
      if (k === 'default') return;
      if (selectorNameSet.has(k)) throw new Error(`duplicate selector name ${k} from ${subName}!`);
      selectorNameSet.add(k);
      const subSelector = subSelectors[subName];

      if (subSelector[k].length === 0 && (k.startsWith('mk') || k.startsWith('make'))) {
        // eslint-disable-next-line no-param-reassign
        selectors[k] = () => {
          const sel = subSelector[k]();

          return (state, ...args) => sel(state?.[subName], ...args);
        };
      } else {
        // eslint-disable-next-line no-param-reassign
        selectors[k] = (state, ...args) => subSelector[k](state?.[subName], ...args);
      }
    });
  });
};
