## Running caffeine locally

* installation:
  * Install nodeJS
  * Install docker
  * Clone caffeine-vue locally
  * go to cmd:
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
    (in this case the ec_model)

## Running services locally

#### warehouse

* installation:
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
  - cmd:
    ```bash
    cd /warehouse
    docker-compose run --rm web flask db upgrade
    docker-compose up
    ```
  - Can be visualized at http://localhost:8000/ (check docker-compose.yml)
  - Tell caffeine-vue where this is: replace in `.env` $VUE_APP_API/warehouse for http://localhost:8000/
