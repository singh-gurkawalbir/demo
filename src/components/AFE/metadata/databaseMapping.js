import sql from './sql';

export default {
  type: 'sql',
  label: 'SQL query builder',
  description: 'Use a handlebar template to construct SQL queries',
  panels: sql.panels,
  drawer: sql.drawer,
};
