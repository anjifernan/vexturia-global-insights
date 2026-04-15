ALTER TABLE public.reservas_turisticas 
ADD COLUMN num_adultos integer NOT NULL DEFAULT 1,
ADD COLUMN num_ninos integer NOT NULL DEFAULT 0,
ADD COLUMN direccion_huesped text,
ADD COLUMN importe_anticipo numeric NOT NULL DEFAULT 0,
ADD COLUMN importe_pendiente numeric NOT NULL DEFAULT 0;