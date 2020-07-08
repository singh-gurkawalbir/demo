import React, { useState, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, FormLabel } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import * as selectors from '../../../../../reducers';
import actions from '../../../../../actions';
import CsvConfigEditorDialog from '../../../../AFE/SuiteScript/CsvConfigEditor/Dialog';
import FieldHelp from '../../../FieldHelp';

const useStyles = makeStyles(theme => ({
  csvContainer: {
    flexDirection: 'row !important',
    width: '100%',
    alignItems: 'center',
  },
  csvBtn: {
    marginRight: theme.spacing(0.5),
  },
  csvLabel: {
    marginBottom: 0,
    marginRight: 12,
    maxWidth: '50%',
    wordBreak: 'break-word',
  },
}));

export default function DynaCsvParse(props) {
  const classes = useStyles();
  const {
    id,
    onFieldChange,
    label,
    resourceId,
    resourceType,
    disabled,
    helpKey,
    options = {},
    ssLinkedConnectionId,
  } = props;
  const { fields = {} } = options;
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

  const handleSave = (shouldCommit, editorValues = {}) => {
    if (shouldCommit) {
      const {
        keyColumns: keyColumnsField,
        ...otherFields
      } = fields;

      Object.keys(otherFields).forEach(key => {
        onFieldChange(`export.file.csv.${key}`, editorValues[key]);
      });

      const { keyColumns } = editorValues;

      // when keyColumn is supported
      if (typeof keyColumnsField !== 'undefined') {
        onFieldChange('export.file.csv.keyColumns', keyColumns || []);
        // set rowsPerRecord if key columns has value
        onFieldChange(
          'export.file.csv.rowsPerRecord',
          !!(keyColumns && keyColumns.length)
        );
        // On change of rules, trigger sample data update
        // It calls processor on final rules to parse csv file
        if (keyColumns) {
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
      }
    }
  };

  const rule = useMemo(
    () => ({
      columnDelimiter: fields.columnDelimiter,
      hasHeaderRow: fields.hasHeaderRow,
      rowDelimiter: fields.rowDelimiter,
      multipleRowsPerRecord:
        fields.keyColumns &&
        Array.isArray(fields.keyColumns) &&
        fields.keyColumns.length,
      keyColumns: fields.keyColumns,
    }),
    [fields.columnDelimiter, fields.hasHeaderRow, fields.keyColumns, fields.rowDelimiter]
  );

  return (
    <div className={classes.csvContainer}>
      {showEditor && (
        <CsvConfigEditorDialog
          title="CSV parser helper"
          id={id + resourceId}
          mode="csv"
          data={csvData}
          resourceType={resourceType}
          csvEditorType="parse"
          /** rule to be passed as json */
          rule={rule}
          onSave={handleSave}
          onClose={handleEditorClick}
          disabled={disabled}
        />
      )}
      <FormLabel className={classes.csvLabel}>{label}</FormLabel>
      <Button
        data-test={id}
        variant="outlined"
        color="secondary"
        className={classes.csvBtn}
        onClick={handleEditorClick}>
        Launch
      </Button>
      <FieldHelp {...props} helpKey={helpKey} />
    </div>
  );
}
