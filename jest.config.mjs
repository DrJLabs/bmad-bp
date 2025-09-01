// Jest config (ESM): ignore Obsidian/Copilot vault artifacts
export default {
  testPathIgnorePatterns: [
    '/node_modules/',
    String.raw`/\.obsidian/`,
    String.raw`/\.copilot/`,
    '/copilot-[^/]+/',
    '/copilot-conversations/',
    '/copilot-custom-prompts/',
    '/dist/',
    '/coverage/',
  ],
  modulePathIgnorePatterns: [
    String.raw`/\.obsidian/`,
    String.raw`/\.copilot/`,
    '/copilot-[^/]+/',
    '/copilot-conversations/',
    '/copilot-custom-prompts/',
  ],
};
