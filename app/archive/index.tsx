import { createFileRoute, useRouter, Link } from '@tanstack/react-router'
import { motion, type Variants } from 'motion/react'
import { useMemo, useRef, useState } from 'react'
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
  FileArchive,
  FileCode,
  FileImage,
  FileVideo,
  FileSpreadsheet,
  File,
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
  type: 'pdf' | 'link' | 'zip' | 'image' | 'video' | 'code' | 'doc' | 'spreadsheet' | 'other'
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
        label: 'Year 1 · Semester 1 (1/2565)',
        subjects: [
          {
            name: 'Mathematics For Information Technology',
            code: 'MFIT',
            files: [
              { name: 'Math-For-IT-Week-12', url: '/itkmitl/Y1-1/MFIT/Homework/Math-For-IT-Week-12.pdf', type: 'pdf' },
              { name: 'Math-For-IT-Week-13', url: '/itkmitl/Y1-1/MFIT/Homework/Math-For-IT-Week-13.pdf', type: 'pdf' },
              { name: 'math-For-It-Week-14', url: '/itkmitl/Y1-1/MFIT/Homework/math-For-It-Week-14.pdf', type: 'pdf' },
              { name: 'MFIT-1-2022-In-Class-Activity-Week3', url: '/itkmitl/Y1-1/MFIT/Homework/MFIT-1-2022-In-Class-Activity-Week3.pdf', type: 'pdf' },
              { name: 'MFIT-1-2022-In-Class-Activity-Week4', url: '/itkmitl/Y1-1/MFIT/Homework/MFIT-1-2022-In-Class-Activity-Week4.pdf', type: 'pdf' },
              { name: 'MFIT-1-2022-In-Class-Activity-Week5', url: '/itkmitl/Y1-1/MFIT/Homework/MFIT-1-2022-In-Class-Activity-Week5.pdf', type: 'pdf' },
              { name: 'MFIT-1-2022-In-Class-Activity-Week6', url: '/itkmitl/Y1-1/MFIT/Homework/MFIT-1-2022-In-Class-Activity-Week6.pdf', type: 'pdf' },
              { name: 'MFIT-1-2022-In-Class-Activity-Week7', url: '/itkmitl/Y1-1/MFIT/Homework/MFIT-1-2022-In-Class-Activity-Week7.pdf', type: 'pdf' },
              { name: 'MFIT-2-2022-Homework-9', url: '/itkmitl/Y1-1/MFIT/Homework/MFIT-2-2022-Homework-9.pdf', type: 'pdf' },
              { name: 'MFIT-2-2022-In-Class-Activity-Week1', url: '/itkmitl/Y1-1/MFIT/Homework/MFIT-2-2022-In-Class-Activity-Week1.pdf', type: 'pdf' },
              { name: 'MFIT-2-2022-In-Class-Activity-Week2', url: '/itkmitl/Y1-1/MFIT/Homework/MFIT-2-2022-In-Class-Activity-Week2.pdf', type: 'pdf' },
              { name: 'MFIT-Week-13', url: '/itkmitl/Y1-1/MFIT/Homework/MFIT-Week-13.pdf', type: 'pdf' },
              { name: 'MFIT-Week-14', url: '/itkmitl/Y1-1/MFIT/Homework/MFIT-Week-14.pdf', type: 'pdf' },
              { name: 'Mfit-Week-16', url: '/itkmitl/Y1-1/MFIT/Homework/Mfit-Week-16.pdf', type: 'pdf' },
              { name: 'M4IT_calculus_01_Handouts_4p-(1)', url: '/itkmitl/Y1-1/MFIT/M4IT_calculus_01_Handouts_4p-(1).pdf', type: 'pdf' },
              { name: 'M4IT_calculus_02_Handouts_4p', url: '/itkmitl/Y1-1/MFIT/M4IT_calculus_02_Handouts_4p.pdf', type: 'pdf' },
              { name: 'M4IT_calculus_03_Handouts_4p', url: '/itkmitl/Y1-1/MFIT/M4IT_calculus_03_Handouts_4p.pdf', type: 'pdf' },
              { name: 'M4IT_calculus_04_Handouts_4p', url: '/itkmitl/Y1-1/MFIT/M4IT_calculus_04_Handouts_4p.pdf', type: 'pdf' },
              { name: 'M4IT_calculus_05_Handouts_4p', url: '/itkmitl/Y1-1/MFIT/M4IT_calculus_05_Handouts_4p.pdf', type: 'pdf' },
              { name: 'M4IT_calculus_06_Handouts_4p', url: '/itkmitl/Y1-1/MFIT/M4IT_calculus_06_Handouts_4p.pdf', type: 'pdf' },
              { name: 'M4IT_calculus_07_Handouts_4p', url: '/itkmitl/Y1-1/MFIT/M4IT_calculus_07_Handouts_4p.pdf', type: 'pdf' },
              { name: 'M4IT_calculus_08_Handouts_4p', url: '/itkmitl/Y1-1/MFIT/M4IT_calculus_08_Handouts_4p.pdf', type: 'pdf' },
              { name: 'MFIT-1-2022-Lecture-Slides-Week3-(1)', url: '/itkmitl/Y1-1/MFIT/MFIT-1-2022-Lecture-Slides-Week3-(1).pdf', type: 'pdf' },
              { name: 'MFIT-1-2022-Lecture-Slides-Week3', url: '/itkmitl/Y1-1/MFIT/MFIT-1-2022-Lecture-Slides-Week3.pdf', type: 'pdf' },
              { name: 'MFIT-1-2022-Lecture-Slides-Week4-(1)', url: '/itkmitl/Y1-1/MFIT/MFIT-1-2022-Lecture-Slides-Week4-(1).pdf', type: 'pdf' },
              { name: 'MFIT-1-2022-Lecture-Slides-Week4', url: '/itkmitl/Y1-1/MFIT/MFIT-1-2022-Lecture-Slides-Week4.pdf', type: 'pdf' },
              { name: 'MFIT-1-2022-Lecture-Slides-Week5-(1)', url: '/itkmitl/Y1-1/MFIT/MFIT-1-2022-Lecture-Slides-Week5-(1).pdf', type: 'pdf' },
              { name: 'MFIT-1-2022-Lecture-Slides-Week5-1', url: '/itkmitl/Y1-1/MFIT/MFIT-1-2022-Lecture-Slides-Week5-1.pdf', type: 'pdf' },
              { name: 'MFIT-1-2022-Lecture-Slides-Week5', url: '/itkmitl/Y1-1/MFIT/MFIT-1-2022-Lecture-Slides-Week5.pdf', type: 'pdf' },
              { name: 'MFIT-1-2022-Lecture-Slides-Week7', url: '/itkmitl/Y1-1/MFIT/MFIT-1-2022-Lecture-Slides-Week7.pdf', type: 'pdf' },
              { name: 'MFIT-2-2022-Lecture-Slides-Week1', url: '/itkmitl/Y1-1/MFIT/MFIT-2-2022-Lecture-Slides-Week1.pdf', type: 'pdf' },
              { name: 'mfit-Midterm-By-P,Mai', url: '/itkmitl/Y1-1/MFIT/mfit-Midterm-By-P%2CMai.pdf', type: 'pdf' },
            ],
          },
          {
            name: 'Information Technology Fundamentals',
            code: 'IFT',
            files: [
              { name: '02-Computer-And-Mobile-Devices', url: '/itkmitl/Y1-1/ITF/02-Computer-And-Mobile-Devices.pdf', type: 'pdf' },
              { name: '06-Network', url: '/itkmitl/Y1-1/ITF/06-Network.pdf', type: 'pdf' },
              { name: 'Computing_Components__storage', url: '/itkmitl/Y1-1/ITF/Computing_Components__storage.pdf', type: 'pdf' },
              { name: 'I-O_Device', url: '/itkmitl/Y1-1/ITF/I-O_Device.pdf', type: 'pdf' },
              { name: 'ITF-07', url: '/itkmitl/Y1-1/ITF/ITF-07.pdf', type: 'pdf' },
              { name: 'ITF-08', url: '/itkmitl/Y1-1/ITF/ITF-08.pdf', type: 'pdf' },
              { name: 'ITF-1', url: '/itkmitl/Y1-1/ITF/ITF-1.pdf', type: 'pdf' },
              { name: 'ITF-10', url: '/itkmitl/Y1-1/ITF/ITF-10.pdf', type: 'pdf' },
              { name: 'ITF-9', url: '/itkmitl/Y1-1/ITF/ITF-9.pdf', type: 'pdf' },
              { name: 'ITF-Database-⛩️', url: '/itkmitl/Y1-1/ITF/ITF-Database-%E2%9B%A9%EF%B8%8F.pdf', type: 'pdf' },
              { name: 'ITF-Lecture-00', url: '/itkmitl/Y1-1/ITF/ITF-Lecture-00.pdf', type: 'pdf' },
              { name: 'ITF-Lecture-02', url: '/itkmitl/Y1-1/ITF/ITF-Lecture-02.pdf', type: 'pdf' },
              { name: 'ITF-Lecture-03', url: '/itkmitl/Y1-1/ITF/ITF-Lecture-03.pdf', type: 'pdf' },
              { name: 'ITF-Lecture-04', url: '/itkmitl/Y1-1/ITF/ITF-Lecture-04.pdf', type: 'pdf' },
              { name: 'ITF-Lecture-05', url: '/itkmitl/Y1-1/ITF/ITF-Lecture-05.pdf', type: 'pdf' },
              { name: 'ITF-Lecture-06', url: '/itkmitl/Y1-1/ITF/ITF-Lecture-06.pdf', type: 'pdf' },
              { name: 'ITF-OS', url: '/itkmitl/Y1-1/ITF/ITF-OS.pdf', type: 'pdf' },
              { name: 'ITF65-IT-System', url: '/itkmitl/Y1-1/ITF/ITF65-IT-System.pdf', type: 'pdf' },
              { name: 'ITF65-OS', url: '/itkmitl/Y1-1/ITF/ITF65-OS.pdf', type: 'pdf' },
              { name: 'Lab02', url: '/itkmitl/Y1-1/ITF/Lab02.pdf', type: 'pdf' },
              { name: 'Lab03', url: '/itkmitl/Y1-1/ITF/Lab03.pdf', type: 'pdf' },
              { name: 'Lab04', url: '/itkmitl/Y1-1/ITF/Lab04.pdf', type: 'pdf' },
              { name: 'Microsoft-PowerPoint-Lecture641-07-08-v7-(1)', url: '/itkmitl/Y1-1/ITF/Microsoft-PowerPoint-Lecture641-07-08-v7-(1).pdf', type: 'pdf' },
              { name: 'Network_1', url: '/itkmitl/Y1-1/ITF/Network_1.pdf', type: 'pdf' },
              { name: 'Network_2', url: '/itkmitl/Y1-1/ITF/Network_2.pdf', type: 'pdf' },
              { name: 'Note-ITF-8', url: '/itkmitl/Y1-1/ITF/Note-ITF-8.pdf', type: 'pdf' },
              { name: 'Quiz', url: '/itkmitl/Y1-1/ITF/Quiz.pdf', type: 'pdf' },
              { name: 'week9', url: '/itkmitl/Y1-1/ITF/week9.pdf', type: 'pdf' },
              { name: '✅-01-Introducing-Today-Technology', url: '/itkmitl/Y1-1/ITF/%E2%9C%85-01-Introducing-Today-Technology.pdf', type: 'pdf' },
              { name: '✅-03-Computing-Components', url: '/itkmitl/Y1-1/ITF/%E2%9C%85-03-Computing-Components.pdf', type: 'pdf' },
              { name: '✅-04-Input-And-Output', url: '/itkmitl/Y1-1/ITF/%E2%9C%85-04-Input-And-Output.pdf', type: 'pdf' },
              { name: '✅-05-Storage', url: '/itkmitl/Y1-1/ITF/%E2%9C%85-05-Storage.pdf', type: 'pdf' },
              { name: '✅-07-Network', url: '/itkmitl/Y1-1/ITF/%E2%9C%85-07-Network.pdf', type: 'pdf' },
            ],
          },
          {
            name: 'Introduction To Computer Systems',
            code: 'ICS',
            files: [
              { name: 'chap01', url: '/itkmitl/Y1-1/ICS/chap01.pdf', type: 'pdf' },
              { name: 'Course-Syllabus-2565', url: '/itkmitl/Y1-1/ICS/Course-Syllabus-2565.pdf', type: 'pdf' },
              { name: '01670D70-DCC7-4600-A3F8-314896D3EF5E', url: '/itkmitl/Y1-1/ICS/Final/01670D70-DCC7-4600-A3F8-314896D3EF5E.jpeg', type: 'image' },
              { name: '078460B7-D50B-4E6D-A485-D24314752974', url: '/itkmitl/Y1-1/ICS/Final/078460B7-D50B-4E6D-A485-D24314752974.jpeg', type: 'image' },
              { name: '20188287-406E-4F92-BB4E-AA59C1583988', url: '/itkmitl/Y1-1/ICS/Final/20188287-406E-4F92-BB4E-AA59C1583988.jpeg', type: 'image' },
              { name: '294B5E7B-60E7-43C2-BA00-43A0B18A8E73', url: '/itkmitl/Y1-1/ICS/Final/294B5E7B-60E7-43C2-BA00-43A0B18A8E73.jpeg', type: 'image' },
              { name: '31282B51-D83C-4A7D-B5A0-2F0BBB28D723', url: '/itkmitl/Y1-1/ICS/Final/31282B51-D83C-4A7D-B5A0-2F0BBB28D723.jpeg', type: 'image' },
              { name: '360A2009-BB63-4C8E-9EA5-77662F7C6DBB', url: '/itkmitl/Y1-1/ICS/Final/360A2009-BB63-4C8E-9EA5-77662F7C6DBB.jpeg', type: 'image' },
              { name: '3CE0481D-2E97-4EDB-8A1A-2E9439AFBE4D', url: '/itkmitl/Y1-1/ICS/Final/3CE0481D-2E97-4EDB-8A1A-2E9439AFBE4D.jpeg', type: 'image' },
              { name: '43168B64-0189-40AF-8E75-04A0AB6F12EE(1)', url: '/itkmitl/Y1-1/ICS/Final/43168B64-0189-40AF-8E75-04A0AB6F12EE(1).jpeg', type: 'image' },
              { name: '43168B64-0189-40AF-8E75-04A0AB6F12EE', url: '/itkmitl/Y1-1/ICS/Final/43168B64-0189-40AF-8E75-04A0AB6F12EE.jpeg', type: 'image' },
              { name: '44797BFA-E13A-4A4B-8A38-FDCA2224E46B', url: '/itkmitl/Y1-1/ICS/Final/44797BFA-E13A-4A4B-8A38-FDCA2224E46B.jpeg', type: 'image' },
              { name: '4936B403-CA7E-4628-AAC5-54A3CC0C28A5', url: '/itkmitl/Y1-1/ICS/Final/4936B403-CA7E-4628-AAC5-54A3CC0C28A5.jpeg', type: 'image' },
              { name: '4D7A5C82-82F3-4067-BA2F-E7A38CF2B81C(1)', url: '/itkmitl/Y1-1/ICS/Final/4D7A5C82-82F3-4067-BA2F-E7A38CF2B81C(1).jpeg', type: 'image' },
              { name: '4D7A5C82-82F3-4067-BA2F-E7A38CF2B81C', url: '/itkmitl/Y1-1/ICS/Final/4D7A5C82-82F3-4067-BA2F-E7A38CF2B81C.jpeg', type: 'image' },
              { name: '5213A80A-33CD-4707-B5D0-02C433C21E02', url: '/itkmitl/Y1-1/ICS/Final/5213A80A-33CD-4707-B5D0-02C433C21E02.jpeg', type: 'image' },
              { name: '524AD197-C1D3-43A7-B066-9D0540526537', url: '/itkmitl/Y1-1/ICS/Final/524AD197-C1D3-43A7-B066-9D0540526537.jpeg', type: 'image' },
              { name: '5286211E-6C11-4CC4-9449-0D590186E399', url: '/itkmitl/Y1-1/ICS/Final/5286211E-6C11-4CC4-9449-0D590186E399.jpeg', type: 'image' },
              { name: '6238EC40-FAEB-4EF7-A275-D90519AD9EFB(1)', url: '/itkmitl/Y1-1/ICS/Final/6238EC40-FAEB-4EF7-A275-D90519AD9EFB(1).jpeg', type: 'image' },
              { name: '6238EC40-FAEB-4EF7-A275-D90519AD9EFB', url: '/itkmitl/Y1-1/ICS/Final/6238EC40-FAEB-4EF7-A275-D90519AD9EFB.jpeg', type: 'image' },
              { name: '6473FCA0-DEEE-41D0-A0AE-E9CB18139996(1)', url: '/itkmitl/Y1-1/ICS/Final/6473FCA0-DEEE-41D0-A0AE-E9CB18139996(1).jpeg', type: 'image' },
              { name: '6473FCA0-DEEE-41D0-A0AE-E9CB18139996', url: '/itkmitl/Y1-1/ICS/Final/6473FCA0-DEEE-41D0-A0AE-E9CB18139996.jpeg', type: 'image' },
              { name: '717C8631-9A9D-41D6-8911-86F90C16612D', url: '/itkmitl/Y1-1/ICS/Final/717C8631-9A9D-41D6-8911-86F90C16612D.jpeg', type: 'image' },
              { name: '7362392B-1AE8-45C3-A2AE-E357AC71FD47', url: '/itkmitl/Y1-1/ICS/Final/7362392B-1AE8-45C3-A2AE-E357AC71FD47.jpeg', type: 'image' },
              { name: '77FA247F-D134-48F2-90B5-683DC7BF55D6(1)', url: '/itkmitl/Y1-1/ICS/Final/77FA247F-D134-48F2-90B5-683DC7BF55D6(1).jpeg', type: 'image' },
              { name: '77FA247F-D134-48F2-90B5-683DC7BF55D6', url: '/itkmitl/Y1-1/ICS/Final/77FA247F-D134-48F2-90B5-683DC7BF55D6.jpeg', type: 'image' },
              { name: '7BDB3768-AB58-46E5-8EA2-CA2F5C1A08CA', url: '/itkmitl/Y1-1/ICS/Final/7BDB3768-AB58-46E5-8EA2-CA2F5C1A08CA.jpeg', type: 'image' },
              { name: '807EFE33-CD52-478B-A9DB-1187208914A8', url: '/itkmitl/Y1-1/ICS/Final/807EFE33-CD52-478B-A9DB-1187208914A8.jpeg', type: 'image' },
              { name: '8ACB50C4-7450-48DA-9EDA-0E5BFD6056F2(1)', url: '/itkmitl/Y1-1/ICS/Final/8ACB50C4-7450-48DA-9EDA-0E5BFD6056F2(1).jpeg', type: 'image' },
              { name: '8ACB50C4-7450-48DA-9EDA-0E5BFD6056F2', url: '/itkmitl/Y1-1/ICS/Final/8ACB50C4-7450-48DA-9EDA-0E5BFD6056F2.jpeg', type: 'image' },
              { name: '9C557315-92FF-4D54-B8F6-436942DEB578(1)', url: '/itkmitl/Y1-1/ICS/Final/9C557315-92FF-4D54-B8F6-436942DEB578(1).jpeg', type: 'image' },
              { name: '9C557315-92FF-4D54-B8F6-436942DEB578', url: '/itkmitl/Y1-1/ICS/Final/9C557315-92FF-4D54-B8F6-436942DEB578.jpeg', type: 'image' },
              { name: '9DECEE95-8D05-4339-ABD9-FF262A8C23F8', url: '/itkmitl/Y1-1/ICS/Final/9DECEE95-8D05-4339-ABD9-FF262A8C23F8.jpeg', type: 'image' },
              { name: 'A2730573-5B1C-4274-B337-CA01CBC384B3(1)', url: '/itkmitl/Y1-1/ICS/Final/A2730573-5B1C-4274-B337-CA01CBC384B3(1).jpeg', type: 'image' },
              { name: 'A2730573-5B1C-4274-B337-CA01CBC384B3', url: '/itkmitl/Y1-1/ICS/Final/A2730573-5B1C-4274-B337-CA01CBC384B3.jpeg', type: 'image' },
              { name: 'B2EA031D-D3AC-46C5-89CF-51D7A6323215', url: '/itkmitl/Y1-1/ICS/Final/B2EA031D-D3AC-46C5-89CF-51D7A6323215.jpeg', type: 'image' },
              { name: 'BBFBC882-ED9B-4431-94B9-9F73EF4987CC', url: '/itkmitl/Y1-1/ICS/Final/BBFBC882-ED9B-4431-94B9-9F73EF4987CC.jpeg', type: 'image' },
              { name: 'BEF308F2-70C6-4189-82CD-8669C7464464', url: '/itkmitl/Y1-1/ICS/Final/BEF308F2-70C6-4189-82CD-8669C7464464.jpeg', type: 'image' },
              { name: 'BF6CF78B-0C6F-40DF-B9C7-B485320D0C9D(1)', url: '/itkmitl/Y1-1/ICS/Final/BF6CF78B-0C6F-40DF-B9C7-B485320D0C9D(1).jpeg', type: 'image' },
              { name: 'BF6CF78B-0C6F-40DF-B9C7-B485320D0C9D', url: '/itkmitl/Y1-1/ICS/Final/BF6CF78B-0C6F-40DF-B9C7-B485320D0C9D.jpeg', type: 'image' },
              { name: 'CEC15E88-B056-4AD8-881E-3FAC281761C1(1)', url: '/itkmitl/Y1-1/ICS/Final/CEC15E88-B056-4AD8-881E-3FAC281761C1(1).jpeg', type: 'image' },
              { name: 'CEC15E88-B056-4AD8-881E-3FAC281761C1', url: '/itkmitl/Y1-1/ICS/Final/CEC15E88-B056-4AD8-881E-3FAC281761C1.jpeg', type: 'image' },
              { name: 'DE3CA23E-BA9F-46B0-9899-6EDC498606F2(1)', url: '/itkmitl/Y1-1/ICS/Final/DE3CA23E-BA9F-46B0-9899-6EDC498606F2(1).jpeg', type: 'image' },
              { name: 'DE3CA23E-BA9F-46B0-9899-6EDC498606F2', url: '/itkmitl/Y1-1/ICS/Final/DE3CA23E-BA9F-46B0-9899-6EDC498606F2.jpeg', type: 'image' },
              { name: 'EBE49CF2-0670-450A-9337-43DBDA141EA7', url: '/itkmitl/Y1-1/ICS/Final/EBE49CF2-0670-450A-9337-43DBDA141EA7.jpeg', type: 'image' },
              { name: 'ECB080D5-21AC-4ED2-9325-562A7DFA1F63', url: '/itkmitl/Y1-1/ICS/Final/ECB080D5-21AC-4ED2-9325-562A7DFA1F63.jpeg', type: 'image' },
              { name: 'F304DA94-2C6C-4311-91FF-B1CCE90BED41(1)', url: '/itkmitl/Y1-1/ICS/Final/F304DA94-2C6C-4311-91FF-B1CCE90BED41(1).jpeg', type: 'image' },
              { name: 'F304DA94-2C6C-4311-91FF-B1CCE90BED41', url: '/itkmitl/Y1-1/ICS/Final/F304DA94-2C6C-4311-91FF-B1CCE90BED41.jpeg', type: 'image' },
              { name: 'F9F8FE4E-9A07-4BA1-B605-7A7994F6C781(1)', url: '/itkmitl/Y1-1/ICS/Final/F9F8FE4E-9A07-4BA1-B605-7A7994F6C781(1).jpeg', type: 'image' },
              { name: 'F9F8FE4E-9A07-4BA1-B605-7A7994F6C781', url: '/itkmitl/Y1-1/ICS/Final/F9F8FE4E-9A07-4BA1-B605-7A7994F6C781.jpeg', type: 'image' },
              { name: 'ICS_Lab01_p', url: '/itkmitl/Y1-1/ICS/ICS_Lab01_p.pdf', type: 'pdf' },
              { name: 'ICS_Lab02_p', url: '/itkmitl/Y1-1/ICS/ICS_Lab02_p.pdf', type: 'pdf' },
              { name: 'ICS_Lab03_p', url: '/itkmitl/Y1-1/ICS/ICS_Lab03_p.pdf', type: 'pdf' },
              { name: 'ICS_Lab04', url: '/itkmitl/Y1-1/ICS/ICS_Lab04.pdf', type: 'pdf' },
              { name: 'ICS_Lab05', url: '/itkmitl/Y1-1/ICS/ICS_Lab05.pdf', type: 'pdf' },
              { name: 'lab02', url: '/itkmitl/Y1-1/ICS/lab02.pdf', type: 'pdf' },
              { name: 'lab03', url: '/itkmitl/Y1-1/ICS/lab03.pdf', type: 'pdf' },
              { name: 'Lec01_Intro', url: '/itkmitl/Y1-1/ICS/Lec01_Intro.pdf', type: 'pdf' },
              { name: 'Lec02_Boolean', url: '/itkmitl/Y1-1/ICS/Lec02_Boolean.pdf', type: 'pdf' },
              { name: 'Lec03_CanonicalForms', url: '/itkmitl/Y1-1/ICS/Lec03_CanonicalForms.pdf', type: 'pdf' },
              { name: 'Lec04_Kmap', url: '/itkmitl/Y1-1/ICS/Lec04_Kmap.pdf', type: 'pdf' },
              { name: 'Lec05_TimeResponse', url: '/itkmitl/Y1-1/ICS/Lec05_TimeResponse.pdf', type: 'pdf' },
              { name: 'Lec06_NumberSys', url: '/itkmitl/Y1-1/ICS/Lec06_NumberSys.pdf', type: 'pdf' },
              { name: 'Lec07_MUX', url: '/itkmitl/Y1-1/ICS/Lec07_MUX.pdf', type: 'pdf' },
              { name: 'slide02', url: '/itkmitl/Y1-1/ICS/slide02.pdf', type: 'pdf' },
              { name: 'สรุป-ICS', url: '/itkmitl/Y1-1/ICS/%E0%B8%AA%E0%B8%A3%E0%B8%B8%E0%B8%9B-ICS.pdf', type: 'pdf' },
            ],
          },
          {
            name: 'Problem Solving And Computer Programming',
            code: 'PSCP',
            files: [
              { name: 'PSCP_Chapter01-2022', url: '/itkmitl/Y1-1/PSCP/PSCP_Chapter01-2022.pdf', type: 'pdf' },
              { name: 'การบ้าน', url: '/itkmitl/Y1-1/PSCP/%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%99.pdf', type: 'pdf' },
            ],
          },
          {
            name: 'Charm School',
            code: 'CS',
            files: [
              { name: 'Charming-Progressive-v.2', url: '/itkmitl/Y1-1/Charm-School/Charming-Progressive-v.2.pdf', type: 'pdf' },
              { name: 'Charming_Progressing_1', url: '/itkmitl/Y1-1/Charm-School/Charming_Progressing_1.pdf', type: 'pdf' },
              { name: 'Hello-Modular-PRESENT', url: '/itkmitl/Y1-1/Charm-School/Hello-Modular-PRESENT.pdf', type: 'pdf' },
              { name: 'กิจกรรม-Hello-Modular', url: '/itkmitl/Y1-1/Charm-School/%E0%B8%81%E0%B8%B4%E0%B8%88%E0%B8%81%E0%B8%A3%E0%B8%A3%E0%B8%A1-Hello-Modular.pdf', type: 'pdf' },
              { name: 'ใบงานที่-1_Know-You-Know-Future', url: '/itkmitl/Y1-1/Charm-School/%E0%B9%83%E0%B8%9A%E0%B8%87%E0%B8%B2%E0%B8%99%E0%B8%97%E0%B8%B5%E0%B9%88-1_Know-You-Know-Future.pdf', type: 'pdf' },
              { name: 'ใบงานที่-2_DISC-SWOT', url: '/itkmitl/Y1-1/Charm-School/%E0%B9%83%E0%B8%9A%E0%B8%87%E0%B8%B2%E0%B8%99%E0%B8%97%E0%B8%B5%E0%B9%88-2_DISC-SWOT.pdf', type: 'pdf' },
              { name: 'ใบงานที่-3_Time-and-Stress-Management', url: '/itkmitl/Y1-1/Charm-School/%E0%B9%83%E0%B8%9A%E0%B8%87%E0%B8%B2%E0%B8%99%E0%B8%97%E0%B8%B5%E0%B9%88-3_Time-and-Stress-Management.pdf', type: 'pdf' },
              { name: 'ใบงานที่-4_The-Power-of-Vision', url: '/itkmitl/Y1-1/Charm-School/%E0%B9%83%E0%B8%9A%E0%B8%87%E0%B8%B2%E0%B8%99%E0%B8%97%E0%B8%B5%E0%B9%88-4_The-Power-of-Vision.pdf', type: 'pdf' },
            ],
          },
          { name: 'Sports And Recreational Activities', code: '90641003' },
          { name: 'Foundation English 1', code: '90644007' },
        ],
      },
      {
        id: 'y1s2',
        label: 'Year 1 · Semester 2 (2/2565)',
        subjects: [
          {
            name: 'Object-Oriented Programming',
            code: 'OOP',
            files: [
              { name: 'Cheatsheet-OOP-Final', url: '/itkmitl/Y1-2/OOP/Cheatsheet-OOP-Final.pdf', type: 'pdf' },
              { name: 'Lab-7-1', url: '/itkmitl/Y1-2/OOP/Lab-7-1.zip', type: 'zip' },
              { name: 'Lab-7-2', url: '/itkmitl/Y1-2/OOP/Lab-7-2.zip', type: 'zip' },
              { name: 'Pre-Final-65-By-Few', url: '/itkmitl/Y1-2/OOP/Pre-Final-65-By-Few.pdf', type: 'pdf' },
              { name: 'Pre-Midterm-65-By-Few', url: '/itkmitl/Y1-2/OOP/Pre-Midterm-65-By-Few.pdf', type: 'pdf' },
            ],
          },
          {
            name: 'Probability And Statistics',
            code: 'Prob',
            files: [
              { name: 'ex1', url: '/itkmitl/Y1-2/Probability/ex1.pdf', type: 'pdf' },
              { name: 'ex2', url: '/itkmitl/Y1-2/Probability/ex2.pdf', type: 'pdf' },
              { name: 'ex3', url: '/itkmitl/Y1-2/Probability/ex3.pdf', type: 'pdf' },
              { name: 'ex4', url: '/itkmitl/Y1-2/Probability/ex4.pdf', type: 'pdf' },
              { name: 'ex5', url: '/itkmitl/Y1-2/Probability/ex5.pdf', type: 'pdf' },
              { name: 'ex6', url: '/itkmitl/Y1-2/Probability/ex6.pdf', type: 'pdf' },
              { name: 'sol_ex1', url: '/itkmitl/Y1-2/Probability/sol_ex1.pdf', type: 'pdf' },
              { name: 'sol_ex2', url: '/itkmitl/Y1-2/Probability/sol_ex2.pdf', type: 'pdf' },
              { name: 'sol_ex3', url: '/itkmitl/Y1-2/Probability/sol_ex3.pdf', type: 'pdf' },
              { name: 'sol_ex4', url: '/itkmitl/Y1-2/Probability/sol_ex4.pdf', type: 'pdf' },
              { name: 'sol_ex5', url: '/itkmitl/Y1-2/Probability/sol_ex5.pdf', type: 'pdf' },
              { name: 'sol_ex6', url: '/itkmitl/Y1-2/Probability/sol_ex6.pdf', type: 'pdf' },
            ],
          },
          {
            name: 'Business Fundamentals For Information',
            code: 'BFIT',
            files: [
              { name: 'ECONOMIC', url: '/itkmitl/Y1-2/Bunisess/ECONOMIC.pdf', type: 'pdf' },
              { name: 'INVENTORY', url: '/itkmitl/Y1-2/Bunisess/INVENTORY.pdf', type: 'pdf' },
              { name: 'MARKETING', url: '/itkmitl/Y1-2/Bunisess/MARKETING.pdf', type: 'pdf' },
            ],
          },
          { name: 'Data Structures And Algorithms', code: '06066301' },
          { name: 'Digital Intelligence Quotient', code: '90641002' },
          { name: 'Innovation Management', code: '90643033' },
          { name: 'Foundation English 2', code: '90644008' },
          {
            name: 'Fun With Coding',
            code: '96642111',
            files: [
              { name: '42BKK-Certificate', url: '/itkmitl/Y1-2/Fun-with-Coding/42BKK-Certificate.pdf', type: 'pdf' },
            ],
          },
        ],
      },
      {
        id: 'y2s1',
        label: 'Year 2 · Semester 1 (1/2566)',
        subjects: [
          { name: 'Multimedia Technology', code: '06016403' },
          {
            name: 'Physical Computing',
            code: '06016409',
            files: [
              { name: 'a+b', url: '/itkmitl/Y2-1/Physical-Computing/Before-Midterm/pratice-midterm/a%2Bb.c', type: 'code' },
              { name: 'ABC', url: '/itkmitl/Y2-1/Physical-Computing/Before-Midterm/pratice-midterm/ABC.c', type: 'code' },
              { name: 'Character-Checker', url: '/itkmitl/Y2-1/Physical-Computing/Before-Midterm/pratice-midterm/Character-Checker.c', type: 'code' },
              { name: 'Floating-Point-Trick', url: '/itkmitl/Y2-1/Physical-Computing/Before-Midterm/pratice-midterm/Floating-Point-Trick.c', type: 'code' },
              { name: 'Grading', url: '/itkmitl/Y2-1/Physical-Computing/Before-Midterm/pratice-midterm/Grading.c', type: 'code' },
              { name: 'Herman', url: '/itkmitl/Y2-1/Physical-Computing/Before-Midterm/pratice-midterm/Herman.c', type: 'code' },
              { name: 'Matrix-Addition', url: '/itkmitl/Y2-1/Physical-Computing/Before-Midterm/pratice-midterm/Matrix-Addition.c', type: 'code' },
              { name: 'Min-Max', url: '/itkmitl/Y2-1/Physical-Computing/Before-Midterm/pratice-midterm/Min-Max.c', type: 'code' },
              { name: 'Pythagorus', url: '/itkmitl/Y2-1/Physical-Computing/Before-Midterm/pratice-midterm/Pythagorus.c', type: 'code' },
              { name: 'X2', url: '/itkmitl/Y2-1/Physical-Computing/Before-Midterm/pratice-midterm/X2.c', type: 'code' },
              { name: 'README', url: '/itkmitl/Y2-1/Physical-Computing/Before-Midterm/README.md', type: 'other' },
              { name: 'template', url: '/itkmitl/Y2-1/Physical-Computing/Before-Midterm/template.c', type: 'code' },
              { name: 'test', url: '/itkmitl/Y2-1/Physical-Computing/Before-Midterm/test.py', type: 'code' },
              { name: 'HW-01-01-Bank-Notes', url: '/itkmitl/Y2-1/Physical-Computing/Before-Midterm/week01/HW-01-01-Bank-Notes.rap', type: 'other' },
              { name: 'HW-01-02-Is-This-Calculus', url: '/itkmitl/Y2-1/Physical-Computing/Before-Midterm/week01/HW-01-02-Is-This-Calculus.rap', type: 'other' },
              { name: 'Lab-01-01-Donut', url: '/itkmitl/Y2-1/Physical-Computing/Before-Midterm/week01/Lab-01-01-Donut.rap', type: 'other' },
              { name: 'Lab-01-02-Grading', url: '/itkmitl/Y2-1/Physical-Computing/Before-Midterm/week01/Lab-01-02-Grading.rap', type: 'other' },
              { name: 'Lab-01-03-Commission', url: '/itkmitl/Y2-1/Physical-Computing/Before-Midterm/week01/Lab-01-03-Commission.rap', type: 'other' },
              { name: 'Lab-01-04-Half-Triangle', url: '/itkmitl/Y2-1/Physical-Computing/Before-Midterm/week01/Lab-01-04-Half-Triangle.rap', type: 'other' },
              { name: 'Lab-01-05-Arrow-UP', url: '/itkmitl/Y2-1/Physical-Computing/Before-Midterm/week01/Lab-01-05-Arrow-UP.rap', type: 'other' },
              { name: 'a', url: '/itkmitl/Y2-1/Physical-Computing/Before-Midterm/week02/a.out', type: 'other' },
              { name: 'HW02-01-ASCII', url: '/itkmitl/Y2-1/Physical-Computing/Before-Midterm/week02/HW02-01-ASCII.c', type: 'code' },
              { name: 'HW02-02-Number', url: '/itkmitl/Y2-1/Physical-Computing/Before-Midterm/week02/HW02-02-Number.c', type: 'code' },
              { name: 'HW02-03-Number-II', url: '/itkmitl/Y2-1/Physical-Computing/Before-Midterm/week02/HW02-03-Number-II.c', type: 'code' },
              { name: 'Lab02-01-PrintF', url: '/itkmitl/Y2-1/Physical-Computing/Before-Midterm/week02/Lab02-01-PrintF.c', type: 'code' },
              { name: 'Lab02-02-Complate-the-code', url: '/itkmitl/Y2-1/Physical-Computing/Before-Midterm/week02/Lab02-02-Complate-the-code.c', type: 'code' },
              { name: 'Lab02-03-Greeting-Alien', url: '/itkmitl/Y2-1/Physical-Computing/Before-Midterm/week02/Lab02-03-Greeting-Alien.c', type: 'code' },
              { name: 'Lab02-04-String-Format', url: '/itkmitl/Y2-1/Physical-Computing/Before-Midterm/week02/Lab02-04-String-Format.c', type: 'code' },
              { name: 'Lab02-05-String-Format-II', url: '/itkmitl/Y2-1/Physical-Computing/Before-Midterm/week02/Lab02-05-String-Format-II.c', type: 'code' },
              { name: 'Lab02-06-Multi-inputs', url: '/itkmitl/Y2-1/Physical-Computing/Before-Midterm/week02/Lab02-06-Multi-inputs.c', type: 'code' },
              { name: 'Lab02-07-IT-Registrar', url: '/itkmitl/Y2-1/Physical-Computing/Before-Midterm/week02/Lab02-07-IT-Registrar.c', type: 'code' },
              { name: 'Lab02-08-3-Person', url: '/itkmitl/Y2-1/Physical-Computing/Before-Midterm/week02/Lab02-08-3-Person.c', type: 'code' },
              { name: 'Lab02-09-Character-Shifting', url: '/itkmitl/Y2-1/Physical-Computing/Before-Midterm/week02/Lab02-09-Character-Shifting.c', type: 'code' },
              { name: 'HW03-01-Cell', url: '/itkmitl/Y2-1/Physical-Computing/Before-Midterm/week03/HW03-01-Cell.c', type: 'code' },
              { name: 'HW03-02-BMI', url: '/itkmitl/Y2-1/Physical-Computing/Before-Midterm/week03/HW03-02-BMI.c', type: 'code' },
              { name: 'Lab03-01-String-Format-III', url: '/itkmitl/Y2-1/Physical-Computing/Before-Midterm/week03/Lab03-01-String-Format-III.c', type: 'code' },
              { name: 'Lab03-02-Sum-and-Average', url: '/itkmitl/Y2-1/Physical-Computing/Before-Midterm/week03/Lab03-02-Sum-and-Average.c', type: 'code' },
              { name: 'Lab03-03-Pythagoras', url: '/itkmitl/Y2-1/Physical-Computing/Before-Midterm/week03/Lab03-03-Pythagoras.c', type: 'code' },
              { name: 'Lab03-04-Arithmetic', url: '/itkmitl/Y2-1/Physical-Computing/Before-Midterm/week03/Lab03-04-Arithmetic.c', type: 'code' },
              { name: 'Lab03-05-Perimeter-of-rectangle', url: '/itkmitl/Y2-1/Physical-Computing/Before-Midterm/week03/Lab03-05-Perimeter-of-rectangle.c', type: 'code' },
              { name: 'Lab03-06-Can-price-rate', url: '/itkmitl/Y2-1/Physical-Computing/Before-Midterm/week03/Lab03-06-Can-price-rate.c', type: 'code' },
              { name: 'Lab03-07-SMO#IT-sales-t-shirt', url: '/itkmitl/Y2-1/Physical-Computing/Before-Midterm/week03/Lab03-07-SMO%23IT-sales-t-shirt.c', type: 'code' },
              { name: 'Lab03-08-Datetime', url: '/itkmitl/Y2-1/Physical-Computing/Before-Midterm/week03/Lab03-08-Datetime.c', type: 'code' },
              { name: 'HW-04-01-SMO#IT-sales-t-shirt-2', url: '/itkmitl/Y2-1/Physical-Computing/Before-Midterm/week04/HW-04-01-SMO%23IT-sales-t-shirt-2.c', type: 'code' },
              { name: 'HW-04-02-Valid-Triangle', url: '/itkmitl/Y2-1/Physical-Computing/Before-Midterm/week04/HW-04-02-Valid-Triangle.c', type: 'code' },
              { name: 'Lab-04-01-Condition-Process', url: '/itkmitl/Y2-1/Physical-Computing/Before-Midterm/week04/Lab-04-01-Condition-Process.c', type: 'code' },
              { name: 'Lab-04-02-Find-Number', url: '/itkmitl/Y2-1/Physical-Computing/Before-Midterm/week04/Lab-04-02-Find-Number.c', type: 'code' },
              { name: 'Lab-04-03-Your-Grade', url: '/itkmitl/Y2-1/Physical-Computing/Before-Midterm/week04/Lab-04-03-Your-Grade.c', type: 'code' },
              { name: 'Lab-04-04-Your-Score', url: '/itkmitl/Y2-1/Physical-Computing/Before-Midterm/week04/Lab-04-04-Your-Score.c', type: 'code' },
              { name: 'Lab-04-05-Case-Convert', url: '/itkmitl/Y2-1/Physical-Computing/Before-Midterm/week04/Lab-04-05-Case-Convert.c', type: 'code' },
              { name: 'Lab-04-06-What-type', url: '/itkmitl/Y2-1/Physical-Computing/Before-Midterm/week04/Lab-04-06-What-type.c', type: 'code' },
              { name: 'HW-05-01-Sum-9', url: '/itkmitl/Y2-1/Physical-Computing/Before-Midterm/week05/HW-05-01-Sum-9.c', type: 'code' },
              { name: 'HW-05-02-Draw-X', url: '/itkmitl/Y2-1/Physical-Computing/Before-Midterm/week05/HW-05-02-Draw-X.c', type: 'code' },
              { name: 'HW-05-03-Reg-System', url: '/itkmitl/Y2-1/Physical-Computing/Before-Midterm/week05/HW-05-03-Reg-System.c', type: 'code' },
              { name: 'Lab-05-01-1-to-n', url: '/itkmitl/Y2-1/Physical-Computing/Before-Midterm/week05/Lab-05-01-1-to-n.c', type: 'code' },
              { name: 'Lab-05-02-n-to-1', url: '/itkmitl/Y2-1/Physical-Computing/Before-Midterm/week05/Lab-05-02-n-to-1.c', type: 'code' },
              { name: 'Lab-05-03-The-Decision', url: '/itkmitl/Y2-1/Physical-Computing/Before-Midterm/week05/Lab-05-03-The-Decision.c', type: 'code' },
              { name: 'Lab-05-04-While', url: '/itkmitl/Y2-1/Physical-Computing/Before-Midterm/week05/Lab-05-04-While.c', type: 'code' },
              { name: 'Lab-05-05-Easy-Loop', url: '/itkmitl/Y2-1/Physical-Computing/Before-Midterm/week05/Lab-05-05-Easy-Loop.c', type: 'code' },
              { name: 'Lab-05-06-Easy-Pyramid', url: '/itkmitl/Y2-1/Physical-Computing/Before-Midterm/week05/Lab-05-06-Easy-Pyramid.c', type: 'code' },
              { name: 'HW-06-01-Decrypt-EZ', url: '/itkmitl/Y2-1/Physical-Computing/Before-Midterm/week06/HW-06-01-Decrypt-EZ.c', type: 'code' },
              { name: 'HW-06-02-Histogram', url: '/itkmitl/Y2-1/Physical-Computing/Before-Midterm/week06/HW-06-02-Histogram.c', type: 'code' },
              { name: 'HW-06-03-Is-Palindrome', url: '/itkmitl/Y2-1/Physical-Computing/Before-Midterm/week06/HW-06-03-Is-Palindrome.c', type: 'code' },
              { name: 'Lab-06-01-Index', url: '/itkmitl/Y2-1/Physical-Computing/Before-Midterm/week06/Lab-06-01-Index.c', type: 'code' },
              { name: 'Lab-06-02-Matrix', url: '/itkmitl/Y2-1/Physical-Computing/Before-Midterm/week06/Lab-06-02-Matrix.c', type: 'code' },
              { name: 'Lab-06-03-Scalar-Matrix', url: '/itkmitl/Y2-1/Physical-Computing/Before-Midterm/week06/Lab-06-03-Scalar-Matrix.c', type: 'code' },
              { name: 'Lab-06-04-Reverse-Word-EZ', url: '/itkmitl/Y2-1/Physical-Computing/Before-Midterm/week06/Lab-06-04-Reverse-Word-EZ.c', type: 'code' },
              { name: 'Lab-06-05-Find-character-in-message-EZ_', url: '/itkmitl/Y2-1/Physical-Computing/Before-Midterm/week06/Lab-06-05-Find-character-in-message-EZ_.c', type: 'code' },
              { name: 'Lab-06-06-Sort-name-normal', url: '/itkmitl/Y2-1/Physical-Computing/Before-Midterm/week06/Lab-06-06-Sort-name-normal.c', type: 'code' },
              { name: 'Lab-06-07-Encrypt-EZ', url: '/itkmitl/Y2-1/Physical-Computing/Before-Midterm/week06/Lab-06-07-Encrypt-EZ.c', type: 'code' },
              { name: 'HW-07-01-Convert', url: '/itkmitl/Y2-1/Physical-Computing/Before-Midterm/week07/HW-07-01-Convert.c', type: 'code' },
              { name: 'HW-07-02-Golf', url: '/itkmitl/Y2-1/Physical-Computing/Before-Midterm/week07/HW-07-02-Golf.c', type: 'code' },
              { name: 'HW-07-03-Mantis-Jumper', url: '/itkmitl/Y2-1/Physical-Computing/Before-Midterm/week07/HW-07-03-Mantis-Jumper.c', type: 'code' },
              { name: 'Lab-07-01-Function-number', url: '/itkmitl/Y2-1/Physical-Computing/Before-Midterm/week07/Lab-07-01-Function-number.c', type: 'code' },
              { name: 'Lab-07-02-Strange', url: '/itkmitl/Y2-1/Physical-Computing/Before-Midterm/week07/Lab-07-02-Strange.c', type: 'code' },
              { name: 'Lab-07-03-Triangle', url: '/itkmitl/Y2-1/Physical-Computing/Before-Midterm/week07/Lab-07-03-Triangle.c', type: 'code' },
              { name: 'Lab-07-04-Temperature', url: '/itkmitl/Y2-1/Physical-Computing/Before-Midterm/week07/Lab-07-04-Temperature.c', type: 'code' },
              { name: 'Lab-07-05-Math-function', url: '/itkmitl/Y2-1/Physical-Computing/Before-Midterm/week07/Lab-07-05-Math-function.c', type: 'code' },
              { name: 'Lab-07-06-C', url: '/itkmitl/Y2-1/Physical-Computing/Before-Midterm/week07/Lab-07-06-C.c', type: 'code' },
              { name: 'ABC', url: '/itkmitl/Y2-1/Physical-Computing/Problem/ABC.pdf', type: 'pdf' },
              { name: 'Cheracter-Checker', url: '/itkmitl/Y2-1/Physical-Computing/Problem/Cheracter-Checker.pdf', type: 'pdf' },
              { name: 'DNA', url: '/itkmitl/Y2-1/Physical-Computing/Problem/DNA.pdf', type: 'pdf' },
              { name: 'Frog', url: '/itkmitl/Y2-1/Physical-Computing/Problem/Frog.pdf', type: 'pdf' },
              { name: 'Grading', url: '/itkmitl/Y2-1/Physical-Computing/Problem/Grading.pdf', type: 'pdf' },
              { name: 'Herman', url: '/itkmitl/Y2-1/Physical-Computing/Problem/Herman.pdf', type: 'pdf' },
              { name: 'Prime-Odd', url: '/itkmitl/Y2-1/Physical-Computing/Problem/Prime-Odd.pdf', type: 'pdf' },
              { name: 'ABC', url: '/itkmitl/Y2-1/Physical-Computing/Problem/%E0%B9%80%E0%B8%89%E0%B8%A5%E0%B8%A2/ABC.c', type: 'code' },
              { name: 'Character-Checker', url: '/itkmitl/Y2-1/Physical-Computing/Problem/%E0%B9%80%E0%B8%89%E0%B8%A5%E0%B8%A2/Character-Checker.c', type: 'code' },
              { name: 'DNA', url: '/itkmitl/Y2-1/Physical-Computing/Problem/%E0%B9%80%E0%B8%89%E0%B8%A5%E0%B8%A2/DNA.c', type: 'code' },
              { name: 'Frog', url: '/itkmitl/Y2-1/Physical-Computing/Problem/%E0%B9%80%E0%B8%89%E0%B8%A5%E0%B8%A2/Frog.c', type: 'code' },
              { name: 'Grading', url: '/itkmitl/Y2-1/Physical-Computing/Problem/%E0%B9%80%E0%B8%89%E0%B8%A5%E0%B8%A2/Grading.c', type: 'code' },
              { name: 'Herman', url: '/itkmitl/Y2-1/Physical-Computing/Problem/%E0%B9%80%E0%B8%89%E0%B8%A5%E0%B8%A2/Herman.c', type: 'code' },
              { name: 'Prime-Odd', url: '/itkmitl/Y2-1/Physical-Computing/Problem/%E0%B9%80%E0%B8%89%E0%B8%A5%E0%B8%A2/Prime-Odd.c', type: 'code' },
            ],
          },
          {
            name: 'Introduction To Network Systems',
            code: '06016413',
            files: [
              { name: 'Chapter-1-(Intro-To-HELL)', url: '/itkmitl/Y2-1/ICN-INS/Chapter-1-(Intro-To-HELL).pdf', type: 'pdf' },
              { name: 'Chapter_1_V6.1_MIT9', url: '/itkmitl/Y2-1/ICN-INS/Chapter_1_V6.1_MIT9.pdf', type: 'pdf' },
              { name: 'Chapter_2_V6.1_MIT9', url: '/itkmitl/Y2-1/ICN-INS/Chapter_2_V6.1_MIT9.pdf', type: 'pdf' },
              { name: 'Chapter_3_V6.0_MIT9', url: '/itkmitl/Y2-1/ICN-INS/Chapter_3_V6.0_MIT9.pdf', type: 'pdf' },
              { name: 'Chapter_4_V6.0_MIT9', url: '/itkmitl/Y2-1/ICN-INS/Chapter_4_V6.0_MIT9.pdf', type: 'pdf' },
              { name: 'Chapter_5_V6.01_MIT9', url: '/itkmitl/Y2-1/ICN-INS/Chapter_5_V6.01_MIT9.pdf', type: 'pdf' },
              { name: 'Midterm-ICN-Full', url: '/itkmitl/Y2-1/ICN-INS/Midterm-ICN-Full.pdf', type: 'pdf' },
              { name: 'สรุป-Network-ทั้งหมด-', url: '/itkmitl/Y2-1/ICN-INS/%E0%B8%AA%E0%B8%A3%E0%B8%B8%E0%B8%9B-Network-%E0%B8%97%E0%B8%B1%E0%B9%89%E0%B8%87%E0%B8%AB%E0%B8%A1%E0%B8%94-.pdf', type: 'pdf' },
            ],
          },
          { name: 'Discrete Mathematics', code: '06066000' },
          {
            name: 'Database System Concepts',
            code: '06066300',
            files: [
              { name: 'LINE_ALBUM_Database-Quiz-8-(88_)_230813_1', url: '/itkmitl/Y2-1/DBS/Lab-8/LINE_ALBUM_Database-Quiz-8-(88_)_230813_1.jpg', type: 'image' },
              { name: 'LINE_ALBUM_Database-Quiz-8-(88_)_230813_10', url: '/itkmitl/Y2-1/DBS/Lab-8/LINE_ALBUM_Database-Quiz-8-(88_)_230813_10.jpg', type: 'image' },
              { name: 'LINE_ALBUM_Database-Quiz-8-(88_)_230813_11', url: '/itkmitl/Y2-1/DBS/Lab-8/LINE_ALBUM_Database-Quiz-8-(88_)_230813_11.jpg', type: 'image' },
              { name: 'LINE_ALBUM_Database-Quiz-8-(88_)_230813_12', url: '/itkmitl/Y2-1/DBS/Lab-8/LINE_ALBUM_Database-Quiz-8-(88_)_230813_12.jpg', type: 'image' },
              { name: 'LINE_ALBUM_Database-Quiz-8-(88_)_230813_13', url: '/itkmitl/Y2-1/DBS/Lab-8/LINE_ALBUM_Database-Quiz-8-(88_)_230813_13.jpg', type: 'image' },
              { name: 'LINE_ALBUM_Database-Quiz-8-(88_)_230813_14', url: '/itkmitl/Y2-1/DBS/Lab-8/LINE_ALBUM_Database-Quiz-8-(88_)_230813_14.jpg', type: 'image' },
              { name: 'LINE_ALBUM_Database-Quiz-8-(88_)_230813_15', url: '/itkmitl/Y2-1/DBS/Lab-8/LINE_ALBUM_Database-Quiz-8-(88_)_230813_15.jpg', type: 'image' },
              { name: 'LINE_ALBUM_Database-Quiz-8-(88_)_230813_16', url: '/itkmitl/Y2-1/DBS/Lab-8/LINE_ALBUM_Database-Quiz-8-(88_)_230813_16.jpg', type: 'image' },
              { name: 'LINE_ALBUM_Database-Quiz-8-(88_)_230813_17', url: '/itkmitl/Y2-1/DBS/Lab-8/LINE_ALBUM_Database-Quiz-8-(88_)_230813_17.jpg', type: 'image' },
              { name: 'LINE_ALBUM_Database-Quiz-8-(88_)_230813_18', url: '/itkmitl/Y2-1/DBS/Lab-8/LINE_ALBUM_Database-Quiz-8-(88_)_230813_18.jpg', type: 'image' },
              { name: 'LINE_ALBUM_Database-Quiz-8-(88_)_230813_19', url: '/itkmitl/Y2-1/DBS/Lab-8/LINE_ALBUM_Database-Quiz-8-(88_)_230813_19.jpg', type: 'image' },
              { name: 'LINE_ALBUM_Database-Quiz-8-(88_)_230813_2', url: '/itkmitl/Y2-1/DBS/Lab-8/LINE_ALBUM_Database-Quiz-8-(88_)_230813_2.jpg', type: 'image' },
              { name: 'LINE_ALBUM_Database-Quiz-8-(88_)_230813_20', url: '/itkmitl/Y2-1/DBS/Lab-8/LINE_ALBUM_Database-Quiz-8-(88_)_230813_20.jpg', type: 'image' },
              { name: 'LINE_ALBUM_Database-Quiz-8-(88_)_230813_21', url: '/itkmitl/Y2-1/DBS/Lab-8/LINE_ALBUM_Database-Quiz-8-(88_)_230813_21.jpg', type: 'image' },
              { name: 'LINE_ALBUM_Database-Quiz-8-(88_)_230813_22', url: '/itkmitl/Y2-1/DBS/Lab-8/LINE_ALBUM_Database-Quiz-8-(88_)_230813_22.jpg', type: 'image' },
              { name: 'LINE_ALBUM_Database-Quiz-8-(88_)_230813_23', url: '/itkmitl/Y2-1/DBS/Lab-8/LINE_ALBUM_Database-Quiz-8-(88_)_230813_23.jpg', type: 'image' },
              { name: 'LINE_ALBUM_Database-Quiz-8-(88_)_230813_24', url: '/itkmitl/Y2-1/DBS/Lab-8/LINE_ALBUM_Database-Quiz-8-(88_)_230813_24.jpg', type: 'image' },
              { name: 'LINE_ALBUM_Database-Quiz-8-(88_)_230813_25', url: '/itkmitl/Y2-1/DBS/Lab-8/LINE_ALBUM_Database-Quiz-8-(88_)_230813_25.jpg', type: 'image' },
              { name: 'LINE_ALBUM_Database-Quiz-8-(88_)_230813_3', url: '/itkmitl/Y2-1/DBS/Lab-8/LINE_ALBUM_Database-Quiz-8-(88_)_230813_3.jpg', type: 'image' },
              { name: 'LINE_ALBUM_Database-Quiz-8-(88_)_230813_4', url: '/itkmitl/Y2-1/DBS/Lab-8/LINE_ALBUM_Database-Quiz-8-(88_)_230813_4.jpg', type: 'image' },
              { name: 'LINE_ALBUM_Database-Quiz-8-(88_)_230813_5', url: '/itkmitl/Y2-1/DBS/Lab-8/LINE_ALBUM_Database-Quiz-8-(88_)_230813_5.jpg', type: 'image' },
              { name: 'LINE_ALBUM_Database-Quiz-8-(88_)_230813_6', url: '/itkmitl/Y2-1/DBS/Lab-8/LINE_ALBUM_Database-Quiz-8-(88_)_230813_6.jpg', type: 'image' },
              { name: 'LINE_ALBUM_Database-Quiz-8-(88_)_230813_7', url: '/itkmitl/Y2-1/DBS/Lab-8/LINE_ALBUM_Database-Quiz-8-(88_)_230813_7.jpg', type: 'image' },
              { name: 'LINE_ALBUM_Database-Quiz-8-(88_)_230813_8', url: '/itkmitl/Y2-1/DBS/Lab-8/LINE_ALBUM_Database-Quiz-8-(88_)_230813_8.jpg', type: 'image' },
              { name: 'LINE_ALBUM_Database-Quiz-8-(88_)_230813_9', url: '/itkmitl/Y2-1/DBS/Lab-8/LINE_ALBUM_Database-Quiz-8-(88_)_230813_9.jpg', type: 'image' },
              { name: 'LINE_ALBUM_Database-Quiz-9-(100-_)_230813_1', url: '/itkmitl/Y2-1/DBS/Lab-9/LINE_ALBUM_Database-Quiz-9-(100-_)_230813_1.jpg', type: 'image' },
              { name: 'LINE_ALBUM_Database-Quiz-9-(100-_)_230813_2', url: '/itkmitl/Y2-1/DBS/Lab-9/LINE_ALBUM_Database-Quiz-9-(100-_)_230813_2.jpg', type: 'image' },
              { name: 'LINE_ALBUM_Database-Quiz-9-(100-_)_230813_3', url: '/itkmitl/Y2-1/DBS/Lab-9/LINE_ALBUM_Database-Quiz-9-(100-_)_230813_3.jpg', type: 'image' },
              { name: 'LINE_ALBUM_Database-Quiz-9-(100-_)_230813_4', url: '/itkmitl/Y2-1/DBS/Lab-9/LINE_ALBUM_Database-Quiz-9-(100-_)_230813_4.jpg', type: 'image' },
              { name: 'LINE_ALBUM_Database-Quiz-9-(100-_)_230813_5', url: '/itkmitl/Y2-1/DBS/Lab-9/LINE_ALBUM_Database-Quiz-9-(100-_)_230813_5.jpg', type: 'image' },
            ],
          },
          {
            name: 'Information System Analysis And Design',
            code: '06066304',
            files: [
              { name: 'ISAD-M', url: '/itkmitl/Y2-1/ISAD/ISAD-M.pdf', type: 'pdf' },
            ],
          },
        ],
      },
      {
        id: 'y2s2',
        label: 'Year 2 · Semester 2 (2/2566)',
        subjects: [
          {
            name: 'Cybersecurity Fundamental',
            code: '06016405',
            files: [
              { name: 'Archives-files-Cybersecurity-02-2023-(Software-Testing)', url: '/itkmitl/Y2-2/Cyber/Archives-files-Cybersecurity-02-2023-(Software-Testing).zip', type: 'zip' },
              { name: 'Cybersecurity-Fundamentals-(06016405)-MID-02_2023-By-P_-Sila-(IT20)(1)(1)', url: '/itkmitl/Y2-2/Cyber/Cybersecurity-Fundamentals-(06016405)-MID-02_2023-By-P_-Sila-(IT20)(1)(1).pdf', type: 'pdf' },
              { name: 'Cybersecurity-Fundamentals-(06016405)-MID-02_2023-By-P_-Sila-(IT20)(1)', url: '/itkmitl/Y2-2/Cyber/Cybersecurity-Fundamentals-(06016405)-MID-02_2023-By-P_-Sila-(IT20)(1).pdf', type: 'pdf' },
              { name: '0-abstract', url: '/itkmitl/Y2-2/Cyber/cybersecurity-group-assignment/0-abstract.docx', type: 'doc' },
              { name: '1-introduction', url: '/itkmitl/Y2-2/Cyber/cybersecurity-group-assignment/1-introduction.docx', type: 'doc' },
              { name: '2-Basic-Principles-and-Literature-Reviews', url: '/itkmitl/Y2-2/Cyber/cybersecurity-group-assignment/2-Basic-Principles-and-Literature-Reviews.docx', type: 'doc' },
              { name: '3-Proposed-Work', url: '/itkmitl/Y2-2/Cyber/cybersecurity-group-assignment/3-Proposed-Work.docx', type: 'doc' },
              { name: '4-conclusion', url: '/itkmitl/Y2-2/Cyber/cybersecurity-group-assignment/4-conclusion.docx', type: 'doc' },
              { name: '5+6-ref+plagiarism', url: '/itkmitl/Y2-2/Cyber/cybersecurity-group-assignment/5%2B6-ref%2Bplagiarism.docx', type: 'doc' },
              { name: 'REPORT-Cybersecurity-02-2023-(Software-Testing)', url: '/itkmitl/Y2-2/Cyber/REPORT-Cybersecurity-02-2023-(Software-Testing).pdf', type: 'pdf' },
              { name: 'SLIDE-Cybersecurity-02-2023-(Software-Testing)', url: '/itkmitl/Y2-2/Cyber/SLIDE-Cybersecurity-02-2023-(Software-Testing).pdf', type: 'pdf' },
              { name: 'อ่านแล้วควยใหญ่', url: '/itkmitl/Y2-2/Cyber/%E0%B8%AD%E0%B9%88%E0%B8%B2%E0%B8%99%E0%B9%81%E0%B8%A5%E0%B9%89%E0%B8%A7%E0%B8%84%E0%B8%A7%E0%B8%A2%E0%B9%83%E0%B8%AB%E0%B8%8D%E0%B9%88.pdf', type: 'pdf' },
            ],
          },
          {
            name: 'Software Engineering',
            code: '06016410',
            files: [
              { name: 'Software-Engineering-MID-02_2023-by-P_-Sila-(IT20)-ขาด-Week-07', url: '/itkmitl/Y2-2/SE/Software-Engineering-MID-02_2023-by-P_-Sila-(IT20)-%E0%B8%82%E0%B8%B2%E0%B8%94-Week-07.pdf', type: 'pdf' },
            ],
          },
          {
            name: 'Computer Organization And Operating System',
            code: '06016412',
            files: [
              { name: 'ComOr-Week-1-4', url: '/itkmitl/Y2-2/COMOR/ComOr-Week-1-4.pdf', type: 'pdf' },
              { name: 'EX01-ComputerProgramExecution', url: '/itkmitl/Y2-2/COMOR/EX01-ComputerProgramExecution.pdf', type: 'pdf' },
              { name: 'EX02-InstructionSetArchitecture', url: '/itkmitl/Y2-2/COMOR/EX02-InstructionSetArchitecture.pdf', type: 'pdf' },
              { name: 'Ex03-CacheOperations', url: '/itkmitl/Y2-2/COMOR/Ex03-CacheOperations.pdf', type: 'pdf' },
              { name: 'EX04-IOandInterrupt', url: '/itkmitl/Y2-2/COMOR/EX04-IOandInterrupt.pdf', type: 'pdf' },
              { name: 'EX05-InstructionPiplining', url: '/itkmitl/Y2-2/COMOR/EX05-InstructionPiplining.pdf', type: 'pdf' },
            ],
          },
          {
            name: 'NoSQL Database Systems',
            code: '06016414',
            files: [
              { name: 'MID02_2023-NoSQL-Lab-@FewIT-(20)', url: '/itkmitl/Y2-2/NoSQL/MID02_2023-NoSQL-Lab-%40FewIT-(20).pdf', type: 'pdf' },
              { name: 'Data-Dictionary', url: '/itkmitl/Y2-2/NoSQL/Project/Data-Dictionary.docx', type: 'doc' },
              { name: 'test.assignmenthistories', url: '/itkmitl/Y2-2/NoSQL/Project/JSON-Data/test.assignmenthistories.json', type: 'other' },
              { name: 'test.assignments', url: '/itkmitl/Y2-2/NoSQL/Project/JSON-Data/test.assignments.json', type: 'other' },
              { name: 'test.classrooms', url: '/itkmitl/Y2-2/NoSQL/Project/JSON-Data/test.classrooms.json', type: 'other' },
              { name: 'test.code.chunks', url: '/itkmitl/Y2-2/NoSQL/Project/JSON-Data/test.code.chunks.json', type: 'other' },
              { name: 'test.code.files', url: '/itkmitl/Y2-2/NoSQL/Project/JSON-Data/test.code.files.json', type: 'other' },
              { name: 'test.file.chunks', url: '/itkmitl/Y2-2/NoSQL/Project/JSON-Data/test.file.chunks.json', type: 'other' },
              { name: 'test.file.files', url: '/itkmitl/Y2-2/NoSQL/Project/JSON-Data/test.file.files.json', type: 'other' },
              { name: 'test.lessons', url: '/itkmitl/Y2-2/NoSQL/Project/JSON-Data/test.lessons.json', type: 'other' },
              { name: 'test.pages', url: '/itkmitl/Y2-2/NoSQL/Project/JSON-Data/test.pages.json', type: 'other' },
              { name: 'test.users', url: '/itkmitl/Y2-2/NoSQL/Project/JSON-Data/test.users.json', type: 'other' },
              { name: 'Query-Questions', url: '/itkmitl/Y2-2/NoSQL/Project/Query-Questions.xlsx', type: 'spreadsheet' },
              { name: 'JLEARN-ABOUT-US', url: '/itkmitl/Y2-2/NoSQL/Project/Webpage/JLEARN-ABOUT-US.png', type: 'image' },
              { name: 'JLEARN-ASSIGNMENT-DESCRIPTION', url: '/itkmitl/Y2-2/NoSQL/Project/Webpage/JLEARN-ASSIGNMENT-DESCRIPTION.png', type: 'image' },
              { name: 'JLEARN-ASSIGNMENT-PAGE', url: '/itkmitl/Y2-2/NoSQL/Project/Webpage/JLEARN-ASSIGNMENT-PAGE.png', type: 'image' },
              { name: 'JLEARN-COURSE-MEMBER-TAB', url: '/itkmitl/Y2-2/NoSQL/Project/Webpage/JLEARN-COURSE-MEMBER-TAB.png', type: 'image' },
              { name: 'JLEARN-COURSE-PAGE', url: '/itkmitl/Y2-2/NoSQL/Project/Webpage/JLEARN-COURSE-PAGE.png', type: 'image' },
              { name: 'JLEARN-COURSE', url: '/itkmitl/Y2-2/NoSQL/Project/Webpage/JLEARN-COURSE.png', type: 'image' },
              { name: 'JLEARN-HISTORY-SUBMISSION', url: '/itkmitl/Y2-2/NoSQL/Project/Webpage/JLEARN-HISTORY-SUBMISSION.png', type: 'image' },
              { name: 'JLEARN-LESSON', url: '/itkmitl/Y2-2/NoSQL/Project/Webpage/JLEARN-LESSON.png', type: 'image' },
              { name: 'JLEARN-MEMBERS', url: '/itkmitl/Y2-2/NoSQL/Project/Webpage/JLEARN-MEMBERS.png', type: 'image' },
              { name: 'JLEARN-PROJECT', url: '/itkmitl/Y2-2/NoSQL/Project/Webpage/JLEARN-PROJECT.png', type: 'image' },
              { name: 'JLEARN-SCOREBOARD', url: '/itkmitl/Y2-2/NoSQL/Project/Webpage/JLEARN-SCOREBOARD.png', type: 'image' },
              { name: 'JLEARN-SUBMISSION-CLASS', url: '/itkmitl/Y2-2/NoSQL/Project/Webpage/JLEARN-SUBMISSION-CLASS.png', type: 'image' },
              { name: 'JLEARN-SUBMISSION-CODE', url: '/itkmitl/Y2-2/NoSQL/Project/Webpage/JLEARN-SUBMISSION-CODE.png', type: 'image' },
              { name: 'JLEARN-SUBMISSION-RELATIONS', url: '/itkmitl/Y2-2/NoSQL/Project/Webpage/JLEARN-SUBMISSION-RELATIONS.png', type: 'image' },
              { name: 'JLEARN-SUBMISSION-TESTCASE', url: '/itkmitl/Y2-2/NoSQL/Project/Webpage/JLEARN-SUBMISSION-TESTCASE.png', type: 'image' },
            ],
          },
          {
            name: 'Functional Programming',
            code: '06016415',
            files: [
              { name: 'Assignment-2-_-Functional-List', url: '/itkmitl/Y2-2/Funtional-Pro/Assignment-2-_-Functional-List.pdf', type: 'pdf' },
              { name: 'ex2-minecraft_data', url: '/itkmitl/Y2-2/Funtional-Pro/ex2-minecraft_data.csv', type: 'spreadsheet' },
              { name: 'ex2', url: '/itkmitl/Y2-2/Funtional-Pro/ex2.txt', type: 'other' },
              { name: 'Lab-03-Basic-file-operations-in-Scala', url: '/itkmitl/Y2-2/Funtional-Pro/Lab-03-Basic-file-operations-in-Scala.pdf', type: 'pdf' },
              { name: 'LAB01_Basic-Scala', url: '/itkmitl/Y2-2/Funtional-Pro/LAB01_Basic-Scala.pdf', type: 'pdf' },
              { name: 'LAB02', url: '/itkmitl/Y2-2/Funtional-Pro/LAB02.pdf', type: 'pdf' },
              { name: 'LAB04', url: '/itkmitl/Y2-2/Funtional-Pro/LAB04.pdf', type: 'pdf' },
              { name: 'Peeranat-Matsor-Assignment-1-_-Lambda-Calculus', url: '/itkmitl/Y2-2/Funtional-Pro/Peeranat-Matsor-Assignment-1-_-Lambda-Calculus.pdf', type: 'pdf' },
              { name: 'q2.1_65070159', url: '/itkmitl/Y2-2/Funtional-Pro/q2.1_65070159.pdf', type: 'pdf' },
              { name: 'q2.2_65070159', url: '/itkmitl/Y2-2/Funtional-Pro/q2.2_65070159.pdf', type: 'pdf' },
              { name: 'quiz1_65070159', url: '/itkmitl/Y2-2/Funtional-Pro/quiz1_65070159.pdf', type: 'pdf' },
            ],
          },
          {
            name: 'Fundamental Web Programming',
            code: '06066302',
            files: [
              { name: 'Group-15-Presentation', url: '/itkmitl/Y2-2/WebPro/Group-15-Presentation.pdf', type: 'pdf' },
              { name: 'Group-15-Proposal', url: '/itkmitl/Y2-2/WebPro/Group-15-Proposal.pdf', type: 'pdf' },
              { name: 'Group-15-Report', url: '/itkmitl/Y2-2/WebPro/Group-15-Report.pdf', type: 'pdf' },
            ],
          },
          {
            name: 'Law For New Generation',
            code: '90642033',
            files: [
              { name: '140267-หลักกฎหมายข้อเท็จจริง-+-Q&A-(Version-1)', url: '/itkmitl/Y2-2/LAW-FOR-NEW-GENARATION/140267-%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%81%E0%B8%81%E0%B8%8E%E0%B8%AB%E0%B8%A1%E0%B8%B2%E0%B8%A2%E0%B8%82%E0%B9%89%E0%B8%AD%E0%B9%80%E0%B8%97%E0%B9%87%E0%B8%88%E0%B8%88%E0%B8%A3%E0%B8%B4%E0%B8%87-%2B-Q%26A-(Version-1).pdf', type: 'pdf' },
              { name: '140267-หลักกฎหมายข้อเท็จจริง-+-Q&A-(Version-2)', url: '/itkmitl/Y2-2/LAW-FOR-NEW-GENARATION/140267-%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%81%E0%B8%81%E0%B8%8E%E0%B8%AB%E0%B8%A1%E0%B8%B2%E0%B8%A2%E0%B8%82%E0%B9%89%E0%B8%AD%E0%B9%80%E0%B8%97%E0%B9%87%E0%B8%88%E0%B8%88%E0%B8%A3%E0%B8%B4%E0%B8%87-%2B-Q%26A-(Version-2).pdf', type: 'pdf' },
              { name: '28-02-2024-Storyboard-Law', url: '/itkmitl/Y2-2/LAW-FOR-NEW-GENARATION/28-02-2024-Storyboard-Law.pdf', type: 'pdf' },
              { name: '290167-ข้อเท็จจริง', url: '/itkmitl/Y2-2/LAW-FOR-NEW-GENARATION/290167-%E0%B8%82%E0%B9%89%E0%B8%AD%E0%B9%80%E0%B8%97%E0%B9%87%E0%B8%88%E0%B8%88%E0%B8%A3%E0%B8%B4%E0%B8%87.pdf', type: 'pdf' },
              { name: 'Law-for-New-Generation-90642033-Final-022023-By-P-Few-IT20', url: '/itkmitl/Y2-2/LAW-FOR-NEW-GENARATION/Law-for-New-Generation-90642033-Final-022023-By-P-Few-IT20.pdf', type: 'pdf' },
              { name: 'Storyboard-Law', url: '/itkmitl/Y2-2/LAW-FOR-NEW-GENARATION/Submission-(Group-6)/storyboard/Storyboard-Law.pdf', type: 'pdf' },
              { name: 'หลักกฎหมายข้อเท็จจริง-+-Q&A', url: '/itkmitl/Y2-2/LAW-FOR-NEW-GENARATION/Submission-(Group-6)/%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%81%E0%B8%81%E0%B8%8E%E0%B8%AB%E0%B8%A1%E0%B8%B2%E0%B8%A2/%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%81%E0%B8%81%E0%B8%8E%E0%B8%AB%E0%B8%A1%E0%B8%B2%E0%B8%A2%E0%B8%82%E0%B9%89%E0%B8%AD%E0%B9%80%E0%B8%97%E0%B9%87%E0%B8%88%E0%B8%88%E0%B8%A3%E0%B8%B4%E0%B8%87-%2B-Q%26A.pdf', type: 'pdf' },
              { name: 'สรุป-Law-for-new-gen-(midterm)', url: '/itkmitl/Y2-2/LAW-FOR-NEW-GENARATION/%E0%B8%AA%E0%B8%A3%E0%B8%B8%E0%B8%9B-Law-for-new-gen-(midterm).pdf', type: 'pdf' },
              { name: 'อาญา', url: '/itkmitl/Y2-2/LAW-FOR-NEW-GENARATION/%E0%B8%AD%E0%B8%B2%E0%B8%8D%E0%B8%B2.pdf', type: 'pdf' },
              { name: 'แนววิชากฎหมาย-สัปดาห์ที่-๑๐(1)', url: '/itkmitl/Y2-2/LAW-FOR-NEW-GENARATION/%E0%B9%81%E0%B8%99%E0%B8%A7%E0%B8%A7%E0%B8%B4%E0%B8%8A%E0%B8%B2%E0%B8%81%E0%B8%8E%E0%B8%AB%E0%B8%A1%E0%B8%B2%E0%B8%A2-%E0%B8%AA%E0%B8%B1%E0%B8%9B%E0%B8%94%E0%B8%B2%E0%B8%AB%E0%B9%8C%E0%B8%97%E0%B8%B5%E0%B9%88-%E0%B9%91%E0%B9%90(1).pdf', type: 'pdf' },
            ],
          },
        ],
      },
      {
        id: 'y3s1',
        label: 'Year 3 · Semester 1 (1/2567)',
        subjects: [
          {
            name: 'Cloud Computing',
            code: '06016404',
            files: [
              { name: 'Cloud-Technology-(06066102)-MID-01_2024-By-P’-Sila-(IT20)', url: '/itkmitl/Y3-1/Cloud-Computing/Cloud-Technology-(06066102)-MID-01_2024-By-P%E2%80%99-Sila-(IT20).pdf', type: 'pdf' },
              { name: 'Cloud_Technology-(SE-06066102)-FINAL-01_2024-_-By-P_Sila-(IT20)', url: '/itkmitl/Y3-1/Cloud-Computing/Cloud_Technology-(SE-06066102)-FINAL-01_2024-_-By-P_Sila-(IT20).pdf', type: 'pdf' },
              { name: 'DeployThings-Cloud-Technology', url: '/itkmitl/Y3-1/Cloud-Computing/DeployThings-Cloud-Technology.pdf', type: 'pdf' },
              { name: 'Knowledge-Check-Before-Midterm', url: '/itkmitl/Y3-1/Cloud-Computing/knowledge-check/Knowledge-Check-Before-Midterm.pdf', type: 'pdf' },
            ],
          },
          {
            name: 'Requirement Engineering',
            code: '06016416',
            files: [
              { name: 'IMG_5376', url: '/itkmitl/Y3-1/Requirement-Engineering/Assignment/IMG_5376.jpg', type: 'image' },
              { name: 'RE-7-Using-Attributes', url: '/itkmitl/Y3-1/Requirement-Engineering/Assignment/RE-7-Using-Attributes.doc', type: 'doc' },
              { name: 'RE-Identify-Actos', url: '/itkmitl/Y3-1/Requirement-Engineering/Assignment/RE-Identify-Actos.pdf', type: 'pdf' },
              { name: 'RE-System-Specifications', url: '/itkmitl/Y3-1/Requirement-Engineering/Assignment/RE-System-Specifications.pdf', type: 'pdf' },
              { name: 'BMC_KMITL', url: '/itkmitl/Y3-1/Requirement-Engineering/BMC_KMITL.pdf', type: 'pdf' },
              { name: 'ISAD-PROJECT', url: '/itkmitl/Y3-1/Requirement-Engineering/ISAD-PROJECT.pdf', type: 'pdf' },
              { name: 'RE-2', url: '/itkmitl/Y3-1/Requirement-Engineering/RE-2.pdf', type: 'pdf' },
              { name: 'RE-3-(Student)', url: '/itkmitl/Y3-1/Requirement-Engineering/RE-3-(Student).pdf', type: 'pdf' },
              { name: 'RE-3-Initial-System-Requests', url: '/itkmitl/Y3-1/Requirement-Engineering/RE-3-Initial-System-Requests.pdf', type: 'pdf' },
              { name: 'RE-4-Student', url: '/itkmitl/Y3-1/Requirement-Engineering/RE-4-Student.pdf', type: 'pdf' },
              { name: 'RE-5', url: '/itkmitl/Y3-1/Requirement-Engineering/RE-5.pdf', type: 'pdf' },
              { name: 'RE-6', url: '/itkmitl/Y3-1/Requirement-Engineering/RE-6.pdf', type: 'pdf' },
              { name: 'RE-7', url: '/itkmitl/Y3-1/Requirement-Engineering/RE-7.pdf', type: 'pdf' },
            ],
          },
          {
            name: 'Software Development Tools And Environments',
            code: '06016417',
            files: [
              { name: '01-2024-Software-Development-Tools-and-Environment-Midterm-By-P_Few-(IT20)', url: '/itkmitl/Y3-1/Software-Developments-and-Environments/01-2024-Software-Development-Tools-and-Environment-Midterm-By-P_Few-(IT20).pdf', type: 'pdf' },
              { name: 'DevTools-LearnHub-PJ', url: '/itkmitl/Y3-1/Software-Developments-and-Environments/DevTools-LearnHub-PJ.pdf', type: 'pdf' },
              { name: 'SOFTWARE_DEVELOPMENT_TOOLS_AND_ENVIRONMENTS_(06016417)_-_Final_012024_-_By_P_Few_(IT20)', url: '/itkmitl/Y3-1/Software-Developments-and-Environments/SOFTWARE_DEVELOPMENT_TOOLS_AND_ENVIRONMENTS_(06016417)_-_Final_012024_-_By_P_Few_(IT20).pdf', type: 'pdf' },
            ],
          },
          {
            name: 'Server-Side Web Development',
            code: '06016418',
            files: [
              { name: 'TA-Registrar-Online-Requirements', url: '/itkmitl/Y3-1/Server-Side-Web-Development/TA-Registrar-Online-Requirements.pdf', type: 'pdf' },
            ],
          },
          {
            name: 'Management Information Systems',
            code: '06066102',
            files: [
              { name: 'student-MIS-2024-ch1', url: '/itkmitl/Y3-1/Management-Information-System/student-MIS-2024-ch1.pdf', type: 'pdf' },
              { name: 'student-MIS-2024-ch2', url: '/itkmitl/Y3-1/Management-Information-System/student-MIS-2024-ch2.pdf', type: 'pdf' },
              { name: 'student-MIS-2024-ch3', url: '/itkmitl/Y3-1/Management-Information-System/student-MIS-2024-ch3.pdf', type: 'pdf' },
              { name: 'student-MIS-2024-ch4-IT-planning', url: '/itkmitl/Y3-1/Management-Information-System/student-MIS-2024-ch4-IT-planning.pdf', type: 'pdf' },
              { name: 'student-MIS-2024-ch5-Ethics', url: '/itkmitl/Y3-1/Management-Information-System/student-MIS-2024-ch5-Ethics.pdf', type: 'pdf' },
            ],
          },
          { name: 'Language In Thai Society', code: '90644048' },
        ],
      },
      {
        id: 'y3s2',
        label: 'Year 3 · Semester 2 (2/2567)',
        subjects: [
          {
            name: 'Microservice Design And Development',
            code: '06016428',
            files: [
              { name: 'smart-route-project', url: '/itkmitl/Y3-2/MDD/smart-route-project.zip', type: 'zip' },
            ],
          },
          {
            name: 'Client-Side Web Development',
            code: '06016429',
            files: [
              { name: 'Full-TA-Registrar-Online', url: '/itkmitl/Y3-2/Client/Full-TA-Registrar-Online.pdf', type: 'pdf' },
            ],
          },
          {
            name: 'Information Technology Project Management',
            code: '06066100',
            files: [
              { name: 'Budget-1', url: '/itkmitl/Y3-2/ITPM/Arit/Budget-1.jpg', type: 'image' },
              { name: 'Budget-2', url: '/itkmitl/Y3-2/ITPM/Arit/Budget-2.jpg', type: 'image' },
              { name: 'Budget-3', url: '/itkmitl/Y3-2/ITPM/Arit/Budget-3.jpg', type: 'image' },
              { name: 'Chap2_4pages', url: '/itkmitl/Y3-2/ITPM/Arit/Chap2_4pages.pdf', type: 'pdf' },
              { name: 'NormalTable1', url: '/itkmitl/Y3-2/ITPM/Arit/NormalTable1.png', type: 'image' },
              { name: 'Project-Cash-Flow-Analysis-1-Question', url: '/itkmitl/Y3-2/ITPM/Arit/Project-Cash-Flow-Analysis-1-Question.pdf', type: 'pdf' },
              { name: 'Project-Cash-Flow-Analysis-1-Solution', url: '/itkmitl/Y3-2/ITPM/Arit/Project-Cash-Flow-Analysis-1-Solution.pdf', type: 'pdf' },
              { name: 'Project-Cash-Flow-Analysis-2', url: '/itkmitl/Y3-2/ITPM/Arit/Project-Cash-Flow-Analysis-2.jpg', type: 'image' },
              { name: 'Project_Budget_Slide', url: '/itkmitl/Y3-2/ITPM/Arit/Project_Budget_Slide.pdf', type: 'pdf' },
              { name: 'Scheduling1', url: '/itkmitl/Y3-2/ITPM/Arit/Scheduling1.pdf', type: 'pdf' },
              { name: 'Scheduling_1', url: '/itkmitl/Y3-2/ITPM/Arit/Scheduling_1.jpg', type: 'image' },
              { name: 'Scheduling_2', url: '/itkmitl/Y3-2/ITPM/Arit/Scheduling_2.jpg', type: 'image' },
              { name: 'Untitled-Notebook', url: '/itkmitl/Y3-2/ITPM/Arit/Untitled-Notebook.pdf', type: 'pdf' },
              { name: '12-Project-Planning-WBS-(1)', url: '/itkmitl/Y3-2/ITPM/Backup-Assignment/12-Project-Planning-WBS-(1).pdf', type: 'pdf' },
              { name: '65070159-Wk11-Group-1-Initiating-Activity-Submission', url: '/itkmitl/Y3-2/ITPM/Backup-Assignment/65070159-Wk11-Group-1-Initiating-Activity-Submission.pdf', type: 'pdf' },
              { name: 'G1Reportคิดได้ยัง(จันทร์เช้า)-(1)', url: '/itkmitl/Y3-2/ITPM/Backup-Assignment/G1Report%E0%B8%84%E0%B8%B4%E0%B8%94%E0%B9%84%E0%B8%94%E0%B9%89%E0%B8%A2%E0%B8%B1%E0%B8%87(%E0%B8%88%E0%B8%B1%E0%B8%99%E0%B8%97%E0%B8%A3%E0%B9%8C%E0%B9%80%E0%B8%8A%E0%B9%89%E0%B8%B2)-(1).docx', type: 'doc' },
              { name: 'G1Reportคิดได้ยัง(จันทร์เช้า)-(1)', url: '/itkmitl/Y3-2/ITPM/Backup-Assignment/G1Report%E0%B8%84%E0%B8%B4%E0%B8%94%E0%B9%84%E0%B8%94%E0%B9%89%E0%B8%A2%E0%B8%B1%E0%B8%87(%E0%B8%88%E0%B8%B1%E0%B8%99%E0%B8%97%E0%B8%A3%E0%B9%8C%E0%B9%80%E0%B8%8A%E0%B9%89%E0%B8%B2)-(1).pdf', type: 'pdf' },
              { name: 'G2Slideคิดได้ยัง(จันทร์เช้า)-(1)', url: '/itkmitl/Y3-2/ITPM/Backup-Assignment/G2Slide%E0%B8%84%E0%B8%B4%E0%B8%94%E0%B9%84%E0%B8%94%E0%B9%89%E0%B8%A2%E0%B8%B1%E0%B8%87(%E0%B8%88%E0%B8%B1%E0%B8%99%E0%B8%97%E0%B8%A3%E0%B9%8C%E0%B9%80%E0%B8%8A%E0%B9%89%E0%B8%B2)-(1).pdf', type: 'pdf' },
              { name: 'ITPM-iJudge-Project-(1)', url: '/itkmitl/Y3-2/ITPM/Backup-Assignment/ITPM-iJudge-Project-(1).pdf', type: 'pdf' },
              { name: 'ITPM-Introduction-and-PM-Tools', url: '/itkmitl/Y3-2/ITPM/Backup-Assignment/ITPM-Introduction-and-PM-Tools.pdf', type: 'pdf' },
              { name: 'PM2_67wk15ClosingActivity', url: '/itkmitl/Y3-2/ITPM/Backup-Assignment/PM2_67wk15ClosingActivity.pdf', type: 'pdf' },
              { name: 'Wk13-Executing-Activity-Instruction', url: '/itkmitl/Y3-2/ITPM/Backup-Assignment/Wk13-Executing-Activity-Instruction.pdf', type: 'pdf' },
              { name: 'Wk14-Group-1-M&C-Activity-Submission', url: '/itkmitl/Y3-2/ITPM/Backup-Assignment/Wk14-Group-1-M%26C-Activity-Submission.docx', type: 'doc' },
              { name: 'Wk14-Group-1-M&C-Activity-Submission', url: '/itkmitl/Y3-2/ITPM/Backup-Assignment/Wk14-Group-1-M%26C-Activity-Submission.pdf', type: 'pdf' },
              { name: 'Wk15_66070009', url: '/itkmitl/Y3-2/ITPM/Backup-Assignment/Wk15_66070009.docx', type: 'doc' },
              { name: 'ITPM-Introduction-and-PM-Tools', url: '/itkmitl/Y3-2/ITPM/ITPM-Introduction-and-PM-Tools.pdf', type: 'pdf' },
              { name: 'PM2_2567-Wk12-Planning', url: '/itkmitl/Y3-2/ITPM/PM2_2567-Wk12-Planning.pdf', type: 'pdf' },
              { name: 'PM2_2567Wk12-WBS', url: '/itkmitl/Y3-2/ITPM/PM2_2567Wk12-WBS.pdf', type: 'pdf' },
            ],
          },
          { name: 'Professional Communication And Presentation', code: '90644042' },
        ],
      },
      {
        id: 'y4s1',
        label: 'Year 4 · Semester 1 (1/2568)',
        subjects: [
          {
            name: 'Project 1',
            code: '06016406',
            files: [
              { name: 'i-Judge_Report_Project_1', url: '/itkmitl/Y4-1/Project-1/i-Judge_Report_Project_1.pdf', type: 'pdf' },
            ],
          },
          { name: 'Cloud Application Development', code: '06016430' },
          { name: 'Introduction To Psychology', code: '90642159' },
          { name: 'Coding With Python', code: '90642211' },
          { name: 'Modern Entrepreneurs', code: '90643021' },
        ],
      },
      {
        id: 'y4s2',
        label: 'Year 4 · Semester 2 (2/2568)',
        subjects: [
          { name: 'Project 2', code: '06016407' },
        ],
      },
    ],
  },
  {
    id: 'master',
    name: 'Master (ITM45.1)',
    semesters: [
    ],
  },
]

