import type { OpenNextConfig } from "@opennextjs/cloudflare";

// FullstackBrand — OpenNext Cloudflare config
// Using dummy cache adapters to avoid WORKER_SELF_REFERENCE binding
// which causes first-deploy failures.
const config: OpenNextConfig = {
  default: {
    override: {
      wrapper: "cloudflare-node",
      converter: "edge",
      incrementalCache: "dummy",
      tagCache: "dummy",
      queue: "direct",
    },
  },
  middleware: {
    external: true,
    override: {
      wrapper: "cloudflare-edge",
      converter: "edge",
    },
  },
};

export default config;
