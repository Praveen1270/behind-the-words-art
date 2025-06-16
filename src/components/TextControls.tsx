
import React from 'react';
import { TextStyle } from './TextBehindEditor';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, Trash2, RotateCcw, Palette, Type, Move } from 'lucide-react';

interface TextControlsProps {
  textStyle: TextStyle;
  onTextStyleChange: (style: TextStyle) => void;
}

const fontFamilies = [
  'Inter', 'SF Pro Display', 'Helvetica Neue', 'Arial', 'Times New Roman', 
  'Georgia', 'Playfair Display', 'Roboto', 'Open Sans', 'Lato'
];

const fontWeights = [
  { label: 'Thin', value: '100' },
  { label: 'Light', value: '300' },
  { label: 'Regular', value: '400' },
  { label: 'Medium', value: '500' },
  { label: 'Semi Bold', value: '600' },
  { label: 'Bold', value: '700' },
  { label: 'Extra Bold', value: '800' },
  { label: 'Black', value: '900' }
];

const presetColors = [
  '#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff',
  '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#800080'
];

export const TextControls: React.FC<TextControlsProps> = ({ textStyle, onTextStyleChange }) => {
  const handleReset = () => {
    onTextStyleChange({
      ...textStyle,
      fontSize: 120,
      fontWeight: '600',
      fontStyle: 'normal',
      color: '#000000',
      x: 400,
      y: 300,
      shadow: false,
      shadowColor: '#000000',
      shadowBlur: 10,
      shadowOffset: 5,
    });
  };

  const handleDuplicate = () => {
    // This would typically create a new text layer
    console.log('Duplicate text set');
  };

  const handleRemove = () => {
    // This would typically remove the current text layer
    console.log('Remove text set');
  };

  return (
    <div className="space-y-6">
      {/* Text Content */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Text Content</Label>
          <Badge variant="secondary" className="text-xs">
            {textStyle.content.length} chars
          </Badge>
        </div>
        <Textarea
          value={textStyle.content}
          onChange={(e) => onTextStyleChange({ ...textStyle, content: e.target.value })}
          placeholder="Enter your text..."
          className="min-h-[80px] resize-none"
        />
      </div>

      {/* Main Controls Tabs */}
      <Tabs defaultValue="typography" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="typography" className="flex items-center gap-1">
            <Type className="h-3 w-3" />
            Text
          </TabsTrigger>
          <TabsTrigger value="position" className="flex items-center gap-1">
            <Move className="h-3 w-3" />
            Position
          </TabsTrigger>
          <TabsTrigger value="effects" className="flex items-center gap-1">
            <Palette className="h-3 w-3" />
            Effects
          </TabsTrigger>
        </TabsList>

        <TabsContent value="typography" className="space-y-4 mt-4">
          {/* Font Family */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Font Family</Label>
            <Select value={textStyle.fontFamily} onValueChange={(value) => onTextStyleChange({ ...textStyle, fontFamily: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fontFamilies.map((font) => (
                  <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                    {font}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Font Weight */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Font Weight</Label>
            <Select value={textStyle.fontWeight} onValueChange={(value) => onTextStyleChange({ ...textStyle, fontWeight: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fontWeights.map((weight) => (
                  <SelectItem key={weight.value} value={weight.value}>
                    {weight.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Font Size */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Font Size</Label>
              <span className="text-xs text-muted-foreground">{textStyle.fontSize}px</span>
            </div>
            <Slider
              value={[textStyle.fontSize]}
              onValueChange={([value]) => onTextStyleChange({ ...textStyle, fontSize: value })}
              min={12}
              max={300}
              step={1}
              className="w-full"
            />
          </div>

          {/* Text Color */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Text Color</Label>
            <div className="flex items-center gap-2">
              <Input
                type="color"
                value={textStyle.color}
                onChange={(e) => onTextStyleChange({ ...textStyle, color: e.target.value })}
                className="w-12 h-8 p-0 border-0"
              />
              <Input
                value={textStyle.color}
                onChange={(e) => onTextStyleChange({ ...textStyle, color: e.target.value })}
                className="flex-1 text-xs font-mono"
              />
            </div>
            <div className="grid grid-cols-5 gap-1 mt-2">
              {presetColors.map((color) => (
                <button
                  key={color}
                  onClick={() => onTextStyleChange({ ...textStyle, color })}
                  className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="position" className="space-y-4 mt-4">
          {/* X Position */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">X Position</Label>
              <span className="text-xs text-muted-foreground">{Math.round(textStyle.x)}</span>
            </div>
            <Slider
              value={[textStyle.x]}
              onValueChange={([value]) => onTextStyleChange({ ...textStyle, x: value })}
              min={0}
              max={1200}
              step={1}
              className="w-full"
            />
          </div>

          {/* Y Position */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Y Position</Label>
              <span className="text-xs text-muted-foreground">{Math.round(textStyle.y)}</span>
            </div>
            <Slider
              value={[textStyle.y]}
              onValueChange={([value]) => onTextStyleChange({ ...textStyle, y: value })}
              min={0}
              max={800}
              step={1}
              className="w-full"
            />
          </div>

          {/* Text Alignment */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Text Alignment</Label>
            <Select value={textStyle.textAlign} onValueChange={(value) => onTextStyleChange({ ...textStyle, textAlign: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="right">Right</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </TabsContent>

        <TabsContent value="effects" className="space-y-4 mt-4">
          {/* Shadow Toggle */}
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Text Shadow</Label>
            <Switch
              checked={textStyle.shadow}
              onCheckedChange={(checked) => onTextStyleChange({ ...textStyle, shadow: checked })}
            />
          </div>

          {textStyle.shadow && (
            <>
              {/* Shadow Color */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Shadow Color</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    value={textStyle.shadowColor}
                    onChange={(e) => onTextStyleChange({ ...textStyle, shadowColor: e.target.value })}
                    className="w-12 h-8 p-0 border-0"
                  />
                  <Input
                    value={textStyle.shadowColor}
                    onChange={(e) => onTextStyleChange({ ...textStyle, shadowColor: e.target.value })}
                    className="flex-1 text-xs font-mono"
                  />
                </div>
              </div>

              {/* Shadow Blur */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Shadow Blur</Label>
                  <span className="text-xs text-muted-foreground">{textStyle.shadowBlur}px</span>
                </div>
                <Slider
                  value={[textStyle.shadowBlur]}
                  onValueChange={([value]) => onTextStyleChange({ ...textStyle, shadowBlur: value })}
                  min={0}
                  max={50}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Shadow Offset */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Shadow Offset</Label>
                  <span className="text-xs text-muted-foreground">{textStyle.shadowOffset}px</span>
                </div>
                <Slider
                  value={[textStyle.shadowOffset]}
                  onValueChange={([value]) => onTextStyleChange({ ...textStyle, shadowOffset: value })}
                  min={0}
                  max={20}
                  step={1}
                  className="w-full"
                />
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <Card className="p-3 bg-muted/50">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDuplicate}
            className="flex-1"
          >
            <Copy className="h-3 w-3 mr-1" />
            Duplicate
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleReset}
            className="flex-1"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Reset
          </Button>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={handleRemove}
            className="flex-1"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Remove
          </Button>
        </div>
      </Card>

      {/* Pro Tip */}
      <div className="text-xs text-muted-foreground text-center p-2 bg-muted/30 rounded">
        💡 Drag the text directly on the canvas to reposition it
      </div>
    </div>
  );
};
