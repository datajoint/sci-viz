#!/bin/sh
rm -R /usr/share/nginx/html
cp -R /home/node/build /usr/share/nginx/html
sciviz_update() {
	yq eval -o=json $DJSCIVIZ_SPEC_PATH | jq . > ./public/sciviz_spec.json
}
sciviz_update
nginx -g "daemon off;"
echo "[$(date -u '+%Y-%m-%d %H:%M:%S')][DataJoint]: Monitoring SciViz updates..."
INIT_TIME=$(date +%s)
LAST_MOD_TIME=$(date -r $DJSCIVIZ_SPEC_PATH +%s)
DELTA=$(expr $LAST_MOD_TIME - $INIT_TIME)
while true; do
	CURR_LAST_MOD_TIME=$(date -r $DJSCIVIZ_SPEC_PATH +%s)
	CURR_DELTA=$(expr $CURR_LAST_MOD_TIME - $INIT_TIME)
	if [ "$DELTA" -lt "$CURR_DELTA" ]; then
		echo "[$(date -u '+%Y-%m-%d %H:%M:%S')][DataJoint]: Reloading SciViz since \`$DJSCIVIZ_SPEC_PATH\` changed."
		sciviz_update
		DELTA=$CURR_DELTA
	else
		sleep 5
	fi
done