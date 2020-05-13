const getFailedRecordDefault = lookup => {
  if (!lookup || !lookup.allowFailures) {
    return 'disallowFailure';
  }

  switch (lookup.default) {
    case '':
      return 'useEmptyString';
    case null:
      return 'useNull';
    default:
      return 'default';
  }
};

export default getFailedRecordDefault;
