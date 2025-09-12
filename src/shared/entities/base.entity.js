import { Utils } from '../utils.js';
import { messages } from '../messages.js';

/**
 * Abstract base class for all entity objects in the system.
 * Provides common functionality including unique ID generation, timestamps, and validation.
 *
 * @abstract
 * @throws {Error} Throws an error if instantiated directly (abstract class)
 */
export class BaseEntity {
  /**
   * Unique identifier for the entity
   * @type {number}
   * @protected
   */
  _id;

  /**
   * Timestamp when the entity was created
   * @type {Date}
   * @private
   */
  #createdAt;

  /**
   * Timestamp when the entity was last updated
   * @type {Date}
   * @private
   */
  #updatedAt;

  /**
   * Static counter used to generate unique IDs
   * @type {number}
   * @static
   */
  static count = 0;

  /**
   * Creates a new BaseEntity instance.
   * Automatically generates a unique ID and sets creation/update timestamps.
   *
   * @constructor
   * @throws {Error} Throws an error if called directly on BaseEntity (abstract class)
   */
  constructor() {
    if (new.target === BaseEntity) {
      const message = messages.error.ABSTRACT_CLASS_OBJECT_CREATION.replace('{0}', 'BaseEntity')
      throw new Error(message);
    }
    this.#generateID();
    this.#createdAt = new Date();
    this.#updatedAt = new Date();
  }

  /**
   * Gets the unique identifier of the entity
   *
   * @readonly
   * @type {number}
   */
  get id() {
    return this._id;
  }

  /**
   * Gets the creation timestamp of the entity
   *
   * @readonly
   * @type {Date}
   */
  get createdAt() {
    return this.#createdAt;
  }

  /**
   * Gets the last update timestamp of the entity
   *
   * @readonly
   * @type {Date}
   */
  get updatedAt() {
    return this.#updatedAt;
  }

  /**
   * Updates the {@link BaseEntity#updatedAt} timestamp to the current time.
   * Should be called whenever the entity is modified.
   *
   * @protected
   */
  _touch() {
    this.#updatedAt = new Date();
  }

  /**
   * Restores the entity's {@link BaseEntity#createdAt} and {@link BaseEntity#updatedAt} timestamps.
   * Should be called when rehydrating the entity from a data source.
   *
   * @protected
   * @param {Date} createdAt - The creation timestamp.
   * @param {Date} updatedAt - The last updated timestamp.
   */
  _restoreTimestamps(createdAt, updatedAt) {
    this.#createdAt = Utils.isValidDate(createdAt) ? createdAt : new Date();
    this.#updatedAt = Utils.isValidDate(updatedAt) ? updatedAt : new Date();
  }

  /**
   * Generates and assigns a unique identifier to the entity.
   *
   * @private
   */
  #generateID() {
    BaseEntity.count++;
    this._id = BaseEntity.count;
  }
};
