import UrlEditor from './';
import HandlebarEditorDialog from '../HandlebarEditorDialog';

export default function UrlEditorDialog(props) {
  const {
    id,
    isSampleDataLoading,
    rule,
    lookups = [],
    data,
    disabled,
    ...rest
  } = props;
  const defaults = {
    layout: 'column',
    width: '70vw',
    height: '55vh',
    open: true,
  };

  return (
    <HandlebarEditorDialog
      id={id}
      {...defaults}
      {...rest}
      disabled={disabled}
      showFullScreen>
      <UrlEditor
        lookups={lookups}
        disabled={disabled}
        editorId={id}
        rule={rule}
        data={data}
        isSampleDataLoading={isSampleDataLoading}
      />
    </HandlebarEditorDialog>
  );
}
