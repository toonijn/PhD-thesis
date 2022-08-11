#!/bin/bash
set -e
docker container rm thesis_sage & true;
docker build docker_sage -t thesis_sage
jupyter_token=SAGETHESISMAGICTOKEN
(sleep 5; google-chrome "http://localhost:8888/?token=$jupyter_token") &
docker run --env JUPYTER_TOKEN=$jupyter_token -v `pwd`:/home/student/work -p 8888:8888 -it --name=thesis_sage thesis_sage jupyter lab --no-browser --ip 0.0.0.0 /home/student/work
