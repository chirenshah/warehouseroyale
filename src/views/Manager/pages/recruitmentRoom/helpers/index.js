export const getEmployeeDetails = (allEmployees, id) => {
  if (!allEmployees || !id) {
    return null;
  }
  return allEmployees.find((employee) => employee.email === id);
};

export const getCurrentTeamOffer = (allEmployees, employeeId, teamId) => {
  const employeeDetails = getEmployeeDetails(allEmployees, employeeId);

  const currentTeamOffer = employeeDetails.offers.filter(
    (offer) => offer.teamId === teamId
  );

  return currentTeamOffer[0];
};
