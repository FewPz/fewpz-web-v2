import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

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

type FocusCandidate = {
  id: 'FP1' | 'FP2' | 'FP3'
  codeSpan: string
  constructType: string
  systemScore: number
  isTop: boolean
}

type CaseDefinition = {
  caseNumber: 1 | 2 | 3
  title: string
  problem: string
  studentCode: string
  candidates: FocusCandidate[]
  systemTop: 'FP1' | 'FP2' | 'FP3'
}

type CaseFormState = {
  caseNumber: 1 | 2 | 3
  primaryFocusChoice: PrimaryFocusChoice | null
  primaryFocusOtherText: string
  rankFp1: number | null
  rankFp2: number | null
  rankFp3: number | null
  systemTopChoiceOpinion: SystemTopChoiceOpinion | null
  systemTopChoiceReason: string
  scoreTeachingRelevance: number | null
  scoreProgramCorrectnessImpact: number | null
  scoreMisunderstandingRisk: number | null
  scoreQuestionFitness: number | null
  caseFeedback: string
}

type SubmissionForm = {
  overallSystemAssessment: OverallSystemAssessment | null
  criteriaCoverageAssessment: CriteriaCoverageAssessment | null
  criteriaAdjustmentNotes: string
  scoringWeightPreference: ScoringWeightPreference | null
  additionalFeedback: string
  caseReviews: CaseFormState[]
}

const CASES: CaseDefinition[] = [
  {
    caseNumber: 1,
    title: 'กรณีที่ 1: ผลรวมเลขคู่',
    problem: 'เขียนโปรแกรมรับจำนวนเต็ม n แล้วพิมพ์ผลรวมของเลขคู่ทั้งหมดตั้งแต่ 0 ถึง n−1',
    studentCode: `n = int(input())\ns = 0\nfor i in range(n):\n    if i % 2 == 0:\n        s += i\nprint(s)`,
    systemTop: 'FP1',
    candidates: [
      { id: 'FP1', codeSpan: 'for i in range(n):', constructType: 'loop_boundary', systemScore: 0.92, isTop: true },
      { id: 'FP2', codeSpan: 'if i % 2 == 0:', constructType: 'branch_condition', systemScore: 0.87, isTop: false },
      { id: 'FP3', codeSpan: 's += i', constructType: 'accumulator_update', systemScore: 0.8, isTop: false },
    ],
  },
  {
    caseNumber: 2,
    title: 'กรณีที่ 2: นับจำนวนตัวอักษรที่ตรงกัน',
    problem: 'เขียนโปรแกรมรับสตริง s และตัวอักษร c แล้วพิมพ์จำนวนครั้งที่ c ปรากฏใน s',
    studentCode: `s = input()\nc = input()\ncount = 0\nfor ch in s:\n    if ch == c:\n        count += 1\nprint(count)`,
    systemTop: 'FP1',
    candidates: [
      { id: 'FP1', codeSpan: 'if ch == c:', constructType: 'branch_condition', systemScore: 0.91, isTop: true },
      { id: 'FP2', codeSpan: 'for ch in s:', constructType: 'loop_boundary', systemScore: 0.88, isTop: false },
      { id: 'FP3', codeSpan: 'count += 1', constructType: 'accumulator_update', systemScore: 0.79, isTop: false },
    ],
  },
  {
    caseNumber: 3,
    title: 'กรณีที่ 3: หาค่ามากที่สุด',
    problem: 'เขียนโปรแกรมรับจำนวนเต็ม n ตัว แล้วพิมพ์ค่าที่มากที่สุด',
    studentCode: `n = int(input())\nnums = list(map(int, input().split()))\nmax_val = nums[0]\nfor i in range(1, n):\n    if nums[i] > max_val:\n        max_val = nums[i]\nprint(max_val)`,
    systemTop: 'FP1',
    candidates: [
      { id: 'FP1', codeSpan: 'for i in range(1, n):', constructType: 'loop_boundary', systemScore: 0.9, isTop: true },
      { id: 'FP2', codeSpan: 'if nums[i] > max_val:', constructType: 'branch_condition', systemScore: 0.88, isTop: false },
      { id: 'FP3', codeSpan: 'max_val = nums[i]', constructType: 'accumulator_update', systemScore: 0.77, isTop: false },
    ],
  },
]

