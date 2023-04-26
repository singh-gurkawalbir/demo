import React, { useCallback } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import makeStyles from '@mui/styles/makeStyles';
import DynaText from './DynaText';
import { getApiUrl } from '../../../utils/resource';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import CopyIcon from '../../icons/CopyIcon';
import IconButtonWithTooltip from '../../IconButtonWithTooltip';

const useStyles = makeStyles(theme => ({
  dynaAPIWrapper: {
    flexDirection: 'row !important',
    display: 'flex',
  },
  children: {
    flex: 1,
  },
  copyInvokeUrlBtn: {
    marginTop: theme.spacing(4),
    marginLeft: theme.spacing(1),
  },
  copyIconButton: {
    padding: 0,
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
          <IconButtonWithTooltip
            data-test="copyToClipboard"
            tooltipProps={{title: 'Copy to clipboard'}}
            buttonSize={{size: 'small'}}
            className={classes.copyIconButton}>
            <CopyIcon />
          </IconButtonWithTooltip>
        </CopyToClipboard>
      </div>

    </div>
  );
}
