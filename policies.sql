GRANT USAGE ON SCHEMA public TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE
    ON TABLE public.pelanggan, public.pemesanan, public.transaksi_kas
    TO anon;

ALTER TABLE public.pelanggan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pemesanan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transaksi_kas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS pelanggan_anon_insert ON public.pelanggan;
DROP POLICY IF EXISTS pelanggan_anon_crud ON public.pelanggan;
CREATE POLICY pelanggan_anon_crud
    ON public.pelanggan
    FOR ALL
    TO anon
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS pemesanan_anon_crud ON public.pemesanan;
CREATE POLICY pemesanan_anon_crud
    ON public.pemesanan
    FOR ALL
    TO anon
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS transaksi_kas_anon_crud ON public.transaksi_kas;
CREATE POLICY transaksi_kas_anon_crud
    ON public.transaksi_kas
    FOR ALL
    TO anon
    USING (true)
    WITH CHECK (true);
