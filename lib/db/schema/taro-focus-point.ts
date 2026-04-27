import {
  boolean,
  check,
  date,
  index,
  numeric,
  pgEnum,
  pgTable,
  smallint,
  text,
  timestamp,
  unique,
  uuid,
} from 'drizzle-orm/pg-core'
import { relations, sql } from 'drizzle-orm'

export const overallSystemAssessmentEnum = pgEnum('overall_system_assessment', [
  'strongly_agree',
  'mostly_agree',
  'mixed',
  'mostly_disagree',
  'strongly_disagree',
])

export const criteriaCoverageAssessmentEnum = pgEnum('criteria_coverage_assessment', [
  'fully_covered',
  'partially_covered',
  'not_covered',
])

export const scoringWeightPreferenceEnum = pgEnum('scoring_weight_preference', [
  'rule_based_heavier',
  'balanced_50_50',
  'ai_heavier',
  'no_clear_opinion',
])

export const primaryFocusChoiceEnum = pgEnum('primary_focus_choice', ['FP1', 'FP2', 'FP3', 'OTHER'])

export const systemTopChoiceOpinionEnum = pgEnum('system_top_choice_opinion', [
  'agree',
  'partially_agree',
  'disagree',
])

export const focusPointIdEnum = pgEnum('focus_point_id', ['FP1', 'FP2', 'FP3'])

export const taroFocusPointSubmissions = pgTable(
  'taro_focus_point_submissions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    formPath: text('form_path').notNull().default('/forms/taro-focus-point'),

    evaluatorFullName: text('evaluator_full_name'),
    evaluationDate: date('evaluation_date'),
    evaluatorRole: text('evaluator_role'),
    teachingExperienceYears: numeric('teaching_experience_years', { precision: 4, scale: 1 }),
    institutionOrDepartment: text('institution_or_department'),

    overallSystemAssessment: overallSystemAssessmentEnum('overall_system_assessment'),
    criteriaCoverageAssessment: criteriaCoverageAssessmentEnum('criteria_coverage_assessment'),
    criteriaAdjustmentNotes: text('criteria_adjustment_notes'),
    scoringWeightPreference: scoringWeightPreferenceEnum('scoring_weight_preference'),
    additionalFeedback: text('additional_feedback'),

    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    check('chk_taro_fp_submissions_form_path', sql`${table.formPath} = '/forms/taro-focus-point'`),
    check(
      'chk_taro_fp_submissions_teaching_exp_non_negative',
      sql`${table.teachingExperienceYears} is null or ${table.teachingExperienceYears} >= 0`,
    ),
    index('idx_taro_fp_submissions_created_at').on(table.createdAt),
    index('idx_taro_fp_submissions_form_path').on(table.formPath),
  ],
)

