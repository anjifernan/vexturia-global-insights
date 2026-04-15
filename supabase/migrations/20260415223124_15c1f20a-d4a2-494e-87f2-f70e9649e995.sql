
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  telefono TEXT,
  email TEXT,
  origen TEXT NOT NULL DEFAULT 'web',
  estado TEXT NOT NULL DEFAULT 'Nuevo',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Public can insert (anonymous visitors from valuation page)
CREATE POLICY "Anyone can insert leads"
ON public.leads
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only authenticated users can view leads
CREATE POLICY "Authenticated can view leads"
ON public.leads
FOR SELECT
TO authenticated
USING (true);

-- Only authenticated users can update leads
CREATE POLICY "Authenticated can update leads"
ON public.leads
FOR UPDATE
TO authenticated
USING (true);

-- Only authenticated users can delete leads
CREATE POLICY "Authenticated can delete leads"
ON public.leads
FOR DELETE
TO authenticated
USING (true);

-- Trigger for updated_at
CREATE TRIGGER update_leads_updated_at
BEFORE UPDATE ON public.leads
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
