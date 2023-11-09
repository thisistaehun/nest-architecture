/**
 * @fileoverview Symbols for dependency injection.
 */

/**
 * ----------------------------------------
 * User
 * ----------------------------------------
 */

/**
 * @description User's CQRS Repositories
 */
export const USER_COMMAND_REPOSITORY = Symbol('USER_COMMAND_REPOSITORY');
export const USER_QUERY_REPOSITORY = Symbol('USER_QUERY_REPOSITORY');

/**
 * @description Point's CQRS Repositories
 */
export const POINT_COMMAND_REPOSITORY = Symbol('POINT_COMMAND_REPOSITORY');
export const POINT_QUERY_REPOSITORY = Symbol('POINT_QUERY_REPOSITORY');

/**
 * @description Point's Helpers
 */
export const POINT_CALCULATOR = Symbol('POINT_CALCULATOR');

/**
 * @description Logger
 */
export const DG_LOGGER = Symbol('LOGGER');

/**
 * ----------------------------------------
 * Payment
 * ----------------------------------------
 */
export const PAYMENT_COMMAND_REPOSITORY = Symbol('PAYMENT_COMMAND_REPOSITORY');
export const PAYMENT_QUERY_REPOSITORY = Symbol('PAYMENT_QUERY_REPOSITORY');
