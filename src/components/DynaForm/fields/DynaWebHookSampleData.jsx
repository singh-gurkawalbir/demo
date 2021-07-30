import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';
import CodeEditor from '../../CodeEditor';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import { isJsonString } from '../../../utils/string';
import FieldMessage from './FieldMessage';
import { OutlinedButton } from '../../Buttons';

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
  const sampleData = useSelector(state => {
    const resource = selectors.resource(state, 'exports', resourceId) || {};

    return resource.sampleData;
  });

  // Updates field with latest sampleData requested whenever user clicks on generate sample data
  useEffect(() => {
    onFieldChange(id, sampleData, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, sampleData]);
  const generateSampleData = useCallback(() => {
    if (!options.webHookUrl) {
      return enqueueSnackbar({
        message: 'Webhook url is mandatory.',
        variant: 'error',
      });
    }

    dispatch(actions.resource.request('exports', resourceId));
  }, [dispatch, enqueueSnackbar, options.webHookUrl, resourceId]);

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
          onChange={handleSampleDataChange}
        />
      </div>
      <FieldMessage
        description={description}
        errorMessages={errorMessages}
        isValid={isValid}
        />
      <div className={classes.actions}>
        <OutlinedButton
          color="secondary"
          className={classes.inlineActions}
          onClick={generateSampleData}>
          Click to show
        </OutlinedButton>
      </div>
    </div>
  );
}
