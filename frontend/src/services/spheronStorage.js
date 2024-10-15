import { SpheronClient, ProtocolEnum } from "@spheron/storage";

class SpheronStorage {
  constructor() {
    this.client = new SpheronClient({ token: process.env.REACT_APP_SPHERON_TOKEN });
  }

  async uploadFile(file) {
    try {
      const { uploadToken } = await this.client.createSingleUploadToken({
        name: file.name,
        protocol: ProtocolEnum.IPFS,
      });

      const response = await this.client.upload(file, {
        protocol: ProtocolEnum.IPFS,
        name: file.name,
        uploadToken,
      });

      return response.publicUrl;
    } catch (error) {
      console.error("Error uploading file to Spheron:", error);
      throw error;
    }
  }

  async downloadFile(cid) {
    try {
      const response = await this.client.getFileFromCID(cid);
      return response;
    } catch (error) {
      console.error("Error downloading file from Spheron:", error);
      throw error;
    }
  }
}

export default new SpheronStorage();