export const getUsersList = (team) => {
  return [
    ...team.employees.map((employee) => employee.email),
    team.manager.email,
  ];
};
