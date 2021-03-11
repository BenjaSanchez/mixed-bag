# Conda tips

Anything related to environments, dependencies, etc.

## Managing environments with anaconda

* Create environment:
  `conda create -n env_name python=3.7`

* Switch to environment in anaconda terminal:
  `conda activate env_name`

* Inspect packages in environment:
  `conda list`

* Delete environment:
  - Use the anaconda explorer to remove the environment
  - Delete any remaining files at `C:\Users\user_name\AppData\Local\Continuum\anaconda3\envs` (a restart might be required beforehand)

More at https://docs.conda.io/projects/conda/en/latest/user-guide/tasks/manage-environments.html

## pip commands

* update package:
  `pip install package_name --upgrade`

* update package + deps:
  `pip install package_name --upgrade --upgrade-strategy=eager`

* update packages based on `requirements.txt`:
  `pip install -r requirements.txt`

## pyCharm

* add Conda env in pyCharm: https://www.jetbrains.com/help/pycharm/conda-support-creating-conda-virtual-environment.html
