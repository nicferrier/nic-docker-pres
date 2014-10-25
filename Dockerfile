FROM nicferrier/elnode-and-nodejs
MAINTAINER nic@ferrier.me.uk
USER root
ADD . /home/emacs/docker-pres
RUN chown -R emacs /home/emacs/docker-pres
USER emacs
WORKDIR /home/emacs/docker-pres
EXPOSE 8009
CMD /usr/local/emacs/bin/emacs -daemon -l  /home/emacs/docker-pres/boot.el ; tail -f /dev/null
