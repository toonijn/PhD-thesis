#!/bin/bash
set -e
docker build docker_sage -t thesis_sage
docker container rm thesis_sage & true;
docker run -it --name=thesis_sage thesis_sage
