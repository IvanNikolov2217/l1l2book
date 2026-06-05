---
title: What You See Is What You Get (WYSIWYG) editor
short_title: WYSIWYG editor
authors:
    - id: FreekPols
--- 


We have been working on a What-You-See-Is-What-You-Get (WYSIWYG) editor. This editor is loaded on the publication page through a sort of pop-pup menu and allows you to change its content in a more visual way - committing changes to GitHub directly to a specific branch, or through a pull request.  

Including the editor in your project helps people who are not familiar with markdown to contribute to the content of the publication.

```{figure} ../images/wysiwyg_editor.png
:width: 100%:
:label: fig_wysiwyg_editor

A screenshot of the WYSIWYG editor interface.
```

(WYS-howitworks)=
## How it works

The WYSIWYG editor is currently enabled by a script for github actions. The script looks for every html file in the repo and adds a small javascript in the header of the file before the project is actually deployed. 

The deployed project has obtained a slider at the top right corner of each page, which allows you to open the editor. If you make changes to the content of that page, you can commit the changes to GitHub. You will need to have a fine-grained access token to be able to commit changes to the repository. 

(WYS-howtoenable)=
## How to enable the editor in your project

`````{tab-set}
````{tab-item} GitHub 
Two actions are needed to enable the WYSIWYG editor in your project. First, you need to modify your GitHub workflow file to include the script that adds the WYSIWYG editor to your project. 
Right after 

```{code} yml
  - name: Build HTML Assets
    run: myst build --html
```

you include the following action:

```{code} yml
    - name: Add wizard to book
      uses: luukfroling/Wizard-jb2/actions@main 
      with:
        script_url: "https://raw.githack.com/luukfroling/Wizard-jb2/main/script/start_wizard.js"
        html_dir: "_build/html"
```

```{warning} github repo known
Make sure that your github repository is known by specifying it in the myst.yml file.
```

The second action requires somewhat more work as you need to give access to the repository to the users who want to use the WYSIWYG editor. You can do this by creating a fine-grained access token. 

```{note} How to Create a GitHub Fine-Grained Personal Access Token
- Click here to open the token creation menu.
- Name your token and set an expiration if desired.
- Under Resource owner, select Your account, if it was not already preselected.
- Under Repository access, choose All repositories.
- Under Repository permissions, set Contents to Read and write.
- Scroll down and click Generate token.
- Copy the token and paste it here.
- Note: This token will not be visible again. If you want to use it more, save it somewhere.
```

````{tab-item} GitLab
some instructions for gitlab
````
`````

```{warning} 
**Do not extend the permissions of the token beyond what is necessary** for the WYSIWYG editor to function. Only give it read and write access to the contents of the repository, and do not give it access to other features such as issues or pull requests. This will help to keep your repository secure.

**Do not set the validity time to long for the token**. This will help to prevent unauthorized access to your repository in case the token is compromised. 
```

(WYS-knownlimitations)=
## Known limitations
JupyterBook is actively being developed. Not all functionalities are included in the editor. Moreover, there are known issues with embedding iframes. Still, the editor is great for writing text and directly see it in the browser.

