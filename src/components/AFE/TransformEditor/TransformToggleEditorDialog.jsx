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
  processorKey,
  entryFunction,
  insertStubKey,
  resourceType,
  resourceId,
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
        processorKey={processorKey}
        disabled={disabled}
        resourceType={resourceType}
        resourceId={resourceId}
      />
      <JavaScriptEditor
        data={data}
        disabled={disabled}
        scriptId={scriptId}
        processorKey={processorKey}
        resourceType={resourceType}
        resourceId={resourceId}
        entryFunction={entryFunction}
        insertStubKey={insertStubKey}
      />
    </ToggleEditorDialog>
  );
}
