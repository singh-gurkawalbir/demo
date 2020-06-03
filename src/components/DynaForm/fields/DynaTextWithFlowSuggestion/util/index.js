const getValueAfterInsert = (value, insertPosition, insertedVal) => {
  const getPreText = val => {
    const lastIndexOfOpenBraces = val.lastIndexOf('{{');

    return val.substring(0, lastIndexOfOpenBraces);
  };

  const getPostText = val => {
    const firstIndexOfOpenBraces = val.indexOf('{{');
    const firstIndexOfCloseBraces = val.indexOf('}}');

    if (firstIndexOfOpenBraces === -1 && firstIndexOfCloseBraces === -1) {
      return '';
    }
    if (
      firstIndexOfCloseBraces !== -1 &&
      (firstIndexOfCloseBraces < firstIndexOfOpenBraces ||
        firstIndexOfOpenBraces === -1)
    ) {
      return val.substring(firstIndexOfCloseBraces + 2);
    }
    if (
      firstIndexOfOpenBraces !== -1 &&
      (firstIndexOfOpenBraces < firstIndexOfCloseBraces ||
        firstIndexOfCloseBraces === -1)
    ) {
      return val.substring(firstIndexOfOpenBraces);
    }

    return '';
  };

  const textBeforeInsert = value.substring(0, insertPosition);
  const textAfterInsert = value.substring(insertPosition);

  return `${getPreText(textBeforeInsert)}{{${insertedVal}}}${getPostText(
    textAfterInsert
  )}`;
};

export default getValueAfterInsert;
