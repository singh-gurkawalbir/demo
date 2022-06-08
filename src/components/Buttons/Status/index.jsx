import React from 'react';
import clsx from 'clsx';
// eslint-disable-next-line import/no-extraneous-dependencies
import {makeStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import StatusCircle from '../../StatusCircle';
import TextButton from '../TextButton';

const useStyles = makeStyles(theme => ({
  statusTextContainer: {
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.secondary.main,
  },
  statusButtonContainer: {
    fontSize: '15px',
    justifyContent: 'flex-start',
    padding: theme.spacing(0, 0, 0, 0.5),
    '& > * .MuiButton-startIcon': {
      marginRight: 0,
    },
  },
}));

export default function Status({ children, className, size, variant, onClick, dataTest, style}) {
  const classes = useStyles();

  if (onClick) {
    return (
      <TextButton
        color="primary"
        className={clsx(classes.statusButtonContainer, className)}
        onClick={onClick}
        data-test={dataTest}
        style={style}
        startIcon={<StatusCircle variant={variant} size={size} />}
        >
        {children}
      </TextButton>
    );
  }

  return (
    <div className={clsx(classes.statusTextContainer, className)}>
      <StatusCircle variant={variant} size={size} />
      {children}
    </div>
  );
}

Status.propTypes = {
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(['mini', 'small', 'large']),
  error: PropTypes.bool,
  color: PropTypes.oneOf(['primary', 'secondary']),
  onClick: PropTypes.func,
};

Status.defaultProps = {
  color: 'primary',
  size: 'small',
};
