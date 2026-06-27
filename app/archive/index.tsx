import { createFileRoute, useRouter, Link } from '@tanstack/react-router'
import { motion, type Variants } from 'motion/react'
import { useMemo, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  ArrowLeft,
  ArrowUp,
  ChevronRight,
  ChevronDown,
  Folder,
  FileText,
  FileDown,
  Link2,
  Search,
  House,
  Minus,
  Square,
  X,
  FolderOpen,
} from 'lucide-react'

export const Route = createFileRoute('/archive/')({
  validateSearch: (s: Record<string, unknown>): { path?: string } => ({
    path: typeof s.path === 'string' && s.path.length > 0 ? s.path : undefined,
  }),
  component: ArchivePage,
})

// ─── Source data ──────────────────────────────────────────────────────────────
// Add real urls inside the files[] arrays as you upload summaries.

interface SubjectFile {
  name: string
  url: string
  type: 'pdf' | 'link'
}

interface Subject {
  name: string
  code?: string
  files?: SubjectFile[]
}

interface Semester {
  id: string
  label: string
  subjects: Subject[]
}

interface DegreeFolder {
  id: string
  name: string
  semesters: Semester[]
}

const archiveData: DegreeFolder[] = [
  {
    id: 'bachelor',
    name: 'Bachelor (IT20)',
    semesters: [
      {
        id: 'y1s1',
        label: 'Year 1 · Semester 1',
        subjects: [
          {
            name: 'Calculus I',
            code: 'MTH101',
            files: [
              // { name: 'Lecture Notes', url: '/files/...', type: 'pdf' },
              // { name: 'Summary', url: 'https://drive.google.com/...', type: 'link' },
            ],
          },
          { name: 'Computer Programming I', code: 'ITS101' },
          { name: 'Physics I', code: 'PHY101' },
          { name: 'English I', code: 'ENG101' },
          { name: 'Introduction to Information Technology', code: 'ITS100' },
        ],
      },
      {
        id: 'y1s2',
        label: 'Year 1 · Semester 2',
        subjects: [
          { name: 'Calculus II', code: 'MTH102' },
          { name: 'Computer Programming II', code: 'ITS102' },
          { name: 'Digital Logic Design', code: 'ITS103' },
          { name: 'Discrete Mathematics', code: 'MTH103' },
          { name: 'English II', code: 'ENG102' },
        ],
      },
      {
        id: 'y2s1',
        label: 'Year 2 · Semester 1',
        subjects: [
          { name: 'Data Structures and Algorithms', code: 'ITS201' },
          { name: 'Database Systems', code: 'ITS202' },
          { name: 'Computer Networks', code: 'ITS203' },
          { name: 'Object-Oriented Programming', code: 'ITS204' },
          { name: 'Statistics for IT', code: 'MTH201' },
        ],
      },
      {
        id: 'y2s2',
        label: 'Year 2 · Semester 2',
        subjects: [
          { name: 'Algorithm Design and Analysis', code: 'ITS205' },
          { name: 'Operating Systems', code: 'ITS206' },
          { name: 'Web Technologies', code: 'ITS207' },
          { name: 'Software Engineering', code: 'ITS208' },
        ],
      },
      {
        id: 'y3s1',
        label: 'Year 3 · Semester 1',
        subjects: [
          { name: 'Mobile Application Development', code: 'ITS301' },
          { name: 'Cloud Computing', code: 'ITS302' },
          { name: 'Information Security', code: 'ITS303' },
          { name: 'Machine Learning Fundamentals', code: 'ITS304' },
        ],
      },
      {
        id: 'y3s2',
        label: 'Year 3 · Semester 2',
        subjects: [
          { name: 'Distributed Systems', code: 'ITS305' },
          { name: 'DevOps and CI/CD', code: 'ITS306' },
          { name: 'Human-Computer Interaction', code: 'ITS307' },
          { name: 'Senior Project I', code: 'ITS390' },
        ],
      },
      {
        id: 'y4s1',
        label: 'Year 4 · Semester 1',
        subjects: [
          { name: 'Senior Project II', code: 'ITS490' },
          { name: 'IT Ethics and Professional Practice', code: 'ITS401' },
        ],
      },
    ],
  },
  {
    id: 'master',
    name: 'Master (ITM43.1)',
    semesters: [
      {
        id: 'm1s1',
        label: 'Year 1 · Semester 1',
        subjects: [
          { name: 'Advanced Algorithms', code: 'ITM501' },
          { name: 'Research Methodology', code: 'ITM502' },
          { name: 'Cloud-Native Architecture', code: 'ITM503' },
          { name: 'Advanced Database Systems', code: 'ITM504' },
        ],
      },
      {
        id: 'm1s2',
        label: 'Year 1 · Semester 2',
        subjects: [
          { name: 'Machine Learning and Deep Learning', code: 'ITM505' },
          { name: 'Software Architecture Patterns', code: 'ITM506' },
          { name: 'Thesis Proposal', code: 'ITM590' },
        ],
      },
    ],
  },
]

