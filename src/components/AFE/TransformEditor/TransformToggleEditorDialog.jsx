import ToggleEditorDialog from '../ToggleEditorDialog';
import TransformEditor from '.';
import JavaScriptEditor from '../JavaScriptEditor';

const defaults = {
  width: '85vw',
  height: '60vh',
  layout: 'column',
  open: true,
};

export default function TransformToggleEditorDialog({
  id,
  rule,
  data,
  disabled,
  ...rest
}) {
  // console.log('render <TransformEditorDialog>');
  return (
    <ToggleEditorDialog
      id={id}
      {...defaults}
      {...rest}
      disabled={disabled}
      showLayoutOptions>
      <TransformEditor rule={rule} data={data} disabled={disabled} />
      <JavaScriptEditor data={data} disabled={disabled} />
    </ToggleEditorDialog>
  );
}
