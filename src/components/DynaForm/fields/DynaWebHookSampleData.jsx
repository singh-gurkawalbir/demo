import { useCallback, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Typography, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CodeEditor from '../../CodeEditor';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import actions from '../../../actions';
import * as selectors from '../../../reducers';

const useStyles = makeStyles(theme => ({
  container: {
    height: '15vh',
  },
  actions: {
    height: '6vh',
    padding: theme.spacing(2),
  },
  inlineActions: {
    display: 'inline',
  },
}));

export default function DynaWebHookSampleData(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [enqueueSnackbar] = useEnqueueSnackbar();
  const { label, id, onFieldChange, options, resourceId } = props;
  const [manualEnter, setManualEnter] = useState(false);
  const sampleData = useSelector(state => {
    const resource = selectors.resource(state, 'exports', resourceId) || {};

    return resource.sampleData;
  });

  // Updates field with latest sampleData requested whenever user clicks on generate sample data
  useEffect(() => {
    onFieldChange(id, sampleData);
    setManualEnter(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, sampleData]);
  const generateSampleData = useCallback(() => {
    if (!options.webHookUrl || !options.webHookProvider) {
      return enqueueSnackbar({
        message: 'Url and Provider are mandatory',
        variant: 'error',
      });
    }

    dispatch(actions.resource.request('exports', resourceId));
  }, [
    dispatch,
    enqueueSnackbar,
    options.webHookProvider,
    options.webHookUrl,
    resourceId,
  ]);
  const handleManualEnter = useCallback(() => {
    setManualEnter(true);
  }, []);
  const handleSampleDataChange = useCallback(
    value => {
      onFieldChange(id, value);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [id]
  );

  return (
    <div>
      <Typography>{label}</Typography>
      <div className={classes.container}>
        <CodeEditor
          name="sampleData"
          value={sampleData}
          mode="json"
          readOnly={!manualEnter}
          onChange={handleSampleDataChange}
        />
      </div>
      <div className={classes.actions}>
        <Button className={classes.inlineActions} onClick={generateSampleData}>
          Click to Show
        </Button>
        <Typography className={classes.inlineActions}> or </Typography>
        <Button className={classes.inlineActions} onClick={handleManualEnter}>
          Manually Enter
        </Button>
      </div>
    </div>
  );
}
