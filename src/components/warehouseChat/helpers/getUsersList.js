export const getUsersList = (team, currentUserEmail) => {
  const result = !team.employees
    ? [team.manager.email]
    : [...team.employees.map((employee) => employee.email), team.manager.email];

  // Remover currentUser
  return result.filter((user) => user !== currentUserEmail);
};
