import jsonComputePaths from '../../../../utils/jsonPaths';
import {
  shouldAutoComplete,
  insertMatchingResultAndRemovePreceedingBraces,
  insertMatchingResult,
} from './completerUtils';

export const FunctionCompleters = {
  functionsHints: [],
  getCompletions(editor, session, pos, prefix, callback) {
    if (prefix.length === 0 || !shouldAutoComplete(editor))
      return callback(null, []);

    return callback(
      null,
      Object.keys(this.functionsHints || [])
        .filter(helperFunction => helperFunction.startsWith(prefix))
        .map(helperFunction => {
          const matchingResult = this.functionsHints[helperFunction];

          return {
            caption: helperFunction,
            value: helperFunction,
            meta: 'helper functions',
            matchingResult,
            completer: {
              insertMatch: (editor, { matchingResult }) => {
                insertMatchingResultAndRemovePreceedingBraces(
                  editor,
                  matchingResult
                );
              },
            },
          };
        })
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
          matchingResult: hint.id,
          completer: {
            insertMatch: (editor, { matchingResult }) => {
              insertMatchingResult(editor, matchingResult);
            },
          },
        }))
    );
  },
};

export const loadJsonHints = value => {
  try {
    return jsonComputePaths(JSON.parse(value));
  } catch (e) {
    return [];
  }
};
