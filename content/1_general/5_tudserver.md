---
title: Hosting on a webserver🌶
short_title: TUD server 🌶
# subtitle: Using the GitHub Integrated Development Environment to write and edit content
authors:
    - id: FreekPols
    - id: RonaldLigteringen

--- 

> Here we describe how to host your Jupyter Book project on a TU Delft webserver, including requesting the server, setting it up as a webserver and updating it through GitLab CI/CD.

## Requesting a TU Delft (web)server
Talk to your department's IT support to ask for support in setting up a virtual TUD linux server ({abbr}`FMS (Faculty Managed Servers)`). If agreed upon, you can request a [FMS](https://tudelft.topdesk.net/tas/public/ssp/content/serviceflow?unid=3a67785f-b4c9-4601-949d-bc8c9cb6b0eb), specifically a linux (Ubuntu) server with ports **22** (ssh), **80** (http) and **443** (https) open. Faculty domain specific servers are preferred (e.g. somesite.tnw.tudelft.nl over somesite.tudelft.nl).

When approved and made available, an email is sent with the first details. In the following step you will need this email and the information provided there. 

## Setup TU Delft webserver
1. Use [putty](https://www.putty.org/) to connect to the server via ssh. HostName is given under _Step A_ (connect to linux-bastion). Click **Open**.
````{aside} 
```{figure} ../images/putty.png
:width: 100%
```
```` 
2. Click **accept**, allowing the computer to connect to the server.
3. Login with your netID (without \@tudelft.nl)
4. Use the information under _Step B_ (use SSH Key-Based Authentication). (`ssh <servername>.tudelft.nl`)

You are now logged in to the server. 

5. We first install the webserver (apache). Run `sudo apt install apache2`. 
6. We can check whether it successfully installed by going to the server's IP address in a web browser. You should see the default apache page. Or confirm by running `sudo systemctl status apache2` and checking whether the service is active (running).

7. Make a second user `sudo adduser web`, make a password (14 characters) for this user. We will use this user for uploading materials to the webserver. If there is a breach, there is only limited access to the server using this user.
 
Everything that is in `home/web/` will be visible on the webserver (after [taking this step](#change-start-dir)). You can use `cd /home/web` to navigate to this directory.

8. Assign your self the web user: `sudo -u web bash -` and navigate to home/web. 

9. Make a directory call `.ssh` by running `mkdir .ssh` and navigate to it.

10. Create an ssh key by running `ssh-keygen`. Do not use a passphrase. This a vulnerability but is necessary for the webserver to be able to pull from GitLab/GitHub without manual input.

Two keys are generated: `id_rsa` (private key) and `id_rsa.pub` (public key). The public key needs to be copied to an authorized_keys file.

11. Run `cp id_rsa.pub authorized_keys` to do this. You will need the private key later to connect GitHub/GitLab and the server. 

We are now ready with setting up the server, but need to secure it.

12. Run `sudo -i` to become a superuser. We need to install a firewall which can be done by running `apt install ufw`.

13. We need to allow ssh, http and https traffic through the firewall. This can be done by running `ufw allow ssh`, `ufw allow http` and `ufw allow https`. Enable the firewall by running `ufw enable`. You can check the status of the firewall by running `ufw status`.

14. Run `apt install fail2ban` to install fail2ban, which is a software that protects against brute-force attacks. It works by monitoring the log files for failed login attempts and banning the IP address after a certain number of failed attempts. You can check the status of fail2ban by running `systemctl status fail2ban`.

If you decided to maintain your server yourself, you will need to regularly check for updates and security patches. This can be done by running `apt update` and `apt upgrade`. You can also set up automatic updates by running `apt install unattended-upgrades` and configuring it to your needs.

## Change start dir

Apache has set the home folder to `var/www` where we want it to be `home/web`. Using the terminal:

1. Run `sudo nano /etc/apache2/sites-available/000-default.conf`

2. Change `DocumentRoot /var/www/html` to `DocumentRoot /home/web`.

3. Add: 

```{code-block} apache
<Directory /home/web>
    Options Indexes FollowSymLinks
    AllowOverride All
    Require all granted
</Directory>
```

4. Save the changes `Ctrl+O, Enter, Ctrl+X` and run `sudo systemctl restart apache2`

5. Follow steps 2-4 after: `sudo nano /etc/apache2/sites-available/default-ssl.conf`

6. Run
```{code-block} bash
sudo a2ensite default-ssl.conf
sudo a2enmod ssl
sudo systemctl reload apache2
```

7. Check whether `Syntax OK` is shown after running: `sudo apache2ctl configtest`, else: `sudo systemctl restart apache2`

## Request SSL-certificate
Although the webserver is now ready, we need to request an SSL-certificate:

Run:
```{code-block} bash
sudo apt update
sudo apt install certbot python3-certbot-apache
sudo certbot --apache -d <server>
```

and test:
```{code-block} bash
sudo apache2ctl configtest
sudo systemctl reload apache2
```

## WinSCP
You can now connect to your server using e.g. WinSCP (see [hpcwiki.tudelft.nl](https://hpcwiki.tudelft.nl/index.php/Remote_Access)) and copy paste your files. However, it may be more convenient to use GitLab and a CI/CD script to do this 'automatically'.

## CI/CD using GitLab
To host your website on a university webserver you'll need:

- a gitlab repo with CI/CD script (provided below)
- a (linux) webserver (made ready above)
- an SSH key (done)
- a runner and docker (next to be covered)


### Install a runner and docker
We have some jobs that need to be run for making our website from our markdown files. We therefore need a GitLab Runner. This is an application that works with GitLab CI/CD to run those jobs. We also need a docker, a standalone, executable file used to create a container. This container image contains all the libraries, dependencies, and files that the container needs to run.

For installing a gitlab runner, we follow mainly [this documentation](https://docs.gitlab.com/user/get_started/get_started_runner/). 

1. On your server, check whether there is already a gitlab-runner `which gitlab-runner`

2. Follow [these step](https://docs.gitlab.com/runner/install/linux-repository/#install-gitlab-runner)

3. Registration is yet not necessary, can be done in gitlab.

4. Check whether the gitlab-runner is running: `sudo gitlab-runner status`

5. Now the runner is installed, check whether a docker is installed `which docker`

6. If not present, install docker using [these steps](https://docs.docker.com/engine/install/ubuntu/) by first removing any previous docker (components) 
```{code-block} bash
sudo apt remove $(dpkg --get-selections docker.io docker-compose docker-compose-v2 docker-doc podman-docker containerd runc | cut -f1)
```
and subsequently following [these installation steps](https://docs.docker.com/engine/install/ubuntu/#install-using-the-repository).

7. Check whether any upgrades need to be made `sudo apt list --upgradable` and install these `sudo apt upgrade`.

With a runner and a docker available, we can go to GitLab and make use of these.

8. Go to GitLab to your group / repository and click **Build** $\rightarrow$ **Runners**. Click **Create group runner**. This will lead you through a stepwise process to connect your runner to the gitlab group. Using tags you can 'connect' certain jobs to the specific runner. For now, choose **Run untagged jobs**. Create a clear runner description. 

9. Using `sudo` copy paste _Step 1_ in the command line (register). Check whether the URL is set correct, create a name for the runner (spaces allowed in name), as executor choose `docker`, as image choose `alpine:latest`.

In `<etc/gitlab-runner>` you can now find the _config.toml_ file with the settings of the runner.


### CI/CD script
Below we provide an example CI/CD script that converts the markdown and Jupyter Notebook files to html and upload these files to the webserver. 

In the script we make use of _variables_ which can be set at either group level (when more repositories are used) or at repository level. The variables in the group are inherited at repo level. We need to set:

| variable / key | type | visibility | flags | Value |
| --- | --- | --- | --- | --- |
|WEBSITE_UPLOAD_KEY | file | visible | protected variable | `<private SSH key from server>`|
|DEPLOY_USER | default | visible | - | `web` |
|DEPLOY_HOST |  default | masked | - | `<servername>` |
|DEPLOY_PATH | default | masked | - | `home/web/<your folder>` |

A good strategy would to be to define the first three at group level and the path at repo level.

Make sure that the below .yml-file is in your root folder. In the repo that you want to connect to the server, click **Settings**, **CI/CD** and then **Runners**. Choose the runner that you created above, and all is set. With every new commit your webpage should be updated. In **Build**, **Pipelines** you can see whether the jobs have been run correctly and check the full log of the build (if any errors occur).



```{code-block} yaml 
:filename: .gitlab-ci.yml
:label: ci-for-gitlab-tudserver
:caption: .gitlab-ci.yml for TU server deployment

stages:
  - deploy

image: python:3.11-slim

variables:
  SSH_COMMAND: 'ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o IdentitiesOnly=yes'
  LOCAL_BUILD_DIR: "_build/html"
  HOST: "127.0.0.1"             # prevents running local host resulting in an error
  BASE_URL: ""                  # specify the base url, e.g. the folder from root
  
before_script:
  - apt-get update
  - apt-get install -y --no-install-recommends curl rsync openssh-client git

  # Node.js
  - curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  - apt-get install -y --no-install-recommends nodejs
  - node --version
  - npm --version

  # Python deps
  - python -m pip install --upgrade pip
  - pip install mystmd
  - pip install -r requirements.txt

  # SSH key laden
  - eval "$(ssh-agent -s)"
  - chmod 400 "$WEBSITE_UPLOAD_KEY"
  - ssh-add "$WEBSITE_UPLOAD_KEY"

deploy:
  stage: deploy
  script:
    # builds the book
    - myst build --html 
    
    # syncs with the server
    - rsync -ravz "${LOCAL_BUILD_DIR}/" -e "${SSH_COMMAND} -i ${WEBSITE_UPLOAD_KEY}" "${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/"
```



### Useful linux commands
|command | |
| --- | --- |
| `ls` | list files in the current directory |
| `ls -a` | list all files (hidden) in the current directory |
| `ls -l` | list files in long format (permissions, owner, size, date) |
| `cd` | change directory |
| `cd ~` | change to home directory |
| `pwd` | print working directory |
| `q` | quit |
| `exit` | exit the terminal / logout |
| `sudo` | run a command with superuser privileges |
| `sudo -s` | open a root shell |
| `sudo -i`| become root |
| `cat` | concatenate and display file content |
| `reboot` | reboot the server |
