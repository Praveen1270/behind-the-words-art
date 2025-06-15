
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Share } from 'lucide-react';
import { toast } from 'sonner';

interface ExportControlsProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

export const ExportControls: React.FC<ExportControlsProps> = ({ canvasRef }) => {
  const handleDownload = (format: 'png' | 'jpg') => {
    if (!canvasRef.current) {
      toast.error('No image to download');
      return;
    }

    try {
      const canvas = canvasRef.current;
      const link = document.createElement('a');
      
      if (format === 'jpg') {
        // Create a new canvas with white background for JPG
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d')!;
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        
        // Fill with white background
        tempCtx.fillStyle = '#ffffff';
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        
        // Draw the original canvas on top
        tempCtx.drawImage(canvas, 0, 0);
        
        link.download = `textbehind-${Date.now()}.jpg`;
        link.href = tempCanvas.toDataURL('image/jpeg', 0.9);
      } else {
        link.download = `textbehind-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
      }
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(`Image downloaded as ${format.toUpperCase()}!`);
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download image');
    }
  };

  const handleShare = async () => {
    if (!canvasRef.current) {
      toast.error('No image to share');
      return;
    }

    try {
      const canvas = canvasRef.current;
      canvas.toBlob(async (blob) => {
        if (!blob) return;

        if (navigator.share && navigator.canShare) {
          const file = new File([blob], 'textbehind.png', { type: 'image/png' });
          
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: 'TextBehind Creation',
              text: 'Check out this amazing text-behind effect!',
              files: [file]
            });
            toast.success('Shared successfully!');
          } else {
            // Fallback to copying to clipboard
            const item = new ClipboardItem({ 'image/png': blob });
            await navigator.clipboard.write([item]);
            toast.success('Image copied to clipboard!');
          }
        } else {
          // Fallback to copying to clipboard
          const item = new ClipboardItem({ 'image/png': blob });
          await navigator.clipboard.write([item]);
          toast.success('Image copied to clipboard!');
        }
      }, 'image/png');
    } catch (error) {
      console.error('Share error:', error);
      toast.error('Failed to share image');
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Button
          onClick={() => handleDownload('png')}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
        >
          <Download className="h-4 w-4 mr-2" />
          Download PNG
        </Button>
        
        <Button
          onClick={() => handleDownload('jpg')}
          variant="outline"
          className="w-full border-slate-600 hover:border-purple-400 text-slate-300"
        >
          <Download className="h-4 w-4 mr-2" />
          Download JPG
        </Button>
      </div>

      <Button
        onClick={handleShare}
        variant="outline"
        className="w-full border-slate-600 hover:border-purple-400 text-slate-300"
      >
        <Share className="h-4 w-4 mr-2" />
        Share
      </Button>

      <div className="text-xs text-slate-500 text-center">
        <p>Pro tip: Drag the text on the canvas to reposition it!</p>
      </div>
    </div>
  );
};
