FROM datajoint/miniconda3:4.10.3-py3.9-alpine
WORKDIR /main
COPY --chown=anaconda:anaconda ./docs/.docker/apk_requirements.txt ${APK_REQUIREMENTS}
COPY --chown=anaconda:anaconda ./docs/.docker/pip_requirements.txt ${PIP_REQUIREMENTS}
RUN \
    umask u+rwx,g+rwx,o-rwx && \
    /entrypoint.sh echo "Dependencies installed" && \
    rm ${APK_REQUIREMENTS} ${PIP_REQUIREMENTS} && \
    git config --global user.name "GitHub Action" && \
    git config --global user.email "action@github.com"&& \
    git config --global pull.rebase false && \
    git init
COPY --chown=anaconda:anaconda ./package.json /main/package.json
COPY --chown=anaconda:anaconda ./docs/mkdocs.yaml /main/docs/mkdocs.yaml
COPY --chown=anaconda:anaconda ./docs/src /main/docs/src
COPY --chown=anaconda:anaconda ./CHANGELOG.md /main/