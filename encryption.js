import crypto from "crypto";

// Initialize AES encryption key
const aesKey = Buffer.from(process.env.AES_KEY, "hex");

/**
 * Encrypt data using AES algorithm.
 * @param {string} data - The data to encrypt.
 * @param {string} algorithm - The encryption algorithm to use (aes-256-cbc).
 * @returns {object} - Encrypted data object containing algorithm, iv, and encrypted data.
 */
export const encrypt = (data, algorithm = "aes-256-cbc") => {
  try {
    if (algorithm === "aes-256-cbc") {
      const aesIv = crypto.randomBytes(16); // Initialization vector for AES
      const cipher = crypto.createCipheriv(algorithm, aesKey, aesIv);
      let encryptedData = cipher.update(data, "utf8", "hex");
      encryptedData += cipher.final("hex");
      return { algorithm, iv: aesIv.toString("hex"), encryptedData };
    } else {
      throw new Error("Unsupported encryption algorithm");
    }
  } catch (error) {
    console.error("Encryption error:", error.message);
    throw error;
  }
};

/**
 * Decrypt data using AES algorithm.
 * @param {object} encryptedObject - The encrypted object containing data, algorithm, and iv.
 * @returns {string} - Decrypted data.
 */
export const decrypt = (encryptedObject) => {
  try {
    const { algorithm, encryptedData, iv } = encryptedObject;
    if (algorithm === "aes-256-cbc") {
      const decipher = crypto.createDecipheriv(
        algorithm,
        aesKey,
        Buffer.from(iv, "hex")
      );
      let decryptedData = decipher.update(encryptedData, "hex", "utf8");
      decryptedData += decipher.final("utf8");
      return decryptedData;
    } else {
      throw new Error("Unsupported decryption algorithm");
    }
  } catch (error) {
    console.error("Decryption error:", error.message);
    throw error;
  }
};
