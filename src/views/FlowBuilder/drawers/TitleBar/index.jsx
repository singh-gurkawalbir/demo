import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  titleBar: {
    background: theme.palette.background.paper,
    display: 'flex',
    padding: '14px 24px',
    '& > :not(:last-child)': {
      marginRight: theme.spacing(2),
    },
  },
  title: {
    flexGrow: 1,
  },
}));

export default function TitleBar({ title }) {
  const classes = useStyles();

  return (
    <div className={classes.titleBar}>
      <Typography variant="h3" className={classes.title}>
        {title}
      </Typography>
    </div>
  );
}
