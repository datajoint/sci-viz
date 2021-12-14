#!/bin/sh
sciviz_update() {
	[ -z "$NGINX_PID" ] || kill $$NGINX_PID
	rm -R /usr/share/nginx/html
	python frontend_gen.py
	yarn build
	mv ./build /usr/share/nginx/html
	nginx -g "daemon off;" &
	NGINX_PID=$!
}
sciviz_update
echo "[$(date -u '+%Y-%m-%d %H:%M:%S')][DataJoint]: Monitoring SciViz updates..."
INIT_TIME=$(date +%s)
LAST_MOD_TIME=$(date -r $FRONTEND_SPEC_PATH +%s)
DELTA=$(expr $LAST_MOD_TIME - $INIT_TIME)
while true; do
	CURR_LAST_MOD_TIME=$(date -r $FRONTEND_SPEC_PATH +%s)
	CURR_DELTA=$(expr $CURR_LAST_MOD_TIME - $INIT_TIME)
	if [ "$DELTA" -lt "$CURR_DELTA" ]; then
		echo "[$(date -u '+%Y-%m-%d %H:%M:%S')][DataJoint]: Reloading SciViz since \`$FRONTEND_SPEC_PATH\` changed."
		sciviz_update
		DELTA=$CURR_DELTA
	else
		sleep 5
	fi
done