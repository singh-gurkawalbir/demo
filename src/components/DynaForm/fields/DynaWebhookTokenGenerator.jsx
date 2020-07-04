import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { deepClone } from 'fast-json-patch';
import { FormContext } from 'react-forms-processor/dist';
import {v4} from 'uuid';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import * as selectors from '../../../reducers';
import actions from '../../../actions';
import DynaTextForSetFields from './text/DynaTextForSetFields';
import { getWebhookUrl } from '../../../utils/resource';

const useStyles = makeStyles(theme => ({
  dynaWebhookTokenWrapper: {
    flexDirection: 'row !important',
  },
  dynaWebhookTokenField: {
    flex: 1,
  },
  dynaWebhookTokenbtn: {
    marginTop: 26,
    marginLeft: theme.spacing(1),
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
    provider: webHookProvider
  } = props;
  const { value: formValues } = formContext;
  const classes = useStyles();
  const [token, setToken] = useState(null);
  const [url, setUrl] = useState(false);
  const dispatch = useDispatch();
  const finalResourceId = useSelector(state =>
    selectors.createdResourceId(state, resourceId)
  );
  const handleGenerateClick = useCallback(() => {
    const tokenValue = v4().replace(/-/g, '');

    setToken(tokenValue);
    onFieldChange(id, tokenValue);
    setFieldIds.forEach(fieldId => {
      onFieldChange(fieldId, '', true);
    });
    const formValuesCopy = deepClone(formValues);

    formValuesCopy[name] = tokenValue;
    if (formValues?.['/webhook/path']) {
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
    }
  }, [dispatch, formValues, id, name, onFieldChange, resourceId, setFieldIds]);

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
      const whURL = getWebhookUrl(
        { webHookProvider, webHookToken: value },
        resourceId
      );

      onFieldChange('webhook.url', whURL, true);
      setUrl(false);
    }
  }, [finalResourceId, id, onFieldChange, webHookProvider, resourceId, url, value]);

  return (
    <>
      <div className={classes.dynaWebhookTokenWrapper}>
        <DynaTextForSetFields
          {...props}
          required
          className={classes.dynaWebhookTokenField}
          value={value}
          setFieldIds={setFieldIds}
        />
        <div className={classes.dynaWebhookTokenbtn}>
          {value && value.match(/^[A-Za-z0-9]/) ? (
            <CopyToClipboard
              text={value}>
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
    </>
  );
}

const DynaWebhookTokenGeneratorFormContext = props => (
  <FormContext.Consumer {...props}>
    {form => <DynaWebhookTokenGenerator {...props} formContext={form} />}
  </FormContext.Consumer>
);

export default DynaWebhookTokenGeneratorFormContext;
