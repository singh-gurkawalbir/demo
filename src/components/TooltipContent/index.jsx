import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import Typography from '@mui/material/Typography';
import RawHtml from '../RawHtml';

const useStyles = makeStyles({
  root: {
    padding: '3px 10px',
    maxWidth: 350,
    maxHeight: 600,
    overflowY: 'auto',
    wordBreak: 'break-word',
    lineHeight: 'inherit',
  },
});

export default function TooltipContent({ children, className, escapeUnsecuredDomains }) {
  const classes = useStyles();

  return (
    <Typography
      className={clsx(classes.root, className)}
      component="div"
      variant="body2">
      {/<\/?[a-z][\s\S]*>/i.test(children) ? (
        <RawHtml isLoggable html={children} options={{allowedTags: ['a', 'b', 'br'], escapeUnsecuredDomains}} />
      ) : (
        children
      )}
    </Typography>
  );
}
