import { useState, Fragment } from 'react';
import Button from '@material-ui/core/Button';
import CsvParseEditorDialog from '../../../components/AFE/CsvParseEditor/Dialog';

export default function DynaCsvParse(props) {
  const { id, onFieldChange, value, label, sampleData = '' } = props;
  const [showEditor, setShowEditor] = useState(false);
  const handleEditorClick = () => {
    setShowEditor(!showEditor);
  };

  const handleClose = (shouldCommit, editorValues) => {
    if (shouldCommit) {
      const {
        columnDelimiter,
        hasHeaderRow,
        keyColumns,
        rowsToSkip,
        trimSpaces,
      } = editorValues;

      onFieldChange(id, {
        columnDelimiter,
        hasHeaderRow,
        keyColumns,
        rowsToSkip,
        trimSpaces,
      });
    }

    handleEditorClick();
  };

  return (
    <Fragment>
      {showEditor && (
        <CsvParseEditorDialog
          title="CSV parse options"
          id={id}
          mode="csv"
          data={sampleData}
          rule={value}
          onClose={handleClose}
        />
      )}
      <Button
        data-test={id}
        variant="contained"
        color="secondary"
        onClick={handleEditorClick}>
        {label}
      </Button>
    </Fragment>
  );
}
