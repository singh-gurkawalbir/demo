import { makeStyles } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';
import { MODEL_PLURAL_TO_LABEL } from '../../../utils/resource';

const useStyles = makeStyles(theme => ({
  text: {
    padding: theme.spacing(1, 0),
  },
}));

export default function DynaApiIdentifier(props) {
  const { value, resourceType } = props;
  const classes = useStyles();

  return (
    <Typography variant="body1" className={classes.text}>
      Invoke this {MODEL_PLURAL_TO_LABEL[resourceType]} via [POST] to:
      https://api.staging.integrator.io/
      {value}
    </Typography>
  );
}
