const { any } = require("zod");
const { db } = require("../config/db");
const { session } = require("../models/session");
const { eq, and } = require("drizzle-orm");
const { Document } = require("../models/Document");

class documentRepository
{  // Create Document
  async addDocument(data) {
    return await db
      .insert(Document)
      .values(data)
      .returning();
  }
  //get document by id
  async getDocumentById(id) {
    const result = await db
      .select()
      .from(Document)
      .where(eq(Document.id, id));
    return result[0] || null;
  }
  //get document list
  async getDocumentList() {
    return await db
      .select()
      .from(Document);
  }

  //soft delete
  async deleteDocument(id) {
    const result = await db
      .update(Document)
      .set({
        softDelete: true,
      })
      .where(and(eq(Document.id, id), eq(Document.softDelete, false)))
      .returning();

    return result[0];
  }

  //permanent delete document by id
  async permanentDeleteDocument(id) {
    const result = await db
      .delete(Document)
      .where(eq(Document.id, id))
      .returning();
    return result[0] || null;
  }
}

module.exports = new documentRepository();
