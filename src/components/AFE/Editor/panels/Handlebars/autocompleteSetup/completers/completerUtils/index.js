export const textAfterBracesMatchers = editor => {
  const { session } = editor;
  const pos = editor.getCursorPosition();
  const line = session.getLine(pos.row);
  const precedingText = line.slice(0, pos.column);
  const prefixRegexp = /.*\{\{(.*)$/;

  return precedingText.match(prefixRegexp);
};

export const removePreceedingUncompletedText = (editor, prefix) => {
  const filterText = prefix || editor.completer.completions.filterText;

  if (filterText) {
    const ranges = editor.selection.getAllRanges();
    const filterTextLength = filterText.length;

    ranges.forEach(rangeVal => {
      const range = rangeVal;

      range.start.column -= filterTextLength;
      editor.session.remove(range);
    });
  }
};

export const insertMatchingResult = (editor, text, prefix) => {
  removePreceedingUncompletedText(editor, prefix);
  editor.execCommand('insertstring', `${text}}}`);
};

export const insertMatchingResultAndRemovePreceedingBraces = (editor, text) => {
  removePreceedingUncompletedText(editor);
  // remove the first two braces
  editor.execCommand('insertstring', text.substring(2));
};