const README_CONTENT =
  'Personal academic archive — lecture summaries, notes, and reference links from my Bachelor (IT20) and Master (ITM43.1) studies at KMITL. Browse the folders like a file explorer: click a degree, then a semester, then a subject to find its files.'

// ─── Filesystem tree ──────────────────────────────────────────────────────────

type FsNode =
  | { kind: 'folder'; slug: string; name: string; children: FsNode[] }
  | { kind: 'file'; slug: string; name: string; fileType: SubjectFile['type']; url: string }
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
  if (node.fileType === 'pdf') return 'PDF'
  if (node.fileType === 'zip') return 'ZIP'
  if (node.fileType === 'image') return 'Image'
  if (node.fileType === 'video') return 'Video'
  if (node.fileType === 'code') return 'Code'
  if (node.fileType === 'doc') return 'Document'
  if (node.fileType === 'spreadsheet') return 'Spreadsheet'
  if (node.fileType === 'other') return 'File'
  return 'Link'
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
        className={`group flex items-center gap-1 rounded-md pr-2 text-xs transition-colors ${isActive
            ? 'bg-muted text-foreground'
            : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
          }`}
        style={{ paddingLeft: `${depth * 12 + 4}px` }}
      >
        <button
          onClick={() => hasChildren && setOpen((o) => !o)}
          className={`flex h-5 w-4 shrink-0 items-center justify-center ${hasChildren ? '' : 'invisible'
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
  if (node.fileType === 'pdf') return <FileDown className="w-4 h-4 text-rose-400" />
  if (node.fileType === 'zip') return <FileArchive className="w-4 h-4 text-amber-400" />
  if (node.fileType === 'image') return <FileImage className="w-4 h-4 text-emerald-400" />
  if (node.fileType === 'video') return <FileVideo className="w-4 h-4 text-purple-400" />
  if (node.fileType === 'code') return <FileCode className="w-4 h-4 text-cyan-400" />
  if (node.fileType === 'doc') return <FileText className="w-4 h-4 text-blue-400" />
  if (node.fileType === 'spreadsheet') return <FileSpreadsheet className="w-4 h-4 text-green-400" />
  if (node.fileType === 'other') return <File className="w-4 h-4 text-muted-foreground" />
  return <Link2 className="w-4 h-4 text-sky-400" />
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
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleFileClick = (e: React.MouseEvent, url: string) => {
    e.preventDefault()
    if (clickTimer.current) clearTimeout(clickTimer.current)
    clickTimer.current = setTimeout(() => {
      window.open(url, '_blank', 'noopener,noreferrer')
    }, 200)
  }

  const handleFileDoubleClick = (e: React.MouseEvent, url: string) => {
    e.preventDefault()
    if (clickTimer.current) clearTimeout(clickTimer.current)
    window.location.href = url
  }

  const cells = (
    <>
      <div className="flex min-w-0 items-center gap-2.5">
        <RowIcon node={node} />
        <span
          className={`truncate text-sm text-foreground ${node.kind === 'readme' ? 'font-mono' : ''
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

  const isDownload = node.fileType !== 'link'
  return (
    <a
      className={rowClass}
      href={node.url}
      download={isDownload || undefined}
      onClick={(e) => handleFileClick(e, node.url)}
      onDoubleClick={(e) => handleFileDoubleClick(e, node.url)}
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
                    className={`flex items-center gap-1 text-xs whitespace-nowrap transition-colors ${i === trail.length - 1
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
          <div className="flex h-[32rem]">
            {/* Sidebar */}
            <aside className="hidden w-60 shrink-0 border-r border-border bg-muted/20 p-3 sm:block overflow-y-auto">
              <p className="px-2 pb-1.5 pt-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                Folders
              </p>
              <button
                onClick={() => go('')}
                className={`mb-0.5 flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-xs transition-colors ${atRoot
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
            <div className="min-w-0 flex-1 p-3 overflow-y-auto">
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
