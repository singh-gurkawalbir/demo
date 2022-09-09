export const getPaginationLabel = (page, rowsPerPage, count, hasMore) => {
  const start = page * rowsPerPage + 1;
  const end = (page + 1) * rowsPerPage;
  const total = `${count}${hasMore ? '+' : ''}`;

  return `${start} - ${end < count ? end : count} of ${total}`;
};

export const isDisableNext = (page, rowsPerPage, count, hasMore) => {
  const end = (page + 1) * rowsPerPage;

  return (end >= count && !hasMore);
};
