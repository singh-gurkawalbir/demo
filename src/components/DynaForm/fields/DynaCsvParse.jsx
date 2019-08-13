import { useState, Fragment } from 'react';
import Button from '@material-ui/core/Button';
import { FieldWrapper } from 'react-forms-processor/dist';
import CsvParseEditorDialog from '../../../components/AFE/CsvParseEditor/Dialog';

function DynaCsvParse(props) {
  const { id, onFieldChange, value, label, sampleData } = props;
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
      <Button variant="contained" onClick={handleEditorClick}>
        {label}
      </Button>
    </Fragment>
  );
}

const WrappedDynaCsvParse = props => (
  <FieldWrapper {...props}>
    <DynaCsvParse />
  </FieldWrapper>
);

export default WrappedDynaCsvParse;
