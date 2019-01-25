export const shouldAutoComplete = editor => {
  const { session } = editor;
  const pos = editor.getCursorPosition();
  const line = session.getLine(pos.row);
  const precedingText = line.slice(0, pos.column);
  const prefixRegexp = /\{\{([a-zA-Z0-9]+)$/;

  return !!precedingText.match(prefixRegexp);
};

export const removePreceedingUncompletedText = editor => {
  if (editor.completer.completions.filterText) {
    const ranges = editor.selection.getAllRanges();
    const filterTextLength = editor.completer.completions.filterText.length;

    ranges.forEach(rangeVal => {
      const range = rangeVal;

      range.start.column -= filterTextLength;
      editor.session.remove(range);
    });
  }
};

export const insertMatchingResult = (editor, text) => {
  removePreceedingUncompletedText(editor);
  editor.execCommand('insertstring', `${text}}}`);
};

export const insertMatchingResultAndRemovePreceedingBraces = (editor, text) => {
  removePreceedingUncompletedText(editor);
  // remove the first two braces
  editor.execCommand('insertstring', text.substring(2));
};
