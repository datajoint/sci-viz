# Developer Instructions

There are a couple issues to address if you are collaborating on this project

- Contributors will have have to point the submodule to their own fork of pharus if they need to edit pharus to support new features for sci-viz.
- That change to pharus would need to be pr'd and then merged into pharus before we can pr and merge their change to sci-viz as we probably dont want unreviewed code linked to sci-viz nor do we want the submodule pointing to their fork of pharus.

## .env

To specify the location of your spec sheet you need this variable in your .env file

```bash
DJSCIVIZ_SPEC_PATH=test/test_spec.yaml
```
