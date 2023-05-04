# ramuna-vulnerable-website
Cybersecurity master 1 project University of Bucharest 2022-2023

This is a vulnerable web application, your task is to find all the 6 vulnerabilities.
For more realism we strongly encourage peoples to not take a look inside the source code, instead, pull the docker images of our different services and consider you can not access the containers (see below).

# How to download it

- WARNING: If you want to use a virtual machine such as Kali in order to test the application, you will need to install docker on the virtual machine. The reason is the following, we can not access containers running on the host from a VM.

### Installing the project on a Kali VM

- Step 1: Open a terminal.
- Step 2: Check for updates: ```sudo apt update``` and ```sudo apt upgrade```.
- Step 3: Install docker: ```sudo apt install docker.io```.
- step 4 : Install docker-compose: ```sudo apt install docker-compose```.
- Step 5: Clone the project: ```git clone https://github.com/Mathis-Dory/ramuna-vulnerable-website.git```.
- Step 6: Go to the project folder: ```cd ramuna-vulnerable-website/cybersecurity_ctf```.
- Step 7: Run the following command: ```sudo docker-compose up -d```.
- step 8: You should be able to access the application on your browser at the following address: ```http://localhost```.

# Theme
This application is a fictitious representation of a government website where citizens can consult the different news and applications to obtain citizenship


# Commit rules:

- Please use conventional commit
- Use your own branch for your feature, in order to do that create a card in the board, next go to issues next create a developpement branch.
- Rebase your branch as much as possible:
  - Checkout master
  - Pull master
  - Checkout your branch
  - > git rebase master
  - Sometimes you will need to push force
- Do not push on master 

# Tips

- Use prettier plugin for your IDE so your code stay clean.
- Use Conventionnal commit plugin and use it to commit.
- This project use pnpm instead of npm so install it.
