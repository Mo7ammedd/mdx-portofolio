\set ON_ERROR_STOP on
SELECT version();

CREATE TEMP TABLE posts (id integer PRIMARY KEY, title text NOT NULL, created_at timestamp NOT NULL);
INSERT INTO posts
SELECT id, 'Post ' || id, timestamp '2026-03-10 14:23:00' - (id / 3) * interval '1 minute'
FROM generate_series(1, 103) AS id;
CREATE INDEX ON posts (created_at DESC, id DESC);

DO $$
DECLARE
  expected integer[];
  actual integer[] := ARRAY[]::integer[];
  page_ids integer[];
  offset_ids integer[];
  cursor_time timestamp := 'infinity';
  cursor_id integer := 2147483647;
  page_offset integer := 0;
  naive_count integer;
BEGIN
  SELECT array_agg(id ORDER BY created_at DESC, id DESC) INTO expected FROM posts;
  LOOP
    SELECT array_agg(id ORDER BY created_at DESC, id DESC) INTO page_ids FROM (
      SELECT id, created_at FROM posts
      WHERE (created_at, id) < (cursor_time, cursor_id)
      ORDER BY created_at DESC, id DESC LIMIT 10
    ) AS page;
    EXIT WHEN page_ids IS NULL;
    SELECT array_agg(id ORDER BY created_at DESC, id DESC) INTO offset_ids FROM (
      SELECT id, created_at FROM posts
      ORDER BY created_at DESC, id DESC LIMIT 10 OFFSET page_offset
    ) AS page;
    IF page_ids IS DISTINCT FROM offset_ids THEN RAISE EXCEPTION 'Cursor and OFFSET disagree at %', page_offset; END IF;
    actual := actual || page_ids;
    SELECT created_at, id INTO cursor_time, cursor_id FROM posts WHERE id = page_ids[array_length(page_ids, 1)];
    page_offset := page_offset + 10;
  END LOOP;
  IF actual IS DISTINCT FROM expected OR array_length(actual, 1) <> 103 THEN
    RAISE EXCEPTION 'Cursor traversal skipped or duplicated rows';
  END IF;
  -- Page one ends inside a group of tied timestamps. A timestamp-only cursor
  -- drops the rest of that group; the tuple cursor above keeps all rows.
  SELECT created_at INTO cursor_time FROM posts ORDER BY created_at DESC, id DESC LIMIT 1 OFFSET 9;
  SELECT count(*) INTO naive_count FROM posts WHERE created_at < cursor_time;
  IF naive_count >= 93 THEN RAISE EXCEPTION 'Fixture did not exercise a timestamp tie'; END IF;
  RAISE NOTICE 'PASS: tuple ordering, all 11 pages, tied timestamps, final partial page, and exhausted cursor';
END $$;
