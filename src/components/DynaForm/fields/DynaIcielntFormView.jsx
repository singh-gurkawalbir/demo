import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import { TextToggle } from '@celigo/fuse-ui';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import useFormContext from '../../Form/FormContext';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';
import { emptyObject } from '../../../constants';
import getResourceFormAssets from '../../../forms/formFactory/getResourceFromAssets';
import { defaultPatchSetConverter, sanitizePatchSet } from '../../../forms/formFactory/utils';

const useStyles = makeStyles(theme => ({
  helpTextButton: {
    padding: 0,
  },
  connectorTextToggle: {
    flexGrow: 100,
    marginLeft: theme.spacing(-1),
  },
}));
const emptyObj = {};
export default function DynaIclientFormView(props) {
  const classes = useStyles();
  const { resourceType, resourceId, defaultValue, formKey, sourceForm} = props;

  const formContext = useFormContext(formKey);
  const dispatch = useDispatch();
  const { merged } =
    useSelectorMemo(
      selectors.makeResourceDataSelector,
      resourceType,
      resourceId
    ) || {};
  const stagedResource = merged || emptyObject;

  const value = useMemo(() => (stagedResource?.formType === 'assistant' || stagedResource?.formType === undefined) ? defaultValue : 'true', [stagedResource, defaultValue]);

  const resourceFormState = useSelector(
    state =>
      selectors.resourceFormState(state, resourceType, resourceId) || emptyObj
  );
  const accountOwner = useSelector(() => selectors.accountOwner(), shallowEqual);

  const options = useMemo(() => [
    { label: 'Simple', value: 'false' },
    { label: 'HTTP', value: 'true' },
  ], []);

  const onFieldChangeFn = useCallback((event, selectedApplication) => {
    console.log(selectedApplication);
    // selecting the other option
    const {id} = props;
    const stagedRes = Object.keys(stagedResource).reduce((acc, curr) => {
      acc[`/${curr}`] = stagedResource[curr];

      return acc;
    }, {});

    // use this function to get the corresponding preSave function for this current form
    const { preSave } = getResourceFormAssets({
      resourceType,
      resource: stagedResource,
      isNew: false,
      accountOwner,
    });
    const finalValues = preSave(formContext.value, stagedRes);
    const newFinalValues = {...finalValues};

    if (selectedApplication !== 'true') {
      stagedRes['/formType'] = 'assistant';
      newFinalValues['/formType'] = 'assistant';
    } else {
      // set http.formType prop to http;
      stagedRes['/formType'] = 'http';
      newFinalValues['/formType'] = 'http';
    }
    const allPatches = sanitizePatchSet({
      patchSet: defaultPatchSetConverter({ ...stagedRes, ...newFinalValues }),
      fieldMeta: resourceFormState.fieldMeta,
      resource: {},
    });

    dispatch(actions.resource.clearStaged(resourceId));
    dispatch(
      actions.resource.patchStaged(resourceId, allPatches)
    );

    let allTouchedFields = formContext.fields ? Object.values(formContext.fields)
      .filter(field => !!field.touched)
      .map(field => ({ id: field.id, value: field.value })) : [];

    // When we initialize we always have the selected form view field touched
    allTouchedFields = [
      ...allTouchedFields,
      { id, value: selectedApplication },
    ];
    dispatch(
      actions.resourceForm.init(
        resourceType,
        resourceId,
        false,
        false,
        '',
        allTouchedFields
      )
    );
  }, [accountOwner, dispatch, formContext.fields, formContext.value, props, resourceFormState.fieldMeta, resourceId, resourceType, stagedResource]);

  if (!sourceForm) {
    return null;
  }

  return (
    <div className={classes.connectorTextToggle}>
      <TextToggle
        value={value}
        onChange={onFieldChangeFn}
        options={options}
        sx={{
          minWidth: 'auto',
          paddingLeft: 2.5,
          paddingRight: 2.5,
        }}
      />
    </div>
  );
}
