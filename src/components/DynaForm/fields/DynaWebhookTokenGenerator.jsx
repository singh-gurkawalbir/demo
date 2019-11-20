import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { deepClone } from 'fast-json-patch';
import { FormContext } from 'react-forms-processor/dist';
import uuid from 'uuid';
import { makeStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import * as selectors from '../../../reducers';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import actions from '../../../actions';
import DynaTextForSetFields from './text/DynaTextForSetFields';
import { getWebhookUrl } from '../../../utils/resource';

// TODO Azhar
const useStyles = makeStyles(() => ({
  children: {
    flex: 1,
  },
}));

function DynaWebhookTokenGenerator(props) {
  const {
    onFieldChange,
    resourceId,
    id,
    value,
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
      onFieldChange(fieldId, '');
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
    if (finalResourceId) {
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
      const whURL = getWebhookUrl(formValues, resourceId);

      onFieldChange('webhook.url', whURL);
      setUrl(false);
    }
  }, [finalResourceId, formValues, id, onFieldChange, resourceId, url]);

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <div style={{ flexBasis: '70%', '& div': { width: '100%' } }}>
        <DynaTextForSetFields
          {...props}
          required
          className={classes.children}
          style={{ width: '100%' }}
          value={value}
          setFieldIds={setFieldIds}
        />
      </div>
      <div>
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
              size="small">
              Copy Token
            </Button>
          </CopyToClipboard>
        ) : (
          <Button onClick={handleGenerateClick}>{buttonLabel}</Button>
        )}
      </div>
    </div>
  );
}

const DynaWebhookTokenGeneratorFormContext = props => (
  <FormContext.Consumer {...props}>
    {form => <DynaWebhookTokenGenerator {...props} formContext={form} />}
  </FormContext.Consumer>
);

export default DynaWebhookTokenGeneratorFormContext;
