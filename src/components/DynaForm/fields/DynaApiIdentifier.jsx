import { makeStyles } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';
import { MODEL_PLURAL_TO_LABEL, getApiUrl } from '../../../utils/resource';
import FieldHelp from '../../../components/DynaForm/FieldHelp';

const useStyles = makeStyles(theme => ({
  text: {
    fontSize: theme.spacing(2),
    marginRight: theme.spacing(0.5),
  },
  dynaAPIWrapper: {
    flexDirection: `row !important`,
  },
}));

export default function DynaApiIdentifier(props) {
  const { value, id, resourceType } = props;
  const classes = useStyles();
  const apiUrl = getApiUrl();

  return (
    <div className={classes.dynaAPIWrapper}>
      <Typography data-test={id} className={classes.text}>
        Invoke this {MODEL_PLURAL_TO_LABEL[resourceType]} via [POST] to:
        {` ${apiUrl}/${value}`}
      </Typography>
      <FieldHelp {...props} />
    </div>
  );
}
