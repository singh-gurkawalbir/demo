import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Typography, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CodeEditor from '../../CodeEditor';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import actions from '../../../actions';

const useStyles = makeStyles(() => ({
  container: {
    height: '20vh',
    width: '80%',
  },
  actions: {
    height: '10vh',
    width: '80%',
  },
}));

export default function DynaWebHookSampleData(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [enqueueSnackbar] = useEnqueueSnackbar();
  const { label, id, onFieldChange, options, resourceId, sampleData } = props;
  const [manualEnter, setManualEnter] = useState(false);
  const generateSampleData = useCallback(() => {
    if (!options.url || !options.provider) {
      return enqueueSnackbar({
        message: 'Url and Provider are mandatory',
        variant: 'error',
      });
    }

    dispatch(actions.resource.request('exports', resourceId));
  }, [dispatch, enqueueSnackbar, options.provider, options.url, resourceId]);
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
        <Button onClick={generateSampleData}> Click to Show </Button>
        <Typography> or </Typography>
        <Button onClick={handleManualEnter}> Manually Enter </Button>
      </div>
    </div>
  );
}
