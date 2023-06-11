/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * ts-to-zod configuration.
 *
 * @type {import("ts-to-zod").TsToZodConfig}
 */
module.exports = [
  {
    name: 'user',
    input: '../common/src/user.ts',
    output: 'src/validation/user.ts',
    jsDocTagFilter: (tags) => tags.map(tag => tag.name).includes('schema')
  },
];
