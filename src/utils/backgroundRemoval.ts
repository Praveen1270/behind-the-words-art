
const API_KEY = 'ZRvPCaUGRvDpLniCq5MuESUs';
const API_URL = 'https://api.remove.bg/v1.0/removebg';

export const removeBackground = async (imageElement: HTMLImageElement): Promise<Blob> => {
  try {
    console.log('Starting background removal with remove.bg API...');
    
    // Convert image to blob with high quality
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
    
    // Convert canvas to blob with maximum quality
    const imageBlob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to convert image to blob'));
        }
      }, 'image/png', 1.0); // Use PNG with max quality
    });
    
    // Create form data for the API request
    const formData = new FormData();
    formData.append('image_file', imageBlob);
    formData.append('size', 'regular'); // Use regular size instead of auto for better quality
    formData.append('format', 'png'); // Request PNG format for better quality
    
    console.log('Sending request to remove.bg API...');
    
    // Make API request
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'X-Api-Key': API_KEY,
      },
      body: formData,
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    const resultBlob = await response.blob();
    console.log('Background removed successfully');
    
    return resultBlob;
  } catch (error) {
    console.error('Error removing background:', error);
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
