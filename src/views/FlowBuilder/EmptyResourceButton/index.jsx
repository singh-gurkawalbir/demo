import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { IconButton } from '@mui/material';
import ExportIcon from '../../../components/icons/ExportsIcon';
import DataLoaderIcon from '../../../components/icons/DataLoaderIcon';
import LookupIcon from '../../../components/icons/LookUpIcon';
import ListenerIcon from '../../../components/icons/ListenerIcon';
import ImportIcon from '../../../components/icons/ImportsIcon';
import TransferDownIcon from '../../../components/icons/TransferDownIcon';
import TransferUpIcon from '../../../components/icons/TransferUpIcon';

// TODO : Flowbuiler duplicate code
// Need to revisit different types of buttons being used and try to combine the logic

const blockMap = {
  newPG: { label: 'Add source', Icon: ExportIcon },
  newPP: { label: 'Add destination / lookup', Icon: ImportIcon },
  newImport: { label: 'Add destination', Icon: ImportIcon },
  export: { label: 'Export', Icon: ExportIcon },
  import: { label: 'Import', Icon: ImportIcon },
  lookup: { label: 'Lookup', Icon: LookupIcon },
  listener: { label: 'Listener', Icon: ListenerIcon },
  dataLoader: { label: 'Data loader', Icon: DataLoaderIcon },
  exportTransfer: { label: 'Transfer', Icon: TransferDownIcon },
  importTransfer: { label: 'Transfer', Icon: TransferUpIcon },
};
export const resourceButtonStyles = makeStyles(theme => ({
  resourceButton: {
    fontSize: 16,
    fontFamily: 'source sans pro',
    marginRight: theme.spacing(1),
    flexDirection: 'column',
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    '& >* svg': {
      marginBottom: 5,
      fontSize: `${theme.spacing(6)}px !important`,
    },
    '&:hover': {
      color: theme.palette.secondary.main,
      '& > * svg': {
        color: theme.palette.primary.main,
      },
    },
  },
}));

export default function ResourceButton({ variant, onClick}) {
  const classes = resourceButtonStyles();
  const block = blockMap[variant];

  return (
    <IconButton className={classes.resourceButton} onClick={onClick}>
      <block.Icon />
    </IconButton>
  );
}
