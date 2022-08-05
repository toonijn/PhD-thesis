# FROM jupyter/minimal-notebook:4d7dd95017ed
FROM sagemath/sagemath:9.5
#FROM sagemath/sagemath:9.2.beta3-py3

LABEL maintainer="Toon Baeyens <toon.baeyens@ugent.be>"

ARG SAGE_ROOT=/home/sage/sage

USER root
RUN userdel sage
RUN useradd -rm -d /home/student -s /bin/bash -u 1000 student

RUN sed -i -re 's/([a-z]{2}\.)?archive.ubuntu.com|security.ubuntu.com/old-releases.ubuntu.com/g' /etc/apt/sources.list

# install necessary packages
ENV DEBIAN_FRONTEND noninteractive
RUN apt-get update \
    && apt-get install -qy --no-install-recommends \
    software-properties-common curl gpg-agent \
    # && add-apt-repository "deb http://ppa.launchpad.net/deadsnakes/ppa/ubuntu focal main" \
    && curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - \
    && apt-get update \
    && apt-get install -yq --no-install-recommends \
    # https://github.com/jupyter/docker-stacks/blob/master/base-notebook/Dockerfile
    wget \
    bzip2 \
    ca-certificates \
    sudo \
    locales \
    fonts-liberation \
    run-one \
    zip \
    # install python
    python3.9 \
    python3.9-dev \
    python3.9-distutils \
    dvipng \
    ffmpeg \
    imagemagick \
    texlive \
    tk tk-dev \
    jq \
    # https://github.com/jupyter/docker-stacks/blob/master/minimal-notebook/Dockerfile
    build-essential \
    emacs \
    git \
    inkscape \
    jed \
    libsm6 \
    libxext-dev \
    libxrender1 \
    lmodern \
    netcat \
    pandoc \
    python-dev \
    texlive-full \
    pdf2svg \
    tzdata \
    unzip \
    nano \
    nodejs \
    cmake \
    # some special requests
    # pm4py
    python3.9-tk graphviz gcc g++ libblas-dev liblapack-dev libsuitesparse-dev \
    && update-alternatives --install /usr/bin/python python /usr/bin/python3.9 1 \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Installing pip
RUN curl https://bootstrap.pypa.io/get-pip.py | python

# Installing jupyter
RUN python -m pip install --no-cache --upgrade pip setuptools \
    && python -m pip --no-cache install \
    'notebook==6.4.*' \
    'jupyterhub==1.4.*' \
    'jupyterlab==3.*' \
    'jupyterlab-git' \
    'jupyterlab-execute-time'

RUN npm install -g yarn 

USER student
ENV HOME /home/student
WORKDIR /home/student

# Populate python 3 kernel
RUN python -m pip --no-cache install --user --no-warn-script-location \
    'numpy==1.21.*' \
    'scipy==1.7.*' \
    'matplotlib==3.4.*' \
    'sympy==1.8.*' \
    'pandas==1.3.*' \
    'pillow==8.3.*' \
    'openpyxl==3.0.*' \
    'pm4py==2.2.*'

RUN mkdir -p /home/sage/sage/local/share/doc/sage/html/en

# Add sage kernel
RUN mkdir $SAGE_ROOT/pkgs && ln -s $SAGE_ROOT/local/var/lib/sage/venv-python3.9.9/lib/python3.9/site-packages/ $SAGE_ROOT/pkgs/sagemath-standard
RUN jupyter kernelspec install --user $SAGE_ROOT/local/var/lib/sage/venv-python3.9.9/share/jupyter/kernels/sagemath

RUN jq '. + {env: {SAGE_ROOT: "'$SAGE_ROOT'"}}' < /home/student/.local/share/jupyter/kernels/sagemath/kernel.json > tmp.kernel.json \
    && mv tmp.kernel.json /home/student/.local/share/jupyter/kernels/sagemath/kernel.json

# Install jupyter labextensions
ENV JUPYTERLAB_DIR=/home/student/.lab
RUN jupyter labextension enable jupyterlab-execute-time @jupyterlab/git
RUN jupyter lab build
RUN mkdir -p .jupyter/lab/user-settings/@jupyterlab/notebook-extension/ \
    && echo '{"recordTiming": true}' > .jupyter/lab/user-settings/@jupyterlab/notebook-extension/tracker.jupyterlab-settings
RUN mkdir -p .jupyter/lab/user-settings/jupyterlab-execute-time \
    && echo '{"highlight": false, "positioning": "right"}' > .jupyter/lab/user-settings/jupyterlab-execute-time/settings.jupyterlab-settings
RUN mkdir -p /home/student/.jupyter/lab/user-settings/\@jupyterlab/git \
    && echo '{"displayStatus": false, "refreshInterval": 10000}' > /home/student/.jupyter/lab/user-settings/\@jupyterlab/git/plugin.jupyterlab-settings

# Install pyslise
WORKDIR /home/student/
RUN git clone https://gitlab.com/libeigen/eigen.git
RUN git clone --recursive https://github.com/twist-numerical/matslise.git
RUN mkdir eigen/build; mkdir matslise/build-sage;  mkdir matslise/build-python

WORKDIR /home/student/eigen/build
RUN git checkout 3.3; cmake -Wno-dev ..

WORKDIR /home/student/matslise/build-sage
RUN cmake .. -DCMAKE_BUILD_TYPE=Release \
    -DEigen3_DIR="/home/student/eigen/build" \
    -DPYTHON_EXECUTABLE=$(sage -python -c "import sys; print(sys.executable, end='')")
RUN cmake --build . --target pyslise_install --config Release -- -j 5

WORKDIR /home/student/matslise/build-python
RUN cmake .. -DCMAKE_BUILD_TYPE=Release \
    -DEigen3_DIR="/home/student/eigen/build" \
    -DPYTHON_EXECUTABLE=$(python -c "import sys; print(sys.executable, end='')")
RUN cmake --build . --target pyslise_install --config Release -- -j 5

WORKDIR /home/student

RUN mkdir /home/student/work
