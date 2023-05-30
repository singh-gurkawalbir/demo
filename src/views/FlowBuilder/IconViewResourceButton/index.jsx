import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import { IconButton, Tooltip } from '@mui/material';
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
  newresourceButton: {
    marginRight: 0,
    padding: 0,
    minWidth: 'auto',
    '& >* svg': {
      fontSize: `${theme.spacing(3)}px !important`,
    },
    '&:hover': {
      color: theme.palette.secondary.main,
      '& > * svg': {
        color: theme.palette.primary.main,
      },
    },
    '& .MuiButton-startIcon': {
      marginBottom: theme.spacing(-1),
    },
  },
  subFlowResourceButton: {
    fontSize: 12,
    fontFamily: 'source sans pro',
    marginRight: theme.spacing(1),
    marginTop: theme.spacing(0.5),
    '& >* svg': {
      marginBottom: 0.5,
      fontSize: `${theme.spacing(4)}px !important`,
    },
    '&:hover': {
      color: theme.palette.secondary.main,
      '& > * svg': {
        color: theme.palette.primary.main,
      },
    },
  },
}));

export default function IconViewResourceButton({ title, showToolTip, onClick, variant, disabled, isSubFlow, className}) {
  const classes = resourceButtonStyles();
  const block = blockMap[variant];

  return (
    showToolTip ? (
      <Tooltip title={title || `Open ${block.label}`}>
        <IconButton
          data-test={block.label}
          onClick={onClick}
          className={clsx({[classes.newresourceButton]: !isSubFlow, [classes.subFlowResourceButton]: isSubFlow}, className)}
          vertical
          disabled={disabled}
          startIcon={<block.Icon />} />
      </Tooltip>
    )
      : (
        <TextButton
          data-test={block.label}
          onClick={onClick}
          className={clsx({[classes.newresourceButton]: !isSubFlow, [classes.subFlowResourceButton]: isSubFlow}, className)}
          vertical
          disabled={disabled}
          startIcon={<block.Icon />} />
      )
  );
}
