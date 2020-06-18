import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import DynaText from './DynaText';
import { getApiUrl } from '../../../utils/resource';

const useStyles = makeStyles(theme => ({
  dynaAPIWrapper: {
    flexDirection: 'row !important',
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
  const invokeUrl = `${apiUrl}/${value}`
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
