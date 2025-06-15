
import React, { useState, useRef } from 'react';
import { ImageUpload } from './ImageUpload';
import { CanvasEditor } from './CanvasEditor';
import { TextControls } from './TextControls';
import { ExportControls } from './ExportControls';
import { Card } from '@/components/ui/card';

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
    fontFamily: 'SF Pro Display',
    color: '#000000',
    fontWeight: '600',
    fontStyle: 'normal',
    textAlign: 'center',
    x: 400,
    y: 300,
    shadow: false,
    shadowColor: '#000000',
    shadowBlur: 10,
    shadowOffset: 5,
  });

  return (
    <div className="flex h-screen">
      {/* Fixed Left Panel - Controls */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-8">
            {/* Upload Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Upload Image</h3>
              <Card className="p-6 bg-gray-50/50 border-gray-200">
                <ImageUpload 
                  onImageUpload={setOriginalImage}
                  onProcessedImage={setProcessedImage}
                  onSubjectMask={setSubjectMask}
                  isProcessing={isProcessing}
                  setIsProcessing={setIsProcessing}
                />
              </Card>
            </div>

            {originalImage && (
              <>
                {/* Text Controls Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Text Style</h3>
                  <Card className="p-6 bg-gray-50/50 border-gray-200">
                    <TextControls 
                      textStyle={textStyle}
                      onTextStyleChange={setTextStyle}
                    />
                  </Card>
                </div>

                {/* Export Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Export</h3>
                  <Card className="p-6 bg-gray-50/50 border-gray-200">
                    <ExportControls canvasRef={canvasRef} />
                  </Card>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right Panel - Canvas (Scrollable) */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          <Card className="bg-white border-gray-200 shadow-lg">
            <div className="p-8">
              <CanvasEditor
                ref={canvasRef}
                originalImage={originalImage}
                processedImage={processedImage}
                subjectMask={subjectMask}
                textStyle={textStyle}
                onTextStyleChange={setTextStyle}
                isProcessing={isProcessing}
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
