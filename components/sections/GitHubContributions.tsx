import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  ContributionGraph,
  ContributionGraphBlock,
  ContributionGraphCalendar,
  ContributionGraphFooter,
  ContributionGraphLegend,
  type Activity,
} from '@/components/kibo-ui/contribution-graph';
import ColorDashes from '@/components/google/ColorDashes';
import GoogleCard from '@/components/google/GoogleCard';
import GoogleDots from '@/components/google/GoogleDots';
import { useI18n, type Locale } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { ArrowUpRight, Github } from 'lucide-react';
import { motion } from 'motion/react';

interface ContributionData {
  total: number;
  days: Activity[];
}

const GITHUB_URL = 'https://github.com/FewPz';

const BLOCK_MARGIN = 4;
// Below this the calendar scrolls instead of shrinking further (phones).
const MIN_BLOCK_SIZE = 10;
const MAX_BLOCK_SIZE = 18;

// Full class strings so Tailwind can detect them at build time.
const levelClassName = cn(
  'data-[level="0"]:fill-muted',
  'data-[level="1"]:fill-g-green/25',
  'data-[level="2"]:fill-g-green/50',
  'data-[level="3"]:fill-g-green/75',
  'data-[level="4"]:fill-g-green',
);

// Cached across mounts so re-renders of the section don't refetch.
let contributionsRequest: Promise<ContributionData> | null = null;
let cachedContributions: ContributionData | null = null;

async function fetchContributions(): Promise<ContributionData> {
  const response = await fetch('/api/github-contributions');
  if (!response.ok) {
    throw new Error('Failed to fetch contributions');
  }
  return response.json();
}

function loadContributions() {
  contributionsRequest ??= fetchContributions()
    .then((data) => (cachedContributions = data))
    .catch((err) => {
      contributionsRequest = null; // allow a retry on next mount
      throw err;
    });
  return contributionsRequest;
}

const intlLocale = (locale: Locale) => (locale === 'th' ? 'th-TH' : 'en-US');

function monthNames(locale: Locale) {
  return Array.from({ length: 12 }, (_, month) =>
    new Date(Date.UTC(2000, month, 1)).toLocaleDateString(intlLocale(locale), { month: 'short', timeZone: 'UTC' }),
  );
}

function describeDay(day: Activity, locale: Locale) {
  const date = new Date(`${day.date}T00:00:00Z`).toLocaleDateString(intlLocale(locale), {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
  if (locale === 'th') {
    return day.count === 0 ? `ไม่มี contribution วันที่ ${date}` : `${day.count} contributions วันที่ ${date}`;
  }
  if (day.count === 0) return `No contributions on ${date}`;
  return `${day.count} contribution${day.count === 1 ? '' : 's'} on ${date}`;
}

/** GitHub contribution heatmap for the last year (Kibo UI ContributionGraph), shown under Education. */
export default function GitHubContributions() {
  const { t, locale } = useI18n();
  const [data, setData] = useState<ContributionData | null>(cachedContributions);
  const [loading, setLoading] = useState(cachedContributions === null);
  const [error, setError] = useState(false);
  const [hovered, setHovered] = useState<Activity | null>(null);
  const [graphWidth, setGraphWidth] = useState(0);
  const graphRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cachedContributions) return;
    let active = true;
    loadContributions()
      .then((result) => active && setData(result))
      .catch(() => active && setError(true))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const labels = useMemo(
    () => ({
      months: monthNames(locale),
      legend: { less: t({ en: 'Less', th: 'น้อย' }), more: t({ en: 'More', th: 'มาก' }) },
    }),
    [locale, t],
  );

  // Track the card's inner width so the calendar can stretch to fill it.
  useLayoutEffect(() => {
    const el = graphRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setGraphWidth(entry.contentRect.width));
    observer.observe(el);
    return () => observer.disconnect();
  }, [data]);

  // Sunday-first week columns, matching the graph's own grouping.
  const weekCount = data?.days.length
    ? Math.ceil((new Date(`${data.days[0].date}T00:00:00Z`).getUTCDay() + data.days.length) / 7)
    : 0;
  const blockSize = weekCount
    ? Math.min(MAX_BLOCK_SIZE, Math.max(MIN_BLOCK_SIZE, Math.floor((graphWidth + BLOCK_MARGIN) / weekCount) - BLOCK_MARGIN))
    : MIN_BLOCK_SIZE;

  // On narrow screens the calendar scrolls; start at the most recent weeks.
  useLayoutEffect(() => {
    const el = graphRef.current?.querySelector<HTMLElement>('[data-graph-scroll]');
    if (el) el.scrollLeft = el.scrollWidth;
  }, [data, blockSize]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <GoogleCard strip="none" className="p-6 sm:p-8">
        <div className="mb-7 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
          <div className="flex items-center gap-3">
            <Github className="size-8 shrink-0 text-foreground" />
            <div>
              <h3 className="text-lg font-semibold leading-tight text-foreground">
                {t({ en: 'GitHub Activity', th: 'กิจกรรมบน GitHub' })}
              </h3>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {data
                  ? t({
                      en: `${data.total.toLocaleString('en-US')} contributions in the last year`,
                      th: `${data.total.toLocaleString('en-US')} contributions ในปีที่ผ่านมา`,
                    })
                  : t({ en: 'Contributions in the last year', th: 'Contributions ในปีที่ผ่านมา' })}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <ColorDashes size="sm" />
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group/link inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-g-blue-ink"
            >
              @FewPz
              <ArrowUpRight className="size-4 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
            </a>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <GoogleDots size={10} />
          </div>
        )}

        {error && !loading && (
          <p className="py-12 text-center text-muted-foreground">
            {t({ en: 'Failed to load contributions from GitHub', th: 'โหลดข้อมูล contribution จาก GitHub ไม่สำเร็จ' })}
          </p>
        )}

        {data && data.days.length > 0 && (
          <div ref={graphRef}>
            <ContributionGraph
              data={data.days}
              totalCount={data.total}
              labels={labels}
              blockSize={blockSize}
              blockMargin={BLOCK_MARGIN}
              blockRadius={Math.round(blockSize / 4)}
              fontSize={12}
              className="mx-auto text-muted-foreground"
            >
              <ContributionGraphCalendar
                data-graph-scroll=""
                className="pb-2 scrollbar-hide"
                onMouseLeave={() => setHovered(null)}
              >
                {({ activity, dayIndex, weekIndex }) => (
                  <ContributionGraphBlock
                    activity={activity}
                    dayIndex={dayIndex}
                    weekIndex={weekIndex}
                    onMouseEnter={() => setHovered(activity)}
                    className={cn(
                      levelClassName,
                      'stroke-transparent stroke-2 transition-[stroke] hover:stroke-g-green-ink/40',
                    )}
                  >
                    <title>{describeDay(activity, locale)}</title>
                  </ContributionGraphBlock>
                )}
              </ContributionGraphCalendar>
              <ContributionGraphFooter className="items-center justify-between text-xs">
                <span className="min-h-4">
                  {hovered
                    ? describeDay(hovered, locale)
                    : t({ en: 'Hover a day to see its contributions', th: 'ชี้ที่ช่องเพื่อดูจำนวน contribution' })}
                </span>
                <ContributionGraphLegend>
                  {({ level }) => (
                    <svg width={12} height={12}>
                      <rect width={12} height={12} rx={3} ry={3} data-level={level} className={levelClassName} />
                    </svg>
                  )}
                </ContributionGraphLegend>
              </ContributionGraphFooter>
            </ContributionGraph>
          </div>
        )}
      </GoogleCard>
    </motion.div>
  );
}
