import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { store } from '@Store/index';
import Introduction from "@Pages/main";

test('renders introduction section with user profile', () => {
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Introduction />
      </MemoryRouter>
    </Provider>
  );
  const nameElement = screen.getByText(/김희정/i);
  expect(nameElement).toBeInTheDocument();
});

