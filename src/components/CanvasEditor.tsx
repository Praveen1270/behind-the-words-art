
import React, { useEffect, useRef, forwardRef, useImperativeHandle, useState } from 'react';
import { TextStyle } from './TextBehindEditor';
import { detectObjectBounds, calculateOptimalTextPosition, ObjectBounds } from '@/utils/objectDetection';

interface CanvasEditorProps {
  originalImage: HTMLImageElement | null;
  processedImage: HTMLImageElement | null;
  subjectMask: HTMLImageElement | null;
  textStyle: TextStyle;
  onTextStyleChange: (style: TextStyle) => void;
  isProcessing: boolean;
}

export const CanvasEditor = forwardRef<HTMLCanvasElement, CanvasEditorProps>(({
  originalImage,
  processedImage,
  subjectMask,
  textStyle,
  onTextStyleChange,
  isProcessing
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const [objectBounds, setObjectBounds] = useState<ObjectBounds | null>(null);
  const [autoPositioned, setAutoPositioned] = useState(false);

  useImperativeHandle(ref, () => canvasRef.current!);

  // Detect object bounds when processed image is available
  useEffect(() => {
    if (!subjectMask || !originalImage || isProcessing) return;

    detectObjectBounds(subjectMask, (bounds) => {
      setObjectBounds(bounds);
      
      // Auto-position text only once when object is first detected
      if (!autoPositioned && canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Use original image dimensions for accurate positioning
          ctx.font = `${textStyle.fontStyle} ${textStyle.fontWeight} ${textStyle.fontSize}px ${textStyle.fontFamily}`;
          
          const optimalPosition = calculateOptimalTextPosition(
            bounds,
            originalImage.naturalWidth,
            originalImage.naturalHeight,
            textStyle.fontSize,
            textStyle.content,
            ctx
          );

          onTextStyleChange({
            ...textStyle,
            x: optimalPosition.x,
            y: optimalPosition.y
          });
          
          setAutoPositioned(true);
          console.log('Auto-positioned text at:', optimalPosition);
        }
      }
    });
  }, [subjectMask, originalImage, isProcessing, autoPositioned, textStyle.content, textStyle.fontSize, textStyle.fontFamily, onTextStyleChange]);

  // Reset auto-positioning when new image is uploaded
  useEffect(() => {
    if (!originalImage) {
      setAutoPositioned(false);
      setObjectBounds(null);
    }
  }, [originalImage]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !originalImage) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Use original image dimensions for high quality
    const originalWidth = originalImage.naturalWidth;
    const originalHeight = originalImage.naturalHeight;
    
    // Set canvas to original dimensions
    canvas.width = originalWidth;
    canvas.height = originalHeight;
    
    // Enable high-quality rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Layer 0: Original background image at full resolution
    ctx.drawImage(originalImage, 0, 0, originalWidth, originalHeight);

    // Layer 1: Text behind subject (only if not processing and text content exists)
    if (!isProcessing && textStyle.content.trim()) {
      ctx.save();
      
      // Set font with proper fallbacks
      const fontFamily = textStyle.fontFamily || 'Arial';
      const fontSize = Math.max(textStyle.fontSize, 12); // Ensure minimum font size
      const fontWeight = textStyle.fontWeight || '400';
      const fontStyle = textStyle.fontStyle || 'normal';
      
      ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}, Arial, sans-serif`;
      ctx.fillStyle = textStyle.color;
      ctx.textAlign = (textStyle.textAlign as CanvasTextAlign) || 'center';
      ctx.textBaseline = 'middle';
      
      // Apply shadow if enabled
      if (textStyle.shadow) {
        ctx.shadowColor = textStyle.shadowColor || '#000000';
        ctx.shadowBlur = textStyle.shadowBlur || 0;
        ctx.shadowOffsetX = textStyle.shadowOffset || 0;
        ctx.shadowOffsetY = textStyle.shadowOffset || 0;
      }

      // Ensure text position is within canvas bounds
      const x = Math.max(0, Math.min(canvas.width, textStyle.x));
      const y = Math.max(fontSize, Math.min(canvas.height, textStyle.y));

      console.log('Drawing text:', {
        content: textStyle.content,
        x, y, fontSize, color: textStyle.color,
        canvasSize: { width: canvas.width, height: canvas.height }
      });

      ctx.fillText(textStyle.content, x, y);
      ctx.restore();
    }

    // Layer 2: Subject mask (foreground) at full resolution
    if (subjectMask && !isProcessing) {
      ctx.globalCompositeOperation = 'source-over';
      ctx.drawImage(subjectMask, 0, 0, originalWidth, originalHeight);
    }

    // Processing overlay
    if (isProcessing) {
      ctx.save();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = '48px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Processing with AI...', canvas.width / 2, canvas.height / 2);
      ctx.restore();
    }
  };

  const handleMouseDown = (event: React.MouseEvent) => {
    if (!canvasRef.current || isProcessing || !originalImage) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    // Check if click is near text position
    const distance = Math.sqrt((x - textStyle.x) ** 2 + (y - textStyle.y) ** 2);
    
    if (distance < 150) { // Increased tolerance for high-res
      isDragging.current = true;
      dragOffset.current = { x: x - textStyle.x, y: y - textStyle.y };
      canvasRef.current.style.cursor = 'grabbing';
    }
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!canvasRef.current || !isDragging.current || !originalImage) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    const newX = x - dragOffset.current.x;
    const newY = y - dragOffset.current.y;

    onTextStyleChange({
      ...textStyle,
      x: Math.max(0, Math.min(originalImage.naturalWidth, newX)),
      y: Math.max(textStyle.fontSize, Math.min(originalImage.naturalHeight, newY))
    });
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = 'default';
    }
  };

  useEffect(() => {
    drawCanvas();
  }, [originalImage, processedImage, subjectMask, textStyle, isProcessing]);

  return (
    <div className="flex justify-center">
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="max-w-full h-auto border border-slate-600 rounded-lg shadow-2xl cursor-default"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          style={{ 
            maxHeight: '80vh'
          }}
        />
        
        {!originalImage && !isProcessing && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-700/50 rounded-lg">
            <p className="text-slate-400 text-lg">Upload an image to get started</p>
          </div>
        )}

        {objectBounds && !isProcessing && (
          <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            Auto-positioned behind detected object
          </div>
        )}

        {/* Debug info for text positioning */}
        {originalImage && !isProcessing && (
          <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            Text: "{textStyle.content}" at ({Math.round(textStyle.x)}, {Math.round(textStyle.y)})
          </div>
        )}
      </div>
    </div>
  );
});

CanvasEditor.displayName = 'CanvasEditor';
