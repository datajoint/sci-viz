# Changelog

Observes [Semantic Versioning](https://semver.org/spec/v2.0.0.html) standard and [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) convention.

## [2.1.0] - 03-17-23

## Added

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

[2.1.0]: https://github.com/datajoint/sci-viz/compare/2.0.0...2.1.0
[2.0.0]: https://github.com/datajoint/sci-viz/compare/1.1.1...2.0.0
[1.1.1]: https://github.com/datajoint/sci-viz/compare/1.1.0...1.1.1
[1.1.0]: https://github.com/datajoint/sci-viz/compare/1.0.2...1.1.0
[1.0.2]: https://github.com/datajoint/sci-viz/compare/1.0.1...1.0.2
[1.0.1]: https://github.com/datajoint/sci-viz/compare/1.0.0...1.0.1
[1.0.0]: https://github.com/datajoint/sci-viz/compare/0.1.1...1.0.0
[0.1.1]: https://github.com/datajoint/sci-viz/compare/0.1.0...0.1.1
[0.1.0]: https://github.com/datajoint/sci-viz/releases/tag/0.1.0
