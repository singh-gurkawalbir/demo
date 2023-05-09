import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import { TextButton } from '@celigo/fuse-ui';
import ExportIcon from '../../../components/icons/ExportsIcon';
import DataLoaderIcon from '../../../components/icons/DataLoaderIcon';
import LookupIcon from '../../../components/icons/LookUpIcon';
import ListenerIcon from '../../../components/icons/ListenerIcon';
import ImportIcon from '../../../components/icons/ImportsIcon';
import TransferDownIcon from '../../../components/icons/TransferDownIcon';
import TransferUpIcon from '../../../components/icons/TransferUpIcon';

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
      fontSize: `${theme.spacing(6)} !important`,
    },
    '&:hover': {
      color: theme.palette.secondary.main,
      '& > * svg': {
        color: theme.palette.primary.main,
      },
    },
  },
  resourceIcon: {
    cursor: 'default',
    marginTop: theme.spacing(-1),
    '&:hover': {
      color: theme.palette.secondary.main,
      '& > * svg': {
        color: theme.palette.secondary.main,
      },
    },
  },
}));

export default function ResourceButton({ onClick, type, variant, disabled, className}) {
  const classes = resourceButtonStyles();
  const block = blockMap[variant];

  return (
    <TextButton
      data-test={block.label}
      onClick={onClick}
      className={clsx(classes.resourceButton, {[classes.resourceIcon]: type === 'icon'}, className)}
      vertical
      disableRipple={type === 'icon'}
      disabled={disabled}
      startIcon={<block.Icon />}>
      {block.label}
    </TextButton>
  );
}
