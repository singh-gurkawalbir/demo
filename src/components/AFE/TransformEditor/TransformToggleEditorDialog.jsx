import ToggleEditorDialog from '../EditorDialog/toggleEditorDialog';
import TransformEditor from '.';
import JavaScriptEditor from '../JavaScriptEditor';

const defaults = {
  width: '85vw',
  height: '60vh',
  layout: 'column',
  open: true,
  labels: ['Rules', 'JavaScript'],
};

export default function TransformToggleEditorDialog({
  id,
  type,
  rule,
  scriptId,
  data,
  disabled,
  entryFunction,
  insertStubKey,
  confirmOnCancel = false,
  ...rest
}) {
  return (
    <ToggleEditorDialog
      id={id}
      type={type}
      {...defaults}
      {...rest}
      disabled={disabled}
      showLayoutOptions>
      <TransformEditor
        rule={rule}
        data={data}
        disabled={disabled}
        confirmOnCancel={confirmOnCancel}
      />
      <JavaScriptEditor
        data={data}
        disabled={disabled}
        scriptId={scriptId}
        entryFunction={entryFunction}
        insertStubKey={insertStubKey}
        confirmOnCancel={confirmOnCancel}
      />
    </ToggleEditorDialog>
  );
}
