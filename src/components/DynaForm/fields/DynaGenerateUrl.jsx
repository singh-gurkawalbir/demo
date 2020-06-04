import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormContext } from 'react-forms-processor/dist';
import { CopyToClipboard } from 'react-copy-to-clipboard';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import * as selectors from '../../../reducers';
import actions from '../../../actions';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import DynaText from './DynaText';
import { isNewId, getWebhookUrl } from '../../../utils/resource';

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

function GenerateUrl(props) {
  const {
    onFieldChange,
    resourceId,
    id,
    value,
    options = {},
    buttonLabel,
    formContext,
    flowId,
    provider: webHookProvider
  } = props;
  const { value: formValues } = formContext;
  const classes = useStyles();
  const [enqueueSnackbar] = useEnqueueSnackbar();
  const [url, setUrl] = useState(true);
  const dispatch = useDispatch();
  const finalResourceId =
    useSelector(state => selectors.createdResourceId(state, resourceId)) ||
    resourceId;
  const handleGenerateUrl = () => {
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
  };

  useEffect(() => {
    if (!isNewId(finalResourceId) && url) {
      // Wrapping inside a timeout to make sure it gets executed after form initializes as this component using Form Context
      // TODO @Raghu : Fix this a better way
      setTimeout(() => {
        const whURL = getWebhookUrl({ webHookProvider, webHookToken: value }, finalResourceId);

        onFieldChange(id, whURL);
        setUrl(false);
      });
    }
  }, [finalResourceId, options, id, onFieldChange, url]);

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
              text={value}
              onCopy={() =>
                enqueueSnackbar({
                  message: 'URL copied to clipboard.',
                  variant: 'success',
                })}>
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
