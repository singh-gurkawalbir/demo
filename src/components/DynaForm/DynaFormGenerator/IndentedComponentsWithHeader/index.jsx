import React, { Fragment } from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import { useSelector } from 'react-redux';
import FormGenerator from '..';
import { selectors } from '../../../../reducers';
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
  },
  helpButton: {
    padding: 0,
    margin: 2,
  },
}));

export default function IndentedComponentsWithHeader(props) {
  const { containers, fieldMap, layout, formKey } = props;
  const { header, helpKey } = layout;
  const classes = useStyles();

  let show = useSelector(state => (selectors.showParser(state, formKey, 'csv') || selectors.showParser(state, formKey, 'xml')));

  if (!header) {
    show = false;
  }

  const transformedContainers = show ? (
    containers?.map((container, index) => {
      const {label, ...rest } = container;

      return (
        // eslint-disable-next-line react/no-array-index-key
        <Fragment key={index}>
          <Typography variant="body2" className={classes.indentTitle}>
            {header}
            <Help
              className={classes.helpButton}
              helpKey={helpKey}
                />
          </Typography>

          <div className={classes.indentFields}>
            {label && <Typography>{label}</Typography>}

            <FormGenerator {...props} layout={rest} fieldMap={fieldMap} />
          </div>
        </Fragment>
      );
    })) : null;

  return <div className={classes.fieldsContainer}>{transformedContainers}</div>;
}
