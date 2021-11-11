import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ExportIcon from '../../../../components/icons/ExportsIcon';
import DataLoaderIcon from '../../../../components/icons/DataLoaderIcon';
import ListenerIcon from '../../../../components/icons/ListenerIcon';
import ImportIcon from '../../../../components/icons/ImportsIcon';
import TransferDownIcon from '../../../../components/icons/TransferDownIcon';
import TransferUpIcon from '../../../../components/icons/TransferUpIcon';
import { OutlinedButton } from '../../../../components/Buttons';

const blockMap = {
  export: { label: 'Export', Icon: ExportIcon },
  import: { label: 'Import', Icon: ImportIcon },
  listener: { label: 'Listener', Icon: ListenerIcon },
  dataLoader: { label: 'Data Loader', Icon: DataLoaderIcon },
  exportTransfer: { label: 'Transfer', Icon: TransferDownIcon },
  importTransfer: { label: 'Transfer', Icon: TransferUpIcon },
};
const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  blockButton: {
    padding: 0,
    marginRight: theme.spacing(2),
    textTransform: 'none',
    '&:hover': {
      backgroundColor: 'transparent',
      '& svg': {
        color: theme.palette.primary.main,
      },
    },
  },
  blockIcon: {
    width: 48,
    height: 48,
  },
}));

export default function ResourceButton({ onClick, variant = 'export', isFileTransfer }) {
  const classes = useStyles();
  const block = blockMap[isFileTransfer ? `${variant}Transfer` : variant];

  return (
    <OutlinedButton
      size="small"
      color="secondary"
      className={classes.blockButton}
      data-test={block.label}
      startIcon={<block.icon className={classes.blockIcon} />}
      onClick={onClick}>
      {block.label}
    </OutlinedButton>
  );
}
