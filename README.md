# Next.js Tesclone Shop App
To run locally database is required 

```
docker-compose up -d
```

* -d means __detached__

MongoDB local URL:

```
MONGO_URL=mongodb://localhost:27017/tesclonedb
```

## Configure environment variables
Rename the file __.env.template__ to __.env__


## Fill the database with test informatino 
Call:
```
http://localhost:3000/api/seed
```


## Sample Webpage
https://tesclone-shop.herokuapp.com/