export default {
  /**
   * There is no support yet for netsuiteQualificationCriteria processor in backend.
   * We need to update this appropriately once the backend is enhanced.
   */
  requestBody: () => ({}),
  validate: () => ({
    dataError: '',
  }),
  init: props => {
    const {options, fieldState} = props;
    const {value} = fieldState || {};
    let rule = [];

    if (value) {
      try {
        rule = JSON.parse(value);
      } catch (e) {
        rule = value;
      }
    }

    return {
      ...options,
      rule,
    };
  },
  // don't remove below logic yet
  // might be used later based on use case
  //   dirty: editor => {
  //     const initKeys = Object.keys(editor).filter(key => key.indexOf('_init') !== -1);

  //     // If there are no initKeys , return undefined
  //     // as we return a boolean only incase of initKeys passed - refer @editorDrawer disableSave property
  //     if (!initKeys.length) {
  //       return;
  //     }
  //     for (let i = 0; i < initKeys.length; i += 1) {
  //       const initKey = initKeys[i];
  //       const originalKey = initKey.replace('_init_', '');

  //       if (typeof editor[originalKey] === 'boolean' && !!editor[initKey] !== !!editor[originalKey]) {
  //         return true;
  //       }
  //       if (
  //         Array.isArray(editor[originalKey]) &&
  //             !isEqual(editor[initKey], editor[originalKey])
  //       ) {
  //         return true;
  //       }
  //       if (
  //         ['string', 'number'].includes(typeof editor[originalKey]) &&
  //             editor[initKey] !== editor[originalKey]
  //       ) {
  //         return true;
  //       }

  //       if (!editor[originalKey]) {
  //         return !!editor[initKey];
  //       }
  //     }

//     return false;
//   },
};
