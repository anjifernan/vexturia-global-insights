
-- Tabla de propiedades turísticas
CREATE TABLE public.propiedades_turisticas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  direccion TEXT NOT NULL,
  num_habitaciones INTEGER NOT NULL DEFAULT 1,
  capacidad_maxima INTEGER NOT NULL DEFAULT 2,
  precio_noche NUMERIC(10,2) NOT NULL DEFAULT 0,
  imagen_url TEXT,
  estado TEXT NOT NULL DEFAULT 'disponible',
  notas TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabla de reservas turísticas
CREATE TABLE public.reservas_turisticas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  propiedad_id UUID NOT NULL REFERENCES public.propiedades_turisticas(id) ON DELETE CASCADE,
  nombre_huesped TEXT NOT NULL,
  telefono_huesped TEXT,
  email_huesped TEXT,
  nacionalidad TEXT,
  fecha_entrada DATE NOT NULL,
  fecha_salida DATE NOT NULL,
  precio_noche NUMERIC(10,2) NOT NULL DEFAULT 0,
  importe_total NUMERIC(10,2) NOT NULL DEFAULT 0,
  estado TEXT NOT NULL DEFAULT 'confirmada',
  notas TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.propiedades_turisticas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservas_turisticas ENABLE ROW LEVEL SECURITY;

-- Políticas: acceso completo para usuarios autenticados
CREATE POLICY "Authenticated full access propiedades" ON public.propiedades_turisticas FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated full access reservas" ON public.reservas_turisticas FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_propiedades_turisticas_updated_at
  BEFORE UPDATE ON public.propiedades_turisticas
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reservas_turisticas_updated_at
  BEFORE UPDATE ON public.reservas_turisticas
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
