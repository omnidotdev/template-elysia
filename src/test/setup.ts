/**
 * @file Test setup barrel file.
 * Re-exports commonly used test utilities for convenient imports.
 *
 * Global setup (container, migrations, MSW) is handled by preload script
 */

export {
  generateTestToken,
  mswServer,
  TEST_TOKEN,
  TEST_USER_ID,
} from "./setup/mswServer";
export { setupTestContext } from "./setup/testContext";
export { userFactory } from "./factories/user.factory";
export { postFactory } from "./factories/post.factory";
