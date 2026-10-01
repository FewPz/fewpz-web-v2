import { ShieldAlert, Zap } from 'lucide-react'
import BlogDiagram from '@/components/blog/BlogDiagram'
import {
  BlogCallout,
  BlogCode,
  BlogLead,
  BlogLink,
  BlogList,
  BlogParagraph,
  BlogSection,
  BlogSubheading,
  BlogTable,
  Code,
} from '@/components/blog/blocks'
import {
  AGENT_ECOSYSTEM,
  ARCHITECTURE,
  CURSOR_CONFIG,
  DIAGRAMS,
  FORMATTED_OUTPUT,
  GOOD_PROMPT,
  PROJECT_TREE,
  REPO,
  SERVER_TOOLS,
  b,
} from './-shared'

export default function MineDocsTh() {
  const D = DIAGRAMS.th
  return (
    <>
      <BlogSection>
        <BlogLead>ช่วงนี้ใครเขียนโค้ดก็น่าจะใช้ AI ช่วยกันหมดแล้วแหละ จะ Claude, Cursor หรือตัวไหนก็ตาม</BlogLead>
        <BlogParagraph>
          แต่พอเอามาเขียน {b('Minecraft Plugin')} ทีไร ก็เจอปัญหาเดิมทุกที คือมันชอบตอบจากความจำตัวเอง
          แล้วความจำนั้นก็ไม่ค่อยตรงกับ PaperMC เวอร์ชันที่เราใช้อยู่ซะด้วย อาการที่เจอบ่อย ๆ ก็ประมาณนี้
        </BlogParagraph>
        <BlogList
          items={[
            'เรียก Method ที่ไม่มีอยู่จริง',
            'ใช้ API ที่ Deprecated ไปนานแล้ว',
            'ส่ง Parameter ผิด type',
            'เอา Spigot API กับ Paper API มาปนกัน',
            'โค้ดดูดีเลย แต่ Compile ไม่ผ่าน',
          ]}
        />
        <BlogParagraph>
          เราเลยคิดว่า ถ้าให้มันไปเปิด Javadocs ดูเองก่อนจะเขียนล่ะ น่าจะแก้ได้เยอะอยู่นะ
        </BlogParagraph>
        <BlogParagraph>
          ก็เลยลองทำ {b('MineDocs MCP')} ขึ้นมา (<BlogLink href={REPO}>github.com/FewPz/minedocs-mcp</BlogLink>)
          เป็น MCP Server ตัวเล็ก ๆ ที่เปิด Open Source ไว้ ให้ AI ค้น Class, Method, Field แล้วก็เช็กได้ว่า API
          ไหน Deprecated ไปแล้ว จาก {b('PaperMC Javadocs')} ตรง ๆ ก่อนจะเริ่มเขียนโค้ด
        </BlogParagraph>
      </BlogSection>

      <BlogSection title="MCP คืออะไร?">
        <BlogParagraph>
          เผื่อใครยังไม่รู้จัก MCP ย่อมาจาก {b('Model Context Protocol')} เป็นมาตรฐานที่ให้แอป AI
          ไปต่อกับเครื่องมือหรือข้อมูลข้างนอกได้ ผ่านสิ่งที่เรียกว่า Tools, Resources กับ Prompts
        </BlogParagraph>
        <BlogParagraph>ถ้าเป็นเคสของ MineDocs ก็จะหน้าตาประมาณนี้</BlogParagraph>
        <BlogDiagram chart={D.OVERVIEW} caption="AI ถามผ่าน MCP แล้ว MineDocs ไปเปิด Javadocs ให้" />
        <BlogParagraph>แค่นี้ AI ก็ไม่ต้องเดาเองแล้ว</BlogParagraph>
      </BlogSection>

      <BlogSection title="ทำไม AI ถึงเขียน Plugin พลาดบ่อย">
        <BlogParagraph>ลองนึกภาพว่าเราสั่ง AI แบบนี้</BlogParagraph>
        <BlogCode code="สร้าง Minecraft Plugin ที่ทำให้ Player teleport ไปยัง Location ที่กำหนด" />
        <BlogParagraph>มันก็คงตอบมาประมาณนี้</BlogParagraph>
        <BlogCode language="java" code="player.teleport(location);" />
        <BlogParagraph>
          อันนี้ยังง่ายอยู่ ไม่มีอะไร แต่พอ Plugin เริ่มใหญ่ขึ้น เราจะเริ่มอยากรู้อะไรอีกเยอะ เช่น
        </BlogParagraph>
        <BlogList
          items={[
            'Method นี้รับ Parameter อะไรบ้าง',
            'คืนค่าเป็นอะไร',
            'มี Overload กี่แบบ',
            'มีข้อจำกัดอะไรที่ต้องระวังไหม',
            'เริ่มมีตั้งแต่เวอร์ชันไหน',
            'ตอนนี้ Deprecated ไปหรือยัง',
          ]}
        />
        <BlogParagraph>
          ปัญหาคือ AI อาจจะตอบจากข้อมูลเก่า ส่วน API ของ Minecraft ก็เปลี่ยนไปเรื่อย ๆ ทุกเวอร์ชัน
          ให้มันเขียนจากความจำอย่างเดียวเลยเสี่ยงไปหน่อย อยากให้มันเช็กก่อนแล้วค่อยเขียนมากกว่า
        </BlogParagraph>
      </BlogSection>

      <BlogSection title="MineDocs ทำอะไรบ้าง">
        <BlogParagraph>หลักการจริง ๆ ไม่มีอะไรเลย มันแค่ไปที่ PaperMC Javadocs แล้วก็</BlogParagraph>
        <BlogList
          ordered
          items={[
            'ดึงหน้า Javadoc มา',
            'แกะ HTML ออก',
            'เก็บเฉพาะข้อมูลที่ใช้จริง',
            'แปลงเป็น Markdown',
            'ส่งกลับไปให้ AI อ่าน',
          ]}
        />
        <BlogParagraph>ข้างในแบ่งเป็นส่วน ๆ แบบนี้</BlogParagraph>
        <BlogDiagram chart={ARCHITECTURE} caption="โครงข้างในของ MineDocs" />
        <BlogParagraph>
          ตัว Server ใช้ MCP SDK แล้วคุยกับ Client ผ่าน <Code>StdioServerTransport</Code>
        </BlogParagraph>
      </BlogSection>

      <BlogSection title="Tool ที่มีให้ใช้">
        <BlogParagraph>ตอนนี้มีอยู่ 6 ตัว</BlogParagraph>
        <BlogTable
          head={['Tool', 'ใช้ทำอะไร']}
          rows={[
            [<Code>get_paper_class_info</Code>, 'ดูข้อมูลของ Class'],
            [<Code>search_paper_classes</Code>, 'ค้น Class จากคำค้น'],
            [<Code>get_method_details</Code>, 'ดูรายละเอียด Method'],
            [<Code>get_field_summary</Code>, 'ดู Field กับ Constant'],
            [<Code>list_package_classes</Code>, 'ดูว่าใน Package มี Class อะไรบ้าง'],
            [<Code>search_deprecated</Code>, 'หาว่าตัวไหน Deprecated แล้ว'],
          ]}
        />
      </BlogSection>

      <BlogSection eyebrow="Tool 01" color="blue" title="ค้นหา Class">
        <BlogParagraph>สมมติยังไม่รู้ว่าเรื่อง Player อยู่ Class ไหน ก็ถาม AI ไปตรง ๆ ได้เลย</BlogParagraph>
        <BlogCode code={'Search PaperMC for classes related to "Player"'} />
        <BlogParagraph>MineDocs จะไปหา Class ที่ชื่อตรงกับคำค้น แล้วส่งชื่อเต็มกลับมา</BlogParagraph>
        <BlogCode
          code={`org.bukkit.entity.Player
org.bukkit.event.player.PlayerEvent
org.bukkit.event.player.PlayerMoveEvent
...`}
        />
        <BlogParagraph>ได้ชื่อมาแล้ว AI ก็เอาไปถามต่อได้</BlogParagraph>
      </BlogSection>

      <BlogSection eyebrow="Tool 02" color="red" title="ดูข้อมูลของ Class">
        <BlogParagraph>
          พอรู้ว่าเป็น <Code>org.bukkit.entity.Player</Code> แล้ว ก็ขอดูข้างในต่อได้
        </BlogParagraph>
        <BlogCode
          code={`Look up org.bukkit.entity.Player in PaperMC
and show me its methods.`}
        />
        <BlogParagraph>
          มันจะไปดึงหน้า Javadoc ของ Class นั้นมา หยิบ Signature, Description, Method Summary กับ Method Detail ออกมา
          แล้วจัดเป็น Markdown ให้ AI อ่าน ข้างในก็ทำงานต่อกันเป็นทอด ๆ แบบนี้
        </BlogParagraph>
        <BlogDiagram chart={D.CLASS_PIPELINE} caption="HTML เข้าไป ออกมาเป็น Markdown" />
      </BlogSection>

      <BlogSection eyebrow="Tool 03" color="yellow" title="ดู Method ตัวเดียว">
        <BlogParagraph>บางทีก็ไม่ได้อยากได้ทั้ง Class หรอก แค่อยากรู้ Method เดียว</BlogParagraph>
        <BlogCode code="What are the parameters for Player's teleport method?" />
        <BlogParagraph>
          อันนี้ใช้ <Code>get_method_details</Code> ส่งชื่อ Class กับชื่อ Method ไป (เช่น{' '}
          <Code>org.bukkit.entity.Player</Code> กับ <Code>teleport</Code>) มันก็จะไปหาใน Javadoc มาให้
        </BlogParagraph>
        <BlogParagraph>ที่เราว่ามีประโยชน์คือ ถ้า Method มีหลาย Overload มันจะเอามาให้ครบ</BlogParagraph>
        <BlogCode
          language="java"
          code={`teleport(Location location)

teleport(Location location, TeleportCause cause)`}
        />
        <BlogParagraph>AI จะได้เห็นว่ามีกี่แบบ ไม่ต้องเดา Parameter เอา</BlogParagraph>
      </BlogSection>

      <BlogSection eyebrow="Tool 04" color="green" title="เช็ก Deprecated API">
        <BlogParagraph>
          อันนี้เจอบ่อยมาก คือโค้ด Compile ผ่านนะ แต่ไปใช้ API ที่เขาเลิกแนะนำแล้ว
        </BlogParagraph>
        <BlogParagraph>
          <Code>search_deprecated</Code> เลยมีไว้หาว่าตัวไหน Deprecated ไปแล้ว ถามแบบนี้ได้
        </BlogParagraph>
        <BlogCode
          code={`Is Player.getDisplayName() deprecated?

Find deprecated PaperMC APIs related to Timing.`}
        />
        <BlogParagraph>
          มันจะดึงรายการ Deprecated มากรองตามคำที่ถาม AI จะได้รู้ก่อนว่าตัวที่มันคุ้น ๆ อาจจะไม่ควรใช้แล้ว
        </BlogParagraph>
      </BlogSection>

      <BlogSection title="แกะดูโค้ดข้างใน">
        <BlogParagraph>โปรเจกต์ไม่ได้ใหญ่อะไร แบ่งไฟล์ตามหน้าที่ประมาณนี้</BlogParagraph>
        <BlogCode code={PROJECT_TREE} />

        <BlogSubheading>Server</BlogSubheading>
        <BlogParagraph>
          <Code>server.ts</Code> สร้าง MCP Server แล้วลงทะเบียน Tool ทั้งหมดไว้ตรงนี้
        </BlogParagraph>
        <BlogDiagram chart={SERVER_TOOLS} caption="Tool ทั้ง 6 ตัวลงทะเบียนอยู่ที่ server.ts" />

        <BlogSubheading>Tools</BlogSubheading>
        <BlogParagraph>
          แต่ละไฟล์ใน <Code>tools/</Code> คือ Tool หนึ่งตัว พร้อม Input Schema ของมัน อย่าง{' '}
          <Code>get_method_details</Code> ก็รับชื่อ Class กับชื่อ Method
        </BlogParagraph>

        <BlogSubheading>Scraper</BlogSubheading>
        <BlogParagraph>
          <Code>src/lib/scraper.ts</Code> มีหน้าที่ไปดึงหน้า Javadocs มา Base URL ตั้งไว้ใน config ตามนี้
        </BlogParagraph>
        <BlogCode code="https://jd.papermc.io/paper/26.2/" />
        <BlogParagraph>แปลว่าตอนนี้ยังอิงเอกสารเวอร์ชันนี้อยู่นะ</BlogParagraph>

        <BlogSubheading>Parser</BlogSubheading>
        <BlogParagraph>
          ใช้ <Code>cheerio</Code> อ่าน HTML แล้วดึงพวกนี้ออกมา
        </BlogParagraph>
        <BlogList items={['คำอธิบายของ Class', 'Method Summary', 'Method Detail', 'Field', 'Deprecated API']} />

        <BlogSubheading>Formatter</BlogSubheading>
        <BlogParagraph>สุดท้ายก็จัดออกมาเป็น Markdown หน้าตาประมาณนี้</BlogParagraph>
        <BlogCode language="markdown" code={FORMATTED_OUTPUT} />
      </BlogSection>

      <BlogSection title="มี Cache ด้วย">
        <BlogParagraph>
          ถ้าถามทีไรต้องไปโหลด Javadocs ใหม่ทุกรอบก็ช้าแย่ เลยใส่ Cache ไว้ในหน่วยความจำ
          ถาม Class หรือ Method เดิมซ้ำก็ไม่ต้องโหลดใหม่
        </BlogParagraph>
        <BlogCallout icon={Zap} color="blue" title="ทำไมต้องมี">
          เขียน Plugin ตัวนึง AI อาจเรียก Tool ซ้ำไปซ้ำมาหลายรอบมาก มี Cache ไว้ก็ไวขึ้นเยอะ
        </BlogCallout>
      </BlogSection>

      <BlogSection title="วิธีติดตั้ง">
        <BlogParagraph>ต้องมีพวกนี้ก่อน</BlogParagraph>
        <BlogList items={['Node.js', 'pnpm', 'MCP Client สักตัว เช่น Claude Code, Claude Desktop, Cursor หรือ Codex']} />
        <BlogParagraph>Clone มาก่อน</BlogParagraph>
        <BlogCode
          language="bash"
          code={`git clone https://github.com/FewPz/minedocs-mcp
cd minedocs-mcp`}
        />
        <BlogParagraph>ลง dependency แล้ว build</BlogParagraph>
        <BlogCode
          language="bash"
          code={`pnpm install
pnpm build`}
        />
        <BlogParagraph>
          build เสร็จจะได้ <Code>dist/server.js</Code> เอาไฟล์นี้ไปต่อกับ client
        </BlogParagraph>

        <BlogSubheading>ต่อกับ Claude Code</BlogSubheading>
        <BlogParagraph>พิมพ์คำสั่งนี้</BlogParagraph>
        <BlogCode language="bash" code="claude mcp add minedocs -- node /absolute/path/to/minedocs-mcp/dist/server.js" />
        <BlogParagraph>
          ถ้าอยากให้ใช้ได้ทุกโปรเจกต์ เติม <Code>-s user</Code> เข้าไป
        </BlogParagraph>
        <BlogCode
          language="bash"
          code="claude mcp add minedocs -s user -- node /absolute/path/to/minedocs-mcp/dist/server.js"
        />
        <BlogParagraph>เช็กว่าลงแล้วยัง</BlogParagraph>
        <BlogCode language="bash" code="claude mcp list" />
        <BlogParagraph>
          แล้วเปิด session ใหม่ ลองพิมพ์ <Code>/mcp</Code> ดู ถ้าเห็น minedocs ก็ใช้ได้แล้ว
        </BlogParagraph>

        <BlogSubheading>ต่อกับ Cursor หรือ Claude Desktop</BlogSubheading>
        <BlogParagraph>ใส่ลงไฟล์ตั้งค่า MCP แบบนี้</BlogParagraph>
        <BlogCode language="json" code={CURSOR_CONFIG} />
        <BlogParagraph>แล้ว restart client ทีนึง</BlogParagraph>
      </BlogSection>

      <BlogSection title="ไม่ต้องสั่งทีละขั้น">
        <BlogParagraph>
          อันนี้เป็นข้อที่เราชอบสุด ถ้าเทียบกับการก๊อปเอกสารไปแปะใน Prompt เอง คือไม่ต้องมาคอยบอกมันทีละขั้นแบบนี้
        </BlogParagraph>
        <BlogCode
          code={`เปิดเว็บนี้
ค้นหา Class นี้
เปิด Method นี้
อ่าน Parameter
เช็ก Deprecated
แล้วค่อยเขียนโค้ด`}
        />
        <BlogParagraph>แค่บอกว่าอยากได้อะไร</BlogParagraph>
        <BlogCode
          code={`Create a PaperMC plugin that gives a player
a custom message when they break a block.`}
        />
        <BlogParagraph>เดี๋ยวมันเลือกเองว่าต้องไปเปิด Tool ไหนก่อน ลำดับก็จะออกมาประมาณนี้</BlogParagraph>
        <BlogDiagram chart={D.AGENT_WORKFLOW} caption="AI ไปเปิดเอกสารเองก่อน แล้วค่อยเขียน" />
      </BlogSection>

      <BlogSection title="ถ้าอยากให้ชัวร์ขึ้นอีก">
        <BlogParagraph>
          ปกติพิมพ์สั้น ๆ ก็ใช้ได้ แต่ถ้าอยากให้มันเช็กเอกสารแน่ ๆ ก็เขียนบอกไปเลยว่าให้ค้นก่อน แบบนี้
        </BlogParagraph>
        <BlogCode code={GOOD_PROMPT} />
        <BlogParagraph>
          เขียนแบบนี้มันจะไปค้นเอกสารก่อนทุกครั้ง แทนที่จะรีบเขียนจากความจำ
        </BlogParagraph>
      </BlogSection>

      <BlogSection title="แต่ไม่ได้แปลว่ามันจะไม่พลาดนะ">
        <BlogParagraph>
          ต้องบอกก่อนว่ามี MineDocs แล้ว AI ก็ยังเขียน Bug หรือมั่วได้อยู่ดี มันช่วยแค่เรื่องที่ข้อมูล API
          ไม่ตรงกับเวอร์ชันที่เราใช้
        </BlogParagraph>
        <BlogCallout icon={ShieldAlert} color="red" title="ยังต้องรีวิวเองอยู่ดี">
          พวก Logic, โครงสร้างโปรเจกต์, Permission, Performance ยังไงก็ต้องรีวิวและเทสเองเหมือนเดิม
        </BlogCallout>
      </BlogSection>

      <BlogSection title="ทำไมถึงเหมาะกับ Minecraft">
        <BlogParagraph>
          API ของ Minecraft เยอะมากจริง ๆ ทั้ง Player, World, Block, Entity, Event, Command, Inventory, Scheduler,
          Permission, Configuration แล้วก็อีกเพียบ ยิ่งโปรเจกต์ใหญ่ AI ก็ยิ่งต้องรู้เยอะ
        </BlogParagraph>
        <BlogParagraph>
          จะยัด Javadocs ทั้งก้อนใส่ Prompt ก็ไม่ไหว Context เต็มเร็ว แล้วมันก็หาของที่ต้องใช้ไม่ค่อยเจออีก
          ให้มันขอดูเฉพาะหน้าที่ต้องใช้น่าจะดีกว่า ซึ่ง MCP ทำแบบนั้นได้พอดี
        </BlogParagraph>
      </BlogSection>

      <BlogSection title="ต่อยอดได้อีก">
        <BlogParagraph>
          ถ้ามี MCP ตัวอื่นมาต่อด้วย อย่าง Git, Build/Test หรือตัวที่คุยกับ Minecraft Server ตอนรันจริง Agent
          ก็จะทำอะไรได้มากขึ้นอีก
        </BlogParagraph>
        <BlogDiagram chart={AGENT_ECOSYSTEM} caption="เส้นประคือตัวที่ยังไม่มี" />
        <BlogParagraph>
          ถ้ามีครบจริง ๆ ก็น่าจะให้มันวนเองได้ เขียน build เทส เจอ error ก็แก้ แล้วลองใหม่จนผ่าน
        </BlogParagraph>
        <BlogDiagram chart={D.FUTURE_LOOP} caption="วนจนกว่าจะผ่าน แล้วค่อยส่งให้เรา" />
        <BlogParagraph>
          ถึงตอนนั้นมันก็จะเริ่มเหมือนผู้ช่วยที่ทำ Plugin ได้เกือบทั้งกระบวนการแล้ว
        </BlogParagraph>
      </BlogSection>

      <BlogSection title="ปิดท้าย">
        <BlogParagraph>
          MineDocs ไม่ได้พยายามทำทุกอย่าง แค่อยากแก้ปัญหาเดียวที่เจอบ่อย ๆ คือให้ AI เปิด PaperMC Javadocs ได้ง่าย ๆ
          ในแบบที่มันอ่านรู้เรื่อง ใช้ได้กับ Claude Code, Claude Desktop, Cursor หรือตัวไหนก็ได้ที่รองรับ MCP
        </BlogParagraph>
        <BlogParagraph>
          ใครลองแล้วติดตรงไหน หรืออยากให้เพิ่ม Tool อะไร เปิด Issue มาคุยกันใน Repo ได้เลยนะ
        </BlogParagraph>
      </BlogSection>

      <BlogSection title="ลิงก์">
        <BlogList
          items={[
            <>
              MineDocs MCP — <BlogLink href={REPO}>{REPO}</BlogLink>
            </>,
            <>
              PaperMC Javadocs — <BlogLink href="https://jd.papermc.io/">https://jd.papermc.io/</BlogLink>
            </>,
            <>
              Model Context Protocol —{' '}
              <BlogLink href="https://modelcontextprotocol.io/">https://modelcontextprotocol.io/</BlogLink>
            </>,
          ]}
        />
      </BlogSection>
    </>
  )
}
