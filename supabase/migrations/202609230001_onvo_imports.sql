-- Preserve short historical questions without relaxing new portfolio submissions.
begin;

alter table public.ask_questions
  add column if not exists import_source text
    check (import_source ~ '^onvo:[a-z0-9_.-]{1,64}:[0-9]{1,32}$');

create unique index if not exists ask_questions_import_source_idx
  on public.ask_questions (import_source);

alter table public.ask_questions
  drop constraint if exists ask_questions_question_check;

alter table public.ask_questions
  add constraint ask_questions_question_check check (
    char_length(btrim(question)) between 15 and 1000
    or (
      import_source is not null
      and char_length(btrim(question)) between 1 and 1000
    )
  );

notify pgrst, 'reload schema';
commit;
