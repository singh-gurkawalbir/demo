import React, { useCallback} from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import makeStyles from '@mui/styles/makeStyles';
import useEnqueueSnackbar from '../../../../../hooks/enqueueSnackbar';
import { message } from '../../../../../utils/messageStore';
import TextButton from '../../../../Buttons/TextButton';
import CopyIcon from '../../../../icons/CopyIcon';

const useStyles = makeStyles(theme => ({
  copyAliasButton: {
    padding: 0,
    height: theme.spacing(3.5),
    fontSize: 14,
    '& .MuiButton-startIcon': {
      marginLeft: 0,
    },
    '&:hover,&:focus': {
      color: theme.palette.secondary.main,
    },
  },
}));
export default {
  key: 'copyAlias',
  useLabel: rowData => {
    const classes = useStyles();

    return (
      <CopyToClipboard text={rowData.alias}>
        <TextButton
          data-test="copyToClipboard"
          startIcon={<CopyIcon />}
          className={classes.copyAliasButton}>
          Copy alias
        </TextButton>
      </CopyToClipboard>
    );
  },
  useOnClick: () => {
    const [enquesnackbar] = useEnqueueSnackbar();
    const handleCopy = useCallback(() => {
      enquesnackbar({ message: message.ALIAS.COPIED_MESSAGE });
    }, [enquesnackbar]);

    return handleCopy;
  },
};
