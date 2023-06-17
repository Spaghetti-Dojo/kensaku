import {EntitiesSearch} from '../../../../sources/js/src/@types'

import {faker} from '@faker-js/faker'
import React from 'react'

import {describe, it, expect} from '@jest/globals'
import {render} from '@testing-library/react'

import {PostTypesSelect} from '../../../../sources/js/src/components/post-types-select'

describe('Post Types Select Component', () => {
  /**
   * @test
   */
  it('render the select to choose post types from', () => {
    let options: EntitiesSearch.PostTypeSelect['options'] = []

    for (let count = 0; count <= 10; ++count) {
      options.push({
        label: faker.random.word(),
        value: faker.word.noun(),
      })
    }

    const {asFragment} = render(<PostTypesSelect options={options} />)

    expect(asFragment()).toMatchSnapshot()
  })
})
