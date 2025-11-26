import { Client } from "@microsoft/microsoft-graph-client";
import { TokenCredentialAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials";
import { ClientSecretCredential } from "@azure/identity";

// Node 18+ has fetch. Guard for older runtimes.
if (typeof fetch !== "function") {
  const mod = await import("node-fetch");
  // eslint-disable-next-line no-global-assign
  global.fetch = mod.default;
}

function makeGraphClient() {
  const tenantId = process.env.TENANT_ID;
  const clientId = process.env.SP_CLIENT_ID;
  const clientSecret = process.env.SP_CLIENT_SECRET;

  if (!tenantId || !clientId || !clientSecret) {
    throw new Error("SharePoint credentials missing: set TENANT_ID, SP_CLIENT_ID, SP_CLIENT_SECRET.");
  }

  const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);
  const authProvider = new TokenCredentialAuthenticationProvider(credential, {
    scopes: ["https://graph.microsoft.com/.default"]
  });

  return Client.initWithMiddleware({ authProvider });
}

export async function resolveSite({ hostname, sitePath, search }) {
  const graph = makeGraphClient();
  if (hostname && sitePath) return graph.api(`/sites/${hostname}:${sitePath}`).get();
  if (search) {
    const res = await graph.api(`/sites`).query({ search }).get();
    return res.value ?? [];
  }
  throw new Error("Provide hostname+sitePath or ?search=term");
}

async function getSiteDriveId(graph, siteId) {
  const drive = await graph.api(`/sites/${siteId}/drive`).get();
  return drive.id;
}

export async function listChildren(siteId, path = "/") {
  const graph = makeGraphClient();
  const driveId = await getSiteDriveId(graph, siteId);
  const enc = encodeURI(path);
  const res = await graph.api(`/drives/${driveId}/root:${enc}:/children`).get();
  return res.value ?? [];
}

export async function downloadFileStream(siteId, path) {
  const graph = makeGraphClient();
  const driveId = await getSiteDriveId(graph, siteId);
  const enc = encodeURI(path);
  return graph.api(`/drives/${driveId}/root:${enc}:/content`).getStream();
}

export async function uploadSmallFile(siteId, path, buffer) {
  const graph = makeGraphClient();
  const driveId = await getSiteDriveId(graph, siteId);
  const enc = encodeURI(path);
  return graph.api(`/drives/${driveId}/root:${enc}:/content`).put(buffer);
}
