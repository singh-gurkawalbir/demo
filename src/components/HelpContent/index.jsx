import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  wrapper: {
    padding: theme.spacing(1.5),
    minWidth: '319px',
    maxWidth: '319px',
    borderRadius: theme.spacing(0.5),
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    wordBreak: 'break-word',
  },
  content: {
    overflowY: 'auto',
    lineHeight: '22px',
    whiteSpace: 'normal',
    wordBreak: 'break-word',
    marginRight: -theme.spacing(1.5),
    padding: theme.spacing(1, 1.5, 0, 0),
    maxHeight: 200,
    '&.MuiTypography-root': {
      '& ul': {
        paddingLeft: theme.spacing(2),
        margin: 0,
      },
    },
    '& > div > pre': {
      background: theme.palette.background.paper2,
      border: '1px solid',
      borderColor: theme.palette.secondary.lightest,
      overflowX: 'auto',
    },
  },

  titleWrapper: {
    display: 'flex',
    alignItems: 'center',
    paddingBottom: theme.spacing(1),
    borderBottom: `1px solid ${theme.palette.secondary.lightest}`,
    justifyContent: 'space-between',
  },
}));

export default function HelpContent({ title, children, ...rest }) {
  const classes = useStyles();

  return (
    <div className={classes.wrapper}>
      <div className={classes.titleWrapper}>
        {title && (
        <Typography className={classes.title} variant="h6">
          {title}
        </Typography>
        )}
      </div>
      <Typography variant="subtitle2" component="div" className={classes.content} {...rest}>{children}</Typography>
    </div>
  );
}
