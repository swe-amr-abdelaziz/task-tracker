import { messages } from "../messages.js";
import { Utils } from "../utils.js";

/**
 * Represents a base entity with an id, creation date, and update date.
 * @class
 */
export class BaseEntity {
  #id;
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
   * @param {Date} [createdAt=new Date()] - The creation timestamp.
   * @param {Date|null} [updatedAt=null] - The last updated timestamp.
   */
  constructor(createdAt = new Date(), updatedAt = null) {
    if (new.target === BaseEntity) {
      Utils.logErrorMsg(messages.error.BASE_ENTITY_OBJECT_CREATION);
    }
    this.#generateID();
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  /**
   * @returns {number} The unique ID of the entity.
   */
  get id() {
    return this.#id;
  }

  /**
   * Generates a unique ID to the entity.
   * @private
   */
  #generateID() {
    BaseEntity.count++;
    this.#id = BaseEntity.count;
  }

  /**
   * @returns {Date} The creation date of the entity.
   */
  get createdAt() {
    return this.#createdAt;
  }

  /**
   * @param {Date} createdAt - The creation date (cannot be reassigned once set).
   */
  set createdAt(createdAt) {
    if (this.#createdAt)
      return;

    if (!Utils.isValidDate(createdAt)) {
      Utils.logErrorMsg(messages.error.INVALID_CREATED_AT);
    }
    this.#createdAt = createdAt;
  }

  /**
   * @returns {Date|null} The last update date of the entity.
   */
  get updatedAt() {
    return this.#updatedAt;
  }

  /**
   * @param {Date|null} updatedAt - The updated date (must be valid or null).
   */
  set updatedAt(updatedAt = null) {
    if (updatedAt && !Utils.isValidDate(updatedAt)) {
      Utils.logErrorMsg(messages.error.INVALID_UPDATED_AT);
    }
    this.#updatedAt = updatedAt;
  }
};
