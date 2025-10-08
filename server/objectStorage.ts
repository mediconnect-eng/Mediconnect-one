import { Storage, File } from "@google-cloud/storage";
import { Response } from "express";
import { randomUUID } from "crypto";
import {
  ObjectAclPolicy,
  ObjectPermission,
  canAccessObject,
  getObjectAclPolicy,
  setObjectAclPolicy,
} from "./objectAcl";

const REPLIT_SIDECAR_ENDPOINT = "http://127.0.0.1:1106";

// The object storage client is used to interact with the object storage service.
export const objectStorageClient = new Storage({
  credentials: {
    audience: "replit",
    subject_token_type: "access_token",
    token_url: `${REPLIT_SIDECAR_ENDPOINT}/token`,
    type: "external_account",
    credential_source: {
      url: `${REPLIT_SIDECAR_ENDPOINT}/credential`,
      format: {
        type: "json",
        subject_token_field_name: "access_token",
      },
    },
    universe_domain: "googleapis.com",
  },
  projectId: "",
});

export class ObjectNotFoundError extends Error {
  constructor() {
    super("Object not found");
    this.name = "ObjectNotFoundError";
    Object.setPrototypeOf(this, ObjectNotFoundError.prototype);
  }
}

// The object storage service is used to interact with the object storage service.
export class ObjectStorageService {
  constructor() {}

  // Gets the public object search paths.
  getPublicObjectSearchPaths(): Array<string> {
    const pathsStr = process.env.PUBLIC_OBJECT_SEARCH_PATHS || "";
    const paths = Array.from(
      new Set(
        pathsStr
          .split(",")
          .map((path) => path.trim())
          .filter((path) => path.length > 0)
      )
    );
    if (paths.length === 0) {
      throw new Error(
        "PUBLIC_OBJECT_SEARCH_PATHS not set. Create a bucket in 'Object Storage' " +
          "tool and set PUBLIC_OBJECT_SEARCH_PATHS env var (comma-separated paths)."
      );
    }
    return paths;
  }

  // Gets the private object directory.
  getPrivateObjectDir(): string {
    const privateDir = process.env.PRIVATE_OBJECT_DIR || "";
    if (privateDir.length === 0) {
      throw new Error(
        "PRIVATE_OBJECT_DIR not set. Create a bucket in 'Object Storage' " +
          "tool and set PRIVATE_OBJECT_DIR env var."
      );
    }
    return privateDir;
  }

  // Searches for a public object by file path.
  async searchPublicObject(filePath: string): Promise<File | null> {
    const searchPaths = this.getPublicObjectSearchPaths();
    for (const searchPath of searchPaths) {
      const [bucketName, ...pathParts] = searchPath.split("/").filter(Boolean);
      const pathPrefix = pathParts.join("/");
      const fullPath = pathPrefix
        ? `${pathPrefix}/${filePath}`
        : filePath;
      const bucket = objectStorageClient.bucket(bucketName);
      const file = bucket.file(fullPath);
      const [exists] = await file.exists();
      if (exists) {
        return file;
      }
    }
    return null;
  }

  // Downloads an object and sends it as a response.
  async downloadObject(objectFile: File, res: Response): Promise<void> {
    const [metadata] = await objectFile.getMetadata();
    const contentType = metadata.contentType || "application/octet-stream";
    res.setHeader("Content-Type", contentType);
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${objectFile.name.split("/").pop()}"`
    );
    objectFile.createReadStream().pipe(res);
  }

  // Gets the object entity file from the object path.
  async getObjectEntityFile(objectPath: string): Promise<File> {
    const privateDir = this.getPrivateObjectDir();
    const [bucketName, ...pathParts] = privateDir.split("/").filter(Boolean);
    const pathPrefix = pathParts.join("/");
    const normalizedPath = objectPath.replace(/^\/objects\//, "");
    const fullPath = pathPrefix
      ? `${pathPrefix}/${normalizedPath}`
      : normalizedPath;
    const bucket = objectStorageClient.bucket(bucketName);
    const file = bucket.file(fullPath);
    const [exists] = await file.exists();
    if (!exists) {
      throw new ObjectNotFoundError();
    }
    return file;
  }

  // Gets a presigned URL for uploading an object entity.
  async getObjectEntityUploadURL(): Promise<string> {
    const privateDir = this.getPrivateObjectDir();
    const [bucketName, ...pathParts] = privateDir.split("/").filter(Boolean);
    const pathPrefix = pathParts.join("/");
    const objectId = randomUUID();
    const fullPath = pathPrefix ? `${pathPrefix}/${objectId}` : objectId;
    const bucket = objectStorageClient.bucket(bucketName);
    const file = bucket.file(fullPath);
    const [url] = await file.getSignedUrl({
      version: "v4",
      action: "write",
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
      contentType: "application/octet-stream",
    });
    return url;
  }

  // Normalizes the object entity path from the upload URL.
  normalizeObjectEntityPath(uploadURL: string): string {
    const url = new URL(uploadURL);
    const pathParts = url.pathname.split("/").filter(Boolean);
    // Remove the bucket name (first part)
    pathParts.shift();
    const objectPath = pathParts.join("/");
    return `/objects/${objectPath}`;
  }

  // Tries to set the ACL policy for an object entity.
  // Returns the normalized object path if successful.
  async trySetObjectEntityAclPolicy(
    uploadURL: string,
    aclPolicy: ObjectAclPolicy
  ): Promise<string> {
    const objectPath = this.normalizeObjectEntityPath(uploadURL);
    const objectFile = await this.getObjectEntityFile(objectPath);
    await setObjectAclPolicy(objectFile, aclPolicy);
    return objectPath;
  }

  // Checks if a user can access an object entity.
  async canAccessObjectEntity({
    objectFile,
    userId,
    requestedPermission,
  }: {
    objectFile: File;
    userId?: string;
    requestedPermission: ObjectPermission;
  }): Promise<boolean> {
    return canAccessObject({ userId, objectFile, requestedPermission });
  }

  // Uploads a buffer to object storage and returns the normalized path
  async uploadBuffer(buffer: Buffer, contentType: string = "application/pdf"): Promise<string> {
    const privateDir = this.getPrivateObjectDir();
    const [bucketName, ...pathParts] = privateDir.split("/").filter(Boolean);
    const pathPrefix = pathParts.join("/");
    const objectId = randomUUID();
    const fullPath = pathPrefix ? `${pathPrefix}/${objectId}` : objectId;
    const bucket = objectStorageClient.bucket(bucketName);
    const file = bucket.file(fullPath);

    await file.save(buffer, {
      metadata: {
        contentType: contentType,
      },
    });

    return `/objects/${pathPrefix ? `${pathPrefix}/` : ""}${objectId}`;
  }
}
