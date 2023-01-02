export const getCurrentTime = () => {
  const nowIsoString = new Date(Date.now()).toISOString();

  // This format supports MUI's TextField- type: datetime-local
  return nowIsoString.substring(0, nowIsoString.indexOf('.'));
};
