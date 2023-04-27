import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormLabel } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import CodeEditor from '../../CodeEditor';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import { isJsonString } from '../../../utils/string';
import FieldMessage from './FieldMessage';
import { OutlinedButton } from '../../Buttons';
import FieldHelp from '../FieldHelp';

const useStyles = makeStyles(theme => ({
  sampleDataContent: {
    flex: 1,
    height: theme.spacing(20),
    display: 'flex',
    flexDirection: 'column',
  },
  container: {
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    height: '100%',
  },
  actions: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(2),
  },
  dynaWebhookWrapper: {
    display: 'flex',
  },
  fieldWrapper: {
    display: 'flex',
    alignItems: 'flex-start',
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
    resourceId,
    errorMessages,
    description,
    isValid,
    formKey,
  } = props;

  const webHookUrl = useSelector(state => {
    const formContext = selectors.formState(state, formKey) || {};

    return formContext.value?.['/webhook/url'];
  });

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
    if (!webHookUrl) {
      return enqueueSnackbar({
        message: 'Webhook url is mandatory.',
        variant: 'error',
      });
    }

    dispatch(actions.resource.request('exports', resourceId));
  }, [dispatch, enqueueSnackbar, webHookUrl, resourceId]);

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
    <div className={classes.dynaWebhookWrapper}>
      <div className={classes.sampleDataContent}>
        <div className={classes.fieldWrapper}>
          <FormLabel error={!isValid}>{label}</FormLabel>
          <FieldHelp
            helpKey="webhook.sampleData"
            label={label} />
        </div>
        {/* sample data can contain sensitive information */}
        <div className={classes.container} data-private>
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
      </div>
      <div className={classes.actions}>
        <OutlinedButton
          onClick={generateSampleData}>
          Click to show
        </OutlinedButton>
      </div>
    </div>
  );
}
