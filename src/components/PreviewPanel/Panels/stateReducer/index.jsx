import produce from 'immer';

export default function reducer(state, action) {
  const {type, payload} = action;

  return produce(state, draft => {
    switch (type) {
      default:
        if (Object.hasOwnProperty.call(payload, 'showDeltaStartDateDialog')) {
          draft.showDeltaStartDateDialog = payload.showDeltaStartDateDialog;
        }
        if (Object.hasOwnProperty.call(payload, 'showWarning')) {
          draft.showWarning = payload.showWarning;
        }
        if (Object.hasOwnProperty.call(payload, 'dateSelected')) {
          draft.dateSelected = payload.dateSelected;
        }
        if (Object.hasOwnProperty.call(payload, 'clickOnPreview')) {
          draft.clickOnPreview = payload.clickOnPreview;
        }
        if (Object.hasOwnProperty.call(payload, 'isValidRecordSize')) {
          draft.isValidRecordSize = payload.isValidRecordSize;
        }
        break;
    }

    return draft;
  });
}
