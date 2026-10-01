import { createFileRoute } from '@tanstack/react-router'
import ChatInterface from '@/components/ChatInterface'
import BlogPostLayout from '@/components/blog/BlogPostLayout'
import Reveal from '@/components/blog/Reveal'
import { BlogParagraph, BlogSection } from '@/components/blog/blocks'

export const Route = createFileRoute('/blogs/itkmitl-review-2026/')({
  component: ITKMITLReview2026,
})

const STAFF_AVATAR =
  'https://avataaars.io/?avatarStyle=Circle&topType=NoHair&accessoriesType=Prescription02&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light'

function ITKMITLReview2026() {
  return (
    <BlogPostLayout post="/blogs/itkmitl-review-2026">
      <BlogSection eyebrow="TCAS รอบ 1 · 2565">
        <BlogParagraph>
          ย้อนกลับไปช่วงต้นปี 2565 ตอนนั้นเป็นช่วง TCAS รอบที่ 1 (Portfolio) ฟิวส์สมัครสัมภาษณ์เข้าคณะเทคโนโลยีสารสนเทศ
          สจล. (IT KMITL) พอดีเป็นช่วงโควิด ทางคณะเลยจัดสัมภาษณ์ผ่าน Google Meet แทนการเดินทางไปสัมภาษณ์ที่คณะ
          จำได้ว่าตื่นเต้นมาก ๆ เปิดโน้ตบุ๊กรอตั้งแต่เช้า เช็กสัญญาณเน็ตซ้ำแล้วซ้ำเล่า กลัวหลุดตอนสัมภาษณ์
        </BlogParagraph>
        <BlogParagraph>
          จนกระทั่งพี่ห้องฟ้า เจ้าหน้าที่ที่ดูแลห้องสัมภาษณ์วันนั้น ส่งลิงก์ห้องประชุมมาในแชทกลุ่ม &ldquo;ห้องที่ 5&rdquo;
          ซึ่งมีทั้งพี่เจ้าหน้าที่ ผู้สมัครอีกคนที่คิวเดียวกันอย่างน้องศิลา แล้วก็ตัวฟิวส์เอง
        </BlogParagraph>
      </BlogSection>

      <Reveal>
        <ChatInterface
          contacts={[
            {
              id: '1',
              type: 'group',
              name: 'ห้องที่ 5',
              members: [
                { name: 'พี่ห้องฟ้า', avatar: STAFF_AVATAR },
                { name: 'น้องศิลา', avatar: STAFF_AVATAR },
                { name: 'FewPz', avatar: 'https://github.com/fewpz.png' },
              ],
              lastMessage: 'You: ขอบคุณครับ สวัสดีครับ',
              lastTime: '09:15',
            },
            {
              id: '2',
              type: 'direct',
              name: 'KongZa4G',
              avatar: 'https://github.com/kongza4g.png',
              status: 'online' as const,
              lastMessage: "",
              lastTime: '2026',
            },
          ]}
          initialMessages={[{
            id: 1,
            sender: 'other',
            text: 'To join the video meeting, click this link: meet.google.com/it-kmitl',
            name: 'พี่ห้องฟ้า',
            time: '09:00',
            avatar: STAFF_AVATAR,
          },
          {
            id: 2,
            sender: 'other',
            text: 'Otherwise, to join by phone, dial +66 2 888 8888 and enter this PIN: 471 310 448 8817#',
            name: 'พี่ห้องฟ้า',
            time: '09:00',
            avatar: STAFF_AVATAR,
          },
          {
            id: 3,
            sender: 'other',
            text: 'น้องศิลา เข้าห้องสัมภาษณ์ได้เลยค่ะ',
            name: 'พี่ห้องฟ้า',
            time: '09:12',
            avatar: STAFF_AVATAR,
          },
          {
            id: 4,
            sender: 'other',
            text: 'น้องพีรณัฐ เข้าห้องสัมภาษณ์ได้เลยค่ะ',
            name: 'พี่ห้องฟ้า',
            time: '09:15',
            avatar: STAFF_AVATAR,
          },
          {
            id: 5,
            sender: 'me',
            text: 'ขอบคุณครับ สวัสดีครับ',
            time: '09:15',
            avatar: 'https://github.com/FewPz.png',
          }
          ]}
          activeContactId="1"
          title="ณ วันสัมภาษณ์รอบ 1 ของปี 2565"
          readonly
        />
      </Reveal>

      <BlogSection>
        <BlogParagraph>
          ตอนนั้นไม่คิดเลยว่าข้อความสั้น ๆ &ldquo;น้องพีรณัฐ เข้าห้องสัมภาษณ์ได้เลยค่ะ&rdquo; จะเป็นจุดเริ่มต้นของเส้นทาง 4 ปี
          ที่ ITKMITL ผ่านมาทั้งเรียน ทำโครงงาน แข่งขัน และผู้คนมากมายที่ได้เจอ วันนี้กลับมาอ่านแชทวันนั้นอีกครั้ง
          ยังรู้สึกตื่นเต้นเหมือนเดิม แค่เปลี่ยนจากความกังวลตอนก่อนสอบ มาเป็นความคิดถึงแทน
        </BlogParagraph>
      </BlogSection>
    </BlogPostLayout>
  )
}
