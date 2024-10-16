const { SpheronClient, ProtocolEnum } = require("@spheron/storage");

class SpheronStorageService {
  constructor() {
    this.client = new SpheronClient({ token: process.env.SPHERON_TOKEN });
  }

  async uploadFile(file, filename) {
    try {
      const { uploadToken } = await this.client.createSingleUploadToken({
        name: filename,
        protocol: ProtocolEnum.IPFS,
      });

      const response = await this.client.upload(file, {
        protocol: ProtocolEnum.IPFS,
        name: filename,
        uploadToken,
      });

      console.log(`File uploaded successfully. CID: ${response.cid}`);
      return {
        cid: response.cid,
        dynamicUrl: response.dynamicLinks[0],
        staticUrl: response.staticLinks[0]
      };
    } catch (error) {
      console.error('Error uploading file to Spheron:', error);
      throw error;
    }
  }

  async uploadJson(jsonData, filename) {
    try {
      const jsonString = JSON.stringify(jsonData);
      const blob = new Blob([jsonString], { type: 'application/json' });
      return this.uploadFile(blob, filename);
    } catch (error) {
      console.error('Error uploading JSON to Spheron:', error);
      throw error;
    }
  }

  async downloadFile(cid) {
    try {
      const response = await this.client.getFileFromCID(cid);
      return response;
    } catch (error) {
      console.error('Error downloading file from Spheron:', error);
      throw error;
    }
  }

  async listUploads() {
    try {
      const uploads = await this.client.getUploads();
      return uploads;
    } catch (error) {
      console.error('Error listing uploads from Spheron:', error);
      throw error;
    }
  }

  async deleteUpload(uploadId) {
    try {
      await this.client.deleteUpload(uploadId);
      console.log(`Upload ${uploadId} deleted successfully`);
    } catch (error) {
      console.error('Error deleting upload from Spheron:', error);
      throw error;
    }
  }
}

module.exports = new SpheronStorageService();