import { makeStyles } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';
import { getApiUrl } from '../../../utils/resource';
import FieldHelp from '../../../components/DynaForm/FieldHelp';

const useStyles = makeStyles(theme => ({
  text: {
    fontSize: theme.spacing(2),
    marginRight: theme.spacing(0.5),
  },
  dynaAPIWrapper: {
    flexDirection: `row !important`,
    alignItems: 'center',
  },
}));

export default function DynaApiIdentifier(props) {
  const { value, id } = props;
  const classes = useStyles();
  const apiUrl = getApiUrl();

  return (
    <div className={classes.dynaAPIWrapper}>
      <Typography data-test={id} className={classes.text}>
        Invoke :{` ${apiUrl}/${value}`}
      </Typography>
      <FieldHelp {...props} />
    </div>
  );
}
