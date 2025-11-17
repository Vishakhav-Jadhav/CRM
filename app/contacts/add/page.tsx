'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useCRMStore } from '@/lib/store';
import { AddContactForm } from '@/components/contacts/add-contact-form';
import { useToast } from '@/hooks/use-toast';

interface ContactFormData {
  name: string;
  title: string;
  current_company: string;
  past_companies: string[];
  reporting_manager: string;
  phone: string;
  email: string;
  address_block: string;
  address_street: string;
  address_city: string;
  address_state: string;
  address_country: string;
  address_postal_code: string;
}

export default function AddContactPage() {
  const router = useRouter();
  const addContact = useCRMStore((state) => state.addContact);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPastCompanies, setSelectedPastCompanies] = useState<string[]>([]);
  const [managerSearchQuery, setManagerSearchQuery] = useState('');
  const [showManagerDropdown, setShowManagerDropdown] = useState(false);
  const { toast } = useToast();

  const {
    watch,
    setValue,
  } = useForm<ContactFormData>({
    defaultValues: {
      name: '',
      title: '',
      current_company: '',
      past_companies: [],
      reporting_manager: '',
      phone: '',
      email: '',
      address_block: '',
      address_street: '',
      address_city: '',
      address_state: '',
      address_country: '',
      address_postal_code: '',
    },
    mode: 'onChange',
  });

  // Watch all form values for the preview
  const formValues = watch();

  const handlePastCompanyToggle = (companyId: string) => {
    setSelectedPastCompanies((prev) => {
      if (prev.includes(companyId)) {
        return prev.filter((id) => id !== companyId);
      } else {
        return [...prev, companyId];
      }
    });
    setValue('past_companies', selectedPastCompanies);
  };

  const handleManagerSelect = (contact: any) => {
    setValue('reporting_manager', `${contact.first_name} ${contact.last_name}`);
    setManagerSearchQuery(`${contact.first_name} ${contact.last_name}`);
    setShowManagerDropdown(false);
  };

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      // Split name into first and last name
      const nameParts = data.name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      // Prepare contact data for API
      const contactData = {
        first_name: firstName,
        last_name: lastName,
        email: data.email || undefined,
        phone: data.phone || undefined,
        position: data.title || undefined,
        company_id: data.current_company && data.current_company !== 'none' ? data.current_company : undefined,
      };

      await addContact(contactData);

      toast({
        title: 'Success',
        description: 'Contact has been created successfully.',
      });

      router.push('/contacts');
    } catch (error) {
      console.error('Error creating contact:', error);
      toast({
        title: 'Error',
        description: 'Failed to create contact. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/contacts');
  };

  return (
    <AddContactForm
      onSubmit={onSubmit}
      onCancel={handleCancel}
      isSubmitting={isSubmitting}
      formValues={formValues}
      selectedPastCompanies={selectedPastCompanies}
      managerSearchQuery={managerSearchQuery}
      showManagerDropdown={showManagerDropdown}
      onPastCompanyToggle={handlePastCompanyToggle}
      onManagerSelect={handleManagerSelect}
      onManagerSearchChange={setManagerSearchQuery}
      setShowManagerDropdown={setShowManagerDropdown}
    />
  );
}
