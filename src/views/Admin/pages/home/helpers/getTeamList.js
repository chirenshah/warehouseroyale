export const getTeamList = (classCollection) => {
  const result = [];

  if (!classCollection) return result;

  for (let i = 0; i < classCollection.length; i++) {
    if (classCollection[i].id.startsWith('Team ')) {
      result.push(classCollection[i].id);
    }
  }

  return result;
};
