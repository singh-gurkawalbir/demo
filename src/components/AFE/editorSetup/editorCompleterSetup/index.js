import * as helpers from '../completers';
import shouldAutocompleteOnBackSpace from '../editorBehaviorTweaks/index';

export default function handleBarAutocompleteSetup(editor) {
  shouldAutocompleteOnBackSpace(editor);
  const editorInst = editor;

  editorInst.completers = [];
  const { handleBarsCompleters } = helpers;
  const completers = handleBarsCompleters.getCompleters();

  Object.keys(completers).forEach(key =>
    editorInst.completers.push(completers[key])
  );
}
