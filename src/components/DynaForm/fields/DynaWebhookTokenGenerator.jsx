import { useState, useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { deepClone } from 'fast-json-patch';
import uuid from 'uuid';
import { makeStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import * as selectors from '../../../reducers';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import actions from '../../../actions';
import DynaTextForSetFields from './text/DynaTextForSetFields';
import { getWebhookUrl } from '../../../utils/resource';
import useFormContext from '../../Form/FormContext';

const useStyles = makeStyles(theme => ({
  dynaWebhookTokenWrapper: {
    flexDirection: `row !important`,
  },
  dynaWebhookTokenField: {
    flex: 1,
  },
  dynaWebhookTokenbtn: {
    marginTop: 36,
    marginLeft: theme.spacing(1),
  },
}));

function DynaWebhookTokenGenerator(props) {
  const {
    onFieldChange,
    resourceId,
    id,
    value,
    options = {},
    buttonLabel,
    setFieldIds = [],
    formContext,
    name,
  } = props;
  const { value: formValues } = formContext;
  const classes = useStyles();
  const [enqueueSnackbar] = useEnqueueSnackbar();
  const [token, setToken] = useState(null);
  const [url, setUrl] = useState(false);
  const dispatch = useDispatch();
  const finalResourceId = useSelector(state =>
    selectors.createdResourceId(state, resourceId)
  );
  const handleGenerateClick = () => {
    const tokenValue = uuid.v4().replace(/-/g, '');

    setToken(tokenValue);
    onFieldChange(id, tokenValue);
    setFieldIds.forEach(fieldId => {
      onFieldChange(fieldId, '', true);
    });
    const formValuesCopy = deepClone(formValues);

    formValuesCopy[name] = tokenValue;
    dispatch(
      actions.resourceForm.submit(
        'exports',
        resourceId,
        formValuesCopy,
        null,
        true
      )
    );
    setUrl(true);
  };

  useEffect(() => {
    value && setToken(value);
  }, [value]);

  useEffect(() => {
    if (finalResourceId && token) {
      const patchSet = [
        {
          op: 'replace',
          path: '/webhook/token',
          value: token,
        },
      ];

      dispatch(
        actions.resource.patchStaged(finalResourceId, patchSet, 'value')
      );
    }
  }, [dispatch, finalResourceId, token]);

  useEffect(() => {
    if (url) {
      const { webHookProvider } = options;
      const whURL = getWebhookUrl(
        { webHookProvider, webHookToken: value },
        resourceId
      );

      onFieldChange('webhook.url', whURL, true);
      setUrl(false);
    }
  }, [finalResourceId, id, onFieldChange, options, resourceId, url, value]);

  return (
    <Fragment>
      <div className={classes.dynaWebhookTokenWrapper}>
        <DynaTextForSetFields
          {...props}
          required
          className={classes.dynaWebhookTokenField}
          value={value}
          setFieldIds={setFieldIds}
        />
        <div className={classes.dynaWebhookTokenbtn}>
          {value.match(/^[A-Za-z0-9]/) ? (
            <CopyToClipboard
              text={value}
              onCopy={() =>
                enqueueSnackbar({
                  message: 'Token copied to clipboard.',
                  variant: 'success',
                })
              }>
              <Button
                data-test="copyToClipboard"
                title="Copy to clipboard"
                variant="outlined"
                color="secondary">
                Copy token
              </Button>
            </CopyToClipboard>
          ) : (
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleGenerateClick}>
              {buttonLabel}
            </Button>
          )}
        </div>
      </div>
    </Fragment>
  );
}

const DynaWebhookTokenGeneratorFormContext = props => {
  const form = useFormContext(props);

  return <DynaWebhookTokenGenerator {...props} formContext={form} />;
};

export default DynaWebhookTokenGeneratorFormContext;
