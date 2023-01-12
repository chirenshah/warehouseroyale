export const getMyTeamChartData = (teamDocument, type) => {
  const result = [];

  if (!teamDocument) return result;

  const rounds = teamDocument[type];

  if (!rounds) return result;

  for (let i = 0; i < rounds.length; i++) {
    result.push({
      round: `Round ${i + 1}`,
      scores: [rounds[i]],
    });
  }

  return result;
};
