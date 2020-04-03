# Running DeCaF locally

These are the steps I followed for having some of the [DeCaF](https://github.com/DD-DeCaF) services running locally. Hopefully they will work for you too?

## Running caffeine-vue locally

* Requirements:
  - nodeJS

* installation:
  - Clone caffeine-vue locally
  - cmd:
    ```bash
    cd /caffeine-vue
    npm install
    npm install -g @vue/cli
    ```

* for linting (before committing):
  ```bash
  npx vue-cli-service lint
  ```

* for running:
  ```bash
  npx vue-cli-service serve --port=4200
  ```
  Can be visualized at http://localhost:4200/

* for updating (will change package-lock.json):
  * switching branches / pulling changes:
    ```bash
    npm install
    ```
  * installing myself a specific package:
    ```bash
    npm install package
    ```
* modifying view locally:
  - changing the model:
    change line 250 in ./src/views/InteractiveMap/InteractiveMap.vue to:
    ```js
    return model.id === 135;
    ```
    (in this case the _E. coli_ ecModel)

## Running services locally

Requirements:

* admin access
* Docker desktop: https://www.docker.com/products/docker-desktop
* make: https://coderefinery.github.io/installation/make/

### warehouse

* installation:
  - open docker
  - clone locally repo
  - cmd:
    ```bash
    cd /warehouse
    docker network inspect DD-DeCaF #check if it exists
    docker network create DD-DeCaF #creates it if not
    docker-compose up -d postgres
    docker-compose exec postgres psql -U postgres -c "create database testing;"
    docker-compose run --rm web flask db upgrade #if prompted share access to C drive + give password to docker pop-up
    docker-compose stop
    docker-compose up -d
    ```

* for running:
  - open docker
  - cmd:
    ```bash
    cd /warehouse
    docker-compose run --rm web flask db upgrade
    docker-compose up
    ```
  - Can be visualized at http://localhost:8000/ (check docker-compose.yml)
  - Create in caffeine's root a `.env.local` file with an over-ride to the API port, e.g.:
    ```bash
    VUE_APP_WAREHOUSE_API=http://localhost:8000/
    ```

### simulations

* installation:
  - install Google cloud SDK: https://cloud.google.com/sdk/docs/ (also gcloud)
  - add `C:\Users\user_name\AppData\Local\Google\Cloud SDK\google-cloud-sdk\bin` to the env path
  - make sure your gmail account is added to the list of verified emails with access to the container registry (ATM [@kvikshaug](https://github.com/kvikshaug) is in charge)
  - autenthicate to the container registry:
    ```bash
    gcloud auth login
    gcloud config set project dd-decaf-cfbf6
    gcloud auth configure-docker
    ```
  - Details of the project:
    ```
    gcloud compute project-info add-metadata --metadata google-compute-default-region=europe-west1,google-compute-default-zone=europe-west1-b
    ```
  - open docker
  - Switch to linux containers: https://docs.docker.com/docker-for-windows/#switch-between-windows-and-linux-containers
  - clone locally repo
  - cmd from simulations' root:
    ```bash
    make setup
    ```

* for qa:
  ```bash
  make flake8 isort black-check test
  ```
  or without make in an anaconda prompt:
  ```bash
  flake8 src tests
  isort --check-only --recursive src tests
  black --check src tests
  ```
  (skip license as it fails in windows)

* for running:
  - Create in root a `.env` file with a different port than warehouse, e.g.:
    ```bash
    API_PORT=8001
    ```
  - cmd from simulation's root:
    ```bash
    docker-compose up
    ```
  - Can be visualized at http://localhost:8001/
  - Create in caffeine's root a `.env.local` file with over-rides to the API ports, e.g.:
    ```bash
    VUE_APP_SIMULATIONS_API=http://localhost:8001/
    VUE_APP_WAREHOUSE_API=http://localhost:8000/
    ```
  - run caffeine-vue


* for running:

  ```bash
  docker-compose up
  ```
