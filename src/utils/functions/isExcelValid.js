export const isExcelValid = (arr) => {
  /**
   * CHECKS
   * 1. All users must have unique email
   * 2. One class must have single manager
   * 3. One class must have uniqe username
   */

  let alreadySeenEmails = {};
  let classesManagers = {};
  let classUsers = {};

  for (let i = 0; i < arr.length; i++) {
    const currentUser = arr[i];

    // Check for unique email
    if (alreadySeenEmails[currentUser.email]) {
      throw new Error(`${currentUser.email} is a duplicate email`);
    } else {
      alreadySeenEmails[currentUser.email] = true;
    }

    // Check for single manager per class
    if (currentUser.role === 'manager') {
      if (classesManagers[currentUser.classId]) {
        throw new Error(`${currentUser.classId} must have single manager`);
      } else {
        classesManagers[currentUser.classId] = true;
      }
    }

    // Check for unique username per class
    if (
      classUsers[currentUser.classId] &&
      classUsers[currentUser.classId][currentUser.username]
    ) {
      throw new Error(
        `Username: ${currentUser.username} is duplicate in class: ${currentUser.classId}`
      );
    } else {
      classUsers[currentUser.classId] = {
        ...classUsers[currentUser.classId],
        [currentUser.username]: true,
      };
    }
  }

  return true;
};
