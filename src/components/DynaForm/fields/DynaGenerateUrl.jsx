import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { makeStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import * as selectors from '../../../reducers';
import actions from '../../../actions';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import DynaText from './DynaText';
import { isNewId, getWebhookUrl } from '../../../utils/resource';
import useFormContext from '../../Form/FormContext';

const useStyles = makeStyles(() => ({
  children: {
    flex: 1,
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
        true
      )
    );
    setUrl(true);
  };

  useEffect(() => {
    if (!isNewId(finalResourceId) && url) {
      // Wrapping inside a timeout to make sure it gets executed after form initializes as this component using Form Context
      // TODO @Raghu : Fix this a better way
      setTimeout(() => {
        const whURL = getWebhookUrl(options, finalResourceId);

        onFieldChange(id, whURL);
        setUrl(false);
      });
    }
  }, [finalResourceId, options, id, onFieldChange, url]);

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <div style={{ flexBasis: '70%', '& div': { width: '100%' } }}>
        <DynaText
          {...props}
          disabled
          required
          className={classes.children}
          style={{ width: '100%' }}
          value={value}
        />
      </div>
      <div>
        {value && (
          <CopyToClipboard
            text={value}
            onCopy={() =>
              enqueueSnackbar({
                message: 'URL copied to clipboard.',
                variant: 'success',
              })
            }>
            <Button
              data-test="copyToClipboard"
              title="Copy to clipboard"
              size="small">
              Copy URL
            </Button>
          </CopyToClipboard>
        )}
        {!value && <Button onClick={handleGenerateUrl}>{buttonLabel}</Button>}
      </div>
    </div>
  );
}

const DynaGenerateUrlFormContext = props => {
  const form = useFormContext(props);

  return <GenerateUrl {...props} formContext={form} />;
};

export default DynaGenerateUrlFormContext;
