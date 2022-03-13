import React, { useCallback} from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import useEnqueueSnackbar from '../../../../../hooks/enqueueSnackbar';
import TextButton from '../../../../Buttons/TextButton';
import CopyIcon from '../../../../icons/CopyIcon';

export default {
  key: 'copyAlias',
  useLabel: rowData => (
    <CopyToClipboard text={rowData.alias}>
      <TextButton
        data-test="copyToClipboard">
        Copy Alias
      </TextButton>
    </CopyToClipboard>
  ),
  icon: CopyIcon,
  useOnClick: () => {
    const [enquesnackbar] = useEnqueueSnackbar();

    const handleCopy = useCallback(() => {
      enquesnackbar({ message: 'Alias copied to clipboard.' });
    }, [enquesnackbar]);

    return handleCopy;
  },
};
