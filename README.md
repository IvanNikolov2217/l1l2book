# README


## 📖 Use the manual

For this project we created a manual, a starterkit, and two templates for static output. This manual describes everything you need to know (and probably much more than you need to know) about writing and publishing a bachelor or master thesis with Jupyter Book - at least to kickstart it, and about writing and publishing a scientific paper through Jupyter Book. 
<!--We also elaborate on planning, writing and publishing educational content with Jupyter Book. 
-->

## 🕵 Where to start 

Already know about JupyterBook, familiar with GitHub or GitLab, Markdown... start with cloning the starterkit and start writing your own book. New to the ecosystem? Start with the manual, and then move on to the starterkit.

## 🏁 Purpose

The purpose of this project and this manual is to enable others to use Jupyter Book for writing and publishing their own scientific and educational content. We hope to lower the technical barrier for researchers and educators to create and share their own resources, and to promote open science and open education practices.


## 📄 License

This book is licensed under the [Creative Commons Attribution-NonCommercial 4.0 International License](http://creativecommons.org/licenses/by-nc/4.0/), unless stated otherwise.

You are free to:
- **Share** — copy and redistribute the material in any medium or format
- **Adapt** — remix, transform, and build upon the material for any non-commercial purpose provided proper attribution is given.


## 🖋 Authors

- Freek Pols  
- Saullo Castro
- Gary Steele
- Rolf Hut
- Bahareh Abdi
- Ilke Ercan
- Georgios Varnavides
- Anton Akhmerov

## 🙎Team members

- Maciej Topyla
- Luuk Fröling
- Ronald Ligteringen

## 🙏 Acknowledgements

We acknowledge Mathijs van den Doel as one of the first users of our workflow and starterkit. We have used his early work as a way to improve our workflow and templates.

## 🤝 How to contribute

We welcome contributions to this project. Whether you are a students willing to explore and provide feedback to our workflow, a developer working on Jupyter Book or a researcher in need of both writing for a scientific paper whilst simultaneously publishing your work online for a wider audience... 

Spotted a mistake? Create an issue or submit a pull request. Want to contribute but not sure how? Contact us and we will be happy to help you get started.

## 🛠️ Building the Book

You can download and build this manual locally. Install the [required software](https://jupyterbook.org/stable/get-started/install/), [download the repository](https://github.com/TUD-JB-OS/book/archive/refs/heads/main.zip), and run the following command in the terminal at the root of the repository (where the myst.yml file is located):

```bash
jupyter-book build
```

This will start a local server and open the book in your web browser.

## 📁 Repository Structure

```
├──┐ root
   ├── myst.yml             # Jupyter Book configuration & Table of contents
   ├── index.md             # landing page
   |── README.md            # this file
   |── toc.yml              # table of contents for the book
   ├──┐ content/
      ├── credits.md        # Book introduction
      ├── blog.md           # blog with updates on the project
      ├──┐ 1_general/       
         ├── ...            # Chapters on JupyterBook and editing
      ├──┐ 2_getstarted
         ├── ...            # Chapters on how to quickstart your project
      ├──┐ 3_science/        
         ├── ...            # Chapters on writing and publishing scientific content
      ├──┐ 4_education/        
         ├── ...            # Chapters on writing and publishing educational content
      ├──┐ images/
         ├── ...            # images      
   |──┐ style/
         ├── ...            # custom CSS and brands 
   |──┐ export
      |── export.yml        # export configuration for exporting to pdf
```

## 📧 Contact

For questions about this textbook, please contact [Freek Pols](mailto:c.f.j.pols@tudelft.nl).


## 💰 Funding
This project has received funding from the [Delft University of Technology Open Science Fund (2025-2026)](https://www.tudelft.nl/en/open-science/articles-tu-delft/mainstreaming-open-science-fund-2025-2026).