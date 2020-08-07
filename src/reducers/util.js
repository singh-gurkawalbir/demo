// eslint-disable-next-line import/prefer-default-export
export const genSelectors = (selectors, subSelectors) => {
  const selectorNameSet = new Set();

  Object.keys(subSelectors).forEach(subName => {
    Object.keys(subSelectors[subName]).forEach(k => {
      if (k === 'default') return;
      if (selectorNameSet.has(k)) throw new Error(`duplicate selector name ${k} from ${subName}!`);
      selectorNameSet.add(k);
      const subSelector = subSelectors[subName];

      // eslint-disable-next-line no-param-reassign
      selectors[k] = (state, ...args) => subSelector[k](state?.[subName], ...args);
    });
  });
};
