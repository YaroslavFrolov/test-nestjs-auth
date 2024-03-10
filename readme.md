# **Start application**

- Clone repo

- Create the `.env` file in root of project with next content:

  ```bash
    PORT_APP=
    PORT_DB=
    PORT_REDIS=

    DB_NAME=
    DB_USER=
    DB_PASS=

    ACCESS_TOKEN_KEY=
    REFRESH_TOKEN_KEY=
  ```

  see the `.env.example` file as example.

- Execute `docker-compose up` and you are ready to go!..)

<br />

# Features

- By default there is admin user with the "admin" role and with next credentials:

  ```json
  {
    "name": "admin",
    "password": "123456"
  }
  ```

<br />

- You can **register** new user (with the "user" role) - execute `POST http://localhost:{PORT_APP}/auth/sign-up` with next body

  ```json
  {
    "name": "your_name",
    "password": "your_password"
  }
  ```

<br />

- You can **login** - execute `POST http://localhost:{PORT_APP}/auth/sign-in` with next body

  ```json
  {
    "name": "some_name",
    "password": "some_password"
  }
  ```

  In response you will get `access_token` (ttl = 4min) and `refresh_token` (ttl = 8min). Save them to clipboard.

<br />

- There are protected routes:

  - `GET http://localhost:{PORT_APP}/api/protected-data-for-role-user` - available for users with role "user" or "admin"
  - `GET http://localhost:{PORT_APP}/api/protected-data-for-role-admin` - available only for users with role "admin"

  Don't forget add the **`Authorization`** header with value **`Bearer {access_token}`**

<br />

- You can **refresh** tokens - execute `POST http://localhost:{PORT_APP}/auth/refresh-tokens` with next body:

  ```json
  {
    "refresh_token": "your_refresh_token"
  }
  ```

  In response you will get access_token (ttl = 4min) and refresh_token (ttl = 8min). Save them to clipboard.

<br />

- You can **logout** - execute `POST http://localhost:{PORT_APP}/auth/sign-out` with next body:

  ```json
  {
    "refresh_token": "your_refresh_token"
  }
  ```

  And don't forget add the **`Authorization`** header with value **`Bearer {access_token}`**

<br />

- And bonus - you can **logout from all devices** (user can login on three devices maximum) - just execute `POST http://localhost:{PORT_APP}/auth/sign-out-all` with next body:

  ```json
  {
    "refresh_token": "your_refresh_token"
  }
  ```

  And don't forget add the **`Authorization`** header with value **`Bearer {access_token}`**

<br />
<br />
<br />

# **Task description**

- Створити функціонал авторизації і аутентифікації на базі фреймворку NestJS
- База даних - PostgreSQL
- Використати будь-яку зручну ORM
