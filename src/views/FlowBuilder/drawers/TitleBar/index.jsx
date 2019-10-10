import { Typography, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  titleBar: {
    display: 'flex',
    marginBottom: theme.spacing(3),
    '& > :not(:last-child)': {
      marginRight: theme.spacing(2),
    },
  },
  title: {
    flexGrow: 1,
  },
}));

export default function TitleBar({
  title,
  submitLabel = 'Save',
  onSubmit,
  history,
}) {
  const handleClose = () => history.goBack();
  const classes = useStyles();

  return (
    <div className={classes.titleBar}>
      <Typography variant="h5" className={classes.title}>
        {title}
      </Typography>
      <Button onClick={handleClose} variant="text" color="secondary">
        Cancel
      </Button>
      <Button onClick={onSubmit} variant="contained" color="primary">
        {submitLabel}
      </Button>
    </div>
  );
}
