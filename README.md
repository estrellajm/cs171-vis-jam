# CS-171 Vis JAM

![image](https://github.com/estrellajm/cs171-vis-jam/assets/104507318/3d2b9abc-b688-4150-ae57-aa98f0d0cfe5)


## Hosting
https://cs171-vis-jam.web.app/

Visit the link above to view the live server.

## Process Book

Below is the link to our team's process book

[Process Book - Google Drive](https://docs.google.com/document/d/1S9Q-4hUzh9FjuUb7bH_uFZvz2amB4Qqf9EyxCqESPmo/edit#heading=h.r7owtswhdbft)

## Notes on Comments

The comments have been made to all the D3 components, which are located within the following directory

```
src/app/main/components
```

Within components, you can find the components where the D3 is built.
```
.
├── bars
│   └── bars.component.ts
├── globe
│   └── globe.component.ts
├── radar
│   └── radar.component.ts
├── rotating-earth
│   └── rotating-earth.component.ts
└── scatter
    └── scatter.component.ts
```

## Technology Used

- Angular (Frontend Framework)
- NGXS (FE Data store)
- Firebase (Hosting)
- Github (Repository)
- Github Actions (CI/CD)


## Run Locally
To start this project locally, you need to have the following
- Node
- Angular (optionally you can use the `npx` command)


Once you confirm that you have the project above installed, you'll need to install `node_modules`

Run the command to generate a `node_modules`
```
npm install
```

Finally, in the root of the project run 
```
ng serve
``` 
> **Optionally:** If you only have NodeJS installed, `npx ng serve`

Then visit 
```
http://localhost:4200/
```

## Git Commands

To switch to a new branch
```
git checkout <branch_name>
```
example: `git checkout main`

To create a new branch and immediately check it out
```
git checkout -b <branch_name>
```


## Angular 16
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.2.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
