#!/bin/sh

supervisord -u app -d /app -l /app/logs/supervisord/activity.log -j /tmp/supervisord.pid -c /etc/supervisord
