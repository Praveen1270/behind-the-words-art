
import React, { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { removeBackground, loadImage } from '@/utils/backgroundRemoval';

interface ImageUploadProps {
  onImageUpload: (image: HTMLImageElement) => void;
  onProcessedImage: (image: HTMLImageElement) => void;
  onSubjectMask: (mask: HTMLImageElement) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageUpload,
  onProcessedImage,
  onSubjectMask,
  isProcessing,
  setIsProcessing
}) => {
  const handleFileUpload = useCallback(async (file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size should be less than 10MB');
      return;
    }

    try {
      setIsProcessing(true);
      toast.info('Processing image...');

      // Load original image
      const originalImage = await loadImage(file);
      onImageUpload(originalImage);

      // Remove background
      toast.info('Removing background with AI...');
      const processedBlob = await removeBackground(originalImage);
      
      // Create processed image (background removed version)
      const processedImage = await loadImage(processedBlob);
      onProcessedImage(processedImage);

      // Create subject mask for layering
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      canvas.width = processedImage.width;
      canvas.height = processedImage.height;
      ctx.drawImage(processedImage, 0, 0);
      
      const maskBlob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => resolve(blob!), 'image/png');
      });
      
      const maskImage = await loadImage(maskBlob);
      onSubjectMask(maskImage);

      toast.success('Image processed successfully!');
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error('Failed to process image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, [onImageUpload, onProcessedImage, onSubjectMask, setIsProcessing]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  }, [handleFileUpload]);

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  return (
    <div className="space-y-4">
      <div
        className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center hover:border-purple-400 transition-colors cursor-pointer"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="flex flex-col items-center space-y-4">
          {isProcessing ? (
            <Loader2 className="h-12 w-12 text-purple-400 animate-spin" />
          ) : (
            <ImageIcon className="h-12 w-12 text-slate-400" />
          )}
          
          <div>
            <p className="text-slate-300 font-medium mb-2">
              {isProcessing ? 'Processing...' : 'Drop your image here'}
            </p>
            <p className="text-slate-500 text-sm">
              JPG, PNG up to 10MB
            </p>
          </div>

          <Input
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="hidden"
            id="image-upload"
            disabled={isProcessing}
          />
          
          <Button
            variant="outline"
            className="border-slate-600 hover:border-purple-400 text-slate-300"
            onClick={() => document.getElementById('image-upload')?.click()}
            disabled={isProcessing}
          >
            <Upload className="h-4 w-4 mr-2" />
            {isProcessing ? 'Processing...' : 'Browse Files'}
          </Button>
        </div>
      </div>

      {isProcessing && (
        <div className="text-center">
          <p className="text-slate-400 text-sm">
            Using AI to separate subject from background...
          </p>
        </div>
      )}
    </div>
  );
};
