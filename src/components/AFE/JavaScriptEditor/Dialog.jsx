import EditorDialog from '../EditorDialog';
import JavaScriptEditor from './';

export default function JavaScriptEditorDialog(props) {
  const {
    id,
    rule,
    data,
    scriptId,
    disabled,
    entryFunction,
    context,
    insertStubKey,
    optionalSaveParams,
    resultMode,
    ...rest
  } = props;
  const defaults = {
    width: '80vw',
    height: '50vh',
    open: true,
  };

  return (
    <EditorDialog
      id={id}
      {...defaults}
      {...rest}
      showLayoutOptions={false}
      disabled={disabled}>
      <JavaScriptEditor
        editorId={id}
        scriptId={scriptId}
        entryFunction={entryFunction}
        context={context}
        insertStubKey={insertStubKey}
        data={data}
        disabled={disabled}
        resultMode={resultMode}
        optionalSaveParams={optionalSaveParams}
      />
    </EditorDialog>
  );
}
