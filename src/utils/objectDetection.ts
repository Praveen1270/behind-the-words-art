
export interface ObjectBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const detectObjectBounds = (
  processedImage: HTMLImageElement,
  callback: (bounds: ObjectBounds) => void
): void => {
  const tempCanvas = document.createElement('canvas');
  const tempCtx = tempCanvas.getContext('2d');
  
  if (!tempCtx) {
    console.error('Could not get canvas context for object detection');
    return;
  }

  tempCanvas.width = processedImage.width;
  tempCanvas.height = processedImage.height;
  
  const detectBounds = () => {
    tempCtx.drawImage(processedImage, 0, 0);
    const imageData = tempCtx.getImageData(0, 0, processedImage.width, processedImage.height);
    const data = imageData.data;
    
    let minX = processedImage.width;
    let minY = processedImage.height;
    let maxX = 0;
    let maxY = 0;
    let hasNonTransparentPixels = false;

    // Scan for non-transparent pixels to find object bounds
    for (let y = 0; y < processedImage.height; y++) {
      for (let x = 0; x < processedImage.width; x++) {
        const i = (y * processedImage.width + x) * 4;
        const alpha = data[i + 3]; // Alpha channel
        
        if (alpha > 50) { // Consider pixels with alpha > 50 as part of the object
          hasNonTransparentPixels = true;
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x);
          maxY = Math.max(maxY, y);
        }
      }
    }

    if (hasNonTransparentPixels) {
      const bounds: ObjectBounds = {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY
      };
      
      console.log('Detected object bounds:', bounds);
      callback(bounds);
    } else {
      // If no object detected, use center positioning
      const fallbackBounds: ObjectBounds = {
        x: processedImage.width * 0.3,
        y: processedImage.height * 0.3,
        width: processedImage.width * 0.4,
        height: processedImage.height * 0.4
      };
      
      console.log('No object detected, using fallback bounds:', fallbackBounds);
      callback(fallbackBounds);
    }
  };

  if (processedImage.complete) {
    detectBounds();
  } else {
    processedImage.onload = detectBounds;
  }
};

export const calculateOptimalTextPosition = (
  objectBounds: ObjectBounds,
  canvasWidth: number,
  canvasHeight: number,
  fontSize: number,
  textContent: string,
  ctx: CanvasRenderingContext2D
): { x: number; y: number } => {
  const textMetrics = ctx.measureText(textContent);
  const textWidth = textMetrics.width;
  const textHeight = fontSize;
  
  // Try different positioning strategies
  const positions = [
    // Behind and slightly below center
    {
      x: objectBounds.x + (objectBounds.width / 2) - (textWidth / 2),
      y: objectBounds.y + (objectBounds.height * 0.7)
    },
    // Behind and to the left
    {
      x: Math.max(50, objectBounds.x - textWidth - 20),
      y: objectBounds.y + (objectBounds.height / 2)
    },
    // Behind and to the right
    {
      x: Math.min(canvasWidth - textWidth - 50, objectBounds.x + objectBounds.width + 20),
      y: objectBounds.y + (objectBounds.height / 2)
    },
    // Behind and above
    {
      x: objectBounds.x + (objectBounds.width / 2) - (textWidth / 2),
      y: Math.max(textHeight + 20, objectBounds.y - 20)
    }
  ];

  // Choose the first position that fits within canvas bounds
  for (const pos of positions) {
    if (
      pos.x >= 20 && 
      pos.x + textWidth <= canvasWidth - 20 &&
      pos.y >= textHeight + 20 && 
      pos.y <= canvasHeight - 20
    ) {
      return pos;
    }
  }

  // Fallback to center if no position works
  return {
    x: (canvasWidth / 2) - (textWidth / 2),
    y: (canvasHeight / 2)
  };
};
