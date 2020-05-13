import { useState, Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, FormLabel } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import * as selectors from '../../../../reducers';
import actions from '../../../../actions';
import CsvConfigEditorDialog from '../../../AFE/CsvConfigEditor/Dialog';
import csvOptions from '../../../AFE/CsvConfigEditor/options';
import FieldHelp from '../../FieldHelp';

const useStyles = makeStyles(theme => ({
  csvContainer: {
    flexDirection: `row !important`,
    width: '100%',
    alignItems: 'center',
  },
  csvBtn: {
    marginRight: theme.spacing(0.5),
  },
  csvLabel: {
    marginBottom: 0,
    marginRight: theme.spacing(1),
  },
}));

export default function DynaCsvParse(props) {
  const classes = useStyles();
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
    const { data: rawData, status } = selectors.getResourceSampleDataWithStatus(
      state,
      resourceId,
      'raw'
    );

    if (!status) {
      // Incase of resource edit and no file uploaded, show the csv content uploaded last time ( sampleData )
      const resource = selectors.resource(state, resourceType, resourceId);

      // If the file type is csv before , only then retrieve its content sampleData to show in the editor
      if (resource && resource.file && resource.file.type === 'csv') {
        return { csvData: resource.sampleData };
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
        rowsToSkip,
        trimSpaces,
      } = editorValues;
      const savedVal = {
        columnDelimiter: csvOptions.ColumnDelimiterMap[columnDelimiter],
        rowDelimiter: csvOptions.RowDelimiterMap[rowDelimiter],
        hasHeaderRow,
        keyColumns,
        trimSpaces,
      };

      if (Number.isInteger(rowsToSkip)) {
        savedVal.rowsToSkip = rowsToSkip;
      }

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
      <div className={classes.csvContainer}>
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
        <FormLabel className={classes.csvLabel}>CSV parsing:</FormLabel>
        <Button
          data-test={id}
          variant="outlined"
          color="secondary"
          className={classes.csvBtn}
          onClick={handleEditorClick}>
          {label}
        </Button>
        {/* TODO: surya we need to add the helptext for the upload file */}
        <FieldHelp {...props} helpText={label} />
      </div>
    </Fragment>
  );
}
