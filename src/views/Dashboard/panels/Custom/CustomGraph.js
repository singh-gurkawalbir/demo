import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import DrawerContent from '../../../../components/drawer/Right/DrawerContent';
import AreaGraph from '../../../../components/Graphs/AreaGraph';
import BarGraph from '../../../../components/Graphs/BarGraph';
import PieGraph from '../../../../components/Graphs/PieGraph';
import { fieldMeta } from './MetaData/metadata2';
import useFormInitWithPermissions from '../../../../hooks/useFormInitWithPermissions';
import DynaForm from '../../../../components/DynaForm';
import { selectors } from '../../../../reducers';

// const useStyles = makeStyles(theme => ({
//   root: {
//     maxHeight: `calc(100vh - (${theme.appBarHeight}px + ${theme.pageBarHeight}px))`,
//     overflowY: 'auto',
//   },
//   formHead: {
//     borderBottom: 'solid 1px',
//     borderColor: theme.palette.secondary.lightest,
//     marginBottom: 29,
//   },
//   formContainer: {
//     padding: theme.spacing(3),
//     paddingTop: props =>
//       props.notificationPanelHeight ? 0 : theme.spacing(3),
//     borderColor: 'rgb(0,0,0,0.1)',
//     borderStyle: 'solid',
//     borderWidth: '1px 0 0 0',
//     overflowY: 'auto',
//   },
//   innerContent: {
//     width: '100%',
//     padding: theme.spacing(3),
//   },
//   paperDefault: {
//     border: '1px solid',
//     borderColor: theme.palette.secondary.lightest,
//     padding: theme.spacing(2),
//     marginBottom: theme.spacing(3),
//   },
//   currentContainer: {
//     fontSize: 13,
//     color: theme.palette.secondary.main,
//     fontFamily: 'source sans pro',
//     padding: 0,
//     paddingRight: theme.spacing(1),
//     marginRight: theme.spacing(-1),
//     '& svg': {
//       marginLeft: theme.spacing(0.5),
//     },
//     '&:hover': {
//       background: 'none',
//       color: theme.palette.text.secondary,
//       '& svg': {
//         color: theme.palette.text.secondary,
//       },
//     },
//   },
//   editableFields: {
//     textAlign: 'center',
//     width: '100%',
//     maxWidth: 500,
//     marginBottom: 112,
//     [theme.breakpoints.down('sm')]: {
//       maxWidth: '100%',
//     },
//   },
// }));

export default function CustomGraph({ finalData }) {
  const formKey = 'customGraphContent';

  const formValues = useSelector(
    state => selectors.formValueTrimmed(state, formKey),
    shallowEqual
  );
  const result = { ...formValues };
  const GraphType = result.Type;

  // console.log(GraphType);

  const handleBarClick = () => {
    // console.log('Area');
  };

  useFormInitWithPermissions({ formKey, fieldMeta });

  const color = [
    '#34AAE6',
    '#A4B9C9',
    '#7D3C98',
    '#2E86C1',
    '#138D75',
    '#28B463',
  ];

  return (
    <>
      <DrawerContent>
        <div>
          <DynaForm formKey={formKey} />

          <div>
            {GraphType === 'Area' && (
              <AreaGraph
                data={finalData}
                color={color}
                onChange={handleBarClick}
              />
            )}
            {GraphType === 'Bar' && (
              <BarGraph
                data={finalData}
                color={color}
                onChange={handleBarClick}
              />
            )}
            {GraphType === 'Pie' && (
              <PieGraph
                data={finalData}
                color={color}
                onChange={handleBarClick}
              />
            )}
          </div>
        </div>
      </DrawerContent>
      ;
    </>
  );
}
