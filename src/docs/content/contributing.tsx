import { C, Callout, CodeBlock, DocLink, ExtLink, H2, OL, P, UL } from "@/components/prose";
import { SITE } from "../site";
import type { DocPage } from "../types";

function Development() {
  return (
    <>
      <P>
        The mod and this documentation site live in separate repositories. The mod is at{" "}
        <ExtLink href={SITE.repoUrl}>{SITE.repoUrl}</ExtLink>; this site is at{" "}
        <ExtLink href={SITE.docsRepoUrl}>{SITE.docsRepoUrl}</ExtLink>.
      </P>

      <H2>Build the mod</H2>
      <CodeBlock
        lang="bash"
        status="none"
        code={`
gradlew.bat build --console=plain --no-daemon`}
      />
      <P>
        The jar is written to <C>build/libs/quill-ui-0.2.0-alpha.3.jar</C>. The build also runs the unit tests
        and the API compatibility check in CI.
      </P>

      <H2>Run the documentation locally</H2>
      <P>You need Node.js 20 or newer.</P>
      <CodeBlock
        lang="bash"
        status="none"
        code={`
git clone https://github.com/NetoTTT/quill-ui-docs.git
cd quill-ui-docs
npm install
npm run dev`}
      />
      <P>
        Vite prints a local address, usually <C>http://localhost:5173</C>. Changes reload instantly.
      </P>

      <H2>Build the static site</H2>
      <CodeBlock
        lang="bash"
        status="none"
        code={`npm run build`}
      />
      <P>
        The command typechecks the project and writes a single self-contained <C>dist/index.html</C>. It uses
        hash URLs (<C>#/components/button</C>), so nested URLs survive a refresh on GitHub Pages and work
        under the repository sub-path.
      </P>

      <H2>Deploy to GitHub Pages</H2>
      <OL>
        <li>
          In <strong>Settings → Pages</strong>, set the source to <strong>GitHub Actions</strong>.
        </li>
        <li>
          Push to <C>main</C>. <C>.github/workflows/pages.yml</C> builds this repository and publishes{" "}
          <C>dist/</C>.
        </li>
        <li>
          The site is available at <ExtLink href={SITE.docsUrl}>{SITE.docsUrl}</ExtLink>.
        </li>
      </OL>

      <H2>This repository</H2>
      <CodeBlock
        lang="text"
        status="none"
        code={`
quill-ui-docs/
├── src/                    documentation app
│   ├── components/         layout, prose helpers, previews
│   ├── docs/content/       article content
│   ├── docs/site.ts        repository URLs, version, licences
│   ├── lib/                router, search, highlighter
│   └── pages/              homepage
├── .github/workflows/      pages.yml
├── package.json
└── vite.config.ts`}
      />
      <P>
        The mod source, its Markdown design docs and Gradle build stay in{" "}
        <ExtLink href={SITE.repoUrl}>{SITE.repoUrl}</ExtLink>.
      </P>
    </>
  );
}

function Guidelines() {
  return (
    <>
      <P>Documentation is only useful if it is accurate. These rules keep this site trustworthy.</P>

      <H2>Writing rules</H2>
      <UL>
        <li>Never document a class, method or option you have not checked in the source.</li>
        <li>Keep Java examples compiling against the current source; they are verified, not illustrative.</li>
        <li>Use plain, short sentences and show a preview when a component is visual.</li>
        <li>
          Mark unfinished pages with <C>status: "draft"</C> or <C>status: "stub"</C>; verified pages omit the
          status.
        </li>
        <li>Do not add placeholder repository URLs, versions or licence text.</li>
      </UL>

      <H2>Adding a page</H2>
      <OL>
        <li>
          Write a component in the matching file in <C>src/docs/content/</C> using the helpers from{" "}
          <C>components/prose</C> (<C>H2</C>, <C>H3</C>, <C>P</C>, <C>CodeBlock</C>, <C>Example</C>,{" "}
          <C>DocTable</C>, <C>Callout</C>, <C>DocLink</C>).
        </li>
        <li>
          Add it to that file&apos;s exported page list with a slug, title, description and component.
          Navigation, search, breadcrumbs, the table of contents and previous/next links update
          automatically.
        </li>
      </OL>
      <CodeBlock
        lang="text"
        status="none"
        title="src/docs/content/guides.tsx"
        code={`
{ slug: "my-page", title: "My Page", description: "One sentence.", component: MyPage },`}
      />

      <H2>Architecture rules</H2>
      <UL>
        <li>A public package may not depend on <C>internal</C>.</li>
        <li>
          <C>theme</C> and <C>layout</C> must stay usable without a live Minecraft screen.
        </li>
        <li>Widgets never contain commands, payloads or gameplay state.</li>
        <li>Screens compose widgets; they do not reimplement their drawing.</li>
        <li>No public API class is added without Javadoc and a compatibility check.</li>
      </UL>
      <P>
        The full rationale is in{" "}
        <ExtLink href={`${SITE.repoUrl}/blob/main/ARCHITECTURE.md`}>ARCHITECTURE.md</ExtLink>.
      </P>

      <Callout kind="tip">
        <P>
          Found something wrong? Open an issue at{" "}
          <ExtLink href={SITE.issuesUrl}>{SITE.issuesUrl}</ExtLink>.
        </P>
      </Callout>
    </>
  );
}

function License() {
  return (
    <>
      <P>
        The documentation site and the Quill UI mod are separate works with separate licences.
      </P>

      <H2>This documentation site</H2>
      <P>
        The site code and content are licensed under the{" "}
        <strong>GNU General Public License v3.0</strong> (<C>GPL-3.0</C>).
      </P>
      <UL>
        <li>
          <ExtLink href={`${SITE.docsRepoUrl}/blob/main/LICENSE`}>LICENSE</ExtLink> in this repository.
        </li>
        <li>
          Source: <ExtLink href={SITE.docsRepoUrl}>{SITE.docsRepoUrl}</ExtLink>
        </li>
      </UL>

      <H2>Quill UI itself</H2>
      <P>
        The mod is licensed under the <strong>GNU Lesser General Public License v3.0 or later</strong> (
        <C>LGPL-3.0-or-later</C>).
      </P>
      <UL>
        <li>
          <ExtLink href={`${SITE.repoUrl}/blob/main/LICENSE`}>LICENSE</ExtLink>
        </li>
        <li>
          <ExtLink href={`${SITE.repoUrl}/blob/main/COPYING`}>COPYING</ExtLink> (LGPL text)
        </li>
        <li>
          <ExtLink href={`${SITE.repoUrl}/blob/main/COPYING.LESSER`}>COPYING.LESSER</ExtLink>
        </li>
      </UL>

      <H2>Code examples</H2>
      <P>
        Java examples are quoted from the mod source. They remain under the mod&apos;s{" "}
        <C>LGPL-3.0-or-later</C> licence; the site&apos;s GPL-3.0 applies to the site implementation and
        prose.
      </P>

      <H2>What this means for mods</H2>
      <P>
        You may use Quill UI as a library in your own mod, including closed-source mods, as long as you
        comply with the LGPL: keep the library separable, preserve notices, and share changes you make to
        Quill UI itself under the same licence.
      </P>
      <Callout kind="note">
        <P>
          This page is a summary, not legal advice. The licence texts in each repository are authoritative.
          See <DocLink to="contributing/guidelines">Contributing Guidelines</DocLink> for how changes are
          reviewed.
        </P>
      </Callout>
    </>
  );
}

export const contributing: DocPage[] = [
  {
    slug: "development",
    title: "Development Setup",
    description: "Build the mod, run the docs site and deploy to GitHub Pages.",
    component: Development,
  },
  {
    slug: "guidelines",
    title: "Contributing Guidelines",
    description: "Accuracy rules, adding pages and architecture constraints.",
    component: Guidelines,
  },
  {
    slug: "license",
    title: "License",
    description: "GPL-3.0 for this site and LGPL-3.0-or-later for the mod.",
    component: License,
  },
];
