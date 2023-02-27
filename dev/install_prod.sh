#!/bin/bash



# DOCKER
sudo apt-get remove -y docker docker-engine docker.io containerd runc
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg lsb-release

sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo chmod a+r /etc/apt/keyrings/docker.gpg
sudo apt-get update
sudo apt-get -y install docker-ce docker-ce-cli containerd.io docker-compose docker-compose-plugin

#NODEJS
sudo apt-get remove -y nodejs npm
curl -sL https://deb.nodesource.com/setup_16.x -o /tmp/nodesource_setup.sh
sudo bash /tmp/nodesource_setup.sh
sudo apt -y install nodejs


#GIT
sudo     git config --global user.name HMJ
sudo     git config --global user.email "hmj@goatpage.com"

#SECURE
sudo apt-get -y install git fail2ban
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable

# git clone
# docker-compose -f docker-compose.yml up -d --no-deps --build