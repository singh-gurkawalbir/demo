import * as helpers from '../completers/completerUtils';

export default function shouldAutocompleteOnBackSpace(editor) {
  editor.commands.on('afterExec', event => {
    const { editor, command } = event;

    if (!(command.name === 'backspace' || command.name === 'insertstring')) {
      return;
    }

    if (helpers.textAfterBracesMatchers(editor)) {
      editor.execCommand('startAutocomplete');
    }
  });
}
