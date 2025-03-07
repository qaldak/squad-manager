import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import Welcome from '../Welcome.vue'

describe('Welcome', () => {
  it('renders properly', () => {
    const wrapper = mount(Welcome, { props: { msg: 'Hello Vitest' } })
    expect(wrapper.text()).toContain('Hello Vitest')
  })
})
