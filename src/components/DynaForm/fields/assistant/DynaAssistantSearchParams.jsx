import { useState, Fragment } from 'react';
import { Button, FormLabel } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { isEmpty } from 'lodash';
import ModalDialog from '../../../ModalDialog';
import DynaForm from '../../../DynaForm';
import DynaSubmit from '../../../DynaForm/DynaSubmit';
import {
  convertToReactFormFields,
  updateFormValues,
  PARAMETER_LOCATION,
} from '../../../../utils/assistant';
import ErroredMessageComponent from '../ErroredMessageComponent';
import useFormInitWithPermissions from '../../../../hooks/useFormInitWithPermissions';
import FieldHelp from '../../FieldHelp';

const useStyles = makeStyles(theme => ({
  dynaAssSearchParamsWrapper: {
    flexDirection: `row !important`,
    width: '100%',
    alignItems: 'center',
  },
  dynaAssistantbtn: {
    marginRight: theme.spacing(0.5),
  },
  dynaAssistantFormLabel: {
    marginBottom: 0,
    marginRight: 12,
    maxWidth: '50%',
    wordBreak: 'break-word',
  },
}));
const SearchParamsModal = props => {
  const {
    paramMeta,
    onClose,
    id,
    onFieldChange,
    value,
    flowId,
    resourceContext,
  } = props;
  const { fieldMap, layout, fieldDetailsMap } = convertToReactFormFields({
    paramMeta,
    value,
    flowId,
    resourceContext,
  });

  function onSaveClick(formValues) {
    const updatedValues = updateFormValues({
      formValues,
      fieldDetailsMap,
      paramLocation: paramMeta.paramLocation,
    });

    onFieldChange(id, updatedValues);
    onClose();
  }

  const formKey = useFormInitWithPermissions({
    fieldsMeta: {
      fieldMap,
      layout,
    },
  });

  return (
    <ModalDialog show onClose={onClose}>
      <Fragment>
        <span>Search parameters</span>
      </Fragment>
      <Fragment>
        <DynaForm
          formKey={formKey}
          fieldMeta={{
            fieldMap,
            layout,
          }}
        />
        <div>
          <DynaSubmit formKey={formKey} onClick={onSaveClick}>
            Save
          </DynaSubmit>
          <Button
            data-test="cancelSearchParams"
            onClick={onClose}
            variant="text"
            color="primary">
            Cancel
          </Button>
        </div>
      </Fragment>
    </ModalDialog>
  );
};

export default function DynaAssistantSearchParams(props) {
  const classes = useStyles();
  let { label } = props;
  const { value, onFieldChange, id, paramMeta = {}, required } = props;
  const [showSearchParamsModal, setShowSearchParamsModal] = useState(false);
  const isValid = !required ? true : !isEmpty(value);

  if (!label) {
    label =
      paramMeta.paramLocation === PARAMETER_LOCATION.BODY
        ? 'Configure body parameters'
        : 'Configure search parameters';
  }

  return (
    <Fragment>
      {showSearchParamsModal && (
        <SearchParamsModal
          {...props}
          id={id}
          paramMeta={paramMeta}
          value={value}
          onFieldChange={onFieldChange}
          onClose={() => {
            setShowSearchParamsModal(false);
          }}
        />
      )}
      <div className={classes.dynaAssSearchParamsWrapper}>
        <FormLabel className={classes.dynaAssistantFormLabel}>
          Search parameters:
        </FormLabel>

        <Button
          data-test={id}
          variant="outlined"
          color="secondary"
          className={classes.dynaAssistantbtn}
          onClick={() => setShowSearchParamsModal(true)}>
          {label} {required && !isValid ? '*' : ''}
        </Button>
        {/* {Todo (shiva): we need helpText for the component} */}
        <FieldHelp {...props} helpText={label} />
      </div>
      <ErroredMessageComponent
        isValid={isValid}
        description=""
        errorMessages="Please enter required parameters"
      />
    </Fragment>
  );
}