const createEmptyCaseState = (caseNumber: 1 | 2 | 3): CaseFormState => ({
  caseNumber,
  primaryFocusChoice: null,
  primaryFocusOtherText: '',
  rankFp1: null,
  rankFp2: null,
  rankFp3: null,
  systemTopChoiceOpinion: null,
  systemTopChoiceReason: '',
  scoreTeachingRelevance: null,
  scoreProgramCorrectnessImpact: null,
  scoreMisunderstandingRisk: null,
  scoreQuestionFitness: null,
  caseFeedback: '',
})

const createInitialFormState = (): SubmissionForm => ({
  overallSystemAssessment: null,
  criteriaCoverageAssessment: null,
  criteriaAdjustmentNotes: '',
  scoringWeightPreference: null,
  additionalFeedback: '',
  caseReviews: [createEmptyCaseState(1), createEmptyCaseState(2), createEmptyCaseState(3)],
})

const rankOptions = [1, 2, 3]
const scoreOptions = [1, 2, 3, 4, 5]
const FORM_ACCESS_CODE = 'TARO69'
const DRAFT_STORAGE_KEY = 'taro-focus-point:draft:v1'

export const Route = createFileRoute('/forms/taro-focus-point/')({
  component: TaroFocusPointFormPage,
})

function TaroFocusPointFormPage() {
  const [form, setForm] = useState<SubmissionForm>(() => createInitialFormState())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(true)
  const [accessInput, setAccessInput] = useState('')
  const [accessError, setAccessError] = useState<string | null>(null)
  const [sessionAccessCode, setSessionAccessCode] = useState<string | null>(null)
  const [draftStatus, setDraftStatus] = useState<string>('ยังไม่มีการบันทึกอัตโนมัติ')

  const caseByNumber = useMemo(() => {
    return new Map(form.caseReviews.map((item) => [item.caseNumber, item]))
  }, [form.caseReviews])

  const setCaseField = <K extends keyof CaseFormState>(caseNumber: 1 | 2 | 3, field: K, value: CaseFormState[K]) => {
    setForm((current) => ({
      ...current,
      caseReviews: current.caseReviews.map((review) => {
        if (review.caseNumber !== caseNumber) return review
        return {
          ...review,
          [field]: value,
        }
      }),
    }))
  }

  useEffect(() => {
    if (typeof window === 'undefined') return

    const raw = localStorage.getItem(DRAFT_STORAGE_KEY)
    if (!raw) return

    try {
      const parsed = JSON.parse(raw) as SubmissionForm
      if (!parsed || !Array.isArray(parsed.caseReviews) || parsed.caseReviews.length !== 3) return
      setForm(parsed)
      setDraftStatus('โหลด draft ล่าสุดแล้ว')
    } catch {
      setDraftStatus('ไม่สามารถโหลด draft เดิมได้')
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const timer = window.setTimeout(() => {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(form))
      setDraftStatus(`บันทึกอัตโนมัติล่าสุด ${new Date().toLocaleTimeString()}`)
    }, 600)

    return () => window.clearTimeout(timer)
  }, [form])

  const getValidationErrors = (): string[] => {
    const errors: string[] = []

    for (const review of form.caseReviews) {
      if (!review.primaryFocusChoice) {
        errors.push(`กรุณาเลือก Focus Point หลักของกรณีที่ ${review.caseNumber}`)
      }

      if (review.rankFp1 === null || review.rankFp2 === null || review.rankFp3 === null) {
        errors.push(`กรุณาจัดอันดับ FP1-FP3 ให้ครบในกรณีที่ ${review.caseNumber}`)
      } else {
        const ranks = [review.rankFp1, review.rankFp2, review.rankFp3].sort((a, b) => a - b)
        const isPermutation = ranks[0] === 1 && ranks[1] === 2 && ranks[2] === 3
        if (!isPermutation) {
          errors.push(`อันดับ FP1-FP3 ของกรณีที่ ${review.caseNumber} ต้องไม่ซ้ำและครบ 1-3`)
        }
      }

      if (!review.systemTopChoiceOpinion) {
        errors.push(`กรุณาเลือกความเห็นต่อ Top Choice ของกรณีที่ ${review.caseNumber}`)
      }

      if (
        (review.systemTopChoiceOpinion === 'partially_agree' || review.systemTopChoiceOpinion === 'disagree')
        && review.systemTopChoiceReason.trim() === ''
      ) {
        errors.push(`กรุณาระบุเหตุผลในกรณีที่ ${review.caseNumber}`)
      }

      if (review.scoreTeachingRelevance === null
        || review.scoreProgramCorrectnessImpact === null
        || review.scoreMisunderstandingRisk === null
        || review.scoreQuestionFitness === null) {
        errors.push(`กรุณาให้คะแนนส่วน C ให้ครบในกรณีที่ ${review.caseNumber}`)
      }
    }

    if (!form.overallSystemAssessment) {
      errors.push('กรุณาเลือกข้อ 4.1 ความเห็นโดยรวม')
    }
    if (!form.criteriaCoverageAssessment) {
      errors.push('กรุณาเลือกข้อ 4.2 ความเหมาะสมของเกณฑ์การให้คะแนน')
    }
    if (!form.scoringWeightPreference) {
      errors.push('กรุณาเลือกข้อ 4.3 การกระจายน้ำหนักคะแนน')
    }
    if (
      form.criteriaCoverageAssessment
      && form.criteriaCoverageAssessment !== 'fully_covered'
      && form.criteriaAdjustmentNotes.trim() === ''
    ) {
      errors.push('ข้อ 4.2 ระบุว่าไม่ครอบคลุม/ครอบคลุมบางส่วน กรุณาใส่เหตุผลเพิ่มเติม')
    }

    return errors
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!isAuthorized || !sessionAccessCode) {
      setSubmitError('กรุณายืนยันรหัสผ่านก่อนเข้าถึงฟอร์ม')
      setDialogOpen(true)
      return
    }

    const validationErrors = getValidationErrors()
    if (validationErrors.length > 0) {
      setSubmitError(validationErrors[0])
      return
    }

    setSubmitError(null)
    setSubmitMessage(null)
    setIsSubmitting(true)

    try {
      const payload = {
        overallSystemAssessment: form.overallSystemAssessment,
        criteriaCoverageAssessment: form.criteriaCoverageAssessment,
        criteriaAdjustmentNotes: form.criteriaAdjustmentNotes,
        scoringWeightPreference: form.scoringWeightPreference,
        additionalFeedback: form.additionalFeedback,
        accessCode: sessionAccessCode,
        caseReviews: form.caseReviews,
      }

      const response = await fetch('/api/forms/taro-focus-point', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const result = (await response.json().catch(() => null)) as { error?: string } | null
        throw new Error(result?.error ?? 'Submit failed')
      }

      const result = (await response.json()) as { submissionId: string }
      setSubmitMessage(`ส่งแบบประเมินสำเร็จแล้ว (ID: ${result.submissionId})`)
      setForm(createInitialFormState())
      if (typeof window !== 'undefined') {
        localStorage.removeItem(DRAFT_STORAGE_KEY)
      }
      setDraftStatus('ส่งข้อมูลแล้ว และลบ draft เรียบร้อย')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'เกิดข้อผิดพลาดขณะส่งแบบประเมิน'
      setSubmitError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAccessSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (accessInput.trim() !== FORM_ACCESS_CODE) {
      setAccessError('รหัสผ่านไม่ถูกต้อง')
      return
    }

    setAccessError(null)
    setSessionAccessCode(FORM_ACCESS_CODE)
    setIsAuthorized(true)
    setDialogOpen(false)
  }

  return (
    <main className="relative min-h-screen bg-background px-4 py-10 md:py-16">
      <Dialog
        open={dialogOpen}
        onOpenChange={(nextOpen) => {
          if (isAuthorized) {
            setDialogOpen(nextOpen)
          }
        }}
      >
        <DialogContent showCloseButton={false} className="sm:max-w-md">
          <form onSubmit={handleAccessSubmit} className="space-y-4">
            <DialogHeader>
              <DialogTitle>ยืนยันสิทธิ์เข้าถึงแบบฟอร์ม</DialogTitle>
              <DialogDescription>
                กรุณากรอกรหัสผ่านก่อนใช้งานฟอร์ม TARO Focus Point
              </DialogDescription>
            </DialogHeader>

            <Input
              type="text"
              value={accessInput}
              onChange={(event) => setAccessInput(event.target.value)}
              placeholder="Access code"
              autoFocus
            />
            {accessError && <p className="text-xs text-red-600">{accessError}</p>}

            <DialogFooter>
              <Button type="submit" className="w-full">ยืนยันเข้าใช้งาน</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {isAuthorized && (
        <>
          <div className="pointer-events-none absolute inset-0 z-0 opacity-70">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--accent))_0%,transparent_40%),radial-gradient(circle_at_bottom_left,hsl(var(--primary)/0.18)_0%,transparent_45%)]" />
          </div>

          <div className="mx-auto w-full max-w-5xl space-y-8">
        <div className="flex items-center justify-between gap-4">
          <Link
            to="/tools"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Tools
          </Link>
          <div className="rounded-full border border-border bg-card/70 px-3 py-1 text-xs text-muted-foreground">
            TARO Evaluator Form
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">TARO Focus Point Evaluation</h1>
          <p className="max-w-3xl text-sm text-muted-foreground md:text-base">
            แบบฟอร์มสำหรับผู้สอนเพื่อประเมินว่า Focus Point ที่ระบบ TARO เลือกนั้นสอดคล้องกับวิจารณญาณเชิงการสอนหรือไม่
          </p>
        </div>

        <Card className="border-blue-400/30 bg-blue-50/60 dark:bg-blue-950/20">
          <CardHeader>
            <CardTitle className="text-base">เป้าหมายของแบบประเมิน</CardTitle>
            <CardDescription>
              เพื่อยืนยันว่า Focus Point ที่ระบบเลือก สามารถสะท้อนความเข้าใจเชิงเหตุผลของนักศึกษาได้จริง
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-foreground/90">
            <p className="font-medium">สิ่งที่ผู้ประเมินต้องทำในแต่ละกรณี</p>
            <p>1. อ่านโจทย์และโค้ดนักศึกษาให้ครบก่อนตัดสินใจ</p>
            <p>2. จัดลำดับความสำคัญของ FP1-FP3 ตามวิจารณญาณของตนเอง</p>
            <p>3. ระบุความเห็นต่อ Top Choice ของระบบ พร้อมเหตุผลเมื่อจำเป็น</p>
            <p>4. ให้คะแนนคุณภาพ 4 มิติ (1-5) และให้ข้อเสนอแนะเพิ่มเติม</p>
          </CardContent>
        </Card>

        <Card className="border-amber-400/40 bg-amber-50/60 dark:bg-amber-950/20">
          <CardHeader>
            <CardTitle className="text-base">คำอธิบายคะแนน Focus Point (สำหรับผู้ประเมิน)</CardTitle>
            <CardDescription>
              กรณีสงสัยว่าทำไมคะแนน FP ไม่เท่ากัน สามารถอ้างอิงแนวทางนี้ได้
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-foreground/90">
            <p>
              คะแนนที่เห็นในแต่ละ FP เป็น <span className="font-semibold">importance score</span> ช่วง 0-1 และอาจไม่เท่ากันตามธรรมชาติ
              เพราะมาจากความสำคัญของ construct ที่ต่างกัน
            </p>
            <p>
              ขั้นคำนวณโดยย่อ: B1 (AST/rule-based) ให้คะแนนโครงสร้างพื้นฐาน เช่น loop, condition, accumulator จากนั้น B2 (AI-based)
              ประเมินเชิงความหมายและความเหมาะสมเชิงการสอน แล้วรวมคะแนนด้วยน้ำหนัก
              <span className="font-semibold"> B1 60% + B2 40%</span>
            </p>
            <p>
              สูตรรวมคะแนน: <span className="font-mono">final_importance = 0.6 * base_score + 0.4 * semantic_importance</span>
            </p>
            <p className="text-muted-foreground">
              หมายเหตุ: ลำดับ FP1-FP3 ที่ระบบแสดงเป็น candidate สำหรับการตั้งคำถาม ไม่ได้หมายความว่า FP อื่นไม่มีคุณค่าเชิงการสอน
            </p>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-8">

          {CASES.map((caseDef) => {
            const caseForm = caseByNumber.get(caseDef.caseNumber)
            if (!caseForm) return null

            return (
              <Card key={caseDef.caseNumber} className="bg-card/85 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>{caseDef.title}</CardTitle>
                  <CardDescription>{caseDef.problem}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-[1.1fr_1fr]">
                    <section className="rounded-lg border border-border bg-background/70 p-4">
                      <h3 className="text-sm font-semibold">โค้ดที่นักศึกษาส่ง</h3>
                      <pre className="mt-3 overflow-x-auto rounded-md bg-muted/70 p-3 text-xs leading-relaxed text-foreground">
                        {caseDef.studentCode}
                      </pre>
                    </section>
                    <section className="rounded-lg border border-border bg-background/70 p-4">
                      <h3 className="text-sm font-semibold">Focus Point ที่ระบบระบุ</h3>
                      <div className="mt-3 space-y-2">
                        {caseDef.candidates.map((candidate) => (
                          <div
                            key={candidate.id}
                            className="rounded-md border border-border/70 bg-card px-3 py-2 text-xs"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <p className="font-medium">
                                {candidate.id} · {candidate.constructType}
                              </p>
                              <span className="text-muted-foreground">
                                {candidate.systemScore.toFixed(2)} {candidate.isTop ? '★ Top' : ''}
                              </span>
                            </div>
                            <p className="mt-1 font-mono text-muted-foreground">{candidate.codeSpan}</p>
                          </div>
                        ))}
                      </div>
                    </section>
                  </div>

                  <section className="space-y-3 rounded-lg border border-border bg-background/70 p-4">
                    <h3 className="text-sm font-semibold">Part A — ลำดับความสำคัญของท่าน</h3>
                    <div className="grid gap-2 md:grid-cols-2">
                      {['FP1', 'FP2', 'FP3', 'OTHER'].map((choice) => (
                        <label key={choice} className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm">
                          <input
                            type="radio"
                            name={`primary-${caseDef.caseNumber}`}
                            value={choice}
                            checked={caseForm.primaryFocusChoice === choice}
                            onChange={() => setCaseField(caseDef.caseNumber, 'primaryFocusChoice', choice as PrimaryFocusChoice)}
                          />
                          <span>
                            {choice === 'OTHER'
                              ? 'อื่นๆ'
                              : `${choice} — ${caseDef.candidates.find((item) => item.id === choice)?.codeSpan ?? ''}`}
                          </span>
                        </label>
                      ))}
                    </div>
                    <Field label="คำอธิบายเพิ่มเติม (ถ้ามี)">
                      <Textarea
                        value={caseForm.primaryFocusOtherText}
                        onChange={(event) => setCaseField(caseDef.caseNumber, 'primaryFocusOtherText', event.target.value)}
                        placeholder="เหตุผลการจัดลำดับ หรือ focus point อื่น"
                      />
                    </Field>
                    <div className="grid gap-3 md:grid-cols-3">
                      <RankField
                        label="ลำดับ FP1"
                        value={caseForm.rankFp1}
                        onChange={(value) => setCaseField(caseDef.caseNumber, 'rankFp1', value)}
                      />
                      <RankField
                        label="ลำดับ FP2"
                        value={caseForm.rankFp2}
                        onChange={(value) => setCaseField(caseDef.caseNumber, 'rankFp2', value)}
                      />
                      <RankField
                        label="ลำดับ FP3"
                        value={caseForm.rankFp3}
                        onChange={(value) => setCaseField(caseDef.caseNumber, 'rankFp3', value)}
                      />
                    </div>
                  </section>

                  <section className="space-y-3 rounded-lg border border-border bg-background/70 p-4">
                    <h3 className="text-sm font-semibold">Part B — ความเห็นต่อ Top Choice ของระบบ ({caseDef.systemTop})</h3>
                    <div className="grid gap-2 md:grid-cols-3">
                      <OpinionOption
                        caseNumber={caseDef.caseNumber}
                        value="agree"
                        label="เห็นด้วย"
                        current={caseForm.systemTopChoiceOpinion}
                        onChange={(value) => setCaseField(caseDef.caseNumber, 'systemTopChoiceOpinion', value)}
                      />
                      <OpinionOption
                        caseNumber={caseDef.caseNumber}
                        value="partially_agree"
                        label="เห็นด้วยบางส่วน"
                        current={caseForm.systemTopChoiceOpinion}
                        onChange={(value) => setCaseField(caseDef.caseNumber, 'systemTopChoiceOpinion', value)}
                      />
                      <OpinionOption
                        caseNumber={caseDef.caseNumber}
                        value="disagree"
                        label="ไม่เห็นด้วย"
                        current={caseForm.systemTopChoiceOpinion}
                        onChange={(value) => setCaseField(caseDef.caseNumber, 'systemTopChoiceOpinion', value)}
                      />
                    </div>
                    <Field label="เหตุผล">
                      <Textarea
                        value={caseForm.systemTopChoiceReason}
                        onChange={(event) => setCaseField(caseDef.caseNumber, 'systemTopChoiceReason', event.target.value)}
                        placeholder="ระบุเหตุผลของการเห็นด้วย/ไม่เห็นด้วย"
                      />
                    </Field>
                  </section>

                  <section className="space-y-3 rounded-lg border border-border bg-background/70 p-4">
                    <h3 className="text-sm font-semibold">Part C — คะแนนคุณภาพ (1-5)</h3>
                    <div className="grid gap-3 md:grid-cols-2">
                      <ScoreField
                        label="ความเกี่ยวข้องเชิงการสอน"
                        value={caseForm.scoreTeachingRelevance}
                        onChange={(value) => setCaseField(caseDef.caseNumber, 'scoreTeachingRelevance', value)}
                      />
                      <ScoreField
                        label="ผลต่อความถูกต้องของโปรแกรม"
                        value={caseForm.scoreProgramCorrectnessImpact}
                        onChange={(value) => setCaseField(caseDef.caseNumber, 'scoreProgramCorrectnessImpact', value)}
                      />
                      <ScoreField
                        label="ความเสี่ยงต่อความเข้าใจผิด"
                        value={caseForm.scoreMisunderstandingRisk}
                        onChange={(value) => setCaseField(caseDef.caseNumber, 'scoreMisunderstandingRisk', value)}
                      />
                      <ScoreField
                        label="ความเหมาะสมในการตั้งคำถาม"
                        value={caseForm.scoreQuestionFitness}
                        onChange={(value) => setCaseField(caseDef.caseNumber, 'scoreQuestionFitness', value)}
                      />
                    </div>
                  </section>

                  <section className="rounded-lg border border-border bg-background/70 p-4">
                    <Field label="Part D — ความคิดเห็นเพิ่มเติมสำหรับกรณีนี้">
                      <Textarea
                        value={caseForm.caseFeedback}
                        onChange={(event) => setCaseField(caseDef.caseNumber, 'caseFeedback', event.target.value)}
                        placeholder="ข้อเสนอแนะเพิ่มเติม"
                      />
                    </Field>
                  </section>
                </CardContent>
              </Card>
            )
          })}

          <Card className="bg-card/85 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>ส่วนที่ 4 — การประเมินภาพรวม</CardTitle>
              <CardDescription>ประเมินระบบ TARO โดยรวมหลังพิจารณาทั้ง 3 กรณี</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Field label="4.1 ความเห็นโดยรวม">
                <RadioGroup
                  name="overall-system-assessment"
                  currentValue={form.overallSystemAssessment}
                  onChange={(value) => setForm((state) => ({ ...state, overallSystemAssessment: value as OverallSystemAssessment }))}
                  options={[
                    { value: 'strongly_agree', label: 'เห็นด้วยอย่างยิ่ง' },
                    { value: 'mostly_agree', label: 'เห็นด้วยเป็นส่วนใหญ่' },
                    { value: 'mixed', label: 'ปะปนกัน' },
                    { value: 'mostly_disagree', label: 'ไม่เห็นด้วยเป็นส่วนใหญ่' },
                    { value: 'strongly_disagree', label: 'ไม่เห็นด้วยอย่างยิ่ง' },
                  ]}
                />
              </Field>

              <Field label="4.2 ความเหมาะสมของเกณฑ์การให้คะแนน">
                <RadioGroup
                  name="criteria-coverage-assessment"
                  currentValue={form.criteriaCoverageAssessment}
                  onChange={(value) => setForm((state) => ({ ...state, criteriaCoverageAssessment: value as CriteriaCoverageAssessment }))}
                  options={[
                    { value: 'fully_covered', label: 'ครอบคลุม' },
                    { value: 'partially_covered', label: 'ครอบคลุมบางส่วน' },
                    { value: 'not_covered', label: 'ไม่ครอบคลุม' },
                  ]}
                />
              </Field>

              <Field label="กรณีครอบคลุมบางส่วน/ไม่ครอบคลุม — เพิ่มหรือปรับเกณฑ์ใด">
                <Textarea
                  value={form.criteriaAdjustmentNotes}
                  onChange={(event) => setForm((state) => ({ ...state, criteriaAdjustmentNotes: event.target.value }))}
                  placeholder="ระบุเกณฑ์ที่ควรเพิ่มหรือปรับ"
                />
              </Field>

              <Field label="4.3 การกระจายน้ำหนักคะแนน">
                <RadioGroup
                  name="scoring-weight-preference"
                  currentValue={form.scoringWeightPreference}
                  onChange={(value) => setForm((state) => ({ ...state, scoringWeightPreference: value as ScoringWeightPreference }))}
                  options={[
                    { value: 'rule_based_heavier', label: 'เหมาะสม (โครงสร้างมากกว่า)' },
                    { value: 'balanced_50_50', label: 'ควรเท่ากัน 50/50' },
                    { value: 'ai_heavier', label: 'AI ควรมีน้ำหนักมากกว่า' },
                    { value: 'no_clear_opinion', label: 'ไม่มีความเห็นที่ชัดเจน' },
                  ]}
                />
              </Field>

              <Field label="4.4 ความคิดเห็นเพิ่มเติม">
                <Textarea
                  value={form.additionalFeedback}
                  onChange={(event) => setForm((state) => ({ ...state, additionalFeedback: event.target.value }))}
                  placeholder="ข้อสังเกต ข้อเสนอแนะ หรือข้อกังวลอื่นๆ"
                />
              </Field>
            </CardContent>
          </Card>

          <div className="sticky bottom-4 z-10 rounded-xl border border-border bg-card/90 p-4 shadow-sm backdrop-blur">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">พร้อมส่งแบบประเมิน</p>
                <p className="text-xs text-muted-foreground">{draftStatus}</p>
                {submitMessage && <p className="text-xs text-emerald-600">{submitMessage}</p>}
                {submitError && <p className="text-xs text-red-600">{submitError}</p>}
              </div>
              <Button type="submit" disabled={isSubmitting} className="md:min-w-40">
                {isSubmitting ? 'กำลังส่ง...' : 'ส่งแบบประเมิน'}
              </Button>
            </div>
          </div>
          </form>
        </div>
        </>
      )}
    </main>
  )
}

