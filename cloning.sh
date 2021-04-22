#!/bin/bash
#CHECKING IF THE DIR EXISTS
if [ -d "docker-trial2" ]
then cd docker-trial2
git pull origin main

# rm -rf docker-trial2
# ECHO "DIRECTORY DELETED!"
# git clone https://github.com/simransindhwani/Docker-MeanStack-Demo.git
fi
#git clone https://github.com/simransindhwani/docker-trial2.git