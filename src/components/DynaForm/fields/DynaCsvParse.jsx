import { useState, Fragment } from 'react';
import Button from '@material-ui/core/Button';
import { useSelector, useDispatch } from 'react-redux';
import * as selectors from '../../../reducers';
import actions from '../../../actions';
import CsvParseEditorDialog from '../../../components/AFE/CsvParseEditor/Dialog';

export default function DynaCsvParse(props) {
  const { id, onFieldChange, value, label, resourceId, resourceType } = props;
  const [showEditor, setShowEditor] = useState(false);
  const handleEditorClick = () => {
    setShowEditor(!showEditor);
  };

  const dispatch = useDispatch();
  /*
   * Fetches Raw data - CSV file to be parsed based on the rules
   */
  const { data: csvData } = useSelector(state =>
    selectors.getResourceSampleDataWithStatus(state, resourceId, 'raw')
  );
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
      // On change of rules, trigger sample data update
      // It calls processor on final rules to parse csv file
      dispatch(
        actions.sampleData.request(
          resourceId,
          resourceType,
          {
            type: 'csv',
            file: csvData,
            rules: {
              columnDelimiter,
              hasHeaderRow,
              keyColumns,
              rowsToSkip,
              trimSpaces,
            },
          },
          'file'
        )
      );
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
          data={csvData}
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
