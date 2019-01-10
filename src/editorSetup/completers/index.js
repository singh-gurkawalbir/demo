export const shouldAutoComplete = editor => {
  const { session } = editor;
  const pos = editor.getCursorPosition();
  const line = session.getLine(pos.row);
  const precedingText = line.slice(0, pos.column);
  const prefixRegexp = /\{\{([a-zA-Z0-9]+)$/;

  return !!precedingText.match(prefixRegexp);
};

export const FunctionCompleters = {
  functionsHints: [],
  getCompletions(editor, session, pos, prefix, callback) {
    if (prefix.length === 0 || !shouldAutoComplete(editor))
      return callback(null, []);

    return callback(
      null,
      Object.keys(this.functionsHints || [])
        .filter(helperFunction => helperFunction.startsWith(prefix))
        .map(helperFunction => ({
          caption: helperFunction,
          value: helperFunction,
          meta: 'helper functions',
          actualValue: this.functionsHints[helperFunction],
          completer: {
            insertMatch(editor, data) {
              if (editor.completer.completions.filterText) {
                const ranges = editor.selection.getAllRanges();

                for (let i = 0; i < ranges.length; i += 1) {
                  const range = ranges[i];

                  range.start.column -=
                    editor.completer.completions.filterText.length;
                  editor.session.remove(range);
                }
              }

              // Remove the first two braces and insert string
              editor.execCommand('insertstring', data.actualValue.substring(2));
            },
          },
        }))
    );
  },
};

export const JsonCompleters = {
  jsonHints: [],
  getCompletions(editor, session, pos, prefix, callback) {
    if (prefix.length === 0 || !shouldAutoComplete(editor))
      return callback(null, []);
    callback(
      null,
      this.jsonHints
        .filter(hint => hint.id.startsWith(prefix))
        .map(hint => ({
          caption: hint.id,
          value: hint.id,
          meta: 'Json paths',
          completer: {
            insertMatch(editor) {
              if (editor.completer.completions.filterText) {
                const ranges = editor.selection.getAllRanges();

                for (let i = 0; i < ranges.length; i += 1) {
                  const range = ranges[i];

                  range.start.column -=
                    editor.completer.completions.filterText.length;
                  editor.session.remove(range);
                }
              }

              editor.execCommand('insertstring', `${hint.id}}}`);
            },
          },
        }))
    );
  },
};
