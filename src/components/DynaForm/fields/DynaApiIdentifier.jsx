import React, { useCallback } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import DynaText from './DynaText';
import { getApiUrl } from '../../../utils/resource';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';

const useStyles = makeStyles(theme => ({
  dynaAPIWrapper: {
    flexDirection: 'row !important',
    display: 'flex',
  },
  children: {
    flex: 1,
  },
  copyInvokeUrlBtn: {
    marginTop: 26,
    marginLeft: theme.spacing(1),
  },
}));

export default function DynaApiIdentifier(props) {
  const { value } = props;
  const classes = useStyles();
  const apiUrl = getApiUrl();
  const invokeUrl = `${apiUrl}/${value}`;

  const [enquesnackbar] = useEnqueueSnackbar();
  const handleCopy = useCallback(() =>
    enquesnackbar({ message: 'URL copied to clipboard' }), [enquesnackbar]);

  return (
    <div className={classes.dynaAPIWrapper}>
      <DynaText
        {...props}
        disabled
        className={classes.children}
        value={invokeUrl}
        />
      <div className={classes.copyInvokeUrlBtn}>
        <CopyToClipboard
          onCopy={handleCopy}
          text={invokeUrl}>
          <Button
            data-test="copyToClipboard"
            title="Copy to clipboard"
            variant="outlined"
            color="secondary">
            Copy URL
          </Button>
        </CopyToClipboard>
      </div>

    </div>
  );
}
