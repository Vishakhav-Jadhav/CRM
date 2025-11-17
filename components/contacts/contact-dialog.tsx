'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Contact } from '@/types';
import { useCRMStore } from '@/lib/store';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface ContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact?: Contact;
}

interface ContactFormData {
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  position?: string;
  company_id?: string;
}

export function ContactDialog({ open, onOpenChange, contact }: ContactDialogProps) {
  const companies = useCRMStore((state) => state.companies);
  const addContact = useCRMStore((state) => state.addContact);
  const updateContact = useCRMStore((state) => state.updateContact);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const { 
    register, 
    handleSubmit, 
    reset, 
    setValue, 
    watch,
    formState: { errors, isValid } 
  } = useForm<ContactFormData>({
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      position: '',
      company_id: undefined,
    },
    mode: 'onChange'
  });

  const watchedCompanyId = watch('company_id');

  useEffect(() => {
    if (contact) {
      reset({
        first_name: contact.first_name,
        last_name: contact.last_name,
        email: contact.email || '',
        phone: contact.phone || '',
        position: contact.position || '',
        company_id: contact.company_id || undefined,
      });
    } else {
      reset({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        position: '',
        company_id: undefined,
      });
    }
  }, [contact, reset]);

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      // Clean the data - remove empty strings and convert undefined to empty string for database
      const cleanedData = {
        first_name: data.first_name.trim(),
        last_name: data.last_name.trim(),
        email: data.email?.trim() || undefined,
        phone: data.phone?.trim() || undefined,
        position: data.position?.trim() || undefined,
        company_id: data.company_id && data.company_id !== 'none' ? data.company_id : undefined,
      };

      if (contact) {
        await updateContact(contact.id, cleanedData);
        toast({
          title: 'Success',
          description: 'Contact has been updated successfully and will appear in real-time across all users.',
        });
      } else {
        await addContact(cleanedData);
        toast({
          title: 'Success',
          description: 'Contact has been created successfully and will appear in real-time across all users.',
        });
      }
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving contact:', error);
      toast({
        title: 'Error',
        description: contact ? 'Failed to update contact. Please try again.' : 'Failed to create contact. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{contact ? 'Edit Contact' : 'Add Contact'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name *</Label>
              <Input
                id="first_name"
                {...register('first_name', { 
                  required: 'First name is required',
                  minLength: {
                    value: 2,
                    message: 'First name must be at least 2 characters'
                  }
                })}
                className={errors.first_name ? 'border-destructive' : ''}
              />
              {errors.first_name && (
                <p className="text-sm text-destructive">{errors.first_name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name *</Label>
              <Input
                id="last_name"
                {...register('last_name', { 
                  required: 'Last name is required',
                  minLength: {
                    value: 2,
                    message: 'Last name must be at least 2 characters'
                  }
                })}
                className={errors.last_name ? 'border-destructive' : ''}
              />
              {errors.last_name && (
                <p className="text-sm text-destructive">{errors.last_name.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              {...register('email', {
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              className={errors.email ? 'border-destructive' : ''}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              placeholder="+1 (555) 123-4567"
              {...register('phone')}
              className={errors.phone ? 'border-destructive' : ''}
            />
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">Position</Label>
            <Input
              id="position"
              placeholder="Software Engineer"
              {...register('position')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company_id">Company</Label>
            <Select
              value={watchedCompanyId || 'none'}
              onValueChange={(value) => setValue('company_id', value === 'none' ? undefined : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select company" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No company</SelectItem>
                {companies.map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-blue-800">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <p className="text-sm font-medium">Real-time Updates Active</p>
            </div>
            <p className="text-xs text-blue-700 mt-1">
              Changes will appear instantly across all connected users.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!isValid || isSubmitting}
            >
              {isSubmitting ? (
                contact ? 'Updating...' : 'Creating...'
              ) : (
                contact ? 'Update' : 'Create'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
