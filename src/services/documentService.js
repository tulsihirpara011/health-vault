const {
  InvalidRequestException,
  NotFoundException,
  AlredayExistsException,
  UnauthorizedException,
  AccessDeniedError,
} = require("../excptions/ApiError");
const {DocumentSchema} = require("../validation/zodDocumentValidation");
const { GeneralResponse } = require("../helpers/genralResponse");
const userRepository = require("../repositories/doucumentRepository");
const messageConstant = require("../constant/messageConstant");
const zodValidateData = require("../validation/index");

class documentService {
    // Create Document
  async addDocument( data, file) {
    console.log(file);
    
    const documentData = {
      // userId,
      // documentType: data.documentType,
      fileName: file.originalname,
      fileStoragePath: fileKey,
      fileType: file.mimetype,
      fileSize: file.size,
      hospitalName: body.hospitalName,
      doctorName: body.doctorName,
      remarks: body.remarks || null,
      reportDate: body.reportDate || null,
      OCRStatus: "Pending",
    };
  console.log("documentData",documentData);
  
    const validation = await zodValidateData(DocumentSchema, documentData);
    if (!validation.success) {
      throw new InvalidRequestException("Validation failed", validation.error);
    }
    const validatedData = validation.data || {};
    const newDocument = await userRepository.addDocument(validatedData);
    return newDocument;
  }
  //get document by id
  async getDocumentById(id) {
    if (!id) {
      throw new InvalidRequestException(messageConstant.DOCUMENT_NOT_FOUND);
    }
    return await userRepository.getDocumentById(id);
    if (!result) {
      throw new InvalidRequestException(messageConstant.INVALID_REQUEST);
    }
    return result;
  }

  //get document list
  async getDocumentList() {
    return await userRepository.getDocumentList();
  }

  //update document by one filed
  async updateDocument(id, data) {
    if (!id) {
      throw new InvalidRequestException(messageConstant.INVALID_REQUEST);
    }
    const validation = await zodValidateData(updateDocumentSchema, data);
    if (!validation.success) {
      throw new InvalidRequestException("Validation failed", validation.error);
    }
    const validatedData = validation.data || {};
    const updatedDocument = await userRepository.updateDocument(id, validatedData);
    return updatedDocument;
  }

  //delete document by id
  async deleteDocument(id) {
      if (!id) {
        throw new InvalidRequestException(messageConstant.INVALID_REQUEST);
      }
      const result = await userRepository.deleteDocument(id);
      if (!result) {
        throw new NotFoundException(messageConstant.DOCUMENT_NOT_FOUND);
      }
    }
}

module.exports = new documentService();
