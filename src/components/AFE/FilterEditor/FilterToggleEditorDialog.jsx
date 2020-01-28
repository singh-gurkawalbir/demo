import ToggleEditorDialog from '../EditorDialog/toggleEditorDialog';
import FilterEditor from './index';
import JavaScriptEditor from '../JavaScriptEditor';

export default function FilterToggleEditorDialog(props) {
  const {
    id,
    rule,
    scriptId,
    data,
    disabled,
    type,
    entryFunction,
    insertStubKey,
    ...rest
  } = props;
  const defaults = {
    width: '85vw',
    height: '60vh',
    layout: 'column',
    open: true,
    labels: ['Rules', 'Javascript'],
  };

  return (
    <ToggleEditorDialog
      id={id}
      type={type}
      {...defaults}
      {...rest}
      disabled={disabled}
      showLayoutOptions>
      <FilterEditor disabled={disabled} data={data} rule={rule} />
      <JavaScriptEditor
        data={data}
        disabled={disabled}
        scriptId={scriptId}
        entryFunction={entryFunction}
        insertStubKey={insertStubKey}
      />
    </ToggleEditorDialog>
  );
}
