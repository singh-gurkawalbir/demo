import { makeStyles } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';
import { MODEL_PLURAL_TO_LABEL, getApiUrl } from '../../../utils/resource';
import FieldHelp from '../../../components/DynaForm/FieldHelp';

const useStyles = makeStyles(theme => ({
  text: {
    padding: theme.spacing(1, 0),
    fontSize: theme.spacing(2),
  },
}));

export default function DynaApiIdentifier(props) {
  const { value, id, resourceType } = props;
  const classes = useStyles();
  const apiUrl = getApiUrl();

  return (
    <Typography data-test={id} className={classes.text}>
      Invoke this {MODEL_PLURAL_TO_LABEL[resourceType]} via [POST] to:
      {` ${apiUrl}/${value}`}
      <FieldHelp {...props} />
    </Typography>
  );
}
