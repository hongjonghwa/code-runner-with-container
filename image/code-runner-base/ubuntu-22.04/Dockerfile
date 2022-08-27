FROM ubuntu:22.04 
LABEL author="jonghwa.hong@gmail.com"

# RUN apt update && apt -y upgrade
RUN useradd -m user -u 9999 && \
    echo "\nexport PS1='$ '" >> ~user/.bashrc && \
    mkdir /CODE && \
    chown user.user /CODE

VOLUME /CODE
