##                

This is a library management system for the purpose
of practising TypeScript, NestJS, TypeORM, Docker and k8s.

**Tech Stack**:

- NestJs
- Postgresql
- Docker

## Installation

**Project:**

```bash
$ npm install
```

**Docker:**

Since when using colima to manage docker is different from using Docker Desktop.

If using colima, some configuration is needed,
because the default configuration seems not support to change the ownership of the directory in docker.
This may cause a problem when launching the Postgresql container.

```shell
brew install --HEAD colima
```

create /Users/[username]/.lima/_config/override.yml:

please change the [username] as your username.

```yaml
mountType: 9p
mounts:
  - location: "/Users/[username]"
    writable: true
    9p:
      securityModel: mapped-xattr
      cache: mmap
  - location: "~"
    writable: true
    9p:
      securityModel: mapped-xattr
      cache: mmap
  - location: /tmp/colima
    writable: true
    9p:
      securityModel: mapped-xattr
      cache: mmap
```

start colima:

```shell
colima start --mount-type 9p
```

## Running the app

postgresql:

```bash
docker-compose up
```

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```