import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { del, head, put } from '@vercel/blob';

@Injectable()
export class StencilStorage {
  private readonly blobToken = process.env.BLOB_READ_WRITE_TOKEN?.trim() ?? '';

  private assertConfigured() {
    if (!this.blobToken) {
      throw new ServiceUnavailableException('Stencil storage is unavailable because BLOB_READ_WRITE_TOKEN is not configured on the server.');
    }
  }

  getAssetPublicUrl(relativePath: string) {
    const safeRelativePath = relativePath.replace(/^\/+/, '');
    return `/v1/stencil/files/${safeRelativePath.replace(/\\/g, '/')}`;
  }

  async saveBuffer(relativePath: string, buffer: Buffer, options?: { contentType?: string }) {
    this.assertConfigured();
    const safeRelativePath = relativePath.replace(/^\/+/, '');
    await put(safeRelativePath, buffer, {
      access: 'private',
      addRandomSuffix: false,
      token: this.blobToken,
      contentType: options?.contentType,
    });

    return {
      relativePath: safeRelativePath,
      publicUrl: this.getAssetPublicUrl(safeRelativePath),
    };
  }

  async readBuffer(relativePath: string) {
    this.assertConfigured();
    const safeRelativePath = relativePath.replace(/^\/+/, '');
    const blob = await head(safeRelativePath, { token: this.blobToken });
    const response = await fetch(blob.url, {
      headers: {
        Authorization: `Bearer ${this.blobToken}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to read blob ${safeRelativePath}`);
    }

    return Buffer.from(await response.arrayBuffer());
  }

  async deleteBuffer(relativePath: string) {
    this.assertConfigured();
    const safeRelativePath = relativePath.replace(/^\/+/, '');
    await del(safeRelativePath, { token: this.blobToken });
  }
}
