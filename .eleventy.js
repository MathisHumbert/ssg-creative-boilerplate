import htmlmin from "html-minifier";
import EleventyVitePlugin from "@11ty/eleventy-plugin-vite";
import EleventyPugPlugin from "@11ty/eleventy-plugin-pug";
import glsl from "vite-plugin-glsl";

export default async function (eleventyConfig) {
  eleventyConfig.setServerOptions({
    port: 3000,
  });

  eleventyConfig.addPlugin(EleventyPugPlugin);
  eleventyConfig.addPlugin(EleventyVitePlugin, {
    tempFolderName: ".11ty-vite",
    viteOptions: {
      publicDir: "public",
      root: "src",
      plugins: [glsl()],
      appType: "spa",
    },
  });

  eleventyConfig.addPassthroughCopy("public");
  eleventyConfig.addPassthroughCopy("src/app");
  eleventyConfig.addPassthroughCopy("src/fonts");
  eleventyConfig.addPassthroughCopy("src/styles");
  eleventyConfig.setServerPassthroughCopyBehavior("copy");

  eleventyConfig.addTransform("htmlmin", (content, outputPath) => {
    if (outputPath && outputPath.endsWith(".html")) {
      const minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      });
      return minified;
    }
    return content;
  });

  return {
    dir: {
      input: "src/views",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    passthroughFileCopy: true,
    htmlTemplateEngine: "pug",
  };
}
