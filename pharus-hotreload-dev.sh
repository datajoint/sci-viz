#!/bin/sh
pharus_update() {
	[ -z "$PHARUS_PID" ] || kill $PHARUS_PID
	(pharus&)
	PHARUS_PID=$!
}
pharus_update
echo "[$(date -u '+%Y-%m-%d %H:%M:%S')][DataJoint]: Monitoring Pharus updates..."
INIT_TIME=$(date +%s)
LAST_MOD_TIME=$(date -r $PHARUS_SPEC_PATH +%s)
DELTA=$(expr $LAST_MOD_TIME - $INIT_TIME)
while true; do
	CURR_LAST_MOD_TIME=$(date -r $PHARUS_SPEC_PATH +%s)
	CURR_DELTA=$(expr $CURR_LAST_MOD_TIME - $INIT_TIME)
	if [ "$DELTA" -lt "$CURR_DELTA" ]; then
		echo "[$(date -u '+%Y-%m-%d %H:%M:%S')][DataJoint]: Reloading Pharus since \`$PHARUS_SPEC_PATH\` changed."
		pharus_update
		DELTA=$CURR_DELTA
	else
		sleep 5
	fi
done