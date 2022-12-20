module.exports = {
  plugins: [
    {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        // The property ID; the tracking code won't be generated without it
        trackingIds: [
            "G-60J37YERL9",
          ],
        pluginConfig: {
        // Defines where to place the tracking script - `true` in the head and `false` in the body
        head: true,
        },
      },
    },
    'gatsby-plugin-resolve-src',
    'gatsby-plugin-sass',
    'gatsby-plugin-react-helmet',
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/assets/images`
      }
    },
    'gatsby-plugin-react-leaflet'
  ]
};
