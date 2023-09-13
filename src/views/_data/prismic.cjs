require('dotenv').config();

const prismicH = require('@prismicio/helpers');
const prismic = require('@prismicio/client');
const axios = require('axios');

const PRISMIC_REPO = process.env.PRISMIC_REPOSITORY;
const PRISMIC_TOKEN = process.env.PRISMIC_ACCESS_TOKEN;

const axiosAdapter = async (url, options = {}) => {
  try {
    const response = await axios({ url, ...options });
    return {
      ok: response.status >= 200 && response.status < 300,
      status: response.status,
      statusText: response.statusText,
      json: () => Promise.resolve(response.data),
    };
  } catch (error) {
    if (error.response) {
      return {
        ok: false,
        status: error.response.status,
        statusText: error.response.statusText,
        json: () => Promise.resolve(error.response.data),
      };
    }
    throw error;
  }
};

const client = prismic.createClient(PRISMIC_REPO, {
  accessToken: PRISMIC_TOKEN,
  fetch: axiosAdapter,
});

async function fetchAbout() {
  return client.getSingle('about');
}

async function fetchHome() {
  return client.getSingle('home');
}

async function fetchMeta() {
  return client.getSingle('meta');
}

function gatherAssets(home, about) {
  const assets = [];

  return assets;
}

async function fetchPrismicData() {
  const [about, home, meta] = await Promise.all([
    fetchAbout(),
    fetchHome(),
    fetchMeta(),
  ]);

  const assets = gatherAssets(home, about);

  const data = {
    assets,
    about,
    home,
    meta,
    navigation,
    collection,
    preloader,
    collections,
    products,
    ...prismicH,
  };

  return data;
}

// module.exports = fetchPrismicData;
