FROM ubuntu:22.04 
MAINTAINER Hong Jong Hwa <jonghwa.hong@gmail.com> 

# RUN apt update && apt -y upgrade
RUN useradd -m user && \
    echo "\nexport PS1='$ '" >> ~user/.bashrc && \
    mkdir /CODE && \
    chown user.user /CODE


