import { makeStyles } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';
import { MODEL_PLURAL_TO_LABEL, getApiUrl } from '../../../utils/resource';

const useStyles = makeStyles(theme => ({
  text: {
    padding: theme.spacing(1, 0),
  },
}));

export default function DynaApiIdentifier(props) {
  const { value, id, resourceType } = props;
  const classes = useStyles();
  const apiUrl = getApiUrl();

  return (
    <Typography data-test={id} variant="body1" className={classes.text}>
      Invoke this {MODEL_PLURAL_TO_LABEL[resourceType]} via [POST] to:
      {` ${apiUrl}/${value}`}
    </Typography>
  );
}
