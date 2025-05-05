
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { EntryData, EntryStatus, fractionToDecimal } from '@/hooks/useEntries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Define the validation schema with zod
const formSchema = z.object({
  room: z.string().min(1, 'Room is required'),
  floor: z.string().optional(),
  width: z.string().min(1, 'Width is required'),
  height: z.string().min(1, 'Height is required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
  film_required: z.boolean().default(true),
  notes: z.string().optional(),
  status: z.enum(['measured', 'cut', 'installed', 'under_review', 'deleted'])
});

type FormValues = z.infer<typeof formSchema>;

interface MeasurementFormProps {
  projectId: string;
  initialData?: Partial<EntryData>;
  onSubmit: (data: EntryData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

export const MeasurementForm: React.FC<MeasurementFormProps> = ({
  projectId,
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitLabel = 'Save'
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      room: initialData?.room || '',
      floor: initialData?.floor || '',
      width: initialData?.width ? String(initialData.width) : '',
      height: initialData?.height ? String(initialData.height) : '',
      quantity: initialData?.quantity || 1,
      film_required: initialData?.film_required ?? true,
      notes: initialData?.notes || '',
      status: (initialData?.status as EntryStatus) || 'measured'
    }
  });

  const handleSubmit: SubmitHandler<FormValues> = (formData) => {
    // Convert width and height string to decimal
    const width = fractionToDecimal(formData.width);
    const height = fractionToDecimal(formData.height);

    const entryData: EntryData = {
      ...initialData as EntryData,
      project_id: projectId,
      room: formData.room,
      floor: formData.floor,
      width: width,
      height: height,
      quantity: formData.quantity,
      film_required: formData.film_required,
      notes: formData.notes,
      status: formData.status
    };

    onSubmit(entryData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="room"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Room*</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Living Room" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="floor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Floor</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 1st Floor" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="width"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Width (inches)*</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 36 or 36 1/2" {...field} />
                </FormControl>
                <FormDescription>
                  Enter as whole number or fraction (e.g., 36 1/2)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="height"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Height (inches)*</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 48 or 48 3/4" {...field} />
                </FormControl>
                <FormDescription>
                  Enter as whole number or fraction (e.g., 48 3/4)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min={1} 
                    {...field} 
                    onChange={e => field.onChange(parseInt(e.target.value) || 1)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="measured">Measured</SelectItem>
                  <SelectItem value="cut">Cut</SelectItem>
                  <SelectItem value="installed">Installed</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="film_required"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Film Required</FormLabel>
                <FormDescription>
                  Check if film is required for this window
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter any additional notes here"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
};
