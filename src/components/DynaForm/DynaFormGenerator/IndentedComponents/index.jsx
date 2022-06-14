import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles, Typography } from '@material-ui/core';
import { selectors } from '../../../../reducers';
import FormGenerator from '..';
import Help from '../../../Help';

const useStyles = makeStyles(theme => ({
  indentFields: {
    borderLeft: `3px solid ${theme.palette.secondary.lightest}`,
    paddingLeft: theme.spacing(1),
    marginBottom: theme.spacing(2),
    '& > div': {
      '& > div:last-child': {
        marginBottom: '0px !important',
      },
    },
  },
  indentTitle: {
    marginBottom: theme.spacing(2),
    fontSize: '15px',
  },
  helpButton: {
    padding: 0,
    margin: 2,
    '&:hover': {
      background: 'none',
    },
  },
}));

export default function IndentedComponents(props) {
  const { containers, fieldMap, formKey} = props;
  const classes = useStyles();
  let isParserSupportedForHTTP = false;

  isParserSupportedForHTTP = useSelector(state => (selectors.isParserSupportedForHTTP(state, formKey, 'csv') || selectors.isParserSupportedForHTTP(state, formKey, 'xml')));
  const transformedContainers =
    containers?.map((container, index) => {
      const {label, header, helpKey, headerDependencies, ...rest } = container;

      return (
        // eslint-disable-next-line react/no-array-index-key
        <Fragment key={index}>
          {isParserSupportedForHTTP && (
            <Typography variant="body2" className={classes.indentTitle}>
              {header}
              <Help
                className={classes.helpButton}
                helpKey={helpKey}
              />
            </Typography >
          )}
          <div className={classes.indentFields}>
            {label && <Typography>{label}</Typography>}

            <FormGenerator {...props} layout={rest} fieldMap={fieldMap} />
          </div>
        </Fragment>
      );
    });

  return <div className={classes.fieldsContainer}>{transformedContainers}</div>;
}
