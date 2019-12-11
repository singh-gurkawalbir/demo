import { useState, Fragment, useEffect, useCallback } from 'react';
import Button from '@material-ui/core/Button';
import { useSelector, useDispatch } from 'react-redux';
import * as selectors from '../../../../reducers';
import actions from '../../../../actions';
import CsvConfigEditorDialog from '../../../AFE/CsvConfigEditor/Dialog';

export default function DynaCsvGenerate(props) {
  const {
    id,
    onFieldChange,
    value = {},
    label,
    resourceId,
    flowId,
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
  const sampleData = useSelector(state =>
    selectors.getSampleData(state, {
      flowId,
      resourceId,
      resourceType,
      stage: 'flowInput',
    })
  );
  const fetchSampleData = useCallback(() => {
    dispatch(
      actions.flowData.requestSampleData(
        flowId,
        resourceId,
        resourceType,
        'flowInput'
      )
    );
  }, [dispatch, flowId, resourceId, resourceType]);

  useEffect(() => {
    fetchSampleData();
  }, [fetchSampleData]);
  const handleClose = (shouldCommit, editorValues) => {
    if (shouldCommit) {
      const {
        rowDelimiter,
        columnDelimiter,
        includeHeader,
        wrapWithQuotes,
        replaceTabWithSpace,
        replaceNewlineWithSpace,
        truncateLastRowDelimiter,
      } = editorValues;

      onFieldChange(id, {
        rowDelimiter,
        columnDelimiter,
        includeHeader,
        truncateLastRowDelimiter,
        replaceTabWithSpace,
        replaceNewlineWithSpace,
        wrapWithQuotes,
      });

      // On change of rules, trigger sample data update
      // It calls processor on final rules to parse csv file
    }

    handleEditorClick();
  };

  const stringifiedSampleData = sampleData ? JSON.stringify(sampleData) : '';

  return (
    <Fragment>
      {showEditor && (
        <CsvConfigEditorDialog
          title="CSV generate options"
          id={id + resourceId}
          mode="csv"
          data={stringifiedSampleData}
          resourceType={resourceType}
          csvEditorType="generate"
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
