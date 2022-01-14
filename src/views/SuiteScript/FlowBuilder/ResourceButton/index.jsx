import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ExportIcon from '../../../../components/icons/ExportsIcon';
import DataLoaderIcon from '../../../../components/icons/DataLoaderIcon';
import ListenerIcon from '../../../../components/icons/ListenerIcon';
import ImportIcon from '../../../../components/icons/ImportsIcon';
import TransferDownIcon from '../../../../components/icons/TransferDownIcon';
import TransferUpIcon from '../../../../components/icons/TransferUpIcon';
import { TextButton } from '../../../../components/Buttons';

const blockMap = {
  export: { label: 'Export', Icon: ExportIcon },
  import: { label: 'Import', Icon: ImportIcon },
  listener: { label: 'Listener', Icon: ListenerIcon },
  dataLoader: { label: 'Data Loader', Icon: DataLoaderIcon },
  exportTransfer: { label: 'Transfer', Icon: TransferDownIcon },
  importTransfer: { label: 'Transfer', Icon: TransferUpIcon },
};
const useStyles = makeStyles(theme => ({
  resourceButton: {
    marginRight: theme.spacing(1),
    '& >* svg': {
      fontSize: `${theme.spacing(6)}px !important`,
    },
  },
}));

export default function ResourceButton({ onClick, variant = 'export', isFileTransfer }) {
  const classes = useStyles();
  const block = blockMap[isFileTransfer ? `${variant}Transfer` : variant];

  return (
    <TextButton
      isVertical
      className={classes.resourceButton}
      data-test={block.label}
      startIcon={<block.Icon />}
      onClick={onClick}>
      {block.label}
    </TextButton>
  );
}
