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

export default function MineDocsEn() {
  const D = DIAGRAMS.en
  return (
    <>
      <BlogSection>
        <BlogLead>Pretty much everyone who writes code leans on AI these days, whether it's Claude, Cursor or something else.</BlogLead>
        <BlogParagraph>
          But every time I use it for a {b('Minecraft plugin')}, I hit the same wall. It answers from memory, and that
          memory rarely matches the PaperMC version I'm actually on. The usual suspects:
        </BlogParagraph>
        <BlogList
          items={[
            "Calling methods that don't exist",
            'Using APIs that were deprecated ages ago',
            'Passing the wrong parameter types',
            'Mixing up the Spigot and Paper APIs',
            "Code that looks great but won't compile",
          ]}
        />
        <BlogParagraph>
          So I figured, what if it just went and checked the Javadocs itself before writing anything? That should fix a lot
          of it.
        </BlogParagraph>
        <BlogParagraph>
          That's how {b('MineDocs MCP')} came about (<BlogLink href={REPO}>github.com/FewPz/minedocs-mcp</BlogLink>). It's a
          small open-source MCP server that lets AI look up classes, methods and fields, and check what's deprecated,
          straight from the {b('PaperMC Javadocs')} before it starts writing code.
        </BlogParagraph>
      </BlogSection>

      <BlogSection title="What's MCP?">
        <BlogParagraph>
          In case you haven't run into it yet, MCP stands for {b('Model Context Protocol')}. It's a standard that lets AI
          apps plug into outside tools and data, through things called Tools, Resources and Prompts.
        </BlogParagraph>
        <BlogParagraph>For MineDocs, it looks roughly like this:</BlogParagraph>
        <BlogDiagram chart={D.OVERVIEW} caption="The AI asks over MCP, and MineDocs goes and reads the Javadocs for it" />
        <BlogParagraph>And just like that, the AI doesn't have to guess anymore.</BlogParagraph>
      </BlogSection>

      <BlogSection title="Why AI keeps getting plugins wrong">
        <BlogParagraph>Say you ask an AI something like:</BlogParagraph>
        <BlogCode code="Create a Minecraft plugin that teleports the player to a given location." />
        <BlogParagraph>You'll probably get something like this back:</BlogParagraph>
        <BlogCode language="java" code="player.teleport(location);" />
        <BlogParagraph>
          That one's easy, no problem there. But once a plugin gets bigger, you start needing to know a lot more, like:
        </BlogParagraph>
        <BlogList
          items={[
            'What parameters does this method take?',
            'What does it return?',
            'How many overloads are there?',
            'Are there any gotchas?',
            'Which version did it show up in?',
            'Is it deprecated yet?',
          ]}
        />
        <BlogParagraph>
          The catch is that the AI might be working off old info, while Minecraft's API keeps shifting every version.
          Letting it write purely from memory is a bit risky. I'd much rather it checked first, then wrote the code.
        </BlogParagraph>
      </BlogSection>

      <BlogSection title="What MineDocs does">
        <BlogParagraph>The idea is honestly really simple. It goes to the PaperMC Javadocs and:</BlogParagraph>
        <BlogList
          ordered
          items={[
            'Fetches the Javadoc page',
            'Parses the HTML',
            'Keeps only the parts that matter',
            'Turns it into Markdown',
            'Sends that back for the AI to read',
          ]}
        />
        <BlogParagraph>Inside, it's split up like this:</BlogParagraph>
        <BlogDiagram chart={ARCHITECTURE} caption="How MineDocs is put together" />
        <BlogParagraph>
          The server is built on the MCP SDK and talks to the client over <Code>StdioServerTransport</Code>.
        </BlogParagraph>
      </BlogSection>

      <BlogSection title="The tools">
        <BlogParagraph>There are six of them right now.</BlogParagraph>
        <BlogTable
          head={['Tool', 'What it does']}
          rows={[
            [<Code>get_paper_class_info</Code>, 'Shows info about a class'],
            [<Code>search_paper_classes</Code>, 'Finds classes by keyword'],
            [<Code>get_method_details</Code>, 'Shows the details of a method'],
            [<Code>get_field_summary</Code>, 'Lists fields and constants'],
            [<Code>list_package_classes</Code>, "Lists what's in a package"],
            [<Code>search_deprecated</Code>, "Finds what's been deprecated"],
          ]}
        />
      </BlogSection>

      <BlogSection eyebrow="Tool 01" color="blue" title="Finding a class">
        <BlogParagraph>Say you don't know which class handles players. Just ask:</BlogParagraph>
        <BlogCode code={'Search PaperMC for classes related to "Player"'} />
        <BlogParagraph>MineDocs looks for matching classes and sends back their full names:</BlogParagraph>
        <BlogCode
          code={`org.bukkit.entity.Player
org.bukkit.event.player.PlayerEvent
org.bukkit.event.player.PlayerMoveEvent
...`}
        />
        <BlogParagraph>Once it has the name, the AI can keep digging from there.</BlogParagraph>
      </BlogSection>

      <BlogSection eyebrow="Tool 02" color="red" title="Looking inside a class">
        <BlogParagraph>
          Now that we know it's <Code>org.bukkit.entity.Player</Code>, we can ask for more:
        </BlogParagraph>
        <BlogCode
          code={`Look up org.bukkit.entity.Player in PaperMC
and show me its methods.`}
        />
        <BlogParagraph>
          It pulls that class's Javadoc page, grabs the signature, description, method summary and method details, and
          formats it all as Markdown for the AI. Under the hood it's just a few steps in a row:
        </BlogParagraph>
        <BlogDiagram chart={D.CLASS_PIPELINE} caption="HTML goes in, Markdown comes out" />
      </BlogSection>

      <BlogSection eyebrow="Tool 03" color="yellow" title="Just one method">
        <BlogParagraph>Sometimes you don't want the whole class, just one method:</BlogParagraph>
        <BlogCode code="What are the parameters for Player's teleport method?" />
        <BlogParagraph>
          That's what <Code>get_method_details</Code> is for. You pass it a class and a method name (say{' '}
          <Code>org.bukkit.entity.Player</Code> and <Code>teleport</Code>) and it finds it in the Javadoc for you.
        </BlogParagraph>
        <BlogParagraph>The part I find really handy is that if a method has overloads, you get all of them:</BlogParagraph>
        <BlogCode
          language="java"
          code={`teleport(Location location)

teleport(Location location, TeleportCause cause)`}
        />
        <BlogParagraph>So the AI can see every way to call it instead of guessing the parameters.</BlogParagraph>
      </BlogSection>

      <BlogSection eyebrow="Tool 04" color="green" title="Checking for deprecated APIs">
        <BlogParagraph>
          This one comes up all the time: the code compiles fine, but it's using an API you're not supposed to use anymore.
        </BlogParagraph>
        <BlogParagraph>
          <Code>search_deprecated</Code> is there to catch that. You can ask things like:
        </BlogParagraph>
        <BlogCode
          code={`Is Player.getDisplayName() deprecated?

Find deprecated PaperMC APIs related to Timing.`}
        />
        <BlogParagraph>
          It pulls the deprecated list and filters it by what you asked, so the AI finds out that the method it's used to
          might not be the one to use anymore.
        </BlogParagraph>
      </BlogSection>

      <BlogSection title="A look at the code">
        <BlogParagraph>The project isn't big. Files are split up by what they do:</BlogParagraph>
        <BlogCode code={PROJECT_TREE} />

        <BlogSubheading>Server</BlogSubheading>
        <BlogParagraph>
          <Code>server.ts</Code> creates the MCP server and registers every tool.
        </BlogParagraph>
        <BlogDiagram chart={SERVER_TOOLS} caption="All six tools are registered in server.ts" />

        <BlogSubheading>Tools</BlogSubheading>
        <BlogParagraph>
          Each file in <Code>tools/</Code> is one tool plus its input schema. <Code>get_method_details</Code>, for
          example, takes a class name and a method name.
        </BlogParagraph>

        <BlogSubheading>Scraper</BlogSubheading>
        <BlogParagraph>
          <Code>src/lib/scraper.ts</Code> fetches the Javadoc pages. The base URL lives in the project config:
        </BlogParagraph>
        <BlogCode code="https://jd.papermc.io/paper/26.2/" />
        <BlogParagraph>So for now it's tied to that version of the docs.</BlogParagraph>

        <BlogSubheading>Parser</BlogSubheading>
        <BlogParagraph>
          It uses <Code>cheerio</Code> to read the HTML and pull out:
        </BlogParagraph>
        <BlogList items={['The class description', 'Method summary', 'Method details', 'Fields', 'Deprecated APIs']} />

        <BlogSubheading>Formatter</BlogSubheading>
        <BlogParagraph>Finally it all gets turned into Markdown, something like this:</BlogParagraph>
        <BlogCode language="markdown" code={FORMATTED_OUTPUT} />
      </BlogSection>

      <BlogSection title="There's a cache too">
        <BlogParagraph>
          Re-downloading the Javadocs for every single question would be painfully slow, so there's an in-memory cache.
          Ask about the same class or method again and it doesn't have to fetch it again.
        </BlogParagraph>
        <BlogCallout icon={Zap} color="blue" title="Why bother?">
          While writing one plugin, the AI might call the same tools over and over. The cache makes that a lot faster.
        </BlogCallout>
      </BlogSection>

      <BlogSection title="Setting it up">
        <BlogParagraph>You'll need:</BlogParagraph>
        <BlogList items={['Node.js', 'pnpm', 'An MCP client, like Claude Code, Claude Desktop, Cursor or Codex']} />
        <BlogParagraph>Clone the repo:</BlogParagraph>
        <BlogCode
          language="bash"
          code={`git clone https://github.com/FewPz/minedocs-mcp
cd minedocs-mcp`}
        />
        <BlogParagraph>Install the dependencies and build:</BlogParagraph>
        <BlogCode
          language="bash"
          code={`pnpm install
pnpm build`}
        />
        <BlogParagraph>
          That gives you <Code>dist/server.js</Code>, which is what you point your client at.
        </BlogParagraph>

        <BlogSubheading>Claude Code</BlogSubheading>
        <BlogParagraph>Run this:</BlogParagraph>
        <BlogCode language="bash" code="claude mcp add minedocs -- node /absolute/path/to/minedocs-mcp/dist/server.js" />
        <BlogParagraph>
          Want it in every project? Add <Code>-s user</Code>:
        </BlogParagraph>
        <BlogCode
          language="bash"
          code="claude mcp add minedocs -s user -- node /absolute/path/to/minedocs-mcp/dist/server.js"
        />
        <BlogParagraph>Check that it's there:</BlogParagraph>
        <BlogCode language="bash" code="claude mcp list" />
        <BlogParagraph>
          Then start a new session and type <Code>/mcp</Code>. If you see minedocs, you're good to go.
        </BlogParagraph>

        <BlogSubheading>Cursor or Claude Desktop</BlogSubheading>
        <BlogParagraph>Add this to your MCP config:</BlogParagraph>
        <BlogCode language="json" code={CURSOR_CONFIG} />
        <BlogParagraph>Then restart the client once.</BlogParagraph>
      </BlogSection>

      <BlogSection title="No step-by-step instructions needed">
        <BlogParagraph>
          This is my favourite part. Compared to pasting docs into the prompt yourself, you don't have to walk it through
          every step like:
        </BlogParagraph>
        <BlogCode
          code={`Open this page
Find this class
Open this method
Read the parameters
Check if it's deprecated
Then write the code`}
        />
        <BlogParagraph>You just say what you want:</BlogParagraph>
        <BlogCode
          code={`Create a PaperMC plugin that gives a player
a custom message when they break a block.`}
        />
        <BlogParagraph>It figures out which tools to use on its own. The flow ends up looking like this:</BlogParagraph>
        <BlogDiagram chart={D.AGENT_WORKFLOW} caption="The AI checks the docs first, then writes the code" />
      </BlogSection>

      <BlogSection title="If you want to be extra sure">
        <BlogParagraph>
          A short prompt usually works fine. But if you really want it to check the docs, just tell it to look things up
          first, like this:
        </BlogParagraph>
        <BlogCode code={GOOD_PROMPT} />
        <BlogParagraph>Written like that, it'll go to the docs every time instead of rushing to write from memory.</BlogParagraph>
      </BlogSection>

      <BlogSection title="It still makes mistakes, though">
        <BlogParagraph>
          To be clear, even with MineDocs, the AI can still write bugs or make things up. It only helps with the API info
          not matching the version you're on.
        </BlogParagraph>
        <BlogCallout icon={ShieldAlert} color="red" title="You still have to review it">
          Logic, project structure, permissions, performance: you still need to review and test all of that yourself.
        </BlogCallout>
      </BlogSection>

      <BlogSection title="Why it fits Minecraft so well">
        <BlogParagraph>
          Minecraft has a lot of API. Player, World, Block, Entity, Event, Command, Inventory, Scheduler, Permission,
          Configuration, and plenty more. The bigger the project, the more the AI needs to know.
        </BlogParagraph>
        <BlogParagraph>
          Stuffing the whole Javadocs into the prompt isn't realistic. The context fills up fast, and the AI has a harder
          time finding what it needs. Letting it ask for just the pages it needs works much better, and that's exactly what
          MCP is good at.
        </BlogParagraph>
      </BlogSection>

      <BlogSection title="Where this could go">
        <BlogParagraph>
          Hook up a few more MCP servers, like Git, build/test, or one that talks to a running Minecraft server, and the
          agent can do a lot more.
        </BlogParagraph>
        <BlogDiagram chart={AGENT_ECOSYSTEM} caption="Dashed lines are the ones that don't exist yet" />
        <BlogParagraph>
          With all of that in place, it could loop on its own: write, build, test, fix any errors, and try again until it
          passes.
        </BlogParagraph>
        <BlogDiagram chart={D.FUTURE_LOOP} caption="Keeps looping until it passes, then hands it over" />
        <BlogParagraph>At that point it starts to feel like a helper that can build most of a plugin end to end.</BlogParagraph>
      </BlogSection>

      <BlogSection title="Wrapping up">
        <BlogParagraph>
          MineDocs isn't trying to do everything. It just fixes the one problem I kept running into: giving AI an easy way
          to read the PaperMC Javadocs in a form it actually understands. It works with Claude Code, Claude Desktop, Cursor,
          or anything else that speaks MCP.
        </BlogParagraph>
        <BlogParagraph>
          If you try it and get stuck, or there's a tool you'd like to see, open an issue on the repo and let's talk.
        </BlogParagraph>
      </BlogSection>

      <BlogSection title="Links">
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
