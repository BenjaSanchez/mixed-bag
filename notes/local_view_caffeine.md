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

* troubleshooting:
  - if you get an error of the type "Cannot create container for service web: b'Drive has not been shared'":
    - try https://github.com/Cyb3rWard0g/HELK/issues/79#issuecomment-397637262
    - If that doesn't work, in `/docker-compose.yml` replace:
      ```yml
      - prometheus_multiproc_dir=/prometheus-client
      volumes:
        - .:/app
        - type: tmpfs
        - target: "/prometheus-client"
      ```
      for:
      ```yml
        - prometheus_multiproc_dir=/
      ```
    - note that if you do this, every time you use `make` you first need to run:
      ```bash
      docker-compose build web
      ```
  - Error 127: You'll have to skip make and directly use the docker commands from `Makefile`

### escher

* installation:
  - clone https://github.com/dd-decaf/escher
  - cmd from escher's root:
    ```bash
    npm install
    npm audit fix
    ```

* using a different build in caffeine:
  - checkout desired branch of escher
  - cmd from escher's root:
    ```bash
    npm run-script build
    ```
  - copy all files in `/dist` to caffeine's repo: `/caffeine/node_modules/@dd-decaf/escher/dist`

* resetting caffeine's version of escher:
  - cmd from caffeine's root:
    ```bash
    npm install
    ```

### Accessing passwords

* cmd:
  ```bash
  gcloud compute ssh projects/dd-decaf-cfbf6/zones/europe-west1-b/instances/amoeba
  ```
* Create file `.ssh/config` with:
  ```bash
  Host git.dd-decaf.eu
   IdentityFile ~/.ssh/google_compute_engine
  ```
* cmd:
  ```bash
  git clone git.dd-decaf.eu:/secrets
  ```

### Using the API

* Accessing public data:
  - Any service can be accessed at https://api-staging.dd-decaf.eu
  - Example: public models are available at https://api-staging.dd-decaf.eu/model-storage/models

* Checking private data:
  - Make sure cisco is not enabled.
  - Go to the corresponding model/map/exp page (in staging or caffeine)
  - Open the Vue tab in the developers tool
  - Models: Inspect `props -> items` in `Root -> App -> VApp -> VContent -> Models -> VDataTable`
  - Maps: Inspect `props -> items` in `Root -> App -> VApp -> VContent -> Maps -> VDataTable`

* Changing databases (recommended way):
  - Go to https://console.cloud.google.com
  - From their CLI, run:
    ```
    gcloud sql connect dd-decaf
    ```
    (you will need the `GCloud postgres user` password from the lastpass vault)
  - To access a given database:
    ```
    \l # show all databases
    \c model_storage_staging # connect to this db
    \dt # list all tables from the db
    select * from model; # show all elements
    ```
  - To make a model public:
    ```
    select * from model where id=XXX;
    update model set project_id=NULL where id=XXX;
    ```
  - To delete an element of the database:
    ```
    delete from model where id=XXX;
    ```
  - hot-keys:
    `;` -> show display
    `q` -> quit display

Other Stuff (Untested):

* Activating proxy:
   ```
   cloud_sql_proxy -instances dd-decaf-cfbf6:europe-west1:dd-decaf=tcp:0.0.0.0:3306
   ```

* Accessing PostgreSQL locally:
  - Install: https://www.compose.com/articles/postgresql-tips-installing-the-postgresql-client/
  - From a shell (using the `GCloud postgres user` password from the lastpass vault), run:
    ```
    gcloud sql connect dd-decaf
    ```

* Having docker work within Windows' Ubuntu: https://altis.com.au/installing-docker-on-ubuntu-bash-for-windows/

* Install gcloud: https://cloud.google.com/sql/docs/mysql/quickstart-proxy-test

* IPython approach for updating models:
  - Clone the micro-service of interest
  - In root, create a `.env` file with:
    ```
    POSTGRES_HOST=172.19.0.1
    POSTGRES_PORT=3306
    POSTGRES_DB_NAME=...
    POSTGRES_USERNAME=...
    POSTGRES_PASS=...
    ```
    - `POSTGRES_HOST`: From the shell, run the following to confirm the Gateway IP:
      ```
      docker network ls
      docker network inspect DD-DeCaF
      ```
      (or similarly named)
    - `POSTGRES_DB_NAME`: Find it from a psql shell (run the `\l` command).
    - `POSTGRES_USERNAME/PASS`: Available at lastpass (`GCloud postgres user`)
  - In a linux terminal (use ubuntu for Windows if in Windows):
    ```bash
    cd /mnt/c/.../model-storage
    make pip-compile build
    docker-compose run --rm ipython
    ```
  - In ipython:
    ```python
    from model_storage.app import *
    from model_storage.models import *
    init_app(app, db)
    app.app_context().push()
    Model.query.count()
    ```
