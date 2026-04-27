import { createFileRoute } from '@tanstack/react-router'
import { db } from '@/lib/db/client'
import {
  taroFocusPointCaseReviews,
  taroFocusPointSubmissions,
} from '@/lib/db/schema'

type PrimaryFocusChoice = 'FP1' | 'FP2' | 'FP3' | 'OTHER'
type SystemTopChoiceOpinion = 'agree' | 'partially_agree' | 'disagree'
type OverallSystemAssessment =
  | 'strongly_agree'
  | 'mostly_agree'
  | 'mixed'
  | 'mostly_disagree'
  | 'strongly_disagree'
type CriteriaCoverageAssessment = 'fully_covered' | 'partially_covered' | 'not_covered'
type ScoringWeightPreference = 'rule_based_heavier' | 'balanced_50_50' | 'ai_heavier' | 'no_clear_opinion'

type CaseReviewPayload = {
  caseNumber: 1 | 2 | 3
  primaryFocusChoice: PrimaryFocusChoice | null
  primaryFocusOtherText?: string | null
  rankFp1: number | null
  rankFp2: number | null
  rankFp3: number | null
  systemTopChoiceOpinion: SystemTopChoiceOpinion | null
  systemTopChoiceReason?: string | null
  scoreTeachingRelevance: number | null
  scoreProgramCorrectnessImpact: number | null
  scoreMisunderstandingRisk: number | null
  scoreQuestionFitness: number | null
  caseFeedback?: string | null
}

type SubmissionPayload = {
  evaluatorFullName?: string | null
  evaluationDate?: string | null
  evaluatorRole?: string | null
  teachingExperienceYears?: number | null
  institutionOrDepartment?: string | null
  overallSystemAssessment?: OverallSystemAssessment | null
  criteriaCoverageAssessment?: CriteriaCoverageAssessment | null
  criteriaAdjustmentNotes?: string | null
  scoringWeightPreference?: ScoringWeightPreference | null
  additionalFeedback?: string | null
  accessCode?: string | null
  caseReviews: CaseReviewPayload[]
}

const FORM_ACCESS_CODE = 'TARO69'
const ANONYMOUS_EVALUATOR_NAME = 'บุคคลปริศนา'

const allowedPrimaryChoices = new Set(['FP1', 'FP2', 'FP3', 'OTHER'])
const allowedOpinions = new Set(['agree', 'partially_agree', 'disagree'])
const allowedOverallAssessment = new Set([
  'strongly_agree',
  'mostly_agree',
  'mixed',
  'mostly_disagree',
  'strongly_disagree',
])
const allowedCriteriaCoverage = new Set(['fully_covered', 'partially_covered', 'not_covered'])
const allowedWeightPreference = new Set(['rule_based_heavier', 'balanced_50_50', 'ai_heavier', 'no_clear_opinion'])

const isRank = (value: unknown) => value === null || (typeof value === 'number' && Number.isInteger(value) && value >= 1 && value <= 3)
const isScore = (value: unknown) => value === null || (typeof value === 'number' && Number.isInteger(value) && value >= 1 && value <= 5)
const toNullableText = (value: unknown) => (typeof value === 'string' && value.trim().length > 0 ? value.trim() : null)

