export const getTeamsChartData = (classCollection, type) => {
  const result = [];

  if (!classCollection) return result;

  const rounds = classCollection.map((item) => item[type]).filter((x) => x);
  const teamNames = classCollection
    .map((item) => item.id)
    .filter((x) => x.startsWith('Team '));

  for (let i = 0; i < rounds[0].length; i++) {
    const round = {
      round: `Round ${i + 1}`,
      scores: [],
    };

    for (let j = 0; j < teamNames.length; j++) {
      round.scores.push(rounds[j][i]);
    }

    result.push(round);
  }

  return result;
};
