<h1 align="center">
  <img alt="logo" src="./assets/images/fhir-icon.png" width="124px" style="border-radius:10px"/><br/>
FHIR React Native App </h1>

> This Project is based on [Obytes starter](https://starter.obytes.com)

## Requirements

- [React Native dev environment ](https://reactnative.dev/docs/environment-setup)
- [Node.js LTS release](https://nodejs.org/en/)
- [Git](https://git-scm.com/)
- [Watchman](https://facebook.github.io/watchman/docs/install#buildinstall), required only for macOS or Linux users
- [Pnpm](https://pnpm.io/installation)
- [Cursor](https://www.cursor.com/) or [VS Code Editor](https://code.visualstudio.com/download) ⚠️ Make sure to install all recommended extension from `.vscode/extensions.json`

## 👋 Quick start

Clone the repo to your machine and install deps :

```sh
git clone https://github.com/bqfan/fhir-app

cd ./fhir-app

pnpm install
```

Copy `env.development.example` as `.env.development` and set `MEDPLUM_CLIENT_ID` in `.env.development` in where `MEDPLUM_CLIENT_ID` can be retrieved from https://app.medplum.com/ClientApplication.

```sh
vim ~/.zshrc
```

To run the app on ios

```sh
pnpm ios
```

To run the app on Android

```sh
pnpm android
```

## 📸 Screen shots

<img src="/assets/images/screenshots/splash-screen.png" alt="splash screen" width=30%><img src="/assets/images/screenshots/onboarding.png" alt="onboarding screen" width=30%><img src="/assets/images/screenshots/login-screen.png" alt="login screen" width=30%><img src="/assets/images/screenshots/patient-list.png" alt="patient list" width=30%><img src="/assets/images/screenshots/patient-screen.png" alt="patient screen" width=30%><img src="/assets/images/screenshots/themes.png" alt="themes" width=30%><img src="/assets/images/screenshots/dark-theme.png" alt="dark-theme" width=30%>

## ✍️ Documentation

- [Rules and Conventions](https://starter.obytes.com/getting-started/rules-and-conventions/)
- [Project structure](https://starter.obytes.com/getting-started/project-structure)
- [Environment vars and config](https://starter.obytes.com/getting-started/environment-vars-config)
- [UI and Theming](https://starter.obytes.com/ui-and-theme/ui-theming)
- [Components](https://starter.obytes.com/ui-and-theme/components)
- [Forms](https://starter.obytes.com/ui-and-theme/Forms)
- [Data fetching](https://starter.obytes.com/guides/data-fetching)
- [Contribute to starter](https://starter.obytes.com/how-to-contribute/)
