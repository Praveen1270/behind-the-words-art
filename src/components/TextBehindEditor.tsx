
import React, { useState, useRef } from 'react';
import { ImageUpload } from './ImageUpload';
import { CanvasEditor } from './CanvasEditor';
import { TextControls } from './TextControls';
import { ExportControls } from './ExportControls';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export interface TextStyle {
  content: string;
  fontSize: number;
  fontFamily: string;
  color: string;
  fontWeight: string;
  fontStyle: string;
  textAlign: string;
  x: number;
  y: number;
  shadow: boolean;
  shadowColor: string;
  shadowBlur: number;
  shadowOffset: number;
}

export const TextBehindEditor = () => {
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [processedImage, setProcessedImage] = useState<HTMLImageElement | null>(null);
  const [subjectMask, setSubjectMask] = useState<HTMLImageElement | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [textStyle, setTextStyle] = useState<TextStyle>({
    content: 'EDIT',
    fontSize: 120,
    fontFamily: 'Arial Black',
    color: '#ffffff',
    fontWeight: 'bold',
    fontStyle: 'normal',
    textAlign: 'center',
    x: 400,
    y: 300,
    shadow: true,
    shadowColor: '#000000',
    shadowBlur: 10,
    shadowOffset: 5,
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Panel - Controls */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6 bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-4">Upload Image</h3>
            <ImageUpload 
              onImageUpload={setOriginalImage}
              onProcessedImage={setProcessedImage}
              onSubjectMask={setSubjectMask}
              isProcessing={isProcessing}
              setIsProcessing={setIsProcessing}
            />
          </Card>

          {originalImage && (
            <>
              <Card className="p-6 bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <h3 className="text-lg font-semibold text-white mb-4">Text Style</h3>
                <TextControls 
                  textStyle={textStyle}
                  onTextStyleChange={setTextStyle}
                />
              </Card>

              <Card className="p-6 bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <h3 className="text-lg font-semibold text-white mb-4">Export</h3>
                <ExportControls canvasRef={canvasRef} />
              </Card>
            </>
          )}
        </div>

        {/* Right Panel - Canvas */}
        <div className="lg:col-span-3">
          <Card className="p-6 bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CanvasEditor
              ref={canvasRef}
              originalImage={originalImage}
              processedImage={processedImage}
              subjectMask={subjectMask}
              textStyle={textStyle}
              onTextStyleChange={setTextStyle}
              isProcessing={isProcessing}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};
