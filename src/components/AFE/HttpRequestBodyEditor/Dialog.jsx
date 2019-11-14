import EditorDialog from '../EditorDialog';
import HttpRequestBodyEditor from './';

export default function HttpRequestBodyDialog(props) {
  const { id, rule, data, contentType, disabled, ...rest } = props;
  const defaults = {
    layout: 'compact',
    width: '80vw',
    height: '50vh',
    open: true,
  };

  return (
    <EditorDialog id={id} {...defaults} {...rest} disabled={disabled}>
      <HttpRequestBodyEditor
        contentType={contentType}
        editorId={id}
        rule={rule}
        data={data}
        disabled={disabled}
      />
    </EditorDialog>
  );
}
