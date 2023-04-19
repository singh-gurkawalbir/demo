import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import makeStyles from '@mui/styles/makeStyles';
import { selectors } from '../../../reducers';
import actions from '../../../actions';
import DynaText from './DynaText';
import { isNewId, getWebhookUrl } from '../../../utils/resource';
import useFormContext from '../../Form/FormContext';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import { getInvalidFields } from '../../../forms/formFactory/utils';
import CopyIcon from '../../icons/CopyIcon';
import AddIcon from '../../icons/AddIcon';
import IconButtonWithTooltip from '../../IconButtonWithTooltip';

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
    marginTop: 28,
    marginLeft: theme.spacing(1),
  },
}));

const webookRequiredFields = ['webhook.password', 'webhook.username', 'webhook.path'];

export default function GenerateUrl(props) {
  const {
    onFieldChange,
    resourceId,
    id,
    value,
    buttonLabel,
    flowId,
    formKey,
    provider: webHookProvider,
  } = props;

  const { webHookToken, webHookVerify} = useSelector(state => {
    const formContext = selectors.formState(state, formKey) || {};

    return {
      webHookToken: formContext.value?.['/webhook/token'],
      webHookVerify: formContext.value?.['/webhook/verify'],
    };
  }, shallowEqual);

  const [touched, setTouched] = useState(false);
  const formContext = useFormContext(formKey);
  const { value: formValues, fields: fieldStates } = formContext;
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
    setTouched(true);
  }, [dispatch, fieldStates, finalResourceId, flowId, formValues, onFieldChange]);

  useEffect(() => {
    if (!isNewId(finalResourceId) && url) {
      const whURL = getWebhookUrl({ webHookProvider, webHookToken, webHookVerify }, finalResourceId);

      onFieldChange(id, whURL, !touched);
      setUrl(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
              <IconButtonWithTooltip
                tooltipProps={{title: 'Copy to clipboard', placement: 'bottom'}}
                buttonSize={{size: 'small'}}>
                <CopyIcon />
              </IconButtonWithTooltip>
            </CopyToClipboard>
          )}
          {!value && (
            <IconButtonWithTooltip
              tooltipProps={{title: buttonLabel, placement: 'bottom'}}
              buttonSize={{size: 'small'}}
              onClick={handleGenerateUrl}>
              <AddIcon />
            </IconButtonWithTooltip>
          )}
        </div>
      </div>
    </>
  );
}
