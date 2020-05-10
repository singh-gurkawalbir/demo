import HttpRequestBodyEditor from './';
import HanldebarEditorDialog from '../HandlebarEditorDialog';

export default function HttpRequestBodyDialog(props) {
  const {
    id,
    rule,
    data,
    contentType,
    lookups = [],
    disabled,
    sampleRule,
    isSampleDataLoading,
    editorVersion,
    ...rest
  } = props;
  const defaults = {
    layout: 'compact',
    width: '80vw',
    height: '50vh',
    open: true,
  };

  return (
    <HanldebarEditorDialog
      id={id}
      {...defaults}
      {...rest}
      disabled={disabled}
      editorVersion={editorVersion}>
      <HttpRequestBodyEditor
        contentType={contentType}
        editorId={id}
        lookups={lookups}
        rule={rule}
        data={data}
        sampleRule={sampleRule}
        isSampleDataLoading={isSampleDataLoading}
        editorVersion={editorVersion}
        disabled={disabled}
      />
    </HanldebarEditorDialog>
  );
}
