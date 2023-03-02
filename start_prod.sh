#!/bin/bash
git pull
if [ ! -f .env ]; then
    cp .env_base .env
fi
docker-compose -f docker-compose.yml up -d --no-deps --build