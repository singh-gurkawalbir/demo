import React, { useCallback} from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import useEnqueueSnackbar from '../../../../../hooks/enqueueSnackbar';
import messageStore from '../../../../../utils/messageStore';
import TextButton from '../../../../Buttons/TextButton';
import CopyIcon from '../../../../icons/CopyIcon';

export default {
  key: 'copyAlias',
  useLabel: rowData => (
    <CopyToClipboard text={rowData.alias}>
      <TextButton
        data-test="copyToClipboard"
        startIcon={<CopyIcon />}>
        Copy alias
      </TextButton>
    </CopyToClipboard>
  ),
  useOnClick: () => {
    const [enquesnackbar] = useEnqueueSnackbar();

    const handleCopy = useCallback(() => {
      enquesnackbar({ message: messageStore('ALIAS_COPIED_MESSAGE') });
    }, [enquesnackbar]);

    return handleCopy;
  },
};
