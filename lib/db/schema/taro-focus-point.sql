-- TARO Focus Point evaluation storage
-- Form route: /forms/taro-focus-point

create extension if not exists pgcrypto;

-- Enums
do $$ begin
  create type overall_system_assessment as enum (
    'strongly_agree',
    'mostly_agree',
    'mixed',
    'mostly_disagree',
    'strongly_disagree'
  );
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type criteria_coverage_assessment as enum (
    'fully_covered',
    'partially_covered',
    'not_covered'
  );
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type scoring_weight_preference as enum (
    'rule_based_heavier',
    'balanced_50_50',
    'ai_heavier',
    'no_clear_opinion'
  );
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type primary_focus_choice as enum ('FP1', 'FP2', 'FP3', 'OTHER');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type system_top_choice_opinion as enum ('agree', 'partially_agree', 'disagree');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type focus_point_id as enum ('FP1', 'FP2', 'FP3');
exception
  when duplicate_object then null;
end $$;

-- High-level evaluator submission
create table if not exists taro_focus_point_submissions (
  id uuid primary key default gen_random_uuid(),
  form_path text not null default '/forms/taro-focus-point'
    check (form_path = '/forms/taro-focus-point'),

  evaluator_full_name text,
  evaluation_date date,
  evaluator_role text,
  teaching_experience_years numeric(4, 1)
    check (teaching_experience_years is null or teaching_experience_years >= 0),
  institution_or_department text,

  overall_system_assessment overall_system_assessment,
  criteria_coverage_assessment criteria_coverage_assessment,
  criteria_adjustment_notes text,
  scoring_weight_preference scoring_weight_preference,
  additional_feedback text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_taro_fp_submissions_created_at
  on taro_focus_point_submissions (created_at desc);

create index if not exists idx_taro_fp_submissions_form_path
  on taro_focus_point_submissions (form_path);

-- Per-case answers
create table if not exists taro_focus_point_case_reviews (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references taro_focus_point_submissions(id) on delete cascade,

  case_number smallint not null check (case_number between 1 and 3),

  primary_focus_choice primary_focus_choice,
  primary_focus_other_text text,

  rank_fp1 smallint check (rank_fp1 is null or rank_fp1 between 1 and 3),
  rank_fp2 smallint check (rank_fp2 is null or rank_fp2 between 1 and 3),
  rank_fp3 smallint check (rank_fp3 is null or rank_fp3 between 1 and 3),

  -- Ensure rank slots are not duplicated
  check (rank_fp1 is null or rank_fp2 is null or rank_fp1 <> rank_fp2),
  check (rank_fp1 is null or rank_fp3 is null or rank_fp1 <> rank_fp3),
  check (rank_fp2 is null or rank_fp3 is null or rank_fp2 <> rank_fp3),

  system_top_choice_opinion system_top_choice_opinion,
  system_top_choice_reason text,

  score_teaching_relevance smallint
    check (score_teaching_relevance is null or score_teaching_relevance between 1 and 5),
  score_program_correctness_impact smallint
    check (score_program_correctness_impact is null or score_program_correctness_impact between 1 and 5),
  score_misunderstanding_risk smallint
    check (score_misunderstanding_risk is null or score_misunderstanding_risk between 1 and 5),
  score_question_fitness smallint
    check (score_question_fitness is null or score_question_fitness between 1 and 5),

  case_feedback text,

  created_at timestamptz not null default now(),

  constraint uq_taro_fp_case_review unique (submission_id, case_number)
);

create index if not exists idx_taro_fp_case_reviews_submission
  on taro_focus_point_case_reviews (submission_id);

create index if not exists idx_taro_fp_case_reviews_case
  on taro_focus_point_case_reviews (case_number);

create index if not exists idx_taro_fp_case_reviews_opinion
  on taro_focus_point_case_reviews (system_top_choice_opinion);

-- Optional static metadata
create table if not exists taro_focus_point_candidates (
  id uuid primary key default gen_random_uuid(),
  form_path text not null default '/forms/taro-focus-point'
    check (form_path = '/forms/taro-focus-point'),
  case_number smallint not null check (case_number between 1 and 3),
  focus_point_id focus_point_id not null,
  code_span text not null,
  construct_type text not null,
  system_score numeric(4, 2) not null check (system_score >= 0 and system_score <= 1),
  is_system_top boolean not null default false,
  unique (form_path, case_number, focus_point_id)
);

create index if not exists idx_taro_fp_candidates_case
  on taro_focus_point_candidates (case_number, focus_point_id);

-- Seed current 3 cases
insert into taro_focus_point_candidates
(form_path, case_number, focus_point_id, code_span, construct_type, system_score, is_system_top)
values
  ('/forms/taro-focus-point', 1, 'FP1', 'for i in range(n):', 'loop_boundary', 0.92, true),
  ('/forms/taro-focus-point', 1, 'FP2', 'if i % 2 == 0:', 'branch_condition', 0.87, false),
  ('/forms/taro-focus-point', 1, 'FP3', 's += i', 'accumulator_update', 0.80, false),

  ('/forms/taro-focus-point', 2, 'FP1', 'if ch == c:', 'branch_condition', 0.91, true),
  ('/forms/taro-focus-point', 2, 'FP2', 'for ch in s:', 'loop_boundary', 0.88, false),
  ('/forms/taro-focus-point', 2, 'FP3', 'count += 1', 'accumulator_update', 0.79, false),

  ('/forms/taro-focus-point', 3, 'FP1', 'for i in range(1, n):', 'loop_boundary', 0.90, true),
  ('/forms/taro-focus-point', 3, 'FP2', 'if nums[i] > max_val:', 'branch_condition', 0.88, false),
  ('/forms/taro-focus-point', 3, 'FP3', 'max_val = nums[i]', 'accumulator_update', 0.77, false)
on conflict (form_path, case_number, focus_point_id) do update
set
  code_span = excluded.code_span,
  construct_type = excluded.construct_type,
  system_score = excluded.system_score,
  is_system_top = excluded.is_system_top;