const README_CONTENT =
  'Personal academic archive — lecture summaries, notes, and reference links from my Bachelor (IT20) and Master (ITM43.1) studies at KMITL. Browse the folders like a file explorer: click a degree, then a semester, then a subject to find its files.'

// ─── Filesystem tree ──────────────────────────────────────────────────────────

type FsNode =
  | { kind: 'folder'; slug: string; name: string; children: FsNode[] }
  | { kind: 'file'; slug: string; name: string; fileType: 'pdf' | 'link'; url: string }
  | { kind: 'readme'; slug: string; name: string; content: string }

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

function buildTree(): FsNode {
  const degrees: FsNode[] = archiveData.map((degree) => ({
    kind: 'folder' as const,
    slug: degree.id,
    name: degree.name,
    children: degree.semesters.map((sem) => ({
      kind: 'folder' as const,
      slug: sem.id,
      name: sem.label,
      children: sem.subjects.map((subject) => ({
        kind: 'folder' as const,
        slug: subject.code ? subject.code.toLowerCase() : slugify(subject.name),
        name: subject.name,
        children: (subject.files ?? []).map((file) => ({
          kind: 'file' as const,
          slug: slugify(file.name),
          name: file.name,
          fileType: file.type,
          url: file.url,
        })),
      })),
    })),
  }))

  return {
    kind: 'folder',
    slug: '',
    name: 'Home',
    children: [
      { kind: 'readme', slug: 'readme', name: 'README.md', content: README_CONTENT },
      ...degrees,
    ],
  }
}

interface Crumb {
  name: string
  path: string
}

/** Walk slug segments from root; drop any unresolvable tail gracefully. */
function resolvePath(root: FsNode, path: string | undefined): { current: FsNode; trail: Crumb[] } {
  const trail: Crumb[] = [{ name: 'Home', path: '' }]
  let current = root
  const acc: string[] = []

  if (path) {
    for (const seg of path.split('/').filter(Boolean)) {
      if (current.kind !== 'folder') break
      const next = current.children.find((c) => c.kind === 'folder' && c.slug === seg)
      if (!next) break
      current = next
      acc.push(seg)
      trail.push({ name: next.name, path: acc.join('/') })
    }
  }

  return { current, trail }
}

const childCount = (node: FsNode) => (node.kind === 'folder' ? node.children.length : 0)

const typeLabel = (node: FsNode) => {
  if (node.kind === 'folder') return 'Folder'
  if (node.kind === 'readme') return 'Markdown'
  return node.fileType === 'pdf' ? 'PDF' : 'Link'
}

// ─── Animation variants ───────────────────────────────────────────────────────

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.025, delayChildren: 0.04 } },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } },
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function WindowButton({ icon: Icon, className }: { icon: typeof Minus; className?: string }) {
  return (
    <span
      className={`flex h-3.5 w-3.5 items-center justify-center rounded-full ${className ?? ''}`}
    >
      <Icon className="w-2 h-2 opacity-0 group-hover/wb:opacity-70 transition-opacity" />
    </span>
  )
}

