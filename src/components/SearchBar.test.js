import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import SearchBar from '@/components/SearchBar.vue';

describe('SearchBar', () => {
  it('renders placeholder and emits input value', async () => {
    const wrapper = mount(SearchBar, {
      props: {
        modelValue: '',
      },
    });

    expect(wrapper.find('input').attributes('placeholder')).toContain('Поиск по меню');

    await wrapper.find('input').setValue('капуч');

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['капуч']);
  });

  it('clears input on clear button click', async () => {
    const wrapper = mount(SearchBar, {
      props: {
        modelValue: 'капуч',
      },
    });

    await wrapper.get('[aria-label="Очистить поиск"]').trigger('click');

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['']);
  });
});
