export const isValidUrl = (url) => {
  //
  const pattern = /^(http|https):\/\/[^ "]+$/;
  return pattern.test(url);
};
