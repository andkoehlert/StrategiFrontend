import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, it, expect } from 'vitest'
import DineMål from '../../components/app/DineMål.vue'

describe('DineMål', () => {
  it('renders a title', async () => {
    const wrapper = await mountSuspended(DineMål, {
      props: {
        totalamount: 0,
        udståendetids: 0,
        totalPotienale: 0
      }
    })

    expect(wrapper.text()).toContain('DINE MÅL')
  })
})
