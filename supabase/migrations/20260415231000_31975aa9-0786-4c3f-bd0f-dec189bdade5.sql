CREATE POLICY "Anon can view config"
ON public.configuracion
FOR SELECT
TO anon
USING (true);