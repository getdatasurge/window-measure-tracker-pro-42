
import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { 
  FormItem, 
  FormLabel, 
  FormDescription, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X, Tag } from 'lucide-react';
import { ProjectFormValues } from '../../project-form/validation-schema';

interface TagsInputFieldProps {
  form: UseFormReturn<ProjectFormValues>;
}

const TagsInputField: React.FC<TagsInputFieldProps> = ({ form }) => {
  const [tagInput, setTagInput] = useState('');

  const addTag = () => {
    if (tagInput.trim()) {
      const currentTags = form.getValues('tags') || [];
      if (!currentTags.includes(tagInput.trim())) {
        form.setValue('tags', [...currentTags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    const currentTags = form.getValues('tags') || [];
    form.setValue(
      'tags',
      currentTags.filter(tag => tag !== tagToRemove)
    );
  };

  return (
    <FormItem>
      <FormLabel className="text-white">
        <Tag className="h-4 w-4 inline-block mr-2" />
        Tags
      </FormLabel>
      <div className="flex flex-wrap gap-2 mb-2">
        {(form.getValues('tags') || []).map((tag, index) => (
          <Badge key={index} variant="outline" className="bg-zinc-700 text-white border-zinc-600 py-1">
            {tag}
            <button 
              type="button" 
              onClick={() => removeTag(tag)}
              className="ml-2 text-zinc-400 hover:text-white"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="Add a tag"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addTag();
            }
          }}
          className="bg-zinc-800 border-zinc-700 text-white flex-1"
        />
        <button
          type="button"
          onClick={addTag}
          className="px-4 py-2 bg-zinc-700 text-white rounded-md hover:bg-zinc-600"
        >
          Add
        </button>
      </div>
      <FormDescription>
        Add relevant tags to help categorize and find this project later.
      </FormDescription>
      <FormMessage />
    </FormItem>
  );
};

export default TagsInputField;
