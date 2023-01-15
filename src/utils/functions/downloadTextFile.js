export const downloadTextFile = (data) => {
  const text = JSON.stringify(data);

  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'chat.txt';
  link.click();
};
