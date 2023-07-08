![GitHub all releases](https://img.shields.io/github/downloads/Mathis-Dory/ramuna-vulnerable-website/total)
![GitHub repo size](https://img.shields.io/github/repo-size/Mathis-Dory/ramuna-vulnerable-website)
![GitHub issues](https://img.shields.io/github/issues-raw/Mathis-Dory/ramuna-vulnerable-website)
![GitHub](https://img.shields.io/github/license/Mathis-Dory/ramuna-vulnerable-website)
![GitHub last commit](https://img.shields.io/github/last-commit/Mathis-Dory/ramuna-vulnerable-website)
![Maintenance](https://img.shields.io/maintenance/yes/2023)
# Ramuna vulnerable website

## Table of contents
  - [Presentation of the project](#presentation-of-the-project)
    - [What is the goal ?](#what-is-the-goal-)
    - [How to download it](#how-to-download-it)
  - [Contributing](#contributing)
    - [Commit rules:](#commit-rules)
    - [Tips](#tips)

## Presentation of the project

This is a project for the cybersecurity course at the University of Bucharest. The goal is to create a vulnerable web application in order to create a CTF (Capture The Flag) for the students.
This application is a fictitious representation of a government website where citizens can consult the different news and applications to obtain the citizenship of the country.


### What is the goal ?

This is a vulnerable web application, your task is to find all the 7 vulnerabilities.
The next version of the application will contain a new page were you will be able to report the flags you found (there are no flag in the current version).
For more realism we strongly encourage peoples to not take a look inside the source code of the application.
The vulnerabilities can be web vulnerabilities, server vulnerabilities or even forensic.

### How to download it

- Clone the repository ```git clone https://github.com/Mathis-Dory/ramuna-vulnerable-website.git```
- Install Docker and Docker-compose on your machine.
- Go to the root of the project and run ```docker-compose up --build -d```
- Go to ```localhost:80``` on your favorite internet browser, you should see the application.
- If you are using a virtual machine such as Kali Linux, you will need to change the ```localhost``` to the ip of your host machine.

## Contributing

### Commit rules:

- Please use conventional commit
- Use Pull request
- Use your own branch for your feature, in order to do that create a card in the board, next go to issues next create a development branch.
- Rebase your branch as much as possible:
  - Checkout master
  - Pull master
  - Checkout your branch
  - > git rebase master
  - Sometimes you will need to push force
- Do not push on master 

### Tips

- Use prettier plugin for your IDE so your code stay clean.
- Use Conventional commit plugin and use it to commit.
- This project use pnpm instead of npm so install it.
