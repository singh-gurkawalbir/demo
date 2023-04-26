import produce from 'immer';

export default function reducer(state, action) {
  const { payload } = action;

  return produce(state, draft => {
    const list = ['showDeltaStartDateDialog', 'dateSelected', 'clickOnPreview', 'isValidRecordSize', 'timeZoneSelected'];

    list.forEach(eachItem => {
      if (Object.hasOwnProperty.call(payload, eachItem)) {
        draft[eachItem] = payload[eachItem];
      }
    });

    return draft;
  });
}
