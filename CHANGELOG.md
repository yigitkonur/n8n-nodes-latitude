# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.6.0] - 2024-11-29

### Changed
- **Major refactor**: Split monolithic node into modular structure following n8n best practices
- New directory structure:
  - `shared/` - Types, utilities, transport, and property descriptions
  - `methods/` - loadOptions methods for dynamic dropdowns
  - `actions/` - Operation implementations
- Main node file reduced from 287 lines to 51 lines
- Improved type safety with dedicated type definitions
- Better separation of concerns for maintainability
- Added JSDoc documentation throughout

### Technical
- Created `shared/types.ts` - All TypeScript interfaces
- Created `shared/utils.ts` - Utility functions (parameter extraction, sanitization)
- Created `shared/transport.ts` - SDK client initialization
- Created `shared/descriptions.ts` - Node property definitions
- Created `methods/loadOptions.ts` - Dynamic dropdown methods
- Created `actions/runPrompt.operation.ts` - Prompt execution logic
- Removed legacy `GenericFunctions.ts`

## [0.5.0] - 2024-11-29

### Added
- AI Agent support (`usableAsTool: true`) - node can now be used as a tool in n8n AI workflows
- Credential testing with `test` property - validates credentials before use
- `authenticate` property for generic header-based authentication
- Codex metadata file (`Latitude.node.json`) for n8n catalog integration
- Dark mode icon support
- `strict: true` in n8n package configuration

### Changed
- Updated to use `NodeConnectionTypes.Main` instead of deprecated string syntax
- Added `noDataExpression: true` to Prompt Path field for better UX
- Improved all property descriptions with proper punctuation
- Enhanced README with better documentation structure
- Updated tsconfig.json to match n8n recommended settings
- Improved error sanitization patterns

### Fixed
- All linting issues resolved
- TypeScript strict mode compliance
- Proper credential icon path resolution

## [0.4.0] - 2024-11-28

### Added
- Simplified output option (clean response data vs full conversation)

## [0.3.4] - 2024-11-27

### Fixed
- Fixed prompt execution (was returning all prompts instead of running selected)

## [0.3.2] - 2024-11-26

### Changed
- Code cleanup and optimizations
- Reduced package size

## [0.3.1] - 2024-11-25

### Added
- Dynamic parameter fields from selected prompt
- Single operation focus for simpler UX

## [0.2.2] - 2024-11-24

### Fixed
- Fixed `{{ variable }}` extraction from prompt content

## [0.1.0] - 2024-11-20

### Added
- Initial release
- Execute AI prompts from Latitude.so
- Dynamic prompt loading
- Parameter extraction from prompt content
- Full TypeScript support
