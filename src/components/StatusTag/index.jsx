import { makeStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(0.5, 1),
    fontSize: 12,
    background: props =>
      props.backgroundcolor
        ? props.backgroundcolor
        : theme.palette.secondary.lightest,
    borderRadius: 4,
    display: 'inline-block',
    border: '1px solid',
    borderColor: props =>
      props.backgroundColor
        ? props.backgroundcolor
        : theme.palette.secondary.lightest,
    color: props =>
      props.backgroundcolor
        ? theme.palette.getContrastText(props.backgroundcolor)
        : theme.palette.getContrastText(theme.palette.secondary.lightest),
  },
}));

function StatusTag(props) {
  const { variant, className, color, ...other } = props;
  const classes = useStyles(props);

  return (
    <div className={clsx(classes.root, className)} {...other}>
      {variant}
    </div>
  );
}

StatusTag.propTypes = {
  variant: PropTypes.string,
  backgroundcolor: PropTypes.string,
};

export default StatusTag;
