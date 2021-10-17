# life-hacks-api

## Creating a Hack
```
$ curl \
-H "Content-Type: application/json" \
-X POST -d '{"title":"Howdy Partner","details": "This is a hefty hack.", "author":"Master Chief"}' \
<INSERT URL>/v1/hacks
```