import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { serviceService } from '../../services/serviceService';
import {
  ServiceFormState, ProcessStep, TechGroup,
  MobileFeature, MobileTechItem, PricingPlan,
  DEFAULT_FORM, mergeApiData,
} from './types';

const generateSlug = (t: string) =>
  t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export const useServiceForm = (id?: string) => {
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form,     setForm]     = useState<ServiceFormState>(DEFAULT_FORM);
  const [loading,  setLoading]  = useState(false);
  const [fetching, setFetching] = useState(false);

  // ── Load ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isEdit) return;
    setFetching(true);
    serviceService.getById(id!)
      .then(res => setForm(mergeApiData(res.data!)))
      .catch(() => { toast.error('Failed to load service'); navigate('/services'); })
      .finally(() => setFetching(false));
  }, [id, isEdit, navigate]);

  // ── Submit ──────────────────────────────────────────────────────────────────
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

  // ── Generic ─────────────────────────────────────────────────────────────────
  const set = <K extends keyof ServiceFormState>(key: K, value: ServiceFormState[K]) =>
    setForm(p => ({ ...p, [key]: value }));

  const setTitle = (value: string) =>
    setForm(p => ({
      ...p,
      title: value,
      slug: isEdit ? p.slug : generateSlug(value),
    }));

  // ── Features (base) ─────────────────────────────────────────────────────────
  const addFeature = (val: string) =>
    setForm(p => ({ ...p, features: [...(p.features ?? []), val] }));
  const removeFeature = (idx: number) =>
    setForm(p => ({ ...p, features: (p.features ?? []).filter((_, i) => i !== idx) }));

  // ── Tools ───────────────────────────────────────────────────────────────────
  const addTool = (val: string) =>
    setForm(p => ({ ...p, tools: [...(p.tools ?? []), val] }));
  const removeTool = (idx: number) =>
    setForm(p => ({ ...p, tools: (p.tools ?? []).filter((_, i) => i !== idx) }));

  // ── Process steps ───────────────────────────────────────────────────────────
  const addProcessStep = () =>
    setForm(p => ({ ...p, process: [...(p.process ?? []), { highlight: '', title: '', desc: '' }] }));
  const updateProcessStep = (idx: number, field: keyof ProcessStep, val: string) =>
    setForm(p => ({
      ...p,
      process: (p.process ?? []).map((s, i) => i === idx ? { ...s, [field]: val } : s),
    }));
  const removeProcessStep = (idx: number) =>
    setForm(p => ({ ...p, process: (p.process ?? []).filter((_, i) => i !== idx) }));

  // ── Tech stack (web) ────────────────────────────────────────────────────────
  const addTechGroup = () =>
    setForm(p => ({ ...p, techStack: [...(p.techStack ?? []), { category: '', tech: [] }] }));
  const updateTechGroupCategory = (gIdx: number, val: string) =>
    setForm(p => ({
      ...p,
      techStack: (p.techStack ?? []).map((g, i) => i === gIdx ? { ...g, category: val } : g),
    }));
  const addTechToGroup = (gIdx: number, val: string) =>
    setForm(p => ({
      ...p,
      techStack: (p.techStack ?? []).map((g, i) =>
        i === gIdx ? { ...g, tech: [...(g.tech ?? []), val] } : g
      ),
    }));
  const removeTechFromGroup = (gIdx: number, tIdx: number) =>
    setForm(p => ({
      ...p,
      techStack: (p.techStack ?? []).map((g, i) =>
        i === gIdx ? { ...g, tech: (g.tech ?? []).filter((_, j) => j !== tIdx) } : g
      ),
    }));
  const removeTechGroup = (idx: number) =>
    setForm(p => ({ ...p, techStack: (p.techStack ?? []).filter((_, i) => i !== idx) }));

  // ── Mobile features ─────────────────────────────────────────────────────────
  const addMobileFeature = () =>
    setForm(p => ({ ...p, mobileFeatures: [...(p.mobileFeatures ?? []), { title: '', desc: '' }] }));
  const updateMobileFeature = (idx: number, field: keyof MobileFeature, val: string) =>
    setForm(p => ({
      ...p,
      mobileFeatures: (p.mobileFeatures ?? []).map((f, i) => i === idx ? { ...f, [field]: val } : f),
    }));
  const removeMobileFeature = (idx: number) =>
    setForm(p => ({ ...p, mobileFeatures: (p.mobileFeatures ?? []).filter((_, i) => i !== idx) }));

  // ── Mobile tech ─────────────────────────────────────────────────────────────
  const addMobileTech = () =>
    setForm(p => ({ ...p, mobileTech: [...(p.mobileTech ?? []), { title: '', desc: '', items: [] }] }));
  const updateMobileTech = (idx: number, field: 'title' | 'desc', val: string) =>
    setForm(p => ({
      ...p,
      mobileTech: (p.mobileTech ?? []).map((t, i) => i === idx ? { ...t, [field]: val } : t),
    }));
  const addMobileTechItem = (tIdx: number, val: string) =>
    setForm(p => ({
      ...p,
      mobileTech: (p.mobileTech ?? []).map((t, i) =>
        i === tIdx ? { ...t, items: [...(t.items ?? []), val] } : t
      ),
    }));
  const removeMobileTechItem = (tIdx: number, iIdx: number) =>
    setForm(p => ({
      ...p,
      mobileTech: (p.mobileTech ?? []).map((t, i) =>
        i === tIdx ? { ...t, items: (t.items ?? []).filter((_, j) => j !== iIdx) } : t
      ),
    }));
  const removeMobileTech = (idx: number) =>
    setForm(p => ({ ...p, mobileTech: (p.mobileTech ?? []).filter((_, i) => i !== idx) }));

  // ── Pricing (generic, keyed by planField) ───────────────────────────────────
  const makePricingHandlers = (planField: 'webPricingPlans' | 'mobilePricingPlans' | 'uiuxPricingPlans') => ({
    addPlan: () =>
      setForm(p => ({
        ...p,
        [planField]: [...(p[planField] ?? []), { name: '', price: '', desc: '', features: [], type: 'normal' as const }],
      })),
    updatePlan: (idx: number, field: keyof PricingPlan, val: any) =>
      setForm(p => ({
        ...p,
        [planField]: (p[planField] ?? []).map((plan, i) =>
          i === idx ? { ...plan, [field]: val } : plan
        ),
      })),
    addPlanFeature: (idx: number, val: string) =>
      setForm(p => ({
        ...p,
        [planField]: (p[planField] ?? []).map((plan, i) =>
          i === idx ? { ...plan, features: [...(plan.features ?? []), val] } : plan
        ),
      })),
    removePlanFeature: (idx: number, fIdx: number) =>
      setForm(p => ({
        ...p,
        [planField]: (p[planField] ?? []).map((plan, i) =>
          i === idx ? { ...plan, features: (plan.features ?? []).filter((_, j) => j !== fIdx) } : plan
        ),
      })),
    removePlan: (idx: number) =>
      setForm(p => ({ ...p, [planField]: (p[planField] ?? []).filter((_, i) => i !== idx) })),
    reorderPlan: (from: number, to: number) =>
      setForm(p => {
        const arr = [...(p[planField] ?? [])];
        if (to < 0 || to >= arr.length) return p;
        const [item] = arr.splice(from, 1);
        arr.splice(to, 0, item);
        return { ...p, [planField]: arr };
      }),
  });

  return {
    form, isEdit, loading, fetching,
    set, setTitle, handleSubmit,
    addFeature, removeFeature,
    addTool, removeTool,
    addProcessStep, updateProcessStep, removeProcessStep,
    addTechGroup, updateTechGroupCategory, addTechToGroup,
    removeTechFromGroup, removeTechGroup,
    addMobileFeature, updateMobileFeature, removeMobileFeature,
    addMobileTech, updateMobileTech, addMobileTechItem,
    removeMobileTechItem, removeMobileTech,
    webPricing:    makePricingHandlers('webPricingPlans'),
    mobilePricing: makePricingHandlers('mobilePricingPlans'),
    uiuxPricing:   makePricingHandlers('uiuxPricingPlans'),
  };
};