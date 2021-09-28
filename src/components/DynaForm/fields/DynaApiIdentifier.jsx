import React, { useCallback } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { makeStyles } from '@material-ui/core/styles';
import DynaText from './DynaText';
import { getApiUrl } from '../../../utils/resource';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import { OutlinedButton } from '../../Buttons';

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
    enquesnackbar({ message: 'URL copied to clipboard.' }), [enquesnackbar]);

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
          <OutlinedButton
            data-test="copyToClipboard"
            title="Copy to clipboard"
            color="secondary">
            Copy URL
          </OutlinedButton>
        </CopyToClipboard>
      </div>

    </div>
  );
}
