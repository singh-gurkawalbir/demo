import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Button } from '@material-ui/core';
import ExportIcon from '../../../../components/icons/ExportsIcon';
import DataLoaderIcon from '../../../../components/icons/DataLoaderIcon';
import ListenerIcon from '../../../../components/icons/ListenerIcon';
import ImportIcon from '../../../../components/icons/ImportsIcon';

const blockMap = {
  export: { label: 'Export', Icon: ExportIcon },
  import: { label: 'Import', Icon: ImportIcon },
  listener: { label: 'Listener', Icon: ListenerIcon },
  dataLoader: { label: 'Data loader', Icon: DataLoaderIcon },
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

export default function ResourceButton({ onClick, variant }) {
  const classes = useStyles();
  const block = blockMap[variant || 'export'];

  return (
    <Button
      size="small"
      className={classes.blockButton}
      data-test={block.label}
      onClick={onClick}>
      <div>
        <block.Icon className={classes.blockIcon} />
        <Typography variant="body2">{block.label}</Typography>
      </div>
    </Button>
  );
}
