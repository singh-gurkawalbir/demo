import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import { Button, makeStyles, Typography } from '@material-ui/core';
import { selectors } from '../../../../reducers';
import SuiteScriptMapping from '..';
import DrawerContent from '../../../../components/drawer/Right/DrawerContent';

const useStyles = makeStyles(theme => ({
  text: {
    marginBottom: theme.spacing(2),
  },
  button: {
    textTransform: 'capitalize',
  },
}));

export default function MappingWrapper(props) {
  const classes = useStyles();
  const {ssLinkedConnectionId, integrationId, onClose} = props;
  const [selectedSubRecordMapping, setSelectedSubRecordMapping] = useState(null);
  const match = useRouteMatch();
  const flowId = props.flowId || match.params.flowId;

  const mappingList = useSelector(state =>
    selectors.getSuitescriptMappingSubRecordList(state,
      {
        integrationId,
        ssLinkedConnectionId,
        flowId,
      }));

  return (
    <>
      {mappingList && mappingList.length && !selectedSubRecordMapping
        ? (
          <DrawerContent>
            <div>
              <Typography className={classes.text} variant="h5">
                This import contains subrecord imports, select which import
                you would like to edit the mapping for.
              </Typography>
              {mappingList.map((sr, index) => (
                <div key={sr.id}>
                  <Button
                    data-test={`subrecordMapping-${index}`}
                    className={classes.button}
                    onClick={() => {
                      setSelectedSubRecordMapping(sr.id);
                    }}>
                    <Typography variant="h6" color="primary">
                      {sr.name}
                    </Typography>
                  </Button>
                </div>
              ))}
            </div>
          </DrawerContent>
        )
        : (
          <SuiteScriptMapping
            ssLinkedConnectionId={ssLinkedConnectionId}
            integrationId={integrationId}
            flowId={flowId}
            onClose={onClose}
            subRecordMappingId={
            selectedSubRecordMapping && selectedSubRecordMapping !== '__parent'
              ? selectedSubRecordMapping
              : ''
          }
         />
        )}
    </>
  );
}
