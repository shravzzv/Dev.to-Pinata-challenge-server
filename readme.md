# PinDrop API

[Project demo](https://)

## Description

This is a REST API for the dev.to Pinata challenge.
[Project Source](https://dev.to/devteam/join-us-for-the-the-pinata-challenge-3000-in-prizes-59cb)

## Features

- Restful API design.
- Clean error handling and code design.

## API ROUTES

`/users`

1. `post: /users/signup`
2. `post: /users/signin`
3. `put(private): /users/:id`
4. `delete(private): /users/:id`

`/pins`

1. `get: /pins`
2. `get: /pins/:id`
3. `post(private): /pins`
4. `put(private): /pins/:id`
5. `delete(private): /pins/:id`

## Technologies Used

[![My Skills](https://skillicons.dev/icons?i=express,git,mongodb,nodejs,postman,vscode)](https://skillicons.dev)

## Installation

To install the project, follow these steps:

```bash
git clone https://github.com/shravzzv/Dev.to-Pinata-challenge-server
cd Dev.to-Pinata-challenge-server
npm install
npm run dev
```

## How to Contribute

If you'd like to contribute, follow these steps:

1. Fork the repository on GitHub.
2. Clone your fork locally.

   ```bash
   git clone https://github.com/shravzzv/Dev.to-Pinata-challenge-server
   cd Dev.to-Pinata-challenge-server
   npm install
   npm run dev
   ```

3. Create a new branch for your feature or bug fix.

   ```bash
   git checkout -b feature-or-bug-fix-name
   ```

4. Make your changes, commit them, and push them to your fork.

   ```bash
   git add .
   git commit -m "Your commit message here"
   git push origin feature-or-bug-fix-name
   ```

5. Open a Pull Request on GitHub, comparing your branch to the original repository's `main` branch.

## Issue Tracker

Find a bug or want to request a new feature? Please let us know by submitting an issue.

- [Issue Tracker](https://github.com/shravzzv/Dev.to-Pinata-challenge-server/issues)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