/** Recursive folder tree for the sidebar (folders only). */
function TreeFolder({
  node,
  path,
  currentPath,
  onNavigate,
  depth,
}: {
  node: FsNode
  path: string
  currentPath: string
  onNavigate: (path: string) => void
  depth: number
}) {
  const subFolders =
    node.kind === 'folder' ? node.children.filter((c) => c.kind === 'folder') : []
  const isActive = currentPath === path
  const isOnTrail = currentPath === path || currentPath.startsWith(path + '/')
  const [open, setOpen] = useState(isOnTrail)
  const hasChildren = subFolders.length > 0

  return (
    <div>
      <div
        className={`group flex items-center gap-1 rounded-md pr-2 text-xs transition-colors ${
          isActive
            ? 'bg-muted text-foreground'
            : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
        }`}
        style={{ paddingLeft: `${depth * 12 + 4}px` }}
      >
        <button
          onClick={() => hasChildren && setOpen((o) => !o)}
          className={`flex h-5 w-4 shrink-0 items-center justify-center ${
            hasChildren ? '' : 'invisible'
          }`}
          aria-label={open ? 'Collapse' : 'Expand'}
        >
          {open ? (
            <ChevronDown className="w-3 h-3" />
          ) : (
            <ChevronRight className="w-3 h-3" />
          )}
        </button>
        <button
          onClick={() => onNavigate(path)}
          className="flex min-w-0 flex-1 items-center gap-1.5 py-1.5 text-left"
        >
          {isActive ? (
            <FolderOpen className="w-3.5 h-3.5 shrink-0 text-yellow-500" />
          ) : (
            <Folder className="w-3.5 h-3.5 shrink-0 text-yellow-500" />
          )}
          <span className="truncate">{node.name}</span>
        </button>
      </div>
      {open &&
        subFolders.map((child) => (
          <TreeFolder
            key={child.slug}
            node={child}
            path={path ? `${path}/${child.slug}` : child.slug}
            currentPath={currentPath}
            onNavigate={onNavigate}
            depth={depth + 1}
          />
        ))}
    </div>
  )
}

function RowIcon({ node }: { node: FsNode }) {
  if (node.kind === 'folder') return <Folder className="w-4 h-4 text-yellow-500" />
  if (node.kind === 'readme') return <FileText className="w-4 h-4 text-muted-foreground" />
  return node.fileType === 'pdf' ? (
    <FileDown className="w-4 h-4 text-rose-400" />
  ) : (
    <Link2 className="w-4 h-4 text-sky-400" />
  )
}

