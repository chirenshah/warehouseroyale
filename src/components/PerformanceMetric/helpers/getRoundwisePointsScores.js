export const getRoundwisePointsScores = (classCollection, round) => {
  if (!classCollection || !round) return [];

  const res = [];

  for (let i = 0; i < classCollection.length; i++) {
    const currentTeam = classCollection[i];

    if (currentTeam.id.startsWith('Team ')) {
      const teamObj = {};

      teamObj.team = currentTeam.id;
      teamObj.score = currentTeam.Points[round - 1];

      res.push(teamObj);
    }
  }

  return res;
};
