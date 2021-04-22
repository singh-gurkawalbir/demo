import produce from 'immer';

const hookReducer = (state, action) => {
  const {type, value} = action;

  return produce(state, draft => {
    switch (type) {
      case 'setShowCreateScriptDialog':
        draft.showCreateScriptDialog = value;
        break;
      case 'setTempScriptId':
        draft.tempScriptId = value;
        break;
      case 'setIsNewScriptIdAssigned':
        draft.isNewScriptIdAssigned = value;
        break;

      default:
        break;
    }
  });
};

export default hookReducer;
