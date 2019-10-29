import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Button } from '@material-ui/core';
import ExportIcon from '../../../components/icons/ExportsIcon';
import LookupIcon from '../../../components/icons/LookUpIcon';
import ListenerIcon from '../../../components/icons/ListenerIcon';
import ImportIcon from '../../../components/icons/ImportsIcon';

const blockMap = {
  newPG: { label: 'Add source', Icon: ExportIcon },
  newPP: { label: 'Add destination / lookup', Icon: ImportIcon },
  export: { label: 'Export', Icon: ExportIcon },
  import: { label: 'Import', Icon: ImportIcon },
  lookup: { label: 'Lookup', Icon: LookupIcon },
  listener: { label: 'Listener', Icon: ListenerIcon },
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
  const block = blockMap[variant];

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
