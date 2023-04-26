import React, { Fragment } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useSelectorMemo } from '../../../../hooks';
import { selectors } from '../../../../reducers';
import FormGenerator from '..';
import Help from '../../../Help';

const emptyObj = {};

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
}));

export default function IndentedComponents(props) {
  const { containers, fieldMap, layout, formKey, resourceType, resourceId} = props;
  const classes = useStyles();
  const resource = useSelectorMemo(selectors.makeResourceDataSelector, resourceType, resourceId)?.merged || emptyObj;
  const connection = useSelectorMemo(selectors.makeResourceDataSelector, 'connections', resource._connectionId)?.merged || emptyObj;
  const formValues = useSelector(state => selectors.formValueTrimmed(state, formKey), shallowEqual);
  const isAnyIndentedComponentsFieldVisible = useSelector(state =>
    selectors.isAnyFieldVisibleForMetaForm(state, formKey, {
      layout,
      fieldMap,
    })
  );

  if (!isAnyIndentedComponentsFieldVisible) return null;

  const transformedContainers =
    containers?.map((container, index) => {
      const {label, header, helpKey, ...rest } = container;
      const heading = typeof header === 'function' ? header(resource, connection, formValues) : header;

      return (
        // eslint-disable-next-line react/no-array-index-key
        <Fragment key={index}>
          {heading && (
            <Typography variant="body2" className={classes.indentTitle}>
              {heading}
              <Help
                title={heading}
                helpKey={helpKey}
                sx={{margin: 0.5}}
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
