import jsonComputePaths from '../../../../utils/jsonPaths';
import {
  textAfterBracesMatchers,
  insertMatchingResultAndRemovePreceedingBraces,
  insertMatchingResult,
} from './completerUtils';

export const FunctionCompleter = {
  functionsHints: [],
  getCompletions(editor, session, pos, prefix, callback) {
    const validText = textAfterBracesMatchers(editor);

    if (!validText) return callback(null, []);

    const insertMatch = (editor, completionMetaData) => {
      const { matchingResult } = completionMetaData;

      insertMatchingResultAndRemovePreceedingBraces(editor, matchingResult);
    };

    const textAfterBraces = validText[1];

    return callback(
      null,
      Object.keys(this.functionsHints || [])
        .filter(
          helperFunction =>
            textAfterBraces.length === 0 ||
            helperFunction.startsWith(textAfterBraces)
        )
        .map(helperFunction => {
          const matchingResult = this.functionsHints[helperFunction];

          return {
            caption: helperFunction,
            value: helperFunction,
            meta: 'function',
            matchingResult,
            completer: {
              insertMatch,
            },
          };
        })
    );
  },
};

export const JsonCompleter = {
  identifierRegexps: [/[.*]/],
  jsonHints: [],
  getCompletions(editor, session, pos, prefix, callback) {
    const validText = textAfterBracesMatchers(editor);

    if (!validText) return callback(null, []);

    const insertMatch = (editor, completionMetaData) => {
      const { matchingResult } = completionMetaData;

      insertMatchingResult(editor, matchingResult);
    };

    const textAfterBraces = validText[1];

    return callback(
      null,
      this.jsonHints
        .filter(
          hint =>
            textAfterBraces.length === 0 || hint.id.startsWith(textAfterBraces)
        )
        .map(hint => ({
          caption: hint.id,
          value: hint.id,
          meta: 'field',
          matchingResult: hint.id,
          completer: {
            insertMatch,
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

export const handleBarsCompleters = {
  setCompleters: (jsonData, helperFunctions) => {
    JsonCompleter.jsonHints = loadJsonHints(jsonData);
    FunctionCompleter.functionsHints = helperFunctions;
  },
  getCompleters: () => ({
    JsonCompleter,
    FunctionCompleter,
  }),
};
