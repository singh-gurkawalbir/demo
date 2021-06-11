import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CopyToClipboard } from 'react-copy-to-clipboard';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@material-ui/styles';
import { IconButton} from '@material-ui/core';
import { selectors } from '../../../reducers';
import actions from '../../../actions';
import DynaText from './DynaText';
import { isNewId, getWebhookUrl } from '../../../utils/resource';
import useFormContext from '../../Form/FormContext';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import { getInvalidFields } from '../../../forms/formFactory/utils';
import CopyIcon from '../../icons/CopyIcon';
import AddIcon from '../../icons/AddIcon';

const hasInValidFields = (fields, fieldStates) => getInvalidFields(fieldStates).some(field => fields.includes(field.id));

const useStyles = makeStyles(theme => ({
  children: {
    flex: 1,
  },
  dynaGenerateUrlWrapper: {
    flexDirection: 'row !important',
    display: 'flex',
  },

  dynaGenerateTokenbtn: {
    marginTop: theme.spacing(3.5),
    marginLeft: theme.spacing(1),
  },
}));

const webookRequiredFields = ['webhook.password', 'webhook.username', 'webhook.path'];

export default function GenerateUrl(props) {
  const {
    options = {},
    onFieldChange,
    resourceId,
    id,
    value,
    buttonLabel,
    flowId,
    formKey,
    provider: webHookProvider,
  } = props;
  const { webHookToken } = options;
  const formContext = useFormContext(formKey);
  const { value: formValues, fields: fieldStates } = formContext;

  const webHookVerify = fieldStates?.['webhook.verify']?.value;
  const classes = useStyles();
  const [url, setUrl] = useState(true);
  const dispatch = useDispatch();
  const finalResourceId =
    useSelector(state => selectors.createdResourceId(state, resourceId)) ||
    resourceId;
  const [enquesnackbar] = useEnqueueSnackbar();
  const handleCopy = useCallback(() =>
    enquesnackbar({ message: 'URL copied to clipboard.' }), [enquesnackbar]);
  const handleGenerateUrl = useCallback(() => {
    if (isNewId(finalResourceId)) {
      if (hasInValidFields(webookRequiredFields, fieldStates)) {
        webookRequiredFields.forEach(fieldId => {
          onFieldChange(fieldId, (Object.values(fieldStates).find(({id}) => fieldId === id) || {value: ''}).value);
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
    }
    setUrl(true);
  }, [dispatch, fieldStates, finalResourceId, flowId, formValues, onFieldChange]);

  useEffect(() => {
    if (!isNewId(finalResourceId) && url) {
      const whURL = getWebhookUrl({ webHookProvider, webHookToken, webHookVerify }, finalResourceId);

      onFieldChange(id, whURL);
      setUrl(false);
    }
  }, [finalResourceId, webHookProvider, webHookVerify, webHookToken, id, onFieldChange, url]);

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
              onCopy={handleCopy}
              text={value}>
              <IconButton aria-label="Copy to clipboard" size="small" color="inherit">
                <CopyIcon />
              </IconButton>
            </CopyToClipboard>
          )}
          {!value && (
            <IconButton aria-label={buttonLabel} onClick={handleGenerateUrl} size="small" color="inherit">
              <AddIcon />
            </IconButton>
          )}
        </div>
      </div>
    </>
  );
}
