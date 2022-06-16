import React, {useMemo, useCallback} from 'react';
import DynaSubmit from '../../../../components/DynaForm/DynaSubmit';
import useFormInitWithPermissions from '../../../../hooks/useFormInitWithPermissions';
import DynaForm from '../../../../components/DynaForm';

export default function Step3() {
  const fieldMeta = useMemo(
    () => ({
      fieldMap: {
        issuerURL: {
          id: 'mobileCode',
          name: 'mobileCode',
          type: 'text',
          required: true,
          noApi: true,
          isLoggable: false,
        },
      },
    }),
    []
  );

  const formKey = useFormInitWithPermissions({ fieldMeta });

  const verifyMobileCode = useCallback(values => {
    console.log(values);
  }, []);

  return (
    <>
      <div><b> Verify mobile device * </b></div>
      <DynaForm formKey={formKey} />
      <DynaSubmit variant="outlined" formKey={formKey} onClick={verifyMobileCode}>
        Verify
      </DynaSubmit>
    </>
  );
}
