import EditorDialog from '../EditorDialog';
import HttpRequestBodyEditor from './';

export default function HttpRequestBodyDialog(props) {
  const {
    id,
    rule,
    data,
    contentType,
    lookups = [],
    disabled,
    resultTitle,
    dataTitle,
    ruleTitle,
    ...rest
  } = props;
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
        lookups={lookups}
        rule={rule}
        data={data}
        disabled={disabled}
        ruleTitle={ruleTitle}
        dataTitle={dataTitle}
        resultTitle={resultTitle}
      />
    </EditorDialog>
  );
}
