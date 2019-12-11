import EditorDialog from '../EditorDialog';
import CsvParseEditor from './CsvParser';
import CsvGenerateEditor from './CsvGenerator';

export default function CsvConfigEditorDialog(props) {
  // csvEditorType: ['parse', 'generate']
  const { id, rule, data, disabled, csvEditorType = 'parse', ...rest } = props;
  const defaults = {
    width: '80vw',
    height: '70vh',
    open: true,
  };

  return (
    <EditorDialog
      id={id}
      {...defaults}
      {...rest}
      // showLayoutOptions={false}
      disabled={disabled}
      showFullScreen>
      <div>
        {csvEditorType === 'generate' ? (
          <CsvGenerateEditor
            disabled={disabled}
            editorId={id}
            rule={rule}
            data={data}
          />
        ) : (
          <CsvParseEditor
            disabled={disabled}
            editorId={id}
            rule={rule}
            data={data}
          />
        )}
      </div>
    </EditorDialog>
  );
}
