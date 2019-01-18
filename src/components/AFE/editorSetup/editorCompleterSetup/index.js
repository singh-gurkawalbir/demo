import * as helpers from '../completers';
import shouldAutocompleteOnBackSpace from '../editorBehaviorTweaks/index';

export default function handleBarAutocompleteSetup(editor) {
  shouldAutocompleteOnBackSpace(editor);
  const editorInst = editor;

  editorInst.completers = [];
  Object.keys(helpers.handleBarCompleters).forEach(completer =>
    editorInst.completers.push(helpers.handleBarCompleters[completer])
  );
}
