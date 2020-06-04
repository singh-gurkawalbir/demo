import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Typography from '@material-ui/core/Typography';
import RawHtml from '../RawHtml';

const useStyles = makeStyles({
  root: {
    padding: '3px 10px',
    width: 350,
    maxHeight: 600,
    overflowY: 'auto',
    wordBreak: 'break-word',
    lineHeight: 'inherit',
  },
});

function TooltipContent({ children, className }) {
  const classes = useStyles();

  return (
    <Typography
      className={clsx(classes.root, className)}
      component="div"
      variant="body2">
      {/<\/?[a-z][\s\S]*>/i.test(children) ? (
        <RawHtml html={children} />
      ) : (
        children
      )}
    </Typography>
  );
}

export default TooltipContent;
