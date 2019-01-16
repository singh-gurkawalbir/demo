import * as helpers from '../completers';
import shouldAutocompleteOnBackSpace from '../editorBehaviorTweaks/index';

export default function handleBarAutocompleteSetup(editor) {
  shouldAutocompleteOnBackSpace(editor);
  const editorInst = editor;

  editorInst.enableBasicAutocompletion = true;
  editorInst.enableLiveAutocompletion = true;
  editorInst.completers = [helpers.JsonCompleters, helpers.FunctionCompleters];
}
