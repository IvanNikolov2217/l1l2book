---
title: Setting up a local workspace
short_title: Local
subtitle: Using local tools to write and edit content
authors:
    - id: FreekPols
    - id: LuukFroling
---

This page will explain how to install the Jupyter Book command-line tools on your device, and how to start a local development server using Visual Studio Code. 

## Install required tools 

Before getting started, make sure the following are installed: 

- An environment manager ([pip](https://pypi.org/project/pip/) will be used here as example)
- [Visual Studio Code](https://code.visualstudio.com/) (or another editor of choice)

If you prefer alternatives to pip, the [Jupyter Book documentation](https://jupyterbook.org/stable/get-started/install/) describes several other installation methods

## Install Jupyter Book 

With the required tools in place, the next step is to install Jupyter Book itself.  
This gives you access to the `jupyter-book` command-line tools. To install Jupyter Book, open a terminal and run:

```bash 
pip install "jupyter-book>=2.0.0"
```

After installation, you can verify that Jupyter Book is available by checking the version:

```
jupyter book --version
```

which shows `v2.0.0` if successfully installed.


## Install VSC
A popular code editor is [Visual Studio Code](https://code.visualstudio.com/). It allows you to program in different languages, where it recognizes the commands in that language and adjusts the FONT so that it becomes better readable. Moreover, it allows you to install various packages (such as Jupyter Notebook). It also integrates GIT and allows to code using Co-Pilot, an AI pair programmer. We advise to use VSC as it allows for multiple programming languages. 

### Terminal
The terminal in Visual Studio Code (VSC) is a tool that lets you interact with your computer's command line directly within the editor. It's used to run commands, scripts, or programs without leaving the coding environment. For example, you can compile code, run a development server, install dependencies, or manage files. It's very helpful for developers because it allows you to code and execute commands in one place, streamlining your workflow.

### Extensions
Extensions in Visual Studio Code (VSC) are powerful add-ons that enhance the functionality of the editor by providing additional features, tools, and support for various programming languages, frameworks, and technologies. Extensions allow you to customize and tailor VSC to suit your specific development needs. To read more about extensions, visit the [extension market place](https://code.visualstudio.com/docs/configure/extensions/extension-marketplace)

#### Popular Extensions in VSC:
* Python: Provides linting, debugging, IntelliSense, and more for Python development.
* Jupyter: Provides support for Jupyter notebooks within VSC.
* Code Spell Checker: Has a great spelling checker, also available for Dutch
* Github Copilot: Your AI pair programmer. Helps you in writing code.
* LaTeX workshop: LaTeX coding, preview, compiling.
* MyST-Markdown: The official Markdown syntax extension


## Starting a project

There are at least two ways to start a project. 

(initialise-local-project)=

### new project

The Jupyter Book package comes with an `init` command, used to initialize a new myst project in the current directory. Using VScode, open the project folder and start a terminal using 'Ctrl + Shift + `' (or by clicking Terminal > New Terminal). In the terminal, initialize a new jupyter book project:  

```bash
jupyter book init
```

To get started writing content in your new project folder, check the [Jupyter Book documentation](https://jupyterbook.org/stable/get-started/create-content/).

### Use the starter kit

Alternatively you can use a template where the folder structure and infrastructure is pre-made for you. Our [starter kit](https://jboss.tudelft.nl/starterkit) has been made to ease the way you set up your project. The starter kit comes with a folder structure, standard needed files, logo's and some styling. 

If you **only** want to work **locally** on your project (not with a git version control system), download the [starter kit zip file](LINK) and unpack it in the desired folder. 

If you want to work with git version control choose either GitLab or GitHub (see [this overview](./4_writing.md/#storing-source-files) for the pros and cons of these systems). Follow either [these steps for GitLab](LINK) or [these steps for GitHub](LINK).

```{tip}
Even when starting locally, one can later on make use of a version control system and make a public website.

There are other templates available, e.g. the [JupyterBook workshop]() or, for educational purposes, the [TUD JB2 template]()
```


## Run the project
To open a live preview of your project, start a built-in server and open the web browser of your choice.

When in the root of your project (where the myst.yml file is)

1) Start a local development instance
```bash
jupyter book start
```

Once loaded the project should be accessible through the local host, using a link similar to `https://localhost:3000` (check the terminal). 

2) Make a change to one of the markdown files and save it. The change will be reflected directly on the webpage!

3) Close the project by using the short key `ctrl + c`.

4) To make a pdf version of your project run `jupyter book build --pdf` or `jupyter book build --typst`. We will cover the building of a pdf version extensively later on.