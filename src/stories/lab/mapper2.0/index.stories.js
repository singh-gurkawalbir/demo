import React from 'react';
import { makeStyles } from '@material-ui/core';
import DemoTree from './Prototype';
import withRouter from '../globalSearch/withRouter';

export default {
  title: 'Lab/Mapper 2.0',
  component: DemoTree,
  decorators: [withRouter],
};

const useStyles = makeStyles({
  container: {
    height: '80vh',
    minHeight: '300px',
    overflow: 'scroll',
  },
});

const Template = args => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <DemoTree
        height="100%"
        {...args} />
    </div>
  );
};

export const Example = Template.bind({});

Example.args = {
  importDoc: {
    _id: '123',
    name: 'FTP Import',
    mappings: {
      type: [
        {
          generate: 'new-object',
          dataType: 'object',
          mappings: [{
            generate: 'fname',
            dataType: 'object',
            mappings: [{
              generate: 'age',
              dataType: 'string',
              extract: '$.age',
            }],
          },
          {
            generate: 'lname',
            dataType: 'string',
            extract: '$.lastname',
          }],
        },
        {
          generate: 'new-id',
          dataType: 'string',
          extract: '$.id',
          hardCodedValue: '123',
        },
        {
          generate: 'school',
          dataType: 'object',
          mappings: [{
            generate: 'name',
            dataType: 'string',
            extract: '$.name',
          },
          {
            generate: 'age',
            dataType: 'string',
            extract: '$.age',
          }],
        },
        {
          generate: 'new-stringarray',
          dataType: 'stringarray',
          buildArrayHelper: [{
            extract: '$.fName',
          // mappings: [], not applicable for stringarray
          },
          {
            extract: '$.lName',
          // mappings: [], not applicable for stringarray
          }],
        },
        {
          generate: 'new-objectarray',
          dataType: 'objectarray',
          buildArrayHelper: [{
            extract: '$.children',
          },
          {
            mappings: [{
              generate: 'name',
              dataType: 'string',
              extract: '$.name',
            },
            {
              generate: 'age',
              dataType: 'string',
              extract: '$.age',
            }],
          },
          {
            extract: '$.siblings[*]',
            mappings: [{
              generate: 'first-name',
              dataType: 'string',
              extract: '$.siblings.firstname',
            },
            {
              generate: 'last-name',
              dataType: 'string',
              extract: '$.siblings.lastname',
            }],
          },
          {
            extract: '$.grandchildren[*]',
            mappings: [{
              generate: 'college',
              dataType: 'string',
              extract: '$.grandchildren.college',
            }],
          }],
        }],
    },
    mapping: {}, // for 1.0
  },
};
