import type { Area } from "react-easy-crop";

export const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });

export const getCroppedImg = async (imageSrc: string, pixelCrop: Area): Promise<string> => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("No 2d context");

  canvas.width = Math.max(1, Math.round(pixelCrop.width));
  canvas.height = Math.max(1, Math.round(pixelCrop.height));

  let bgColor = "#ffffff";
  try {
    const sampleCanvas = document.createElement("canvas");
    sampleCanvas.width = 1;
    sampleCanvas.height = 1;
    const sampleCtx = sampleCanvas.getContext("2d");
    if (sampleCtx) {
      sampleCtx.drawImage(image, 0, 0, 1, 1, 0, 0, 1, 1);
      const p = sampleCtx.getImageData(0, 0, 1, 1).data;
      if (p[3] > 0) {
        bgColor = `rgb(${p[0]}, ${p[1]}, ${p[2]})`;
      }
    }
  } catch (_) {}

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const sX = Math.max(0, pixelCrop.x);
  const sY = Math.max(0, pixelCrop.y);
  const sWidth = Math.min(image.naturalWidth - sX, pixelCrop.width - (sX - pixelCrop.x));
  const sHeight = Math.min(image.naturalHeight - sY, pixelCrop.height - (sY - pixelCrop.y));

  const dX = Math.max(0, sX - pixelCrop.x);
  const dY = Math.max(0, sY - pixelCrop.y);
  const dWidth = Math.max(0, sWidth);
  const dHeight = Math.max(0, sHeight);

  if (dWidth > 0 && dHeight > 0) {
    ctx.drawImage(
      image,
      sX,
      sY,
      sWidth,
      sHeight,
      dX,
      dY,
      dWidth,
      dHeight
    );
  }

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        resolve(URL.createObjectURL(blob));
      },
      "image/jpeg",
      0.95
    );
  });
};

export const getCroppedBlob = async (imageSrc: string, pixelCrop: Area): Promise<Blob> => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("No 2d context");

  canvas.width = Math.max(1, Math.round(pixelCrop.width));
  canvas.height = Math.max(1, Math.round(pixelCrop.height));

  let bgColor = "#ffffff";
  try {
    const sampleCanvas = document.createElement("canvas");
    sampleCanvas.width = 1;
    sampleCanvas.height = 1;
    const sampleCtx = sampleCanvas.getContext("2d");
    if (sampleCtx) {
      sampleCtx.drawImage(image, 0, 0, 1, 1, 0, 0, 1, 1);
      const p = sampleCtx.getImageData(0, 0, 1, 1).data;
      if (p[3] > 0) {
        bgColor = `rgb(${p[0]}, ${p[1]}, ${p[2]})`;
      }
    }
  } catch (_) {}

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const sX = Math.max(0, pixelCrop.x);
  const sY = Math.max(0, pixelCrop.y);
  const sWidth = Math.min(image.naturalWidth - sX, pixelCrop.width - (sX - pixelCrop.x));
  const sHeight = Math.min(image.naturalHeight - sY, pixelCrop.height - (sY - pixelCrop.y));

  const dX = Math.max(0, sX - pixelCrop.x);
  const dY = Math.max(0, sY - pixelCrop.y);
  const dWidth = Math.max(0, sWidth);
  const dHeight = Math.max(0, sHeight);

  if (dWidth > 0 && dHeight > 0) {
    ctx.drawImage(
      image,
      sX,
      sY,
      sWidth,
      sHeight,
      dX,
      dY,
      dWidth,
      dHeight
    );
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) return reject(new Error("Failed to create blob from canvas"));
        resolve(blob);
      },
      "image/jpeg",
      0.95
    );
  });
};
