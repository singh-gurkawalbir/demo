import React, { useCallback, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Typography, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';
import CodeEditor from '../../CodeEditor';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import actions from '../../../actions';
import * as selectors from '../../../reducers';
import { isJsonString } from '../../../utils/string';
import ErroredMessageComponent from './ErroredMessageComponent';

const useStyles = makeStyles(theme => ({
  container: {
    height: '15vh',
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
  },
  actions: {
    marginTop: theme.spacing(2),
  },
  inlineActions: {
    display: 'inline',
  },
}));

export default function DynaWebHookSampleData(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [enqueueSnackbar] = useEnqueueSnackbar();
  const {
    label,
    id,
    onFieldChange,
    options,
    resourceId,
    errorMessages,
    description,
    isValid,
  } = props;
  const [manualEnter, setManualEnter] = useState(false);
  const sampleData = useSelector(state => {
    const resource = selectors.resource(state, 'exports', resourceId) || {};

    return resource.sampleData;
  });

  // Updates field with latest sampleData requested whenever user clicks on generate sample data
  useEffect(() => {
    onFieldChange(id, sampleData, true);
    setManualEnter(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, sampleData]);
  const generateSampleData = useCallback(() => {
    if (!options.webHookUrl) {
      return enqueueSnackbar({
        message: 'Webhook url is mandatory',
        variant: 'error',
      });
    }

    dispatch(actions.resource.request('exports', resourceId));
  }, [dispatch, enqueueSnackbar, options.webHookUrl, resourceId]);
  const handleManualEnter = useCallback(() => {
    setManualEnter(true);
  }, []);
  const handleSampleDataChange = useCallback(
    value => {
      if (isJsonString(value)) {
        onFieldChange(id, JSON.parse(value));
      } else {
        onFieldChange(id, value);
      }
    },
    [id, onFieldChange]
  );

  return (
    <div>
      <FormLabel error={!isValid} >{label}</FormLabel>

      <div className={classes.container}>
        <CodeEditor
          name="sampleData"
          value={sampleData}
          mode="json"
          readOnly={!manualEnter}
          onChange={handleSampleDataChange}
        />
      </div>
      <ErroredMessageComponent
        description={description}
        errorMessages={errorMessages}
        isValid={isValid}
        />
      <div className={classes.actions}>
        <Button
          variant="outlined"
          color="secondary"
          className={classes.inlineActions}
          onClick={generateSampleData}>
          Click to show
        </Button>
        <Typography className={classes.inlineActions}> or </Typography>
        <Button
          variant="outlined"
          color="secondary"
          className={classes.inlineActions}
          onClick={handleManualEnter}>
          Manually enter
        </Button>
      </div>
    </div>
  );
}
