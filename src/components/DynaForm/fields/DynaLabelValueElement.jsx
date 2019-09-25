import { makeStyles } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  text: {
    padding: theme.spacing(1, 0),
  },
}));

export default function DynaLabelValueElement(props) {
  const { label, value, id } = props;
  const classes = useStyles(props);

  return (
    <Typography data-test={id} variant="body1" className={classes.text}>
      {label} {value}
    </Typography>
  );
}
