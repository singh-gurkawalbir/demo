import { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import uuid from 'uuid';
import { makeStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import DynaText from './DynaText';

const useStyles = makeStyles(() => ({
  children: {
    flex: 1,
  },
}));

export default function GenerateToken(props) {
  const {
    onFieldChange,
    id,
    value,
    buttonLabel,
    setFieldsOnChange,
    setFieldValue = '',
    setFieldIds = [],
  } = props;
  const classes = useStyles();
  const [enqueueSnackbar] = useEnqueueSnackbar();
  const [token, setToken] = useState(null);
  const handleGenerateClick = () => {
    const tokenValue = uuid.v4().replace(/-/g, '');

    setToken(tokenValue);
    onFieldChange(id, tokenValue);
    setFieldIds.forEach(fieldId => {
      onFieldChange(fieldId, setFieldValue);
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <div style={{ flexBasis: '70%', '& div': { width: '100%' } }}>
        <DynaText
          {...props}
          required
          className={classes.children}
          style={{ width: '100%' }}
          value={value}
          setFieldsOnChange={setFieldsOnChange}
          setFieldValue={setFieldValue}
          setFieldIds={setFieldIds}
        />
      </div>
      <div>
        {token && (
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
              copy token
            </Button>
          </CopyToClipboard>
        )}
        {!token && <Button onClick={handleGenerateClick}>{buttonLabel}</Button>}
      </div>
    </div>
  );
}
