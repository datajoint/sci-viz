# Kubernetes deployment instructions

you will need to make a configMap from your spec sheet.

you can use this command to generate a config map from a file:

```
kubectl create configmap <map-name> <data-source>
```

Then you need to mount the files into both the sci-viz pod and the pharus pod
in their respective deployment.yaml files.

After mounting the files it is also necessary to set both sci-viz and pharus environment variables to point to where you mounted the files.

An example deployment is given in this directories sub-folders.
