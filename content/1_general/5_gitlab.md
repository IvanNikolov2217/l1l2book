---
title: Hosting with GitLab pages
short_title: GitLab pages
# subtitle: Using the GitHub Integrated Development Environment to write and edit content
authors:
    - id: FreekPols
    - id: RonaldLigteringen

--- 

# GitLab pages

There are (at least) two options for hosting your Jupyter Book through GitLab:
1. Using GitLab CI/CD to deploy to an external server (e.g. TU Virtual Machine), see [TUD server](./5_tudserver.md)
2. Using GitLab Pages to host the book directly on GitLab

```{note}
GitLab pages is not enable by default for TU Delft, but https://gitlab.ewi.tudelft.nl/ has enabled GitLab pages. 
```

GitLab Pages allows you to host static HTML files online from GitLab repositories using [GitLab CI/CD](https://docs.gitlab.com/ci/). This page includes the how-to instruction. Note that the GL starter kit includes a CI/CD script.

## Instructions[^ref]
[^ref]: This text is copied and adapted from the [MyST documentation](https://myst.org/guide) where it has been written by Freek Pols

To get setup with GitLab Pages, ensure that your repository is hosted in GitLab and you are in the root of the Git repository. Create a file called `.gitlab-ci.yml` with the following content:


```{code} yaml
:filename: .gitlab-ci.yml


image: ghcr.io/prefix-dev/pixi:latest

stages:
  - build
  - deploy

variables:
  PIXI_CACHE_DIR: "$CI_PROJECT_DIR/.pixi"
  HOST: "127.0.0.1"

cache:
  paths:
    - .pixi

before_script:
  - pixi --version

build:
  stage: build
  script:
    # install environment from pixi.toml + pixi.lock
    - pixi install --locked

    # run jupyter-book via pixi environment
    - pixi run jupyter-book build --html
  artifacts:
    paths:
      - _build/html

pages:
  stage: deploy
  script:
    - mkdir public
    - cp -r _build/html/* public/
  artifacts:
    paths:
      - public
  only:
    - main
```


You must set the `HOST` - this is a fix for a [known issue](https://github.com/jupyter-book/mystmd/issues/2471).

Note that a [pixi.toml](https://pixi.prefix.dev/latest/python/pyproject_toml/) and pixi.lock file should be included!

A minimal version is shown below.

```{code-block} toml
:filename: pixi.toml

[workspace]
authors = [{name = "Me", email = "me@me.com"}]
channels = ["conda-forge"]
name = "jbtest"
platforms = ["win-64", "linux-64"]
version = "0.1.0"

[tasks]

[dependencies]
python = ">=3.14.3,<3.15"
jupyter-book = ">=2.1.2,<3"
```

