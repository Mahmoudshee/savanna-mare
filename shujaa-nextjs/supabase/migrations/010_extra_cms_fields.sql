-- Migration 010: extra CMS fields for homepage content
ALTER TABLE home_content
  ADD COLUMN IF NOT EXISTS sidebar_intro          TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS sidebar_reserve_note   TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS sidebar_bullets_json   JSONB NOT NULL DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS pricing_note           TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS departure_note         TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS contact_reply_note     TEXT NOT NULL DEFAULT '';

