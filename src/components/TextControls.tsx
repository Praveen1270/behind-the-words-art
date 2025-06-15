
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { TextStyle } from './TextBehindEditor';
import { Separator } from '@/components/ui/separator';

interface TextControlsProps {
  textStyle: TextStyle;
  onTextStyleChange: (style: TextStyle) => void;
}

export const TextControls: React.FC<TextControlsProps> = ({
  textStyle,
  onTextStyleChange
}) => {
  const handleChange = (key: keyof TextStyle, value: any) => {
    onTextStyleChange({ ...textStyle, [key]: value });
  };

  const fontFamilies = [
    'Arial Black',
    'Impact',
    'Bebas Neue',
    'Oswald',
    'Roboto Condensed',
    'Anton',
    'Fjalla One',
    'Archivo Black'
  ];

  return (
    <div className="space-y-6">
      {/* Text Content */}
      <div className="space-y-2">
        <Label className="text-slate-300">Text Content</Label>
        <Input
          value={textStyle.content}
          onChange={(e) => handleChange('content', e.target.value)}
          className="bg-slate-700 border-slate-600 text-white"
          placeholder="Enter your text..."
        />
      </div>

      <Separator className="bg-slate-600" />

      {/* Font Settings */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-slate-300">Font Settings</h4>
        
        <div className="space-y-2">
          <Label className="text-slate-400 text-xs">Font Family</Label>
          <Select value={textStyle.fontFamily} onValueChange={(value) => handleChange('fontFamily', value)}>
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600">
              {fontFamilies.map((font) => (
                <SelectItem key={font} value={font} className="text-white hover:bg-slate-600">
                  {font}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-slate-400 text-xs">Font Size: {textStyle.fontSize}px</Label>
          <Slider
            value={[textStyle.fontSize]}
            onValueChange={(value) => handleChange('fontSize', value[0])}
            min={20}
            max={200}
            step={5}
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label className="text-slate-400 text-xs">Weight</Label>
            <Select value={textStyle.fontWeight} onValueChange={(value) => handleChange('fontWeight', value)}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="normal" className="text-white hover:bg-slate-600">Normal</SelectItem>
                <SelectItem value="bold" className="text-white hover:bg-slate-600">Bold</SelectItem>
                <SelectItem value="900" className="text-white hover:bg-slate-600">Black</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-400 text-xs">Style</Label>
            <Select value={textStyle.fontStyle} onValueChange={(value) => handleChange('fontStyle', value)}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="normal" className="text-white hover:bg-slate-600">Normal</SelectItem>
                <SelectItem value="italic" className="text-white hover:bg-slate-600">Italic</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Separator className="bg-slate-600" />

      {/* Color Settings */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-slate-300">Colors</h4>
        
        <div className="space-y-2">
          <Label className="text-slate-400 text-xs">Text Color</Label>
          <div className="flex space-x-2">
            <Input
              type="color"
              value={textStyle.color}
              onChange={(e) => handleChange('color', e.target.value)}
              className="w-12 h-10 p-1 bg-slate-700 border-slate-600"
            />
            <Input
              value={textStyle.color}
              onChange={(e) => handleChange('color', e.target.value)}
              className="flex-1 bg-slate-700 border-slate-600 text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {['#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'].map((color) => (
            <Button
              key={color}
              variant="outline"
              size="sm"
              className="h-8 w-full p-0 border-2"
              style={{ backgroundColor: color, borderColor: textStyle.color === color ? '#ffffff' : color }}
              onClick={() => handleChange('color', color)}
            />
          ))}
        </div>
      </div>

      <Separator className="bg-slate-600" />

      {/* Shadow Effects */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-slate-300">Text Shadow</h4>
          <Switch
            checked={textStyle.shadow}
            onCheckedChange={(checked) => handleChange('shadow', checked)}
          />
        </div>

        {textStyle.shadow && (
          <div className="space-y-4 pl-4 border-l-2 border-slate-600">
            <div className="space-y-2">
              <Label className="text-slate-400 text-xs">Shadow Color</Label>
              <div className="flex space-x-2">
                <Input
                  type="color"
                  value={textStyle.shadowColor}
                  onChange={(e) => handleChange('shadowColor', e.target.value)}
                  className="w-12 h-8 p-1 bg-slate-700 border-slate-600"
                />
                <Input
                  value={textStyle.shadowColor}
                  onChange={(e) => handleChange('shadowColor', e.target.value)}
                  className="flex-1 bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-400 text-xs">Blur: {textStyle.shadowBlur}px</Label>
              <Slider
                value={[textStyle.shadowBlur]}
                onValueChange={(value) => handleChange('shadowBlur', value[0])}
                min={0}
                max={20}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-400 text-xs">Offset: {textStyle.shadowOffset}px</Label>
              <Slider
                value={[textStyle.shadowOffset]}
                onValueChange={(value) => handleChange('shadowOffset', value[0])}
                min={0}
                max={15}
                step={1}
                className="w-full"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
