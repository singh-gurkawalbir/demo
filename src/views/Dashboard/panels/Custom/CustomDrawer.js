/* eslint-disable no-restricted-syntax */
import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import ReactResizeDetector from 'react-resize-detector';
import { useHistory } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { FormControl } from '@mui/material';
import { selectors } from '../../../../reducers';
import { useSelectorMemo } from '../../../../hooks';
import DrawerHeader from '../../../../components/drawer/Right/DrawerHeader';
import DrawerContent from '../../../../components/drawer/Right/DrawerContent';
import DrawerFooter from '../../../../components/drawer/Right/DrawerFooter';

import RightDrawer from '../../../../components/drawer/Right';
import DynaForm from '../../../../components/DynaForm';
import { additionalFilter } from '../../../ResourceList/util';
import SaveAndCloseButtonGroupForm from '../../../../components/SaveAndCloseButtonGroup/SaveAndCloseButtonGroupForm';
import CustomGraph from './CustomGraph';
import { fieldMeta } from './MetaData/metadata';
import { itemData } from './images/image';
import useFormInitWithPermissions from '../../../../hooks/useFormInitWithPermissions';

const useStyles = makeStyles(theme => ({
  root: {
    maxHeight: `calc(100vh - (${theme.appBarHeight}px + ${theme.pageBarHeight}px))`,
    overflowY: 'auto',
  },
  formHead: {
    borderBottom: 'solid 1px',
    borderColor: theme.palette.secondary.lightest,
    marginBottom: 29,
  },
  formContainer: {
    padding: theme.spacing(3),
    // paddingTop: props =>
    //   props.notificationPanelHeight ? 0 : theme.spacing(3),
    borderColor: 'rgb(0,0,0,0.1)',
    borderStyle: 'solid',
    borderWidth: '1px 0 0 0',
    overflowY: 'auto',
  },
  innerContent: {
    width: '100%',
    padding: theme.spacing(3),
  },
  paperDefault: {
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    padding: theme.spacing(2),
    marginBottom: theme.spacing(3),
  },
  currentContainer: {
    fontSize: 13,
    color: theme.palette.secondary.main,
    fontFamily: 'source sans pro',
    padding: 0,
    paddingRight: theme.spacing(1),
    marginRight: theme.spacing(-1),
    '& svg': {
      marginLeft: theme.spacing(0.5),
    },
    '&:hover': {
      background: 'none',
      color: theme.palette.text.secondary,
      '& svg': {
        color: theme.palette.text.secondary,
      },
    },
  },
  editableFields: {
    textAlign: 'center',
    width: '100%',
    maxWidth: 500,
    marginBottom: 112,
    [theme.breakpoints.down('sm')]: {
      maxWidth: '100%',
    },
  },
}));

function CustomDrawerContent() {
  const formKey = 'customDashboardContent';

  const history = useHistory();

  const [notificationPanelHeight, setNotificationPanelHeight] = useState(0);
  const classes = useStyles({
    notificationPanelHeight,
  });
  const resize = (width, height) => {
    setNotificationPanelHeight(height);
  };
  const handleClose = history.goBack;

  const formValues = useSelector(
    state => selectors.formValueTrimmed(state, formKey),
    shallowEqual
  );

  const [sign, setSign] = useState('initial');

  const result = { ...formValues };
  const resourceType = result.Type;

  const filter = useSelector(state => selectors.filter(state, resourceType));
  const filterConfig = useMemo(
    () => ({
      type: resourceType,
      filter: additionalFilter(resourceType),
      ...(filter || {}),
    }),
    [filter, resourceType]
  );
  const list = useSelectorMemo(
    selectors.makeResourceListSelector,
    filterConfig
  );

  const transformData1 = data => {
    const dates = {};

    for (const obj in data) {
      if (Object.prototype.hasOwnProperty.call(data, obj)) {
        const created = data[obj].createdAt.slice(0, 7);
        const modified = data[obj].lastModified.slice(0, 7);

        if (created in dates) {
          dates[created].create += 1;
        } else {
          dates[created] = { create: 1, modify: 0 };
        }
        if (modified in dates) {
          dates[modified].modify += 1;
        } else {
          dates[modified] = { create: 0, modify: 1 };
        }
      }
    }
    const values = [];

    Object.keys(dates).forEach(key =>
      values.push({
        label: key,
        createdAt: dates[key].create,
        modifiedAt: dates[key].modify,
      })
    );

    return {
      ids: {
        XAxis: 'label',
        YAxis: '',
        Plots: ['createdAt', 'modifiedAt'],
        MaximumYaxis: '',
      },
      values,
    };
  };

  const finalData = transformData1(list.resources);

  // console.log(finalData.values.length);
  useEffect(() => {
    if (finalData.values.length > 0) {
      setSign('next');
    } else {
      setSign('initial');
    }
  }, [finalData]);

  useFormInitWithPermissions({ formKey, fieldMeta });

  return (
    <>
      <DrawerHeader title="Graph Reports" handleClose={handleClose} />
      <div>
        {(() => {
          switch (sign) {
            case 'initial':
              return (
                <>
                  <DrawerContent>
                    <div className={classes.root}>
                      <ReactResizeDetector handleHeight onResize={resize} />
                      <div>
                        <FormControl className={classes.editableFields}>
                          <DynaForm formKey={formKey} />

                          <div className={classes.currentContainer} />
                        </FormControl>
                      </div>

                      <div>What type of Graph would you like to render?</div>
                      <ImageList
                        sx={{ width: 500, height: 450 }}
                        cols={3}
                        rowHeight={112}
                      >
                        {itemData.map(item => (
                          <ImageListItem key={item.img}>
                            <img
                              src={item.img}
                              alt={item.title}
                              loading="lazy"
                            />
                          </ImageListItem>
                        ))}
                      </ImageList>
                    </div>
                  </DrawerContent>
                </>
              );
            case 'next':
              return <CustomGraph finalData={finalData} />;
            default:
              return null;
          }
        })()}
      </div>

      <DrawerFooter>
        <SaveAndCloseButtonGroupForm onClose={handleClose} formKey={formKey} />
      </DrawerFooter>
    </>
  );
}

export default function Drawer({ integrationId }) {
  return (
    <RightDrawer path="dashboard" height="tall" width="default">
      <CustomDrawerContent integrationId={integrationId} />
    </RightDrawer>
  );
}
