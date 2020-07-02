import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormContext } from 'react-forms-processor/dist';
import { CopyToClipboard } from 'react-copy-to-clipboard';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import * as selectors from '../../../reducers';
import actions from '../../../actions';
import DynaText from './DynaText';
import { isNewId, getWebhookUrl } from '../../../utils/resource';

const inValidFields = (fields, fieldStates) => fieldStates.filter(field => fields.includes(field.id)).some(
  field => !field.isValid || field.isDiscretelyInvalid
);
const useStyles = makeStyles(theme => ({
  children: {
    flex: 1,
  },
  dynaGenerateUrlWrapper: {
    flexDirection: 'row !important',
  },

  dynaGenerateTokenbtn: {
    marginTop: 26,
    marginLeft: theme.spacing(1),
  },
}));

const webookRequiredFields = ['webhook.password', 'webhook.username'];

function GenerateUrl(props) {
  const {
    options = {},
    onFieldChange,
    resourceId,
    id,
    value,
    buttonLabel,
    formContext,
    flowId,
    provider: webHookProvider
  } = props;
  const { webHookToken } = options;
  const { value: formValues, fields: fieldStates } = formContext;
  const classes = useStyles();
  const [url, setUrl] = useState(true);
  const dispatch = useDispatch();
  const finalResourceId =
    useSelector(state => selectors.createdResourceId(state, resourceId)) ||
    resourceId;
  const handleGenerateUrl = useCallback(() => {
    if (inValidFields(webookRequiredFields, fieldStates)) {
      webookRequiredFields.forEach(fieldId => {
        onFieldChange(fieldId, (fieldStates.find(({id}) => fieldId === id) || {value: ''}).value);
      });
      return;
    }
    dispatch(
      actions.resourceForm.submit(
        'exports',
        finalResourceId,
        formValues,
        null,
        true,
        false,
        flowId
      )
    );
    setUrl(true);
  }, [dispatch, fieldStates, finalResourceId, flowId, formValues, onFieldChange]);

  useEffect(() => {
    if (!isNewId(finalResourceId) && url) {
      const whURL = getWebhookUrl({ webHookProvider, webHookToken }, finalResourceId);
      onFieldChange(id, whURL);
      setUrl(false);
    }
  }, [finalResourceId, webHookProvider, webHookToken, id, onFieldChange, url]);

  return (
    <>
      <div className={classes.dynaGenerateUrlWrapper}>
        <DynaText
          {...props}
          disabled
          required
          className={classes.children}
          value={value}
        />
        <div className={classes.dynaGenerateTokenbtn}>
          {value && (
            <CopyToClipboard
              text={value}>
              <Button
                data-test="copyToClipboard"
                title="Copy to clipboard"
                variant="outlined"
                color="secondary">
                Copy URL
              </Button>
            </CopyToClipboard>
          )}
          {!value && (
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleGenerateUrl}>
              {buttonLabel}
            </Button>
          )}
        </div>
      </div>
    </>
  );
}

const DynaGenerateUrlFormContext = props => (
  <FormContext.Consumer {...props}>
    {form => <GenerateUrl {...props} formContext={form} />}
  </FormContext.Consumer>
);

export default DynaGenerateUrlFormContext;
