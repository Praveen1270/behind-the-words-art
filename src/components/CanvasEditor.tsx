
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
          // Set up canvas font for text measurement
          const scale = Math.min(800 / originalImage.width, 600 / originalImage.height, 1);
          ctx.font = `${textStyle.fontStyle} ${textStyle.fontWeight} ${textStyle.fontSize * scale}px ${textStyle.fontFamily}`;
          
          const optimalPosition = calculateOptimalTextPosition(
            {
              x: bounds.x * scale,
              y: bounds.y * scale,
              width: bounds.width * scale,
              height: bounds.height * scale
            },
            canvas.width,
            canvas.height,
            textStyle.fontSize * scale,
            textStyle.content,
            ctx
          );

          // Convert back to original image coordinates
          const newX = optimalPosition.x / scale;
          const newY = optimalPosition.y / scale;

          onTextStyleChange({
            ...textStyle,
            x: newX,
            y: newY
          });
          
          setAutoPositioned(true);
          console.log('Auto-positioned text at:', { x: newX, y: newY });
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

    // Set canvas size to match image
    const maxWidth = 800;
    const maxHeight = 600;
    const scale = Math.min(maxWidth / originalImage.width, maxHeight / originalImage.height, 1);
    
    canvas.width = originalImage.width * scale;
    canvas.height = originalImage.height * scale;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Layer 0: Original background image
    ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);

    // Layer 1: Text behind subject
    if (!isProcessing) {
      ctx.save();
      ctx.font = `${textStyle.fontStyle} ${textStyle.fontWeight} ${textStyle.fontSize * scale}px ${textStyle.fontFamily}`;
      ctx.fillStyle = textStyle.color;
      ctx.textAlign = textStyle.textAlign as CanvasTextAlign;
      
      // Apply shadow if enabled
      if (textStyle.shadow) {
        ctx.shadowColor = textStyle.shadowColor;
        ctx.shadowBlur = textStyle.shadowBlur * scale;
        ctx.shadowOffsetX = textStyle.shadowOffset * scale;
        ctx.shadowOffsetY = textStyle.shadowOffset * scale;
      }

      const x = textStyle.x * scale;
      const y = textStyle.y * scale;
      
      ctx.fillText(textStyle.content, x, y);
      ctx.restore();
    }

    // Layer 2: Subject mask (foreground)
    if (subjectMask && !isProcessing) {
      ctx.drawImage(subjectMask, 0, 0, canvas.width, canvas.height);
    }

    // Processing overlay
    if (isProcessing) {
      ctx.save();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = '24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Processing with AI...', canvas.width / 2, canvas.height / 2);
      ctx.restore();
    }
  };

  const handleMouseDown = (event: React.MouseEvent) => {
    if (!canvasRef.current || isProcessing) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    // Check if click is near text position (rough approximation)
    const textX = textStyle.x * (canvasRef.current.width / (originalImage?.width || 1));
    const textY = textStyle.y * (canvasRef.current.height / (originalImage?.height || 1));
    
    const distance = Math.sqrt((x - textX) ** 2 + (y - textY) ** 2);
    
    if (distance < 100) { // 100px tolerance
      isDragging.current = true;
      dragOffset.current = { x: x - textX, y: y - textY };
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

    const newX = (x - dragOffset.current.x) * (originalImage.width / canvasRef.current.width);
    const newY = (y - dragOffset.current.y) * (originalImage.height / canvasRef.current.height);

    onTextStyleChange({
      ...textStyle,
      x: Math.max(0, Math.min(originalImage.width, newX)),
      y: Math.max(textStyle.fontSize, Math.min(originalImage.height, newY))
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
          style={{ maxHeight: '600px' }}
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
      </div>
    </div>
  );
});

CanvasEditor.displayName = 'CanvasEditor';
