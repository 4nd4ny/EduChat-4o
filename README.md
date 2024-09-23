# EduChat

This project is based on [GPT-4 Playground](https://github.com/Nashex/gpt4-playground) project by [Nashex](https://github.com/Nashex).

This version is designed for educational institutions aiming to provide all their students with free access to the latest versions of OpenAI's artificial intelligence models. The installation on a server is accomplished easily using few simple commands, enabling quick and efficient implementation of this educational tool.

It's my first React/Next/Typscript/Flex projet. Thanks to ChatGPT, I was able to do all this very quickly, in a learning by doing mood.
I'm teaching full time in Chamblandes's gymnasium (in Switzerland), so I don't have time to maintain this project and make improvements or bug corrections.

To install this project, you must create a .env file in the root folder of the project (same folder as src), with the following entries:

```
REACT_APP_API_KEY=sk-proj-blablabla
REACT_APP_ORG_KEY=org-blablabla
REACT_APP_USER_ID=user-blablabla
REACT_APP_PASSWD=password
```

Note: ORG_KEY and USER_ID will be used for billing calculs later. Not sure I use them in this version.

## Running Locally
To run this project locally, you will need to have [Node.js](https://nodejs.org/en/) installed. Once you have Node.js installed, you can clone this repository and run the following commands:

```bash
yarn install
yarn dev
```

This will start a local server on port 3000. You can then navigate to `localhost:3000` to view the project!

