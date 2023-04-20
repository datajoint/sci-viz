# Changelog

Observes [Semantic Versioning](https://semver.org/spec/v2.0.0.html) standard and [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) convention.

## [2.3.1] - 04-21-23

### Added

- `booleans` key to form component spec to specify boolean attributes and make their inputs True/False ([#111](https://github.com/datajoint/sci-viz/issues/111)) PR [#114](https://github.com/datajoint/sci-viz/pull/114)

### Fixed

- Queries now properly refetch tables on insert ([#112](https://github.com/datajoint/sci-viz/issues/112)) PR [#113](https://github.com/datajoint/sci-viz/pull/113)

## [2.3.0] - 04-14-23

### Added

- IFrame component ([#88](https://github.com/datajoint/sci-viz/issues/88)) PR [#92](https://github.com/datajoint/sci-viz/pull/92)
- Extra optional Datadog Logging [#110](https://github.com/datajoint/sci-viz/pull/110)

### Fixed

- Hidden pages bug PR [#107](https://github.com/datajoint/sci-viz/pull/107)

### Changed

- Update logo PR [#104](https://github.com/datajoint/sci-viz/pull/104)
- Update readme - Update reference and citation sections PR [#104](https://github.com/datajoint/sci-viz/pull/104)
- Update docs - Add index page. Update navigation. Remove Google Analytics environment variable PR [#104](https://github.com/datajoint/sci-viz/pull/104)
- Update hidden page behavior to mimic pre 2.0 PR [#109](https://github.com/datajoint/sci-viz/pull/109)

## [2.2.1] - 04-07-23

### Changed

- Datadog replay sampling rate and set user ID PR [#106](https://github.com/datajoint/sci-viz/pull/106)

## [2.2.0] - 04-04-23

### Added

- DataDog real user monitoring (RUM) implementation PR [#101](https://github.com/datajoint/sci-viz/pull/101)

### Changed

- Forms now clear previous values on preset selection ([#98](https://github.com/datajoint/sci-viz/issues/98)) PR [#99](https://github.com/datajoint/sci-viz/pull/99)
- Inserting into a form will refresh all tables on the page PR [#99](https://github.com/datajoint/sci-viz/pull/99)
- Optimized dockerfile and added build step PR[#100](https://github.com/datajoint/sci-viz/pull/100)

### Fixed

- Date, Datetime, Time, and Timestamp type attribute presets for forms PR [#99](https://github.com/datajoint/sci-viz/pull/99)

## [2.1.1] - 03-24-23

### Changed

- Optimized table component queries PR [#97](https://github.com/datajoint/sci-viz/pull/97)

## [2.1.0] - 03-21-23

### Added

- OIDC authentication ([#68](https://github.com/datajoint/sci-viz/issues/68)) PR [#91](https://github.com/datajoint/sci-viz/pull/91)
- Option to set default table page size ([#94](https://github.com/datajoint/sci-viz/issues/94)) PR [#95](https://github.com/datajoint/sci-viz/pull/95)
- Option to add preset values to forms PR [#96](https://github.com/datajoint/sci-viz/pull/96/files)

### Removed

- All deprecated files from source PR [#90](https://github.com/datajoint/sci-viz/pull/90)

### Fixed

- Bug with table page size not updating properly ([#94](https://github.com/datajoint/sci-viz/issues/94)) PR [#95](https://github.com/datajoint/sci-viz/pull/95)

## [2.0.0] - 02-17-23

### Changed

- Replaced build step with hot-reload yaml spec conversion to json spec in public folder PR [#77](https://github.com/datajoint/sci-viz/pull/77)
- Replaced built pages with SciViz component PR [#77](https://github.com/datajoint/sci-viz/pull/77), [#81](https://github.com/datajoint/sci-viz/pull/81)

### Added

- OIDC Support for individual components PR [#79](https://github.com/datajoint/sci-viz/pull/79)
- Docstrings for new components PR [#78](https://github.com/datajoint/sci-viz/pull/78)

## [1.1.1] - 02-09-23

### Fixed

- Form inputs for attributes with time precision e.g: `datetime(6)` ([#65](https://github.com/datajoint/sci-viz/issues/65)) PR [#75](https://github.com/datajoint/sci-viz/pull/75)

## [1.1.0] - 02-06-23

### Added

- DateRangePicker component PR [#72](https://github.com/datajoint/sci-viz/pull/72)
- Slideshow component PR [#72](https://github.com/datajoint/sci-viz/pull/72)

## [1.0.2] - 1-31-23

### Fixed

- Forms for tables with datetime FPKs would return an incorrect datetime format, causing inserts to fail ([#62](https://github.com/datajoint/sci-viz/issues/62)) PR [#64](https://github.com/datajoint/sci-viz/pull/64)

## [1.0.1] - 1-26-23

### Fixed

- Attributes with "null" or "NULL" default values would incorrectly get marked as required inputs in forms (#60) PR #61

## [1.0.0] - 12-30-22

### Added

- Kubernetes docs PR #50
- Antd Table component PR #53, #54
- Dynamic form component PR #55

## [0.1.1] - 04-01-22

### Added

- Support for hosting sci-viz under a subdirectory PR #44

## [0.1.0] - 03-18-22

### Added

- [pharus](https://github.com/datajoint/pharus) As submodule (#17) PR #33
- Components PR #33:
  - `table`
  - `markdown`
  - `metadata`
  - `plot:plotly:stored_json`
  - `file:image:attach`
- Components PR #41:
  - `radiobuttons`
  - `dropdown-query`
  - `dropdown-static`
- Grid system PR #33
- Dynamic grid system (#23) PR #33
- Database Login PR (#9) #33
- Basic GHA for repo PR (#26) #33
- Hotreloading based off of spec sheet (#24) PR #33
- Initial framework for jest testing (#27) PR #33
- loginless mode PR #41

[2.3.1]: https://github.com/datajoint/sci-viz/compare/2.3.0...2.3.1
[2.3.0]: https://github.com/datajoint/sci-viz/compare/2.2.1...2.3.0
[2.2.1]: https://github.com/datajoint/sci-viz/compare/2.2.0...2.2.1
[2.2.0]: https://github.com/datajoint/sci-viz/compare/2.1.1...2.2.0
[2.1.1]: https://github.com/datajoint/sci-viz/compare/2.1.0...2.1.1
[2.1.0]: https://github.com/datajoint/sci-viz/compare/2.0.0...2.1.0
[2.0.0]: https://github.com/datajoint/sci-viz/compare/1.1.1...2.0.0
[1.1.1]: https://github.com/datajoint/sci-viz/compare/1.1.0...1.1.1
[1.1.0]: https://github.com/datajoint/sci-viz/compare/1.0.2...1.1.0
[1.0.2]: https://github.com/datajoint/sci-viz/compare/1.0.1...1.0.2
[1.0.1]: https://github.com/datajoint/sci-viz/compare/1.0.0...1.0.1
[1.0.0]: https://github.com/datajoint/sci-viz/compare/0.1.1...1.0.0
[0.1.1]: https://github.com/datajoint/sci-viz/compare/0.1.0...0.1.1
[0.1.0]: https://github.com/datajoint/sci-viz/releases/tag/0.1.0
