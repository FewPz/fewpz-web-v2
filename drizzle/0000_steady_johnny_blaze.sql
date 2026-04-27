CREATE TYPE "public"."criteria_coverage_assessment" AS ENUM('fully_covered', 'partially_covered', 'not_covered');--> statement-breakpoint
CREATE TYPE "public"."focus_point_id" AS ENUM('FP1', 'FP2', 'FP3');--> statement-breakpoint
CREATE TYPE "public"."overall_system_assessment" AS ENUM('strongly_agree', 'mostly_agree', 'mixed', 'mostly_disagree', 'strongly_disagree');--> statement-breakpoint
CREATE TYPE "public"."primary_focus_choice" AS ENUM('FP1', 'FP2', 'FP3', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."scoring_weight_preference" AS ENUM('rule_based_heavier', 'balanced_50_50', 'ai_heavier', 'no_clear_opinion');--> statement-breakpoint
CREATE TYPE "public"."system_top_choice_opinion" AS ENUM('agree', 'partially_agree', 'disagree');--> statement-breakpoint
CREATE TABLE "taro_focus_point_candidates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"form_path" text DEFAULT '/forms/taro-focus-point' NOT NULL,
	"case_number" smallint NOT NULL,
	"focus_point_id" "focus_point_id" NOT NULL,
	"code_span" text NOT NULL,
	"construct_type" text NOT NULL,
	"system_score" numeric(4, 2) NOT NULL,
	"is_system_top" boolean DEFAULT false NOT NULL,
	CONSTRAINT "uq_taro_fp_candidates" UNIQUE("form_path","case_number","focus_point_id"),
	CONSTRAINT "chk_taro_fp_candidates_form_path" CHECK ("taro_focus_point_candidates"."form_path" = '/forms/taro-focus-point'),
	CONSTRAINT "chk_taro_fp_candidates_case_number_range" CHECK ("taro_focus_point_candidates"."case_number" between 1 and 3),
	CONSTRAINT "chk_taro_fp_candidates_score_range" CHECK ("taro_focus_point_candidates"."system_score" >= 0 and "taro_focus_point_candidates"."system_score" <= 1)
);
--> statement-breakpoint
CREATE TABLE "taro_focus_point_case_reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"submission_id" uuid NOT NULL,
	"case_number" smallint NOT NULL,
	"primary_focus_choice" "primary_focus_choice",
	"primary_focus_other_text" text,
	"rank_fp1" smallint,
	"rank_fp2" smallint,
	"rank_fp3" smallint,
	"system_top_choice_opinion" "system_top_choice_opinion",
	"system_top_choice_reason" text,
	"score_teaching_relevance" smallint,
	"score_program_correctness_impact" smallint,
	"score_misunderstanding_risk" smallint,
	"score_question_fitness" smallint,
	"case_feedback" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "uq_taro_fp_case_review" UNIQUE("submission_id","case_number"),
	CONSTRAINT "chk_taro_fp_case_reviews_case_number_range" CHECK ("taro_focus_point_case_reviews"."case_number" between 1 and 3),
	CONSTRAINT "chk_taro_fp_case_reviews_rank_fp1_range" CHECK ("taro_focus_point_case_reviews"."rank_fp1" is null or "taro_focus_point_case_reviews"."rank_fp1" between 1 and 3),
	CONSTRAINT "chk_taro_fp_case_reviews_rank_fp2_range" CHECK ("taro_focus_point_case_reviews"."rank_fp2" is null or "taro_focus_point_case_reviews"."rank_fp2" between 1 and 3),
	CONSTRAINT "chk_taro_fp_case_reviews_rank_fp3_range" CHECK ("taro_focus_point_case_reviews"."rank_fp3" is null or "taro_focus_point_case_reviews"."rank_fp3" between 1 and 3),
	CONSTRAINT "chk_taro_fp_case_reviews_rank_unique_12" CHECK ("taro_focus_point_case_reviews"."rank_fp1" is null or "taro_focus_point_case_reviews"."rank_fp2" is null or "taro_focus_point_case_reviews"."rank_fp1" <> "taro_focus_point_case_reviews"."rank_fp2"),
	CONSTRAINT "chk_taro_fp_case_reviews_rank_unique_13" CHECK ("taro_focus_point_case_reviews"."rank_fp1" is null or "taro_focus_point_case_reviews"."rank_fp3" is null or "taro_focus_point_case_reviews"."rank_fp1" <> "taro_focus_point_case_reviews"."rank_fp3"),
	CONSTRAINT "chk_taro_fp_case_reviews_rank_unique_23" CHECK ("taro_focus_point_case_reviews"."rank_fp2" is null or "taro_focus_point_case_reviews"."rank_fp3" is null or "taro_focus_point_case_reviews"."rank_fp2" <> "taro_focus_point_case_reviews"."rank_fp3"),
	CONSTRAINT "chk_taro_fp_case_reviews_score_teaching" CHECK ("taro_focus_point_case_reviews"."score_teaching_relevance" is null or "taro_focus_point_case_reviews"."score_teaching_relevance" between 1 and 5),
	CONSTRAINT "chk_taro_fp_case_reviews_score_correctness" CHECK ("taro_focus_point_case_reviews"."score_program_correctness_impact" is null or "taro_focus_point_case_reviews"."score_program_correctness_impact" between 1 and 5),
	CONSTRAINT "chk_taro_fp_case_reviews_score_misunderstanding" CHECK ("taro_focus_point_case_reviews"."score_misunderstanding_risk" is null or "taro_focus_point_case_reviews"."score_misunderstanding_risk" between 1 and 5),
	CONSTRAINT "chk_taro_fp_case_reviews_score_question_fitness" CHECK ("taro_focus_point_case_reviews"."score_question_fitness" is null or "taro_focus_point_case_reviews"."score_question_fitness" between 1 and 5)
);
--> statement-breakpoint
CREATE TABLE "taro_focus_point_submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"form_path" text DEFAULT '/forms/taro-focus-point' NOT NULL,
	"evaluator_full_name" text,
	"evaluation_date" date,
	"evaluator_role" text,
	"teaching_experience_years" numeric(4, 1),
	"institution_or_department" text,
	"overall_system_assessment" "overall_system_assessment",
	"criteria_coverage_assessment" "criteria_coverage_assessment",
	"criteria_adjustment_notes" text,
	"scoring_weight_preference" "scoring_weight_preference",
	"additional_feedback" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "chk_taro_fp_submissions_form_path" CHECK ("taro_focus_point_submissions"."form_path" = '/forms/taro-focus-point'),
	CONSTRAINT "chk_taro_fp_submissions_teaching_exp_non_negative" CHECK ("taro_focus_point_submissions"."teaching_experience_years" is null or "taro_focus_point_submissions"."teaching_experience_years" >= 0)
);
--> statement-breakpoint
ALTER TABLE "taro_focus_point_case_reviews" ADD CONSTRAINT "taro_focus_point_case_reviews_submission_id_taro_focus_point_submissions_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."taro_focus_point_submissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_taro_fp_candidates_case" ON "taro_focus_point_candidates" USING btree ("case_number","focus_point_id");--> statement-breakpoint
CREATE INDEX "idx_taro_fp_case_reviews_submission" ON "taro_focus_point_case_reviews" USING btree ("submission_id");--> statement-breakpoint
CREATE INDEX "idx_taro_fp_case_reviews_case" ON "taro_focus_point_case_reviews" USING btree ("case_number");--> statement-breakpoint
CREATE INDEX "idx_taro_fp_case_reviews_opinion" ON "taro_focus_point_case_reviews" USING btree ("system_top_choice_opinion");--> statement-breakpoint
CREATE INDEX "idx_taro_fp_submissions_created_at" ON "taro_focus_point_submissions" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_taro_fp_submissions_form_path" ON "taro_focus_point_submissions" USING btree ("form_path");