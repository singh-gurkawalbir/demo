import { useState, Fragment } from 'react';
import Button from '@material-ui/core/Button';
import { useSelector, useDispatch } from 'react-redux';
import * as selectors from '../../../../../reducers';
import actions from '../../../../../actions';
import CsvConfigEditorDialog from '../../../../AFE/SuiteScript/CsvConfigEditor/Dialog';
import csvOptions from '../../../../AFE/SuiteScript/CsvConfigEditor/options';

export default function DynaCsvParse(props) {
  const {
    id,
    onFieldChange,
    value = {},
    label,
    resourceId,
    resourceType,
    disabled,
    ssLinkedConnectionId,
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
    const { data: rawData, status } = selectors.getResourceSampleDataWithStatus(
      state,
      resourceId,
      'raw'
    );

    if (!status) {
      // Incase of resource edit and no file uploaded, show the csv content uploaded last time ( sampleData )
      const resource = selectors.suiteScriptResource(state, {
        resourceType,
        id: resourceId,
        ssLinkedConnectionId,
      });

      // If the file type is csv before , only then retrieve its content sampleData to show in the editor
      if (
        resource &&
        resource.export &&
        resource.export.file &&
        resource.export.file.csv
      ) {
        return { csvData: resource.export.sampleData };
      }
    }

    return { csvData: rawData && rawData.body };
  });
  const handleClose = (shouldCommit, editorValues) => {
    if (shouldCommit) {
      const {
        columnDelimiter,
        rowDelimiter,
        hasHeaderRow,
        keyColumns,
      } = editorValues;
      const savedVal = {
        columnDelimiter: csvOptions.ColumnDelimiterMap[columnDelimiter],
        rowDelimiter: csvOptions.RowDelimiterMap[rowDelimiter],
        hasHeaderRow,
        keyColumns,
      };

      onFieldChange(id, savedVal);

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
          title="CSV Parse Options"
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
