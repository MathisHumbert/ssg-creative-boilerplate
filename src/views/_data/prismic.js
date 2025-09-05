import "dotenv/config";
import * as prismicH from "@prismicio/helpers";
import * as prismic from "@prismicio/client";

const PRISMIC_REPO = process.env.PRISMIC_REPOSITORY;
const PRISMIC_TOKEN = process.env.PRISMIC_ACCESS_TOKEN;

const fetchAdapter = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    return {
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      json: () => response.json(),
    };
  } catch (error) {
    throw error;
  }
};

const client = prismic.createClient(PRISMIC_REPO, {
  accessToken: PRISMIC_TOKEN,
  fetch: fetchAdapter,
});

async function fetchAbout() {
  return client.getSingle("about");
}

async function fetchHome() {
  return client.getSingle("home");
}

async function fetchMeta() {
  return client.getSingle("meta");
}

async function fetchPrismicData() {
  const [about, home, meta] = await Promise.all([
    fetchAbout(),
    fetchHome(),
    fetchMeta(),
  ]);

  return {
    about,
    home,
    meta,
    ...prismicH,
  };
}

// export default fetchPrismicData;
