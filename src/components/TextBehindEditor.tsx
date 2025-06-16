
import React, { useState, useRef } from 'react';
import { ImageUpload } from './ImageUpload';
import { CanvasEditor } from './CanvasEditor';
import { TextControls } from './TextControls';
import { ExportControls } from './ExportControls';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Image, Type, Download } from 'lucide-react';

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
    fontFamily: 'Inter',
    color: '#ffffff',
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

  const handleAddNewTextSet = () => {
    // This would typically add a new text layer
    console.log('Add new text set');
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Left Panel - Controls */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col overflow-hidden shadow-lg">
        {/* Header */}
        <div className="p-4 border-b bg-gradient-to-r from-purple-600 to-blue-600">
          <div className="flex items-center justify-between">
            <h2 className="text-white font-semibold">Text Behind Editor</h2>
            <Badge variant="secondary" className="text-xs">
              1 generation left
            </Badge>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-6">
            {/* Upload Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Image className="h-4 w-4 text-gray-600" />
                <h3 className="text-sm font-semibold text-gray-900">Upload Image</h3>
              </div>
              <Card className="p-4 bg-gray-50/80 border-gray-200 hover:bg-gray-50 transition-colors">
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
                {/* Add New Text Set Button */}
                <Button
                  onClick={handleAddNewTextSet}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Text Set
                </Button>

                {/* Text Controls Section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Type className="h-4 w-4 text-gray-600" />
                    <h3 className="text-sm font-semibold text-gray-900">Text Style</h3>
                    <Badge variant="outline" className="text-xs ml-auto">
                      Active
                    </Badge>
                  </div>
                  <Card className="p-4 bg-gray-50/80 border-gray-200">
                    <TextControls 
                      textStyle={textStyle}
                      onTextStyleChange={setTextStyle}
                    />
                  </Card>
                </div>

                {/* Export Section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Download className="h-4 w-4 text-gray-600" />
                    <h3 className="text-sm font-semibold text-gray-900">Export</h3>
                  </div>
                  <Card className="p-4 bg-gray-50/80 border-gray-200">
                    <ExportControls canvasRef={canvasRef} />
                  </Card>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right Panel - Canvas */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="p-6">
          <Card className="bg-white border-gray-200 shadow-xl">
            <div className="p-6">
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
