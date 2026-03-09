-- ============================================================
-- CRM Lead Scoring Schema — Supabase PostgreSQL
-- Supabase nativo (SQL), sin Prisma
-- ============================================================

-- 1. TABLAS PRINCIPALES
CREATE TABLE leads (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email        TEXT UNIQUE NOT NULL,
  name         TEXT,
  company      TEXT,
  title        TEXT,
  score        INT DEFAULT 0,         -- score actual
  stage        TEXT DEFAULT 'prospect' CHECK (stage IN ('prospect','mql','sal','sql','customer','lost')),
  source       TEXT,                   -- organic | paid | referral | outbound
  custom_data  JSONB DEFAULT '{}',    -- campos custom por nicho
  last_activity_at TIMESTAMPTZ DEFAULT NOW(),
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE lead_events (
  id          BIGSERIAL PRIMARY KEY,
  lead_id     UUID REFERENCES leads(id) ON DELETE CASCADE,
  event_type  TEXT NOT NULL,    -- page_visit | email_open | demo_request | pricing_visit | unsubscribe
  meta        JSONB DEFAULT '{}',
  scored_pts  INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 2. SCORING MATRIX (función SQL pura)
CREATE OR REPLACE FUNCTION calculate_score_delta(event_type TEXT) RETURNS INT AS $$
BEGIN
  RETURN CASE event_type
    -- Alta intención
    WHEN 'demo_request'       THEN  75
    WHEN 'pricing_visit'      THEN  50
    WHEN 'whitepaper_download' THEN 25
    WHEN 'contact_sales'      THEN  60
    -- Media intención
    WHEN 'email_open'         THEN  10
    WHEN 'blog_visit'         THEN  15
    WHEN 'webinar_attended'   THEN  30
    -- Negativo
    WHEN 'unsubscribe'        THEN -20
    WHEN 'spam_report'        THEN -50
    WHEN 'bad_fit_company'    THEN -30
    ELSE 0
  END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 3. TRIGGER: actualiza score automáticamente al registrar evento
CREATE OR REPLACE FUNCTION apply_lead_event_score() RETURNS TRIGGER AS $$
DECLARE
  delta INT;
BEGIN
  delta := calculate_score_delta(NEW.event_type);
  NEW.scored_pts := delta;

  UPDATE leads
  SET
    score = GREATEST(0, score + delta),   -- score nunca baja de 0
    last_activity_at = NOW(),
    stage = CASE
      WHEN (score + delta) >= 150 THEN 'sql'
      WHEN (score + delta) >= 100 THEN 'sal'
      WHEN (score + delta) >= 50  THEN 'mql'
      ELSE stage
    END,
    updated_at = NOW()
  WHERE id = NEW.lead_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_lead_event_score
  BEFORE INSERT ON lead_events
  FOR EACH ROW EXECUTE FUNCTION apply_lead_event_score();

-- 4. DECAY MODEL: ejecutar con pg_cron cada 24h
-- Reduce score en 10 pts por cada 30 días sin actividad
CREATE OR REPLACE FUNCTION apply_score_decay() RETURNS void AS $$
BEGIN
  UPDATE leads
  SET
    score = GREATEST(0, score - (
      EXTRACT(DAY FROM NOW() - last_activity_at)::INT / 30 * 10
    )),
    updated_at = NOW()
  WHERE last_activity_at < NOW() - INTERVAL '30 days'
    AND score > 0
    AND stage NOT IN ('customer', 'lost');
END;
$$ LANGUAGE plpgsql;

-- Programar con pg_cron (Supabase tiene pg_cron habilitado)
-- SELECT cron.schedule('lead-decay', '0 3 * * *', 'SELECT apply_score_decay()');

-- 5. RLS: Multi-tenant (cada organización ve solo sus leads)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY leads_org_isolation ON leads
  USING (custom_data->>'org_id' = auth.jwt()->>'org_id');
