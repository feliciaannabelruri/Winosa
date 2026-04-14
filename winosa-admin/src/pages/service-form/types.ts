export type ServiceFormState = {
  title:       string;
  slug:        string;
  description: string;
  icon:        string;
  isActive:    boolean;
};

export const DEFAULT_FORM: ServiceFormState = {
  title:       '',
  slug:        '',
  description: '',
  icon:        '',
  isActive:    true,
};

export const mergeApiData = (s: any): ServiceFormState => ({
  title:       s.title       ?? '',
  slug:        s.slug        ?? '',
  description: s.description ?? '',
  icon:        s.icon        ?? '',
  isActive:    s.isActive    ?? true,
});