import { messages } from "../messages.js";
import { Utils } from "../utils.js";

/**
 * Represents a base entity with an id, creation date, and update date.
 * @class
 */
export class BaseEntity {
  _id;
  #createdAt;
  #updatedAt;

  /**
   * Represents the total count of objects of a base entity.
   * Useful for keeping track of auto-increment id.
   * @static
   */
  static count = 0;

  /**
   * Initializes members of the base entity.
   */
  constructor() {
    if (new.target === BaseEntity) {
      const message = messages.error.ABSTRACT_CLASS_OBJECT_CREATION.replace("{0}", "BaseEntity")
      throw new Error(message);
    }
    this.#generateID();
    this.#createdAt = new Date();
    this.#updatedAt = new Date();
  }

  /**
   * @returns {number} The unique ID of the entity.
   */
  get id() {
    return this._id;
  }

  /**
   * @returns {Date} The creation date of the entity.
   */
  get createdAt() {
    return this.#createdAt;
  }

  /**
   * @returns {Date} The last update date of the entity.
   */
  get updatedAt() {
    return this.#updatedAt;
  }

  /**
   * Update the `updatedAt` timestamp.
   * Should be called whenever the entity is modified.
   * @protected
   */
  _touch() {
    this.#updatedAt = new Date();
  }

  /**
   * Restore the `createdAt` and `updatedAt` timestamps.
   * Should be called whenever the entity is restored from a database.
   * @protected
   * @param {Date} createdAt - The creation timestamp.
   * @param {Date} updatedAt - The last updated timestamp.
   */
  _restoreTimestamps(createdAt, updatedAt) {
    this.#createdAt = Utils.isValidDate(createdAt) ? createdAt : new Date();
    this.#updatedAt = Utils.isValidDate(updatedAt) ? updatedAt : new Date();
  }

  /**
   * Generates a unique ID to the entity.
   * @private
   */
  #generateID() {
    BaseEntity.count++;
    this._id = BaseEntity.count;
  }
};
