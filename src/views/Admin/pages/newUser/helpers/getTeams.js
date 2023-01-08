export const getTeams = (classCollection) => {
  if (!classCollection) return [];

  const teams = [];

  for (let i = 0; i < classCollection.length; i++) {
    if (classCollection[i].id.startsWith('Team ')) {
      teams.push(classCollection[i].id);
    }
  }

  return teams;
};
