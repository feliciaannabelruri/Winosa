import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { serviceService } from '../../services/serviceService';
import { ServiceFormState, DEFAULT_FORM, mergeApiData } from './types';

const generateSlug = (t: string) =>
  t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export const useServiceForm = (id?: string) => {
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form,     setForm]     = useState<ServiceFormState>(DEFAULT_FORM);
  const [loading,  setLoading]  = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    setFetching(true);
    serviceService.getById(id!)
      .then(res => setForm(mergeApiData(res.data!)))
      .catch(() => { toast.error('Failed to load service'); navigate('/services'); })
      .finally(() => setFetching(false));
  }, [id, isEdit, navigate]);

  const handleSubmit = async (isActive: boolean) => {
    if (!form.title || !form.slug || !form.description) {
      toast.error('Title, slug, and description are required');
      return;
    }
    setLoading(true);
    try {
      const payload = { ...form, isActive };
      if (isEdit) {
        await serviceService.update(id!, payload);
        toast.success('Service updated!');
      } else {
        await serviceService.create(payload);
        toast.success('Service created!');
      }
      navigate('/services');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const set = <K extends keyof ServiceFormState>(key: K, value: ServiceFormState[K]) =>
    setForm(p => ({ ...p, [key]: value }));

  const setTitle = (value: string) =>
    setForm(p => ({
      ...p,
      title: value,
      slug: isEdit ? p.slug : generateSlug(value),
    }));

  return {
    form, isEdit, loading, fetching,
    set, setTitle, handleSubmit,
  };
};