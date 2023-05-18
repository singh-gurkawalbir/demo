import React, { useCallback} from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import {TextButton} from '@celigo/fuse-ui';
import useEnqueueSnackbar from '../../../../../hooks/enqueueSnackbar';
import { message } from '../../../../../utils/messageStore';
import CopyIcon from '../../../../icons/CopyIcon';

export default {
  key: 'copyAlias',
  useLabel: rowData => (
    <CopyToClipboard text={rowData.alias}>
      <TextButton
        data-test="copyToClipboard"
        startIcon={<CopyIcon />}
        sx={{
          padding: 0,
          height: 28,
          fontSize: '14px',
          '& .MuiButton-startIcon': {
            marginLeft: 0,
          },
          '&:hover,&:focus': {
            color: 'secondary.main',
          },
        }}>
        Copy alias
      </TextButton>
    </CopyToClipboard>
  ),
  useOnClick: () => {
    const [enquesnackbar] = useEnqueueSnackbar();
    const handleCopy = useCallback(() => {
      enquesnackbar({ message: message.ALIAS.COPIED_MESSAGE });
    }, [enquesnackbar]);

    return handleCopy;
  },
};
