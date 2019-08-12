import { withStyles } from '@material-ui/core/styles';
import { FieldWrapper } from 'react-forms-processor/dist';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  textField: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    display: 'inline-block',
    fontSize: theme.typography.fontSize * 1.5,
  },
});

function ApiIdentifier(props) {
  const { classes, label, value } = props;

  return (
    <Typography className={classes.textField}>
      {label}: {value}
    </Typography>
  );
}

const ComponentWithStyles = withStyles(styles)(ApiIdentifier);
const DynaApiIdentifier = props => (
  <FieldWrapper {...props}>
    <ComponentWithStyles />
  </FieldWrapper>
);

export default DynaApiIdentifier;
