/**
 * Central site configuration. Every link and version label in the site reads from here.
 */
export const SITE = {
  name: "Quill UI",
  tagline: "A small client-side UI framework for Fabric.",
  version: "0.2.0-alpha.7",
  minecraftVersion: "26.3",
  javaVersion: "25",
  /** The mod repository. */
  repoUrl: "https://github.com/NetoTTT/quill-ui",
  /** This documentation repository. */
  docsRepoUrl: "https://github.com/NetoTTT/quill-ui-docs",
  docsUrl: "https://netottt.github.io/quill-ui-docs/",
  issuesUrl: "https://github.com/NetoTTT/quill-ui-docs/issues",
  /** Licence of this site. */
  licenseLabel: "GPL-3.0",
  licenseUrl: "https://github.com/NetoTTT/quill-ui-docs/blob/main/LICENSE",
  /** Licence of the Quill UI mod and its code examples. */
  modLicenseLabel: "LGPL-3.0-or-later",
  modLicenseUrl: "https://github.com/NetoTTT/quill-ui/blob/main/LICENSE",
  repoIsPlaceholder: false,
} as const;

export const repoLinkTitle = "Quill UI mod on GitHub";
export const docsRepoLinkTitle = "Quill UI documentation on GitHub";
