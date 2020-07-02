import React from 'react';
import Typography from '@material-ui/core/Typography';
import { FormContext } from 'react-forms-processor';
import FormGenerator from '..';
import { isAnyFieldVisibleForMeta } from '../../../../forms/utils';

function ColumnComponents(props) {
  const { containers, fieldMap, classes, formState } = props;
  const transformedContainers =
    containers &&
    containers.map((container, index) => {
      const { label: header, ...rest } = container;

      // If all the fields in this layout are not visible, no need to create a column for this
      if (
        formState.fields &&
        formState.fields.length &&
        !isAnyFieldVisibleForMeta({ layout: rest, fieldMap }, formState.fields)
      ) {
        return null;
      }

      return (
        // eslint-disable-next-line react/no-array-index-key
        <div key={index} className={classes.child}>
          {header && <Typography>{header}</Typography>}
          <FormGenerator {...props} layout={rest} fieldMap={fieldMap} />
        </div>
      );
    });

  return <div className={classes.container}>{transformedContainers}</div>;
}

export default function ColumnComponentsWithFormState(props) {
  return (
    <FormContext.Consumer>
      {form => <ColumnComponents {...props} formState={form} />}
    </FormContext.Consumer>
  );
}
