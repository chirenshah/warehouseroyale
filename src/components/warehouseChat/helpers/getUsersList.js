export const getUsersList = (team) => {
  return !team.employees
    ? [team.manager.email]
    : [...team.employees.map((employee) => employee.email), team.manager.email];
};
