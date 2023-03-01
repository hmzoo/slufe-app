#!/bin/bash
git pull
npm install
sudo docker-compose -f ./dev/docker-compose.yml up -d 
npm run dev