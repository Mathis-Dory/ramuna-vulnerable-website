FROM node:lts-alpine as production

RUN apk update && apk add openssh-server && apk add sudo
RUN mkdir /var/run/sshd
RUN echo 'root:password' | chpasswd
RUN ssh-keygen -A
RUN adduser -D michael && echo 'michael:unH@ck@bl3&' | chpasswd -e
RUN echo 'michael ALL=(ALL) NOPASSWD: ALL' >> /etc/sudoers

WORKDIR /usr/src/app

RUN npm i -g @nestjs/cli

COPY package*.json ./

RUN npm install

COPY . .

CMD ["/usr/sbin/sshd", "-D"]
CMD [ "npm", "start"]
