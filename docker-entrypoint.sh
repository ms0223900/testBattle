#!/bin/sh
set -e

# Environment
if [ "$NODE_ENV" ]; then
	sed -i "s/NODE_ENV=production/NODE_ENV=${NODE_ENV}/g" ${PWD}/.env
fi

exec "$@"
