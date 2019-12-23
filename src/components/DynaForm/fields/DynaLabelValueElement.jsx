import { makeStyles } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';
import RawHtml from '../../RawHtml';

const useStyles = makeStyles(theme => ({
  text: {
    padding: theme.spacing(1, 0),
  },
  label: {
    paddingRight: theme.spacing(1),
    color: theme.palette.text.secondary,
  },
}));

export default function DynaLabelValueElement(props) {
  const { label, value, id } = props;
  const classes = useStyles(props);

  return (
    <Typography data-test={id} variant="body1" className={classes.text}>
      {/* sanitize html value */}
      <span className={classes.label}>{label}</span>
      {/<\/?[a-z][\s\S]*>/i.test(value) ? <RawHtml html={value} /> : value}
    </Typography>
  );
}
