
# Javascript character manager

This is a simple webapp written in javascript to manage characters at https://character-database.becode.xyz/

You can find a live version of it [here](https://sdegueldre.github.io/CharacterManager/)

## Usage guide

### Installing dependencies

This project uses [npm](https://www.npmjs.com/) to download its dependencies. To install everything it needs, use:

```bash
npm install
```

### Running the project

This project is built using [Parcel](https://parceljs.org/). To run this app in a dev environment with hot-reloading (rebuild and reload a file when it's been modified on disk), use:

```bash
npm run dev
```

While this works well for css, some problems occur (like all the characters being duplicated at the end) with HTML and JS because the javascript generates HTML on the fly to add the characters after the server response. Simply refreshing the page fixes those issues.

The dev script will serve the index at `http://localhost:1234`.

### Building for production

If you want to deploy this application (like the live demo you see), you must first build it with this command:

```bash
npm run build
```

It will then be available in the `dist` folder (you might want to delete the dist folder before doing this however or some files might be duplicated from a previous `dev` run). On top of compiling the sass to css it will also minify all the javascript for faster loading and such.

## Files

* [index.html](./index.html): Contains the skeleton of the app as well as a single, empty, 'character card' with a big plus in it for creating new characters on the server. All other characters will be inserted before it when they're loaded.
* [style.scss](./style.scss): A [SASS](https://sass-lang.com/) style sheet that takes care of the layout, style and such.
* [script.js](./script.js): The core functionality resides here. It also contains some HTML templates as const template literals, which you might need to modify if you want to mess with the layout and SASS isn't cutting it. 

## Integrated libraries

The template I used integrates some libraries and tools:

* [Bootstrap](https://getbootstrap.com/): A CSS framework containing a lot of useful components, both in CSS and JavaScript. This template uses the [Litera](https://bootswatch.com/litera/) Bootstrap template.
* [Font Awesome](https://fontawesome.com/): A library of icons that we can use to display nice little icons everywhere. There are even cats in it :smiley_cat: !
* [Markdown](https://www.npmjs.com/package/markdown): A library that lets you convert markdown to HTML for displaying. If you're wondering what style of markdown this app supports, look here!

Also some transitive dependencies (like jQuery for bootstrap), you can find the compete list in the package.json

## Closing words

This project was hacked together in about 10 hours, lots of things are suboptimal or plain ugly, and things might break if you poke at them too much. This is a learning project, so don't take it too seriously. Feel free however to make pull request for improvements or open issues, I can't say for sure I'll be able to come back to this project but it's nice to get some feedback on what could be improved!

If however you have some problems with the [API](https://character-database.becode.xyz/) that this app uses, and want to tell someone that it is awfully broken or insecure, direct all complaints to [@nicolas-van](https://github.com/nicolas-van)

Godspeed, Sam.
