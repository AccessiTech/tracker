import React from 'react';
import { render, act, waitFor } from '@testing-library/react';
import { EditFieldForm, EditFieldFormProps } from '../EditFieldForm';

describe('EditFieldForm', () => {
  test('renders without crashing', () => {
    const mockProps = {
      
    } as EditFieldFormProps;
    render(<EditFieldForm {...mockProps} />);
  });
});