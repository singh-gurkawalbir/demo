import { useState, Fragment, useEffect, useCallback } from 'react';
import { FormLabel, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import * as selectors from '../../../../reducers';
import actions from '../../../../actions';
import CsvConfigEditorDialog from '../../../AFE/CsvConfigEditor/Dialog';
import FieldHelp from '../../FieldHelp';

const useStyles = makeStyles(theme => ({
  dynaCsvGenerateWrapper: {
    flexDirection: `row !important`,
    width: '100%',
    alignItems: 'center',
  },
  dynaCsvBtn: {
    marginRight: theme.spacing(0.5),
  },
  dynaCsvLabel: {
    marginBottom: 0,
    marginRight: 12,
    maxWidth: '50%',
    wordBreak: 'break-word',
  },
}));

export default function DynaCsvGenerate(props) {
  const classes = useStyles();
  const {
    id,
    onFieldChange,
    label,
    resourceId,
    flowId,
    resourceType,
    disabled,
    helpKey,
    options = {},
  } = props;
  const { fields = {} } = options;
  const [showEditor, setShowEditor] = useState(false);
  const [sampleDataLoaded, setSampleDataLoaded] = useState(false);
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
    if (!sampleDataLoaded) {
      fetchSampleData();
    }
  }, [fetchSampleData, sampleDataLoaded]);
  useEffect(() => {
    if (!sampleDataLoaded && sampleData) {
      setSampleDataLoaded(true);
    }
  }, [sampleData, sampleDataLoaded]);
  const handleClose = (shouldCommit, editorValues) => {
    if (shouldCommit) {
      Object.keys(fields).forEach(key => {
        onFieldChange(`${id}.${key}`, editorValues[key]);
      });
    }

    handleEditorClick();
  };

  const stringifiedSampleData = sampleData
    ? JSON.stringify(sampleData, null, 2)
    : '';

  return (
    <Fragment>
      {showEditor && (
        <CsvConfigEditorDialog
          key={sampleDataLoaded}
          title="CSV generator helper"
          id={id + resourceId}
          mode="csv"
          data={stringifiedSampleData}
          resourceType={resourceType}
          csvEditorType="generate"
          /** rule to be passed as json */
          rule={fields}
          onClose={handleClose}
          disabled={disabled}
        />
      )}
      <div className={classes.dynaCsvGenerateWrapper}>
        <FormLabel className={classes.dynaCsvLabel}>{label}</FormLabel>
        <Button
          data-test={id}
          variant="outlined"
          color="secondary"
          className={classes.dynaCsvBtn}
          onClick={handleEditorClick}>
          Launch
        </Button>

        <FieldHelp {...props} helpKey={helpKey} />
      </div>
    </Fragment>
  );
}
