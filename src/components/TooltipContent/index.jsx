import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import Typography from '@mui/material/Typography';
import RawHtml from '../RawHtml';

const useStyles = makeStyles({
  noPadding: {
    padding: 0,
  },
});

export default function TooltipContent({ children, className, escapeUnsecuredDomains, basicInfo }) {
  const classes = useStyles();

  return (
    <Typography
      className={clsx(classes.root, {[classes.noPadding]: basicInfo}, className)}
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
