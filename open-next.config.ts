import type { OpenNextConfig } from "@opennextjs/cloudflare";

// FullstackBrand — OpenNext Cloudflare config
// Using dummy cache adapters to avoid WORKER_SELF_REFERENCE binding
const config: OpenNextConfig = {
  default: {
    override: {
      wrapper: "cloudflare-node",
      converter: "edge",
      proxyExternalRequest: "fetch",
      incrementalCache: "dummy",
      tagCache: "dummy",
      queue: "direct",
    },
  },
  edgeExternals: ["node:crypto"],
  middleware: {
    external: true,
    override: {
      wrapper: "cloudflare-edge",
      converter: "edge",
      proxyExternalRequest: "fetch",
      incrementalCache: "dummy",
      tagCache: "dummy",
      queue: "direct",
    },
  },
};

export default config;
