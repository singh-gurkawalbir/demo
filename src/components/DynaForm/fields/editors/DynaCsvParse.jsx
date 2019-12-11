import { useState, Fragment } from 'react';
import Button from '@material-ui/core/Button';
import { useSelector, useDispatch } from 'react-redux';
import * as selectors from '../../../../reducers';
import actions from '../../../../actions';
import CsvConfigEditorDialog from '../../../AFE/CsvConfigEditor/Dialog';

export default function DynaCsvParse(props) {
  const {
    id,
    onFieldChange,
    value = {},
    label,
    resourceId,
    resourceType,
    disabled,
  } = props;
  const [showEditor, setShowEditor] = useState(false);
  const handleEditorClick = () => {
    setShowEditor(!showEditor);
  };

  const dispatch = useDispatch();
  /*
   * Fetches Raw data - CSV file to be parsed based on the rules
   */
  const { csvData } = useSelector(state => {
    const rawData = selectors.getResourceSampleDataWithStatus(
      state,
      resourceId,
      'raw'
    );

    return { csvData: rawData && rawData.data && rawData.data.body };
  });
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
            editorValues,
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
        <CsvConfigEditorDialog
          title="CSV parse options"
          id={id + resourceId}
          mode="csv"
          data={csvData}
          resourceType={resourceType}
          csvEditorType="parse"
          /** rule to be passed as json */
          rule={value}
          onClose={handleClose}
          disabled={disabled}
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