function ListRow({
  node,
  onOpenFolder,
  onOpenReadme,
}: {
  node: FsNode
  onOpenFolder: (slug: string) => void
  onOpenReadme: (content: string) => void
}) {
  const cells = (
    <>
      <div className="flex min-w-0 items-center gap-2.5">
        <RowIcon node={node} />
        <span
          className={`truncate text-sm text-foreground ${
            node.kind === 'readme' ? 'font-mono' : ''
          }`}
        >
          {node.name}
        </span>
      </div>
      <span className="hidden shrink-0 text-xs text-muted-foreground sm:block">
        {typeLabel(node)}
      </span>
      <span className="shrink-0 text-right text-xs text-muted-foreground">
        {node.kind === 'folder'
          ? `${childCount(node)} item${childCount(node) !== 1 ? 's' : ''}`
          : '—'}
      </span>
    </>
  )

  const rowClass =
    'grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_6rem_6rem] items-center gap-3 rounded-lg px-4 py-3 transition-colors hover:bg-muted/60 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 text-left w-full'

  if (node.kind === 'folder') {
    return (
      <button className={rowClass} onClick={() => onOpenFolder(node.slug)}>
        {cells}
      </button>
    )
  }

  if (node.kind === 'readme') {
    return (
      <button className={rowClass} onClick={() => onOpenReadme(node.content)}>
        {cells}
      </button>
    )
  }

  const isPdf = node.fileType === 'pdf'
  return (
    <a
      className={rowClass}
      href={node.url}
      download={isPdf || undefined}
      target={isPdf ? undefined : '_blank'}
      rel={isPdf ? undefined : 'noopener noreferrer'}
    >
      {cells}
    </a>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function ArchivePage() {
  const root = useMemo(() => buildTree(), [])
  const { path } = Route.useSearch()
  const navigate = Route.useNavigate()
  const router = useRouter()

  const [query, setQuery] = useState('')
  const [readme, setReadme] = useState<string | null>(null)

  const { current, trail } = useMemo(() => resolvePath(root, path), [root, path])
  const currentPath = trail[trail.length - 1].path
  const atRoot = currentPath === ''

  const children = current.kind === 'folder' ? current.children : []
  const visible = query
    ? children.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))
    : children

  const go = (nextPath: string) => {
    setQuery('')
    navigate({ search: nextPath ? { path: nextPath } : {} })
  }

  const openFolder = (slug: string) => go(currentPath ? `${currentPath}/${slug}` : slug)
  const goUp = () => go(currentPath.split('/').slice(0, -1).join('/'))

  const topFolders = root.kind === 'folder' ? root.children.filter((c) => c.kind === 'folder') : []

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 pt-32 pb-40">
        {/* Back to Home */}
        <a
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </a>

        {/* ── Window ───────────────────────────────────────────── */}
        <div className="rounded-xl border border-border bg-card shadow-2xl overflow-hidden">
          {/* Title bar */}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/40 border-b border-border select-none">
            <FolderOpen className="w-4 h-4 text-yellow-500" />
            <span className="text-xs font-medium text-foreground">Archive — File Explorer</span>
            <div className="ml-auto flex items-center gap-1.5">
              <span className="group/wb">
                <WindowButton icon={Minus} className="bg-yellow-500/80" />
              </span>
              <span className="group/wb">
                <WindowButton icon={Square} className="bg-green-500/80" />
              </span>
              <Link to="/" className="group/wb" aria-label="Close">
                <WindowButton icon={X} className="bg-red-500/80" />
              </Link>
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-background/60">
            <button
              onClick={() => router.history.back()}
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
              aria-label="Back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={goUp}
              disabled={atRoot}
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors disabled:opacity-30 disabled:pointer-events-none"
              aria-label="Up"
            >
              <ArrowUp className="w-4 h-4" />
            </button>

            {/* Address bar / breadcrumb */}
            <div className="flex-1 min-w-0 flex items-center gap-1 h-9 rounded-md border border-input bg-transparent px-2.5 overflow-x-auto">
              {trail.map((crumb, i) => (
                <span key={crumb.path} className="flex items-center gap-1 shrink-0">
                  {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60" />}
                  <button
                    onClick={() => go(crumb.path)}
                    className={`flex items-center gap-1 text-xs whitespace-nowrap transition-colors ${
                      i === trail.length - 1
                        ? 'text-foreground font-medium'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {i === 0 && <House className="w-3.5 h-3.5" />}
                    {crumb.name}
                  </button>
                </span>
              ))}
            </div>

            {/* Search */}
            <div className="relative hidden sm:block w-40">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search"
                className="h-9 w-full rounded-md border border-input bg-transparent pl-8 pr-2 text-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
              />
            </div>
          </div>

          {/* Body: sidebar tree + list */}
          <div className="flex min-h-[32rem]">
            {/* Sidebar */}
            <aside className="hidden w-60 shrink-0 border-r border-border bg-muted/20 p-3 sm:block">
              <p className="px-2 pb-1.5 pt-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                Folders
              </p>
              <button
                onClick={() => go('')}
                className={`mb-0.5 flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-xs transition-colors ${
                  atRoot
                    ? 'bg-muted text-foreground'
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                }`}
              >
                <House className="w-3.5 h-3.5 shrink-0" />
                Home
              </button>
              {topFolders.map((folder) => (
                <TreeFolder
                  key={folder.slug}
                  node={folder}
                  path={folder.slug}
                  currentPath={currentPath}
                  onNavigate={go}
                  depth={0}
                />
              ))}
            </aside>

            {/* List view */}
            <div className="min-w-0 flex-1 p-3">
              {/* Column header */}
              {visible.length > 0 && (
                <div className="grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_6rem_6rem] gap-3 border-b border-border px-4 pb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                  <span>Name</span>
                  <span className="hidden sm:block">Type</span>
                  <span className="text-right">Items</span>
                </div>
              )}

              {visible.length === 0 ? (
                <div className="flex h-64 flex-col items-center justify-center gap-3 text-center">
                  <Folder className="w-10 h-10 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">
                    {query ? 'No items match your search.' : 'This folder is empty.'}
                  </p>
                </div>
              ) : (
                <motion.div
                  key={currentPath || 'root'}
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="mt-1 flex flex-col"
                >
                  {visible.map((node) => (
                    <motion.div key={node.slug} variants={itemVariants}>
                      <ListRow
                        node={node}
                        onOpenFolder={openFolder}
                        onOpenReadme={(c) => setReadme(c)}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </div>

          {/* Status bar */}
          <div className="flex items-center justify-between px-4 py-2 bg-muted/40 border-t border-border text-[11px] text-muted-foreground select-none">
            <span>
              {visible.length} item{visible.length !== 1 ? 's' : ''}
              {query && ` (filtered)`}
            </span>
            <span className="font-mono truncate max-w-[60%]">/{currentPath}</span>
          </div>
        </div>
      </div>

      {/* README dialog */}
      <Dialog open={readme !== null} onOpenChange={(o) => !o && setReadme(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-mono flex items-center gap-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              README.md
            </DialogTitle>
            <DialogDescription className="leading-relaxed pt-2 text-left">
              {readme}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </main>
  )
}