function Field({
  label,
  className,
  children,
}: {
  label: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <label className={`grid gap-2 ${className ?? ''}`}>
      <span className="text-sm font-medium">{label}</span>
      {children}
    </label>
  )
}

function RadioGroup({
  name,
  options,
  currentValue,
  onChange,
}: {
  name: string
  options: Array<{ value: string; label: string }>
  currentValue: string | null
  onChange: (value: string) => void
}) {
  return (
    <div className="grid gap-2 md:grid-cols-2">
      {options.map((option) => (
        <label key={option.value} className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm">
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={currentValue === option.value}
            onChange={() => onChange(option.value)}
          />
          <span>{option.label}</span>
        </label>
      ))}
    </div>
  )
}

function RankField({
  label,
  value,
  onChange,
}: {
  label: string
  value: number | null
  onChange: (value: number | null) => void
}) {
  return (
    <label className="grid gap-2 text-sm">
      <span className="font-medium">{label}</span>
      <select
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value === '' ? null : Number(event.target.value))}
        className="h-9 rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
      >
        <option value="">-</option>
        {rankOptions.map((rank) => (
          <option key={rank} value={rank}>{rank}</option>
        ))}
      </select>
    </label>
  )
}

function ScoreField({
  label,
  value,
  onChange,
}: {
  label: string
  value: number | null
  onChange: (value: number | null) => void
}) {
  return (
    <label className="grid gap-2 text-sm">
      <span className="font-medium">{label}</span>
      <select
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value === '' ? null : Number(event.target.value))}
        className="h-9 rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
      >
        <option value="">-</option>
        {scoreOptions.map((score) => (
          <option key={score} value={score}>{score}</option>
        ))}
      </select>
    </label>
  )
}

function OpinionOption({
  caseNumber,
  value,
  label,
  current,
  onChange,
}: {
  caseNumber: 1 | 2 | 3
  value: SystemTopChoiceOpinion
  label: string
  current: SystemTopChoiceOpinion | null
  onChange: (value: SystemTopChoiceOpinion) => void
}) {
  return (
    <label className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm">
      <input
        type="radio"
        name={`opinion-${caseNumber}`}
        value={value}
        checked={current === value}
        onChange={() => onChange(value)}
      />
      <span>{label}</span>
    </label>
  )
}
