
import React from 'react';
import { FormSchema, SchemaForm } from '@/components/form-system';
import { z } from 'zod';

// Example schema for creating a project with dynamic fields and repeatable groups
const projectFormSchema: FormSchema = {
  fields: [
    {
      name: 'name',
      label: 'Project Name',
      type: 'text',
      placeholder: 'Enter project name',
      validation: { required: 'Project name is required' }
    },
    {
      name: 'type',
      label: 'Project Type',
      type: 'select',
      options: [
        { label: 'Residential', value: 'residential' },
        { label: 'Commercial', value: 'commercial' },
        { label: 'Industrial', value: 'industrial' }
      ],
      validation: { required: 'Project type is required' }
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      rows: 4,
      placeholder: 'Describe the project'
    },
    {
      name: 'preferredContactMethod',
      label: 'Preferred Contact Method',
      type: 'select',
      options: [
        { label: 'Email', value: 'Email' },
        { label: 'Phone', value: 'Phone' }
      ]
    },
    {
      name: 'contactInfo',
      label: 'Contact Information',
      type: 'dynamic',
      dynamicType: {
        dependsOn: 'preferredContactMethod',
        map: {
          Email: 'email',
          Phone: 'tel'
        }
      },
      placeholder: 'Enter contact details'
    },
    {
      name: 'locations',
      label: 'Project Locations',
      type: 'repeatable',
      minItems: 1,
      maxItems: 5,
      addButtonText: 'Add Location',
      removeButtonText: 'Remove Location',
      fields: [
        { name: 'address', label: 'Street Address', type: 'text' },
        { name: 'city', label: 'City', type: 'text' },
        { name: 'state', label: 'State/Province', type: 'text' },
        { name: 'zip', label: 'ZIP/Postal Code', type: 'text' }
      ]
    },
    {
      name: 'team',
      label: 'Team Members',
      type: 'repeatable',
      fields: [
        { name: 'name', label: 'Name', type: 'text' },
        { name: 'role', label: 'Role', type: 'text' },
        { name: 'email', label: 'Email', type: 'email' }
      ]
    }
  ]
};

// Create a matching Zod schema for validation
const zodSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  type: z.string().min(1, 'Project type is required'),
  description: z.string().optional(),
  preferredContactMethod: z.string().optional(),
  contactInfo: z.string().optional(),
  locations: z.array(
    z.object({
      address: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      zip: z.string().optional()
    })
  ).min(1, 'At least one location is required'),
  team: z.array(
    z.object({
      name: z.string().optional(),
      role: z.string().optional(),
      email: z.string().email('Invalid email format').optional()
    })
  ).optional()
});

export const ProjectFormExample: React.FC = () => {
  const handleSubmit = (data: any) => {
    console.log('Form submitted with:', data);
    // Handle form submission logic here
  };

  const defaultValues = {
    locations: [{ address: '', city: '', state: '', zip: '' }],
    team: []
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-6">Create Project</h1>
      <SchemaForm
        schema={projectFormSchema}
        defaultValues={defaultValues}
        zodSchema={zodSchema}
        onSubmit={handleSubmit}
        submitText="Create Project"
      />
    </div>
  );
};

export default ProjectFormExample;
