#!/bin/bash
git pull
if [ ! -f .env ]; then
    cp .env_base .env
fi
npm install
sudo docker-compose -f ./dev/docker-compose.yml up -d 
npm run dev