export const taroFocusPointCaseReviews = pgTable(
  'taro_focus_point_case_reviews',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    submissionId: uuid('submission_id')
      .notNull()
      .references(() => taroFocusPointSubmissions.id, { onDelete: 'cascade' }),

    caseNumber: smallint('case_number').notNull(),

    primaryFocusChoice: primaryFocusChoiceEnum('primary_focus_choice'),
    primaryFocusOtherText: text('primary_focus_other_text'),

    rankFp1: smallint('rank_fp1'),
    rankFp2: smallint('rank_fp2'),
    rankFp3: smallint('rank_fp3'),

    systemTopChoiceOpinion: systemTopChoiceOpinionEnum('system_top_choice_opinion'),
    systemTopChoiceReason: text('system_top_choice_reason'),

    scoreTeachingRelevance: smallint('score_teaching_relevance'),
    scoreProgramCorrectnessImpact: smallint('score_program_correctness_impact'),
    scoreMisunderstandingRisk: smallint('score_misunderstanding_risk'),
    scoreQuestionFitness: smallint('score_question_fitness'),

    caseFeedback: text('case_feedback'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    check('chk_taro_fp_case_reviews_case_number_range', sql`${table.caseNumber} between 1 and 3`),
    check(
      'chk_taro_fp_case_reviews_rank_fp1_range',
      sql`${table.rankFp1} is null or ${table.rankFp1} between 1 and 3`,
    ),
    check(
      'chk_taro_fp_case_reviews_rank_fp2_range',
      sql`${table.rankFp2} is null or ${table.rankFp2} between 1 and 3`,
    ),
    check(
      'chk_taro_fp_case_reviews_rank_fp3_range',
      sql`${table.rankFp3} is null or ${table.rankFp3} between 1 and 3`,
    ),
    check(
      'chk_taro_fp_case_reviews_rank_unique_12',
      sql`${table.rankFp1} is null or ${table.rankFp2} is null or ${table.rankFp1} <> ${table.rankFp2}`,
    ),
    check(
      'chk_taro_fp_case_reviews_rank_unique_13',
      sql`${table.rankFp1} is null or ${table.rankFp3} is null or ${table.rankFp1} <> ${table.rankFp3}`,
    ),
    check(
      'chk_taro_fp_case_reviews_rank_unique_23',
      sql`${table.rankFp2} is null or ${table.rankFp3} is null or ${table.rankFp2} <> ${table.rankFp3}`,
    ),
    check(
      'chk_taro_fp_case_reviews_score_teaching',
      sql`${table.scoreTeachingRelevance} is null or ${table.scoreTeachingRelevance} between 1 and 5`,
    ),
    check(
      'chk_taro_fp_case_reviews_score_correctness',
      sql`${table.scoreProgramCorrectnessImpact} is null or ${table.scoreProgramCorrectnessImpact} between 1 and 5`,
    ),
    check(
      'chk_taro_fp_case_reviews_score_misunderstanding',
      sql`${table.scoreMisunderstandingRisk} is null or ${table.scoreMisunderstandingRisk} between 1 and 5`,
    ),
    check(
      'chk_taro_fp_case_reviews_score_question_fitness',
      sql`${table.scoreQuestionFitness} is null or ${table.scoreQuestionFitness} between 1 and 5`,
    ),
    unique('uq_taro_fp_case_review').on(table.submissionId, table.caseNumber),
    index('idx_taro_fp_case_reviews_submission').on(table.submissionId),
    index('idx_taro_fp_case_reviews_case').on(table.caseNumber),
    index('idx_taro_fp_case_reviews_opinion').on(table.systemTopChoiceOpinion),
  ],
)

export const taroFocusPointCandidates = pgTable(
  'taro_focus_point_candidates',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    formPath: text('form_path').notNull().default('/forms/taro-focus-point'),
    caseNumber: smallint('case_number').notNull(),
    focusPointId: focusPointIdEnum('focus_point_id').notNull(),
    codeSpan: text('code_span').notNull(),
    constructType: text('construct_type').notNull(),
    systemScore: numeric('system_score', { precision: 4, scale: 2 }).notNull(),
    isSystemTop: boolean('is_system_top').notNull().default(false),
  },
  (table) => [
    check('chk_taro_fp_candidates_form_path', sql`${table.formPath} = '/forms/taro-focus-point'`),
    check('chk_taro_fp_candidates_case_number_range', sql`${table.caseNumber} between 1 and 3`),
    check(
      'chk_taro_fp_candidates_score_range',
      sql`${table.systemScore} >= 0 and ${table.systemScore} <= 1`,
    ),
    unique('uq_taro_fp_candidates').on(table.formPath, table.caseNumber, table.focusPointId),
    index('idx_taro_fp_candidates_case').on(table.caseNumber, table.focusPointId),
  ],
)

export const taroFocusPointSubmissionsRelations = relations(
  taroFocusPointSubmissions,
  ({ many }) => ({
    caseReviews: many(taroFocusPointCaseReviews),
  }),
)

export const taroFocusPointCaseReviewsRelations = relations(
  taroFocusPointCaseReviews,
  ({ one }) => ({
    submission: one(taroFocusPointSubmissions, {
      fields: [taroFocusPointCaseReviews.submissionId],
      references: [taroFocusPointSubmissions.id],
    }),
  }),
)

