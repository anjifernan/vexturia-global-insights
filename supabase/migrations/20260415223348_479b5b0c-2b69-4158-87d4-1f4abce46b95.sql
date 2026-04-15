
CREATE TABLE public.configuracion (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  telefono TEXT,
  email TEXT,
  direccion TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.configuracion ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view config"
ON public.configuracion FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated can insert config"
ON public.configuracion FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated can update config"
ON public.configuracion FOR UPDATE TO authenticated USING (true);

CREATE TRIGGER update_configuracion_updated_at
BEFORE UPDATE ON public.configuracion
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
