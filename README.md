# Notes App

Built using Bun, Hono, Drizzle ORM, and PostgreSQL. This project provides users with the ability to register an account and perform notes operations such as create, update, delete, and view a note.

### API Documentation

The REST API is documented with openAPI in scalar. Available at `documentation` branch make sure to checkout the branch

```
git checkout documentation
```

once the docker container running, the scalar link is available on
http://localhost:3000/api/v1/reference

### Full App

the full notes app, using react as frontend, coupled with tRPC, available at `frontend` branch.

```
git checkout frontend
```

## Getting Started

Prerequisites:

- Docker
- Bun

Clone the Repository

```
git clone https://github.com/your-username/notes-app.git

cd notes-app
```

Create a .env

```
DB_USER=hononotes
DB_PASSWORD=hononotes
DB_HOST=db // name of db container in docker compose
DB_PORT=5432
DB_NAME=hononotes
DB_URL=postgres://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME

JWT_SERCRET=secret
```

Run with Docker

```
docker compose up --build
```

push database schema

- run shell in api container

```
docker exec -it <api-container-name/sha> /bin/bash
```

- run script

```
bun run db:push
```

### License

This project is licensed under the MIT License.
