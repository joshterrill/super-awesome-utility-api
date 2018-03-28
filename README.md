# super-awesome-utility-api

A super awesome utility API that has various endpoints that are useful during development. All saved records get stored in a collection that has a naming convention of `<your ip address>-<collection name>`. These collections will be deleted after 30 minutes of inactivity.

## Todo

* Add more useful endpoints


## installation / running

```
git clone https://github.com/joshterrill/super-awesome-utility-api
cd super-awesome-utility-api/
npm install
```

Before running `npm run dev` or `npm start` to start the project, you'll need to rename `.env.example` to just `.env` and replace the values in it with real values for the `MLAB_DB` and `MLAB_URL` variables.

## endpoints

#### Get languages and dialects

```
GET /api/get-languages-dialects
Content-Type: application/json
```

#### Generate random identity

```
GET /api/generate-identity
Content-Type: application/json
```

#### Generate many random identities

```
GET /api/generate-identity/:numberOfIdentities
Content-Type: application/json
```

#### Save object to collection

```
POST /api/database/:collectionName
Content-Type: application/json
Request Body: any kind of object
```

#### Update saved object in collection

```
PUT /api/database/:collectionName/:id
Content-Type: application/json
Request Body: any kind of object
```

#### Get all objects saved in collection

```
GET /api/database/:collectionName
Content-Type: application/json
```

#### Get a single object saved in collection

```
GET /api/database/:collectionName/:id
Content-Type: application/json
```

#### Delete object in collection

```
DELETE /api/database/:collectionName/:id
Content-Type: application/json
```