export const Route = createFileRoute('/api/forms/taro-focus-point')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const payload = (await request.json()) as SubmissionPayload

          if (payload?.accessCode !== FORM_ACCESS_CODE) {
            return new Response(JSON.stringify({ error: 'Unauthorized access code' }), {
              status: 403,
              headers: { 'Content-Type': 'application/json' },
            })
          }

          if (!payload || !Array.isArray(payload.caseReviews) || payload.caseReviews.length !== 3) {
            return new Response(JSON.stringify({ error: 'caseReviews must contain exactly 3 cases' }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' },
            })
          }

          const caseNumbers = payload.caseReviews.map((review) => review.caseNumber)
          const expectedCases = [1, 2, 3]
          const hasAllCases = expectedCases.every((caseNo) => caseNumbers.includes(caseNo as 1 | 2 | 3))
          if (!hasAllCases) {
            return new Response(JSON.stringify({ error: 'caseReviews must include caseNumber 1, 2, and 3' }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' },
            })
          }

          for (const review of payload.caseReviews) {
            if (review.primaryFocusChoice !== null && !allowedPrimaryChoices.has(review.primaryFocusChoice)) {
              return new Response(JSON.stringify({ error: `Invalid primaryFocusChoice in case ${review.caseNumber}` }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
              })
            }

            if (review.primaryFocusChoice === null) {
              return new Response(JSON.stringify({ error: `primaryFocusChoice is required in case ${review.caseNumber}` }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
              })
            }

            if (review.systemTopChoiceOpinion !== null && !allowedOpinions.has(review.systemTopChoiceOpinion)) {
              return new Response(JSON.stringify({ error: `Invalid systemTopChoiceOpinion in case ${review.caseNumber}` }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
              })
            }

            if (review.systemTopChoiceOpinion === null) {
              return new Response(JSON.stringify({ error: `systemTopChoiceOpinion is required in case ${review.caseNumber}` }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
              })
            }

            if (!isRank(review.rankFp1) || !isRank(review.rankFp2) || !isRank(review.rankFp3)) {
              return new Response(JSON.stringify({ error: `Ranking in case ${review.caseNumber} must be null or 1-3` }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
              })
            }

            if (review.rankFp1 === null || review.rankFp2 === null || review.rankFp3 === null) {
              return new Response(JSON.stringify({ error: `Ranking in case ${review.caseNumber} is required for FP1-FP3` }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
              })
            }

            const ranks = [review.rankFp1, review.rankFp2, review.rankFp3].sort((a, b) => a - b)
            const isValidRanking = ranks[0] === 1 && ranks[1] === 2 && ranks[2] === 3
            if (!isValidRanking) {
              return new Response(JSON.stringify({ error: `Ranking in case ${review.caseNumber} must be a non-duplicate set of 1,2,3` }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
              })
            }

            if (
              !isScore(review.scoreTeachingRelevance)
              || !isScore(review.scoreProgramCorrectnessImpact)
              || !isScore(review.scoreMisunderstandingRisk)
              || !isScore(review.scoreQuestionFitness)
            ) {
              return new Response(JSON.stringify({ error: `Scores in case ${review.caseNumber} must be null or 1-5` }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
              })
            }

            if (
              review.scoreTeachingRelevance === null
              || review.scoreProgramCorrectnessImpact === null
              || review.scoreMisunderstandingRisk === null
              || review.scoreQuestionFitness === null
            ) {
              return new Response(JSON.stringify({ error: `All quality scores are required in case ${review.caseNumber}` }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
              })
            }

            if (
              (review.systemTopChoiceOpinion === 'partially_agree' || review.systemTopChoiceOpinion === 'disagree')
              && toNullableText(review.systemTopChoiceReason) === null
            ) {
              return new Response(JSON.stringify({ error: `Reason is required in case ${review.caseNumber} for partially agree/disagree` }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
              })
            }
          }

          if (payload.overallSystemAssessment && !allowedOverallAssessment.has(payload.overallSystemAssessment)) {
            return new Response(JSON.stringify({ error: 'Invalid overallSystemAssessment' }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' },
            })
          }

          if (payload.criteriaCoverageAssessment && !allowedCriteriaCoverage.has(payload.criteriaCoverageAssessment)) {
            return new Response(JSON.stringify({ error: 'Invalid criteriaCoverageAssessment' }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' },
            })
          }

          if (payload.scoringWeightPreference && !allowedWeightPreference.has(payload.scoringWeightPreference)) {
            return new Response(JSON.stringify({ error: 'Invalid scoringWeightPreference' }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' },
            })
          }

          if (!payload.overallSystemAssessment) {
            return new Response(JSON.stringify({ error: 'overallSystemAssessment is required' }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' },
            })
          }

          if (!payload.criteriaCoverageAssessment) {
            return new Response(JSON.stringify({ error: 'criteriaCoverageAssessment is required' }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' },
            })
          }

          if (!payload.scoringWeightPreference) {
            return new Response(JSON.stringify({ error: 'scoringWeightPreference is required' }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' },
            })
          }

          if (
            payload.criteriaCoverageAssessment !== 'fully_covered'
            && toNullableText(payload.criteriaAdjustmentNotes) === null
          ) {
            return new Response(JSON.stringify({ error: 'criteriaAdjustmentNotes is required when criteriaCoverageAssessment is not fully_covered' }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' },
            })
          }

          const submissionId = await db.transaction(async (tx) => {
            const [submission] = await tx
              .insert(taroFocusPointSubmissions)
              .values({
                formPath: '/forms/taro-focus-point',
                evaluatorFullName: ANONYMOUS_EVALUATOR_NAME,
                evaluationDate: payload.evaluationDate ?? null,
                evaluatorRole: toNullableText(payload.evaluatorRole),
                teachingExperienceYears:
                  payload.teachingExperienceYears === null
                  || payload.teachingExperienceYears === undefined
                    ? null
                    : payload.teachingExperienceYears.toString(),
                institutionOrDepartment: toNullableText(payload.institutionOrDepartment),
                overallSystemAssessment: payload.overallSystemAssessment ?? null,
                criteriaCoverageAssessment: payload.criteriaCoverageAssessment ?? null,
                criteriaAdjustmentNotes: toNullableText(payload.criteriaAdjustmentNotes),
                scoringWeightPreference: payload.scoringWeightPreference ?? null,
                additionalFeedback: toNullableText(payload.additionalFeedback),
              })
              .returning({ id: taroFocusPointSubmissions.id })

            await tx.insert(taroFocusPointCaseReviews).values(
              payload.caseReviews.map((review) => ({
                submissionId: submission.id,
                caseNumber: review.caseNumber,
                primaryFocusChoice: review.primaryFocusChoice,
                primaryFocusOtherText: toNullableText(review.primaryFocusOtherText),
                rankFp1: review.rankFp1,
                rankFp2: review.rankFp2,
                rankFp3: review.rankFp3,
                systemTopChoiceOpinion: review.systemTopChoiceOpinion,
                systemTopChoiceReason: toNullableText(review.systemTopChoiceReason),
                scoreTeachingRelevance: review.scoreTeachingRelevance,
                scoreProgramCorrectnessImpact: review.scoreProgramCorrectnessImpact,
                scoreMisunderstandingRisk: review.scoreMisunderstandingRisk,
                scoreQuestionFitness: review.scoreQuestionFitness,
                caseFeedback: toNullableText(review.caseFeedback),
              })),
            )

            return submission.id
          })

          return new Response(JSON.stringify({ ok: true, submissionId }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
          })
        } catch (error) {
          console.error('Failed to submit TARO form:', error)
          return new Response(JSON.stringify({ error: 'Failed to submit TARO focus point form' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          })
        }
      },
    },
  },
})
