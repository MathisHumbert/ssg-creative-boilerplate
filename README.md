## Mathis Humbert

A boilerplate template for creative websites using JavaScript (OOP) with no framework, WebGL via THREE and GSAP, working with 11ty for SSG.

### Description

This boilerplate is a modern version of "bizarroilerplate" that you can find over here https://github.com/bizarro/bizarroilerplate.

I changed some part of this template bases for my own use.

I replaced Webpack with Vite.js and updated all of the packages to have an up to date template.

I also replace SSR with SSG to create a static website, I'm using eleventy for this part.

It's using Prismic as a CMS, feel free to replace it with any other CMS of your choice.

#### Eleventy

This file is used to configure our eleventy project and to build our website.

#### Client

All of the client code is located in the SRC folder.

The APP folder is for the javascript code.

The FONTS folder is for your fonts.

The STYLES folder is for the scss code.

The VIEWS folder is for your html files, actualy using PUG as an html template.

The VIEWS folder is splited intot two parts \_data for the fetching of the content and the \_includes for the PUG part.

#### Assets

All of your assets are located in the PUBLIC folder in the root of the template.

## Getting Started

### Installation

Install the project dependencies using:

```sh
pnpm install
```

### Dive In!

Kickstart the development environment:

```sh
pnpm dev
```

Navigate to http://localhost:3000/

### Build

To generate a static build of the project:

```sh
pnpm build
```

### Deploy

You can easily deploy it on vercel for free, don't forget to set the environment variables:

## Credits

All credits goes to Luis Bizarro's "bizarroilerplate" that you can find over here https://github.com/bizarro/bizarroilerplate
