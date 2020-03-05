import { Typography, makeStyles } from '@material-ui/core';
import InfoIconButton from '../InfoIconButton';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'space-between',
  },
  infoIcon: {
    color: theme.palette.text.hint,
  },
}));

export default function PanelHeader({ title, children, infoText }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="h4">
        {title}
        {infoText && (
          <InfoIconButton info={infoText} className={classes.infoIcon} />
        )}
      </Typography>
      <div>{children}</div>
    </div>
  );
}
