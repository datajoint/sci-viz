# Developer Instructions

There are a couple issues to address if you are collaborating on this project

- Contributors will have have to point the submodule to their own fork of pharus if they need to edit pharus to support new features for sci-viz.
- That change to pharus would need to be pr'd and then merged into pharus before we can pr and merge their change to sci-viz as we probably dont want unreviewed code linked to sci-viz nor do we want the submodule pointing to their fork of pharus.

## Environment Variables

To specify the location of your spec sheet you need to set this environment variable:

```bash
DJSCIVIZ_SPEC_PATH=test/test_spec.yaml
```

## User

You will need to change the `user` value for the SciViz service in your compose file:
```
user: root
```

## Public Folder

Config values for images or icons must be relative to the public folder. To add your file, follow these steps in your compose file:
 1. Mount the file into the container
 2. Copy the file to `/home/node/public` before running `sci-viz-hotreload-dev.sh`

In production environments, the file must instead be copied to `/home/node/build` before running `sci-viz-hotreload-prod.sh`