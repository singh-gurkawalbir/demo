import React, { Fragment } from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import FormGenerator from '..';


const useStyles = makeStyles(theme => ({
  indentFieldsTitle: {
    marginBottom: theme.spacing(2),
  },
  indentFields: {
    borderLeft: `3px solid ${theme.palette.secondary.lightest}`,
    paddingLeft: theme.spacing(1),
    marginBottom: theme.spacing(2),
    '& > div': {
      '& > div:last-child': {
        marginBottom: '0px !important'
      },
    }
  },
}));

export default function IndentedComponents(props) {
  const { containers, fieldMap} = props;
  const classes = useStyles();
  const transformedContainers =
    containers &&
    containers.map((container, index) => {
      const {label, ...rest } = container;


      return (
        // eslint-disable-next-line react/no-array-index-key
        <Fragment key={index}>
          {label && <Typography className={classes.indentFieldsTitle}>{label}</Typography>}
          <div className={classes.indentFields}>

            <FormGenerator {...props} layout={rest} fieldMap={fieldMap} />
          </div>
        </Fragment>
      );
    });

  return <div className={classes.fieldsContainer}>{transformedContainers}</div>;
}
