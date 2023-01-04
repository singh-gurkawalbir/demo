import ace from 'ace-builds/src-noconflict/ace';
import 'ace-builds/src-noconflict/ext-language_tools';
import handlebarCompleterSetup from './editorCompleterSetup/index';
import * as utils from './completers/completerUtils';
import { handleBarsCompleters } from './completers';

describe('handlebars autocomplete', () => {
  const editor = ace.edit(null);
  const functionsHints = {
    add: '{{add}}',
    substract: '{{substract}}',
  };
  const lookupHints = [{name: 'propperty_1'}, {name: 'propperty_2'}];
  const jsonData = JSON.stringify({
    a: {
      d: 1,
      e: 3,
    },
    b: 4,
  });

  handleBarsCompleters.setJsonCompleter(jsonData);
  handleBarsCompleters.setFunctionCompleter(functionsHints);
  handlebarCompleterSetup(editor);

  //  we are doing something similar in the react end
  // but injecting directly into the JSX
  editor.setOptions({
    enableBasicAutocompletion: true,
    enableLiveAutocompletion: true,
  });
  beforeEach(() => {
    // reset editor

    editor.setValue('');
  });
  describe('utils test cases', () => {
    test('should remove previously uncompleted json path', () => {
      editor.execCommand('insertstring', '{{ad');

      utils.removePreceedingUncompletedText(editor, '{{ad');

      expect(editor.getValue()).toBe('');
    });

    test('should insert the matching result with completing braces', () => {
      editor.execCommand('insertstring', '{{a');
      const matchingResult = 'a.d';

      utils.insertMatchingResult(editor, matchingResult);
      expect(editor.getValue()).toBe(`{{${matchingResult}}}`);
    });

    test('should insert the matching result with completing braces and remove braces', () => {
      editor.execCommand('insertstring', '{{a');
      const matchingResult = '{{add}}';

      utils.insertMatchingResultAndRemovePreceedingBraces(
        editor,
        matchingResult
      );
      expect(editor.getValue()).toEqual(matchingResult);
    });
    test('should remove all the text preceeding the opening braces', () => {
      editor.execCommand('insertstring', 'unwantedtext{{a');

      const matchingGroup = utils.textAfterBracesMatchers(
        editor
      );

      expect(matchingGroup[1]).toBe('a');
    });
  });

  test('should attempt to autocomplete with all results when the user types in just the brace expressions', () => {
    editor.execCommand('insertstring', '{{');
    const prevOp = editor.prevOp.command;

    expect(editor.completer.completions.all).toHaveLength(5);

    expect(prevOp.name).toBe('startAutocomplete');
  });
  test('should attempt to autocomplete when user types in a valid brace expression with the matching completions', () => {
    editor.execCommand('insertstring', '{{ad');
    const prevOp = editor.prevOp.command;

    expect(editor.completer.completions.all).toHaveLength(1);
    // check matching value as well
    expect(editor.completer.completions.all[0].matchingResult).toBe(
      '{{add}}'
    );
    expect(prevOp.name).toBe('startAutocomplete');
  });
  test('should attempt to autocomplete when user types in a value that could result in several matches', () => {
    editor.execCommand('insertstring', '{{a');
    const prevOp = editor.prevOp.command;

    expect(editor.completer.completions.all).toHaveLength(4);

    const matchingResults = editor.completer.completions.all.map(
      result => result.matchingResult
    );

    expect(matchingResults).toEqual(['a.d', 'a.e', '{{add}}', '{{substract}}']);
    expect(prevOp.name).toBe('startAutocomplete');
  });

  test('should not autocomplete when user types in an invalid brace expression', () => {
    editor.execCommand('insertstring', '{a');
    const prevOp = editor.prevOp.command;

    expect(prevOp.name).not.toBe('startAutocomplete');
  });

  test('should autocomplete for a backspace or insertString and a valid brace expression and not for any other command', () => {
    editor.execCommand('insertstring', '{{ad');
    let prevOp = editor.prevOp.command;

    editor.execCommand('backspace');
    expect(editor.getValue()).toBe('{{a');
    prevOp = editor.prevOp.command;

    expect(prevOp.name).toBe('startAutocomplete');

    editor.execCommand('gotostart');

    prevOp = editor.prevOp.command;

    expect(prevOp.name).not.toBe('startAutocomplete');
  });

  test('should attempt to autocomplete when user types a valid brace expression with matching lookups', () => {
    handleBarsCompleters.setLookupCompleter(lookupHints, false);
    editor.execCommand('insertstring', '{{p');
    const prevOp = editor.prevOp.command;

    expect(editor.completer.completions.all).toHaveLength(2);
    const matchingResults = editor.completer.completions.all.map(
      result => result.matchingResult
    );

    expect(matchingResults).toEqual(
      ['lookup "propperty_1" this', 'lookup "propperty_2" this']
    );
    expect(prevOp.name).toBe('startAutocomplete');
  });
  test('should attempt to autocomplete when user types a valid brace expression with matching lookups when dotNotation is used', () => {
    handleBarsCompleters.setLookupCompleter(lookupHints, true);
    editor.execCommand('insertstring', '{{p');
    const prevOp = editor.prevOp.command;

    expect(editor.completer.completions.all).toHaveLength(2);
    const matchingResults = editor.completer.completions.all.map(
      result => result.matchingResult
    );

    expect(matchingResults).toEqual(
      ['lookup.propperty_1', 'lookup.propperty_2']
    );
    expect(prevOp.name).toBe('startAutocomplete');
  });

  // eslint-disable-next-line jest/no-commented-out-tests
  /*
  //Couldn't get this to work was expecting
  //the Tab or return to insert the autocomplete result

  test('should insert autocomplete result with tab
  keystroke for a possible match', () => {
    editor.execCommand('insertstring', '{{ad');
    let prevOp = editor.prevOp.command;

    expect(editor.getValue()).toEqual('{{ad');
    prevOp = editor.prevOp.command;
    expect(editor.completer.completions.all.length).toEqual(1);

    expect(prevOp.name).toEqual('startAutocomplete');
    editor.execCommand('Tab');
    expect(editor.getValue()).toEqual('{{add}}');
  });

  */
});
