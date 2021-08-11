import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { deepClone } from 'fast-json-patch';
import {v4} from 'uuid';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@material-ui/styles';
import { selectors } from '../../../reducers';
import actions from '../../../actions';
import DynaTextForSetFields from './text/DynaTextForSetFields';
import { getWebhookUrl } from '../../../utils/resource';
import useFormContext from '../../Form/FormContext';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import CopyIcon from '../../icons/CopyIcon';
import AddIcon from '../../icons/AddIcon';
import IconButtonWithTooltip from '../../IconButtonWithTooltip';
import FieldMessage from './FieldMessage';

const useStyles = makeStyles(theme => ({
  dynaWebhookTokenWrapper: {
    flexDirection: 'row !important',
    display: 'flex',
  },
  dynaWebhookTokenField: {
    flex: 1,
  },
  dynaWebhookTokenbtn: {
    marginTop: 28,
    marginLeft: theme.spacing(1),
  },
  warningText: {
    marginTop: -12,
    marginBottom: theme.spacing(2),
  },
}));

export default function DynaWebhookTokenGenerator(props) {
  const {
    onFieldChange,
    resourceId,
    id,
    value,
    buttonLabel,
    setFieldIds = [],
    name,
    formKey,
    provider: webHookProvider,
  } = props;
  const warningTextMessage = 'Please copy and secure this token externally. It will not be displayed in clear text again.';
  const formContext = useFormContext(formKey);
  const { value: formValues } = formContext;
  const classes = useStyles();
  const [token, setToken] = useState(null);
  const [url, setUrl] = useState(false);
  const dispatch = useDispatch();
  const finalResourceId = useSelector(state =>
    selectors.createdResourceId(state, resourceId)
  );
  const [enquesnackbar] = useEnqueueSnackbar();
  const handleCopy = useCallback(() =>
    enquesnackbar({ message: 'Token copied to clipboard.' }), [enquesnackbar]);
  const handleGenerateClick = useCallback(() => {
    const tokenValue = v4().replace(/-/g, '');

    setToken(tokenValue);
    onFieldChange(id, tokenValue);
    setFieldIds.forEach(fieldId => {
      onFieldChange(fieldId, '', true);
    });
    const formValuesCopy = deepClone(formValues);

    formValuesCopy[name] = tokenValue;
    if (formValues?.['/webhook/verify'] !== 'token' || formValues?.['/webhook/path']) {
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
        <div className={classes.dynaWebhookTokenField}>
          <DynaTextForSetFields
            {...props}
            required
            value={value}
            setFieldIds={setFieldIds}
        />
          {value?.match(/^[A-Za-z0-9]/) && (
          <FieldMessage
            className={classes.warningText}
            warningMessages={warningTextMessage} />
        )}
        </div>
        <div className={classes.dynaWebhookTokenbtn}>
          {value?.match(/^[A-Za-z0-9]/) ? (
            <CopyToClipboard
              onCopy={handleCopy}
              text={value}>
              <IconButtonWithTooltip
                tooltipProps={{title: 'Copy to clipboard', placement: 'bottom'}}
                buttonSize={{size: 'small'}}>
                <CopyIcon />
              </IconButtonWithTooltip>
            </CopyToClipboard>
          ) : (
            <IconButtonWithTooltip
              tooltipProps={{title: buttonLabel, placement: 'bottom'}}
              buttonSize={{size: 'small'}}
              onClick={handleGenerateClick}>
              <AddIcon />
            </IconButtonWithTooltip>
          )}
        </div>
      </div>
    </>
  );
}
