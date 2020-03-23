import Typography from '@material-ui/core/Typography';
import FormGenerator from '../';
import { isAnyFieldVisibleForMeta } from '../../../../forms/utils';
import useFormContext from '../../../Form/FormContext';

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
  const formState = useFormContext(props);

  return <ColumnComponents {...props} formState={formState} />;
}
