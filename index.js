(async () => {
  for (let index = 0; index < 1000; index++) {
    try {
      const { Octokit } = require("@octokit/core");
      const { paginateRest } = require("@octokit/plugin-paginate-rest");
      const { enterpriseCloud } = require("@octokit/plugin-enterprise-cloud");
      const { retry } = require("@octokit/plugin-retry");

      const { createAppAuth } = require("@octokit/auth-app");

      const auth = createAppAuth({
        id: process.env.TEST_APP_ID,
        privateKey: process.env.TEST_APP_PRIVATE_KEY,
      });

      const installationAuthentication = await auth({
        type: "installation",
        installationId: process.env.TEST_APP_INSTALLATION_ID,
        refresh: true,
      });

      const PluginOctokit = Octokit.plugin(
        paginateRest,
        enterpriseCloud,
        retry
      );
      const octokit = new PluginOctokit({
        auth: installationAuthentication.token,
      });

      await octokit.request("GET /installation/repositories", {
        mediaType: {
          previews: ["machine-man"],
        },
      });

      process.stdout.write(".");
    } catch (error) {
      console.log("Error: ", error);
      process.exit(1);
    }
  }

  console.log("");
})();
