FROM ubuntu:22.04 
LABEL author="jonghwa.hong@gmail.com"

# RUN apt update && apt -y upgrade
RUN apt-get update && \
    apt-get -y install time && \
    useradd -m user -u 9999 && \
    echo "\nexport PS1='$ '" >> ~user/.bashrc && \
    mkdir /CODE && \
    chown user /CODE && \
    chgrp user /CODE

VOLUME /CODE
