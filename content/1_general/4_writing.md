---
title: Writing, editing and storing content
short_title: Tools for editing
# subtitle: 
authors:
    - id: FreekPols


--- 

> Here we briefly described the various ways of storing and writing content. In the subsequent sections we describe these in more detail.

There are multiple ways to write, edit and store content for Jupyter Book projects, and showing your content to the world (or not).
In the table below, we have summarized various possibilities, specified the requirements and highlighted their pros and cons. 
In the next chapters, each of these options is elaborated on, providing step-by-step instructions to get started.

```{warning} Discuss with your supervisor
If you are using this workflow for writing, discuss with your supervisor where to store your source files and *if* you can make the data open accessible from the start.
```

## Storing source files

````{tab-set}
```{tab-item} Local
**Description:**  
You can write, edit and store your source files locally. 
If you want to see the output of the content in either web- or pdf-format, you'll need to have installed software (see below).

**Pros:**
- Not visible to outside world when in development
- Not supporting big tech with feeding data

**Cons:**
- Not available to others
- Back ups not automated
- No version control
```

```{tab-item} GitHub
**Description:**  
GitHub is a platform especially for software developers. It is owned by MicroSoft.

**Pros:**
- Version control
- Automated deploy of files
- No local software install required
- Well documented/support

**Cons:**
- Big Tech
- No support by university
```

```{tab-item} GitLab
**Description:** 
GitLab is the 'free' version of GitHub.

**Pros:**
- Version control
- Automated deploy of files
- No local software install required

**Cons:**
- Functionality depends on university (and even faculty level)
- Less documented than GitHub.

```
```` 

## Writing and editing
Here we merely summarize the different ways of writing and editing your content.
Information for how to use / enable it is covered in the subsequent chapters.

````{tab-set}
```{tab-item} Local (VSC)
You can edit your project on your local machine. 

**Requirements:**
- Python installation
- JupyterBook
- [NodeJS](https://nodejs.org/en/download)
- Code editor (e.g. VS Code)

|pros|cons|
|---|---|
|Full control over project and environment | Requires installation and setup |
|Works offline| Easy to use extensions for writing and editing|
| Not visible to others until deployed| |

```

```{tab-item} GitHub Web editor 
If you work with GitHub, you can use the GitHub {abbr}`IDE(Integrated Development Environment)`.

**Requirements:**
- GitHub account
- Deploy file
- Internet connection

|pros|cons|
|---|---|
|No installation required|Little inconvenient with including new files |
|Accessible from any device with internet|Dependent on internet connection|

```

```{tab-item} Overleaf 
An option is to connect [overleaf](https://overleaf.org) with GitHub and use .tex files.

**Requirements:**
- Overleaf account
- See GitHub web editor

|pros|cons|
|---|---|
|What you see is what you get editor | .tex files only (in basic version) |
|LaTeX pdf | |
|Integrated text AI |Dependent on internet connection|
```

```{tab-item} Jupyter Lab 
**Requirements:**
- Jupyter Lab
- See Local with VSC
- [MyST extension](https://mystmd.org/guide/quickstart-jupyter-lab-myst#install-jupyterlab-myst)

|pros|cons|
|---|---|
|.ipyb and .md files | Requires installation and setup |

```

```{tab-item} GitLab
GitLab is like GitHub but not owned by Microsoft. It has an IDE.

**Requirements:**
- GitLab account
- Gitlab CI/CD file
- Internet connection

GitLab is advised at various Universities for multiple reasons. 
One is digital soverenity: the servers where the source files are stored are located at the campus.
The other is that an additional back-up is made which can be accessed by people from the university.


|pros|cons|
|---|---|
|No installation required| Not automatic deployed |
|Accessible from any device with internet|Dependent on internet connection|
```

```{tab-item} WYSIWYG editor
We have built an online {abbr}`WYSIWYG (what you see is what you get)` that works with GitHub. 

**Requirements**
- Personal access token
- See GitHub

|pros|cons|
|---|---|
|No installation required|  |
|Accessible from any device with internet|Dependent on internet connection|
```
````
