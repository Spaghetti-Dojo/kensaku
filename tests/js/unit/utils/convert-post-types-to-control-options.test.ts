import {EntitiesSearch} from '../../../../sources/js/src/@types'

import {faker} from '@faker-js/faker'
import {fromPartial} from '@total-typescript/shoehorn'

import {describe, it, expect} from '@jest/globals'

import {convertPostTypesToControlOptions} from '../../../../sources/js/src/utils/convert-post-types-to-control-options'

describe('Convert Post Types To Control Options', () => {
  /**
   * @test
   */
  it('convert post types to control options', () => {
    const postTypes = []

    for (let count = 0; count <= 10; ++count) {
      postTypes.push(
        fromPartial<EntitiesSearch.EditablePostType>({
          viewable: true,
          slug: faker.word.noun(),
          name: faker.random.word(),
        })
      )
    }

    const options = convertPostTypesToControlOptions(postTypes)
    for (const postType of postTypes) {
      expect(options.findIndex(option => option.value === postType.slug) >= 0).toEqual(true)
    }
  })
})
