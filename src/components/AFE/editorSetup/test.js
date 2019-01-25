/* global describe, test, expect ,beforeEach */
import * as ace from 'brace';
import 'brace/ext/language_tools';
import handlebarCompleterSetup from './editorCompleterSetup/index';
import { handleBarsCompleters } from './completers';

// const langTools = ace.require('ace/ext/language_tools');

describe('Handle bars autocomplete', () => {
  const editor = ace.edit(null);
  const functionsHints = {
    add: '{{add}}',
    substract: '{{substract}}',
  };
  const jsonData = JSON.stringify({
    a: {
      d: 1,
      e: 3,
    },
    b: 4,
  });

  handleBarsCompleters.setCompleters(jsonData, functionsHints);
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
  test('should attempt to autocomplete when user types in a valid brace expression with the matching completions', () => {
    editor.setOptions({
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true,
    });

    editor.execCommand('insertstring', '{{ad');
    const prevOp = editor.prevOp.command;

    expect(editor.completer.completions.all.length).toEqual(1);
    // check matching value as well
    expect(editor.completer.completions.all[0].actualValue).toEqual('{{add}}');
    expect(prevOp.name).toEqual('startAutocomplete');
  });
  test('should attempt to autocomplete when user types in a value that could result in several matches', () => {
    editor.setOptions({
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true,
    });

    editor.execCommand('insertstring', '{{a');
    const prevOp = editor.prevOp.command;

    expect(editor.completer.completions.all.length).toEqual(3);

    const matchingResults = editor.completer.completions.all.map(result => {
      if (result.meta === 'helper functions') return result.actualValue;

      return result.value;
    });

    expect(matchingResults).toEqual(['a.d', 'a.e', '{{add}}']);
    expect(prevOp.name).toEqual('startAutocomplete');
  });

  test('should not autocomplete when user types in an invalid brace expression', () => {
    editor.execCommand('insertstring', '{a');
    const prevOp = editor.prevOp.command;

    expect(prevOp.name).not.toEqual('startAutocomplete');
  });

  test('should autocomplete for a backspace or insertString and a valid brace expression and not for any other command', () => {
    editor.execCommand('insertstring', '{{ad');
    let prevOp = editor.prevOp.command;

    editor.execCommand('backspace');
    expect(editor.getValue()).toEqual('{{a');
    prevOp = editor.prevOp.command;

    expect(prevOp.name).toEqual('startAutocomplete');

    editor.execCommand('gotostart');

    prevOp = editor.prevOp.command;

    expect(prevOp.name).not.toEqual('startAutocomplete');
  });

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
