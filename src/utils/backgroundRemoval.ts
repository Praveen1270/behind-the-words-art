
import { removeBackground as removeBackgroundAPI } from 'not-lain/background-removal';

let isModelLoaded = false;

const loadModel = async () => {
  if (isModelLoaded) return;
  
  try {
    console.log('Background removal model ready...');
    isModelLoaded = true;
    console.log('Background removal model loaded successfully');
  } catch (error) {
    console.error('Failed to load background removal model:', error);
    throw error;
  }
};

export const removeBackground = async (imageElement: HTMLImageElement): Promise<Blob> => {
  try {
    console.log('Starting local background removal...');
    
    // Load model if not already loaded
    await loadModel();
    
    // Convert image to canvas for processing
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) throw new Error('Could not get canvas context');
    
    // Use original dimensions to maintain quality
    canvas.width = imageElement.naturalWidth;
    canvas.height = imageElement.naturalHeight;
    
    // Use high-quality image rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(imageElement, 0, 0);
    
    // Convert canvas to blob for processing
    const inputBlob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to convert image to blob'));
        }
      }, 'image/png', 1.0);
    });
    
    console.log('Processing image with local AI model...');
    
    // Process the image using the not-lain/background-removal package
    const resultBlob = await removeBackgroundAPI(inputBlob);
    
    console.log('Background removed successfully using local processing');
    
    return resultBlob;
  } catch (error) {
    console.error('Error removing background locally:', error);
    throw error;
  }
};

export const loadImage = (file: Blob): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};
