export const isValidImageUrl = (url: string) => {
  const imageUrlPattern =
    /^(https?:\/\/(?:[\w-]+\.)+[a-z]{2,})(\/[\w-]+)*\/([\w-]+\.(?:jpg|jpeg|png|gif|bmp|webp))(\?[a-z0-9&=]*)?$/i;
  const dynamicImagePattern =
    /^(https?:\/\/picsum\.photos|https?:\/\/img\.freepik\.com)/i;

  return imageUrlPattern.test(url) || dynamicImagePattern.test(url);
};